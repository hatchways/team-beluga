import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import CalendarWidget from '../components/CalendarWidget';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Hidden from '@material-ui/core/Hidden';
import moment from "moment";
import { theme } from "../themes/theme";
import { UserContext } from '../globals/UserContext';
import EmailDialog from '../components/EmailDialog';
import { AlertContext } from '../globals/AlertContext';


const useStyles = makeStyles((theme) => ({
    body: {
        maxWidth: 1100,
        margin: '30px auto',
        border: 'none',
        boxShadow: '0px 0px 15px 0px rgba(215,214,235,1)',
        padding: 40
    },
    name: {
        color: theme.palette.muted.main
    },
    iconMins: {
        verticalAlign: 'middle',
    },
    mins: {
        verticalAlign: 'middle',
        display: 'inline-block',
    },
    minsLine: {
        marginTop: 25,
        marginBottom: 25
    },
    title: {
        marginBottom: 40,
        paddingLeft: 20,
        paddingRight: 20
    },
    calendarFooter: {
        display: 'inline-block',
        marginTop: 25
    },
    dateRight: {
        marginTop: 7,
        fontSize: 18,
        color: theme.palette.muted.main
    },
    colLeft: {
        paddingLeft: 20
    },
    colMid: {
        paddingLeft: 20,
        paddingRight: 20
    },
    colRight: {
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20
    },
    divider: {
        marginRight: 20
    },
    timeContainer: {
        width: '100%',
        minWidth: 200,
        '& button': {
            display: 'block'
        },
        maxHeight: 350,
        overflowY: 'auto',
        overflowX: 'hidden',
        marginTop: 30,
        border: 0,
        paddingRight: '10%',
        '&::-webkit-scrollbar': {
            width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.light.light,
            borderRadius: 50
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.light.main,
            borderRadius: 50
        }
    },
    timeBtnContainer: {
        display: 'block',
        whiteSpace: 'nowrap'
    },
    timeBtn: {
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 5,
        marginRight: '12%',
        color: theme.palette.light.main,
        borderColor: theme.palette.light.light,
        alignItems: 'center',
        '& span': {
            pointerEvents: 'none'
        },
        width: '100%',
        display: 'inline-block!important',
        '&.time-active': {
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            color: '#fff',
            '& span svg': {
                color: '#fff'
            },
            marginRight: '3%',
            width: '48.5%',
            transition: 'width 0.3s ease-in-out'
        },
    },
    dotIcon: {
        fontSize: 12,
        verticalAlign: 'middle',
        color: theme.palette.primary.main
    },
    confirmBtn: {
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 5,
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        alignItems: 'center',
        '&:hover': {
            color: '#fff',
            backgroundColor: theme.palette.primary.main
        },
        width: '48.5%',
        display: 'inline-block!important'
    },
    arrowDownIcon: {
        fontSize: 16,
        verticalAlign: 'middle',
        color: theme.palette.muted.main
    }
}));

