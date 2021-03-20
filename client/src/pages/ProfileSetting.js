import React from "react";
import Onboarding from "../components/Onboarding";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'; 
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import DropdownSelect from '../components/DropdownSelect';
import moment from 'moment-timezone';

// Selected timezones only for Canada, otherwise there would be too many
const timezones = moment.tz.zonesForCountry('CA').map((z) => {
    return {
        value:z,
        label:`${z} (${moment(moment()).tz(z).format("HH:mm")})`
    }
});

const path = "/calendar-confirm"

function ProfileSetting() {

    const [timezone,setTimezone] = React.useState(moment.tz.guess())

    const handleChange = (event)=>{
        setTimezone(event.target.value)
    }

    return (
        <Onboarding title="Welcome to CalendApp!" activeStep={1} path={path}>
            <Grid container item xs={12} justify="flex-start" alignItems="center">
                <Grid item xs={4}>
                    <Typography variant="subtitle2">Create your CalendApp URL:</Typography>
                </Grid>

                <Grid item xs={8}>
                    <TextField
                        InputProps={{
                            startAdornment: <InputAdornment position="start">calendapp.com/</InputAdornment>,
                        }}
                        variant="outlined"
                        fullWidth={true}
                        // TODO: To be updated
                        defaultValue="John-Doe"
                        color="secondary"
                        type="text"
                    />
                </Grid>
            </Grid>

            <Grid container item xs={12} justify="flex-start" alignItems="center">
                <Grid item xs={4}>
                    <Typography variant="subtitle2">Select your timezone:</Typography>
                </Grid>

                <Grid item xs={5}>
                    <DropdownSelect defaultValue={timezone} handler={handleChange} options={timezones}></DropdownSelect>
                </Grid>
            </Grid>
        </Onboarding>
    )
}

export default ProfileSetting