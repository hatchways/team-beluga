import React from "react";
import Calendar from 'react-calendar';
import { makeStyles } from '@material-ui/core/styles';
import 'react-calendar/dist/Calendar.css';

const useStyles = makeStyles((theme) => ({

    calendar: {
        width: 390,
        border: 'none',
        textAlign: 'center',
        '& .react-calendar__navigation': {
            '& button': {
                border: 'none'
            }
        },
        '& .react-calendar__navigation__prev2-button': {
            display: 'none'
        },
        '& .react-calendar__navigation__next2-button': {
            display: 'none'
        },
        '& .react-calendar__navigation__prev-button': {
            order: 1,
            color: theme.palette.primary.main,
            fontSize: 20
        },
        '& .react-calendar__navigation__next-button': {
            order: 2,
            color: theme.palette.primary.main,
            fontSize: 20
        },
        '& .react-calendar__navigation__label': {
            textAlign: 'left',
            fontSize: 18
        },
        '& .react-calendar__month-view__days__day--neighboringMonth':{
            visibility: 'hidden'
        },
        '& .react-calendar__month-view__days__day': {
            margin: '1.5%',
            outline: 'none',
            fontSize: '0.6em',
            width: '11.2857%!important',
            padding: '14px 5px',
            borderRadius: 15,
            flexBasis: 'unset!important',
            border: 0,
            background: theme.palette.light.light,
            fontWeight: 600
        },
        '& .react-calendar__month-view__days__day--weekend': {
            // color: theme.palette.muted.main,
            // background: 'none'
            color: 'black'
        },
        '& .react-calendar__tile--now:enabled:hover, .react-calendar__tile--now:enabled:focus':{
            background: theme.palette.primary.dark
        },
        '& .react-calendar__month-view__weekdays__weekday': {
            '& abbr': {
                textDecoration: 'none'
            }            
        },
        '& .react-calendar__tile--now': {
            background: theme.palette.primary.light,
            color: '#fff'
        },
        '& .react-calendar__tile--active': {
            background: theme.palette.primary.main
        },
        '& .react-calendar__tile--active:enabled:hover, .react-calendar__tile--active:enabled:focus': {
            background: theme.palette.primary.main
        },        
        '& .react-calendar__tile:disabled': {
            color: theme.palette.muted.main,
            background: 'none'
        },
        '& .react-calendar__navigation button[disabled]': {
            background: 'none',
            color: theme.palette.muted.main
        }
    },

}));

export default function CalendarWidget(props){
    const classes = useStyles();
    const abledDay = props.abledDay;        
    return(
        <Calendar
            locale={'en'}
            className={classes.calendar}
            minDate={props.minDate}
            maxDetail={'month'}
            minDetail={'month'}
            onClickDay={props.handleClickDay}
            value={props.selectedDay}
            tileDisabled={({activeStartDate, date, view }) => !abledDay.includes(date.getDay())}
        ></Calendar>
    )
}