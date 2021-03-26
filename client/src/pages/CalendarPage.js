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
        '& button': {
            display: 'block'
        },
        '& .time-active': {
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            '& span svg': {
                color: '#fff'
            }
        },
        maxHeight: 350,
        overflow: 'auto',
        marginTop: 30,
        border: 0,
        paddingRight: 25,
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
    timeBtn: {
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 5,
        color: theme.palette.light.main,
        borderColor: theme.palette.light.light,
        alignItems: 'center',
        '& span': {
            pointerEvents: 'none'
        }
    },
    dotIcon: {
        fontSize: 12,
        verticalAlign: 'middle',
        color: theme.palette.primary.main
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

    const handleClickDay = (day) => {
        if (selectedDay !== "" && new Date(day).getMonth() !== new Date(selectedDay).getMonth()) {
            let yearMonth = new Date(day).toISOString();
            setCurrentMonth(yearMonth);
        };
        setSelectedDay(day)
    }

    const handleClickTime = (e) => {
        setSelectedTime(e.target.id.replace(/-/, ":"))
    }

    const TimeSlots = (start, end) => {
        var start = moment(start, "HH:mm");
        var end = moment(end, "HH:mm");
        let times = [];
        while (start < end) {
            times.push(start.format("HH:mm"));
            start.add(30, 'minutes')
        };
        setTimes(times)
    };

    const user = useContext(UserContext);
    useEffect(() => {
        let userId = user.userId;
        let status;
        fetch(`/availability/${userId}?ym=${currentMonth}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                status = res.status;
                if (status < 500) return res.json();
                else throw Error("Server error");
            })
            .then(res => {
                if (status === 200) {
                    TimeSlots(res.dayStart, res.dayEnd);
                    setTimePeriods(res.busy)
                }
                else throw Error("Failed to get calendar");
            })
            .catch(err => {
                alert(err.message);
            });
    }, [currentMonth]);

    const listTime = times.map((time) => {
        if (timePeriods.length === 0) {
            return (
                <Button variant="outlined" fullWidth
                    className={`${classes.timeBtn} ${selectedTime === time ? "time-active" : ""
                        }`}
                    onClick={handleClickTime} id={time.replace(/:/, "-")}
                    key={moment(selectedDay).format("YYYY-MM-DD") + time.replace(/:/, "-")}
                >
                    <FiberManualRecordIcon className={classes.dotIcon} />&nbsp;&nbsp;{time}
                </Button>
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
                <Button variant="outlined" fullWidth
                    className={`${classes.timeBtn} ${selectedTime === time ? "time-active" : ""}`}
                    onClick={handleClickTime}
                    key={dateTime} id={time.replace(/:/, "-")}
                >
                    <FiberManualRecordIcon className={classes.dotIcon} />&nbsp;&nbsp;{time}
                </Button>
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
                    <Grid item className={classes.colMid} sm={8}>
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
                    <Grid item sm={4} className={classes.colRight}>
                        <Typography variant="subtitle1" className={classes.dateRight}>
                            Wednesday,Februry 12
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