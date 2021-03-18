import React from "react";
import Onboarding from "../components/Onboarding";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'; 
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles =  makeStyles({
    header: {
        padding:"5px 16px 16px 16px !important",
        marginBottom:"10px"
    }
})

const path = "/availability"

function CalendarConfirm() {

    const classes = useStyles();
    const email = "fake@gmail.com"

    return (
        <Onboarding title="Your Google Calendar is connected!" activeStep={2} path={path}>
            <Grid container item xs={12} justify="flex-start" alignItems="center" className={classes.header}>
                <Grid item xs={12} >
                    <Typography variant="subtitle2">Here is how CalendApp will work with {email}</Typography>
                </Grid>
            </Grid>

            <Divider/>

            <Grid container item xs={12} justify="space-around" alignItems="center">
                <Grid item xs={7}>
                    <Typography variant="body2">1. We will check {email} for conflicts</Typography>
                </Grid>
                <Grid container item xs={4} justify="flex-end">
                    <Button disabled>Edit</Button>
                </Grid>
            </Grid>

            <Divider/>

            <Grid container item xs={12} justify="space-around" alignItems="center" >
                <Grid item xs={7}>
                    <Typography variant="body2">2. We will add event to {email}</Typography>
                </Grid>
                <Grid container item xs={4} justify="flex-end">
                    <Button disabled>Edit</Button>
                </Grid>
            </Grid>

            <Divider/>
        </Onboarding>
    )
}

export default CalendarConfirm