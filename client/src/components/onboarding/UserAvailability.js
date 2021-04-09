import React, {useEffect, useContext, useState} from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'; 
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import DropdownSelect from '../DropdownSelect';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { UserContext } from '../../globals/UserContext';
import {AlertContext} from '../../globals/AlertContext';

const useStyles = makeStyles((theme) => ({
    dash: {
        textAlign: 'center'
    },

    checkBoxContainer: {
        paddingRight:"0px !important"
    },
    
    checkBox: {
        boxShadow: "0px 1px 4px 0px rgb(0 0 0 / 15%)",
        margin:0,
        padding:"0px 15px 10px 15px",
        width: 53
    },

    checkBoxText: {
        fontSize:"12px"
    },

    body: {
        padding: "50px 50px 50px 50px",
        marginBottom:"20px"
    },

    button: {
        marginBottom:"70px",
        color:"#ffffff"
    },
}))

const timeOptions = []

for (let i = 0; i <= 23; i++) {
    timeOptions.push(
        {
            value:i,
            label:`${i}:00`
        }
    );
}

function CheckBox({days,handler}) {

    const classes = useStyles();

    return (
        <FormGroup row>
            {days.map((date,index)=>(
                <FormControlLabel
                key={date.id}
                value={index}
                checked={date.state}
                control={<Checkbox  color="primary"/>}
                label={<Typography variant="subtitle2" className={classes.checkBoxText}>{date.value}</Typography>}
                labelPlacement="bottom"
                onChange={handler}
                classes={{root:classes.checkBox}}
                style={{color:date.color}}
                />
            ))}
        </FormGroup>
    )
}

function UserAvailability({setters}) {

    const classes = useStyles();

    const alertContext = useContext(AlertContext)

    const userContext = useContext(UserContext)
    
    const [startTime,setStartTime] = useState(9)

    const [endTime,setEndTime] = useState(17)

    const handleStartTimeChange = (event) => {
        setStartTime(event.target.value)
    }

    const handleEndTimeChange = (event) => {
        setEndTime(event.target.value)
    }

    const [days,setDays] = React.useState([
        {
            id:0,
            value:"Sundays",
            state:false,
            color:"rgb(0 0 0 / 15%)"
        },

        {
            id:1,
            value:"Mondays",
            state:false,
            color:"rgb(0 0 0 / 15%)"
        },

        {
            id:2,
            value:"Tuesdays",
            state:false,
            color:"rgb(0 0 0 / 15%)"
        },

        {
            id:3,
            value:"Wednesdays",
            state:false,
            color:"rgb(0 0 0 / 15%)"
        },

        {
            id:4,
            value:"Thursdays",
            state:false,
            color:"rgb(0 0 0 / 15%)"
        },

        {
            id:5,
            value:"Fridays",
            state:false,
            color:"rgb(0 0 0 / 15%)"
        },

        {
            id:6,
            value:"Saturdays",
            state:false,
            color:"rgb(0 0 0 / 15%)"
        }
    ])

    const toggleCheckbox = (event) => {
        const idx = event.target.value
        setDays(prevDays => {
            const newDays = [...prevDays]
            newDays[idx].state = !prevDays[idx].state
            newDays[idx].color = prevDays[idx].state ? "#000000" : "rgb(0 0 0 / 15%)"
            return newDays
        })
    }

    useEffect( ()=>{
        setters.setTitle("Set your availability!")
        setters.setActiveStep(3)
    },[setters])

    const history = useHistory();

    const clickHandler = () => {

        const availableDays = days.filter(day => day.state)

        let status=0;

        try {
            if (startTime === "" || endTime === "") {
                throw Error("Available time cannot be empty")  
            }
            else if (startTime >= endTime) {
                throw Error("Start time must be earlier than end time")    
            } 
            else if (availableDays.length === 0) {
                throw Error("Must select at least one available date")    
            }
            else{
                fetch(`/user/${userContext.userId}/availability`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials:"include",
                    body: JSON.stringify({
                        start_time:startTime,
                        end_time:endTime,
                        available_days:availableDays.map(day => day.value).join(",")
                    })
                })
                .then(res => {
                        status = res.status;
                        if (status < 500) return res.json();
                        else throw Error("Server error");
                })
                .then(res => {
                        if (status === 200) {
                            if (res.success === true) { 
                                alertContext.setAlertStatus({
                                    isOpen:true,
                                    message:"Profile created!",
                                    type:"success"
                                    })  
                                history.push("/home")                    
                            }
                        }
                        else throw Error("Server error");                
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
        catch(err) {
                alertContext.setAlertStatus({
                    isOpen:true,
                    message:err.message,
                    type:"error"
                    })    
        };
    }

    return (
        <Grid container item xs={12}>
            <Grid item container xs={12} className={classes.body} direction="column" spacing={4} justify="center">
                <Grid container item xs={12} alignItems="center">
                    <Grid item xs={12} style={{marginBottom:10}}>
                        <Typography variant="subtitle2">Available Hours:</Typography>
                    </Grid>
                    <Grid container item xs={12} alignItems="center" spacing={3}>
                        <Grid item sm={3} xs={5}> 
                            <DropdownSelect defaultValue={startTime} handler={handleStartTimeChange} options={timeOptions}/>
                        </Grid>
                        
                        <Grid item xs={1}><Typography variant="h6" className={classes.dash}>&mdash;</Typography></Grid>

                        <Grid item sm={3} xs={5}>    
                            <DropdownSelect defaultValue={endTime} handler={handleEndTimeChange}  options={timeOptions}/>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container item xs={12} alignItems="center" className={classes.checkBoxContainer}>
                    <Grid item xs={12} style={{marginBottom:10}}>
                        <Typography variant="subtitle2">Available Days:</Typography>
                    </Grid>
                    <CheckBox days={days} handler={toggleCheckbox}/>
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

export default UserAvailability