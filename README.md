# CalendApp

## Contributors

[Tony Fang](https://github.com/fangyu3) & [Josh Liu](https://github.com/bugatti12345)

## About

A clone of [Calendly](https://calendly.com) whitch allow the logged in user set availabilities and unique links for different event types, and allow the other users book appointments with the unique links.

### Stacks/Technologies
- Front-End: ReactJs, Material UI, React Calendar
- Back-End: Flask, PostgreSQL
- Sevices: Oauth, Google Calendar, Stripe, SendGrid

## Online Demo

-   ### [LIVE DEMO](http://ec2-54-241-68-236.us-west-1.compute.amazonaws.com/)
-   #### Demo Gmail account: 
        joshliudemotest@gmail.com
        demotest

## Features

### Login

![login](/source/demo/login.gif)

### Sign Up

![signup](/source/demo/signup.jpg)
![signup](/source/demo/signup2.jpg)

### Oauth

![oauth](/source/demo/oauth.gif)

### Log Out

![oauth](/source/demo/logout.gif)

### On Boarding

- Allow users to set profiles (unique url, timezone) and available dates & times

![oauth](/source/demo/onboarding.gif)

### Create Event Type

![create_event](/source/demo/create_eventType.gif)

### Up Grade Account

- Subscribe with Stripe, remain all step in origin site (never redirect to Stripe)

![upgrade](/source/demo/upgrade.gif)

### Book Appointment

- Fully connected with Google Calendar for displaying free times and create events.
- Calendar only show user available dates and times.
- Notification email will be sent once appointment is booked.

![book_meeting](/source/demo/book_meeting.gif)

### Appointments

![delete_meeting](/source/demo/delete_meeting.gif)

### Create Event Type

![create_event](/source/demo/create_eventType.gif)

## Installation

- Install dependncies:
    #### `yarn install`
    #### `pipenv install`
    
- Additional Requirement:
    #### `client_secrets.json` under `/server/util/auth/` from Google with following:
    ```json
    {
        "web": {
            "client_id": <Google Client ID>,
            "project_id": <Google Project ID>,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": <Google Client Secret>,
            "redirect_uris": [
                <Google Redirect Urls>
            ],
            "javascript_origins": [
                <Google Accept Origin Urls>
            ]
        }
    }
    ```

    #### `.evn` under root `/` with following:
    ```
     FLASK_ENV="development", 
     SQLALCHEMY_DATABASE_URI=<DataBase URI for SQLAlchemy>, 
     STRIPE_API_KEY=<Stripe api key>, 
     GOOGLE_CLIENT_ID=<Google Client ID>, 
     GOOGLE_CLIENT_SECRET=<Google Client Secret>, 
     GOOGLE_TOKEN_URL="https://oauth2.googleapis.com/token", 
     GOOGLE_API_KEY=<Google API key>
     GOOGLE_REDIRECT_URL=<Google Redirect Urls>
    ```

- Environmnet:
    #### Python 3.7
    #### node v14.16.0

## Usage
- ### Front-End:
    #### in `/client`
    #### `yarn start`
    - Running on `localhost:3000`

- ### Back-End:
    #### in `/server`
    #### `flask run`
    - Running on `localhost:5000`

- ### DataBase:
    #### in `/server`
    #### `flask db migrate`
    #### `flask db upgrade`
