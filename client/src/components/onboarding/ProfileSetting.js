import React, { useState, useEffect, useContext } from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'; 
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import DropdownSelect from '../DropdownSelect';
import moment from 'moment-timezone';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { AlertContext } from '../../globals/AlertContext';
import { UserContext } from '../../globals/UserContext';


const useStyles = makeStyles({

    body: {
        padding: "50px 50px 50px 50px",
        marginBottom:"20px"
    },

    button: {
        marginBottom:"70px",
        color:"#ffffff"
    },

    link: {
        textDecoration: 'none',
        color:"#ffffff",
    }
});

// Selected timezones only for Canada, otherwise there would be too many
const timezones = moment.tz.zonesForCountry('CA').map((z) => {
    return {
        value:z,
        label:`${z} (${moment(moment()).tz(z).format("HH:mm")})`
    }
});

function ProfileSetting({setters}) {

    const classes = useStyles();

    const history = useHistory();

    const alertContext = useContext(AlertContext)

    const userContext = useContext(UserContext)

    const user_id = userContext.userId

    const clickHandler = () => {
        let status=0;
        if (url === "") {
            alertContext.setAlertStatus({
                isOpen:true,
                message:"URL field cannot be empty",
                type:"error"
                })    
        }
        else{
            fetch(`/user/${user_id}/profile-setting`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials:"include",
                body: JSON.stringify({
                    url: url,
                    timezone:timezone
                })
            })
            .then(res => {
                    status = res.status;
                    if (status < 500) return res.json();
                    else throw Error("Server error");
            })
            .then(res => {
                    if (status === 200) {
                        if (res.unique === true) { 
                            return history.push("/onboarding/calendar-confirm")                      
                        }
                        
                        alertContext.setAlertStatus({
                            isOpen:true,
                            message:"URL already exist",
                            type:"error"
                            })   
                        return 
                    };
                    throw Error("Failed to check URL");                
            })
            .catch(err => {
                alertContext.setAlertStatus({
                    isOpen:true,
                    message:err.message,
                    type:"error"
                    })    
            });
        }
    }

    useEffect( ()=>{
            setters.setTitle("Welcome to CalendApp!")
            setters.setActiveStep(1)
            },[setters])

    const [timezone,setTimezone] = useState(moment.tz.guess())

    const handleTimezoneChange = (event)=>{
        setTimezone(event.target.value)
    }

    const [url, setUrl] = useState("");

    const handleUrlChange = (e) => {
        setUrl(e.target.value)
    }

    return (
        <Grid container item xs={12}>
            <Grid item container xs={12} className={classes.body} direction="column" spacing={4} justify="center">
                <Grid container item xs={12} justify="flex-start" alignItems="center">
                    <Grid item xs={4}>
                        <Typography variant="subtitle2">Create your CalendApp URL:</Typography>
                    </Grid>

                    <Grid item xs={8}>
                        <TextField
                            required
                            InputProps={{
                                startAdornment: <InputAdornment position="start">calendapp.com/</InputAdornment>,
                            }}
                            variant="outlined"
                            fullWidth={true}
                            // TODO: To be updated
                            placeholder="John-Doe"
                            color="secondary"
                            type="text"
                            value={url}
                            onChange={handleUrlChange}
                        />
                    </Grid>
                </Grid>

                <Grid container item xs={12} justify="flex-start" alignItems="center">
                    <Grid item xs={4}>
                        <Typography variant="subtitle2">Select your timezone:</Typography>
                    </Grid>

                    <Grid item xs={5}>
                        <DropdownSelect defaultValue={timezone} handler={handleTimezoneChange} options={timezones}></DropdownSelect>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item container xs={12} justify="center"> 
                <Button color="primary" variant="contained"  onClick={clickHandler} className={classes.button} type="submit">
                    <Typography variant="body2">Continue</Typography>
                </Button>
            </Grid>
        </Grid>
    )
}

export default ProfileSetting