export default function CalendarPage() {
    const classes = useStyles();
    const [minDate, setMinDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(''); //date of the first day of the month
    const [times, setTimes] = useState([]);
    const [timePeriods, setTimePeriods] = useState([]);
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');

    const alertContext = useContext(AlertContext);
    const user = useContext(UserContext);

    const handleClickDay = (day) => {
        if (selectedDay !== "" && new Date(day).getMonth() !== new Date(selectedDay).getMonth()) {
            let yearMonth = new Date(day).toISOString();
            setCurrentMonth(yearMonth);
        };
        setSelectedDay(day);
        setSelectedTime('')
    }

    const handleClickTime = (e) => {
        setSelectedTime(e.target.id.replace(/-/, ":"))
    }

    const displayDate = moment(selectedDay).format("dddd, MMMM D");


    const TimeSlots = (start, end) => {
        const timeStart = moment(start, "HH:mm");
        const timeEnd = moment(end, "HH:mm");
        const times = [];
        while (timeStart < timeEnd) {
            times.push(timeStart.format("HH:mm"));
            timeStart.add(30, 'minutes')
        };
        setTimes(times)
    };
    
    useEffect(() => {
        const userId = user.userId;
        let status;
        fetch(`/availability/${userId}?ym=${currentMonth}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                status = res.status;
                if (status >= 500) throw Error("Server error");
                if (status >= 400) throw Error("Failed to get calendar data");
                return res.json();
            })
            .then(res => {
                if (status === 200) {
                    TimeSlots(res.dayStart, res.dayEnd);
                    setTimePeriods(res.busy)
                }
                else throw Error("Failed to get calendar");
            })
            .catch(err => {
                alertContext.setAlertStatus({
                    isOpen:true,
                    message:err.message,
                    type:"error"
                })
            });
    }, [currentMonth]);

    const listTime = times.map((time) => {
        if (timePeriods === null || timePeriods.length === 0 ) {
            return (
                <Grid className={classes.timeBtnContainer}>
                    <Button variant="outlined"
                        className={`${classes.timeBtn} ${selectedTime === time ? "time-active" : ""
                            }`}
                        onClick={handleClickTime} id={time.replace(/:/, "-")}
                        key={moment(selectedDay).format("YYYY-MM-DD") + time.replace(/:/, "-")}
                    >
                        <FiberManualRecordIcon className={classes.dotIcon} />&nbsp;&nbsp;{time}
                    </Button>
                    <EmailDialog selectedDay={selectedDay} selectedTime={selectedTime} />
                </Grid>
            );
        };
        let dateTime = moment(
            moment(selectedDay).format("YYYY-MM-DD") + ' ' + moment(time, "HH:mm").format("HH:mm"),
            "YYYY-MM-DD HH:mm"
        );
        let timeRendered = [];
        let timeExclude = [];
        timePeriods.map((busy) => {
            let busyStart = moment(moment(busy.start).format("YYYY-MM-DD HH:mm"), "YYYY-MM-DD HH:mm");
            let busyEnd = moment(moment(busy.end).format("YYYY-MM-DD HH:mm"), "YYYY-MM-DD HH:mm");
            if (timeExclude.includes(time)) return;
            if (timeRendered.includes(time)) return;
            if (dateTime.isBetween(busyStart, busyEnd, undefined, '[)')) {
                timeExclude.push(time);
                return
            };
        });
        if (!timeRendered.includes(time) && !timeExclude.includes(time)) {
            timeRendered.push(time);
            return (
                <Grid className={classes.timeBtnContainer}>
                    <Button variant="outlined"
                        className={`${classes.timeBtn} ${selectedTime === time ? "time-active" : ""}`}
                        onClick={handleClickTime}
                        key={dateTime} id={time.replace(/:/, "-")}
                    >
                        <FiberManualRecordIcon className={classes.dotIcon} />&nbsp;&nbsp;{time}
                    </Button>
                    <EmailDialog selectedDay={selectedDay} selectedTime={selectedTime} />
                </Grid>
            )
        }
    })
    return (
        <Grid container className={classes.body} >
            <Grid item sm className={classes.colLeft}>
                <Typography variant="subtitle1" className={classes.name}>
                    John Doe
                </Typography>
                <Typography variant="h5">60 minute meeting</Typography>
                <Grid item className={classes.minsLine}>
                    <AccessTimeIcon className={classes.iconMins} />
                    <Typography variant="subtitle2" className={classes.mins}>&nbsp;60 min</Typography>
                </Grid>
            </Grid>
            <Hidden smDown>
                <Divider orientation="vertical" flexItem className={classes.divider} />
            </Hidden>
            <Grid item container sm={8} direction="column">
                <Grid item>
                    <Typography variant="h5" className={classes.title}>
                        Select a Date & Time
                    </Typography>
                </Grid>
                <Grid item container direction="row">
                    <Grid item className={classes.colMid} md={8}>
                        <CalendarWidget minDate={minDate} handleClickDay={handleClickDay}
                            selectedDay={selectedDay} />
                        <Typography variant="subtitle2" className={classes.calendarFooter}>
                            Coordinated Universal Time&nbsp;
                            </Typography>
                        <Typography variant="caption" color="textSecondary" className={classes.calendarFooter}>
                            (0:00)
                                <ArrowDropDownIcon className={classes.arrowDownIcon} />
                        </Typography>
                    </Grid>
                    <Grid item md={4} className={classes.colRight}>
                        <Typography variant="subtitle1" className={classes.dateRight}>
                            {/* Wednesday,Februry 12 */}
                            {displayDate}
                            </Typography>
                        <Paper className={classes.timeContainer} elevation={0}>
                            {listTime}
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>            
        </Grid>
    )
}