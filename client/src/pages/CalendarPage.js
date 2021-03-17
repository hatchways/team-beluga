import React, { useState } from "react";
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
        alignItems: 'center'
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
    // may need fetch from server with useEffect hook
    const [times, setTimes] = useState([
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
        '21:00',
        '21:30'
    ])
    const listTime = times.map((time) =>
        <Button variant="outlined" fullWidth className={classes.timeBtn}>
            <FiberManualRecordIcon className={classes.dotIcon} />&nbsp;&nbsp;{time}
        </Button>
    )
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
                        <CalendarWidget minDate={minDate} />
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