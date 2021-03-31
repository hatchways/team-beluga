from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.auth.transport import requests
from google.oauth2.credentials import Credentials
from config import GOOGLE_REDIRECT_URL,GOOGLE_CLIENT_SCOPE, GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET, GOOGLE_TOKEN_URL
import os
import dateutil.parser
from datetime import timedelta

class GoogleClient:

    def __init__(self,google_auth_code=None,access_token=None,refresh_token=None):

        if google_auth_code:  
            self.credentials = self.oauth(google_auth_code)
        
        # For offline use 
        elif access_token and refresh_token:
            self.credentials = Credentials(
                token=access_token,
                refresh_token=refresh_token,
                token_uri=GOOGLE_TOKEN_URL,
                client_id=GOOGLE_CLIENT_ID,
                client_secret=GOOGLE_CLIENT_SECRET
            )
        else:
            raise Exception("GOOGLE CLIENT INITIALIZE ERROR: please enter either Google auth code or user access token with refresh token")


    # Get auth code from frontend and exchange for access/refresh token
    def oauth(self,code):

        try:

            GOOGLE_CLIENT_SECRET_FILE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                        'client_secrets.json'))
            flow = Flow.from_client_secrets_file(
                GOOGLE_CLIENT_SECRET_FILE_PATH,
                # Scope has to match what was defined in the frontend
                scopes = GOOGLE_CLIENT_SCOPE,
                # Redirect uri has to match what is defined on GCP
                redirect_uri = GOOGLE_REDIRECT_URL
            )

            # Exchange auth code for refresh/access token
            flow.fetch_token(code=code)

            return flow.credentials
        except Exception as e:
            print(f"EXCEPTION IN GOOGLE OAUTH: {e.__class__.__name__}")

    def get_user_info(self):
        try:
            user_info_service = build('oauth2', 'v2', credentials=self.credentials)

            # Request Google api user_info endpoint to get user information
            user_info = user_info_service.userinfo().get().execute()

            userid = user_info.get('id')
            name = user_info.get('name')
            email = user_info.get('email')
            return {'status': True, 'userid': userid, 'name': name, 'email': email, 'access_token':self.credentials.token, 'refresh_token':self.credentials.refresh_token}
        
        except ValueError:
            # Invalid token
            return {'status': False}
    
    def get_user_calendar_info(self, timeMin, timeMax, timezone):
        try:
            calendar_info_service = build('calendar', 'v3', credentials=self.credentials)

            calendar_ids = [{"id":item.get('id')} for item in calendar_info_service.calendarList().list().execute().get("items")]

            time = {
                    "timeMin": timeMin,
                    "timeMax": timeMax,
                    "timeZone": f"{timezone}",
                    # "groupExpansionMax": integer,
                    # "calendarExpansionMax": integer,
                    "items": calendar_ids
                }
            
            calendar_info = calendar_info_service.freebusy().query(body=time).execute().get("calendars",{})

            busy_time = [time for outer in [v.get('busy') for (k,v) in calendar_info.items() if len(v.get('busy')) > 0] for time in outer] 
            
            return busy_time

        except Exception as e:
            print(e)

    def create_event_type(self, duration, title, start_time, timezone, host_email, booker_email):
        end_time = (dateutil.parser.isoparse(start_time) + timedelta(minutes=duration)).isoformat()
        event = {
            'summary': 'Appointment with CalendApp',
            'description': title,
            'start': {
                'dateTime': start_time,
                'timeZone': timezone,
            },
            'end': {
                'dateTime': end_time,
                'timeZone': timezone,
            },
            'recurrence': [
                'RRULE:FREQ=DAILY;COUNT=1'
            ],
            'attendees': [
                {'email': host_email},
                {'email': booker_email},
            ],
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 10},
                ],
            },
        }

        event_service = build('calendar', 'v3', credentials=self.credentials)
        event = event_service.events().insert(calendarId='primary', body=event).execute()
        return event.get("id")
        # print('Event created: %s' % (event.get('htmlLink')))
    
    def delete_calendar_event(self,google_event_id):
        try:
            service = build('calendar', 'v3', credentials=self.credentials)
            service.events().delete(calendarId='primary', eventId='eventId').execute()
            return True
        except Exception as e:
            return False

