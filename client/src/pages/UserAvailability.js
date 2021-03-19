import React from "react";
import Onboarding from "../components/Onboarding";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'; 
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import DropdownSelect from '../components/DropdownSelect';

const useStyles = makeStyles((theme) => ({
    checkBoxContainer: {
        paddingRight:"0px !important"
    },
    
    checkBox: {
        boxShadow: "0px 1px 4px 0px rgb(0 0 0 / 15%)",
        margin:0,
        padding:"0px 15px 10px 15px",
    },

    checkBoxText: {
        fontSize:"12px"
    }
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


function CheckBox() {

    const classes = useStyles();

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
                onChange={toggleCheckbox}
                classes={{root:classes.checkBox}}
                style={{color:date.color}}
                />
            ))}
        </FormGroup>
    )
}

const path = "/home/event"

function UserAvailability() {

    const classes = useStyles();
    
    const [startTime,setStartTime] = React.useState(9)

    const [endTime,setEndTime] = React.useState(17)

    const handleStartTimeChange = (event) => {
        setStartTime(event.target.value)
    }

    const handleEndTimeChange = (event) => {
        setEndTime(event.target.value)
    }

    return (
        <Onboarding title="Set your availability" activeStep={3} path={path}>
            <Grid container item xs={12} alignItems="center">
                <Grid item xs={12} style={{marginBottom:10}}>
                    <Typography variant="subtitle2">Available Hours:</Typography>
                </Grid>
                <Grid container item xs={12} alignItems="center" spacing={3}>
                    <Grid item xs={3}> 
                        <DropdownSelect defaultValue={startTime} handler={handleStartTimeChange} options={timeOptions}/>
                    </Grid>
                    
                    <Grid item><Typography variant="h6">-</Typography></Grid>

                    <Grid item xs={3}>    
                        <DropdownSelect defaultValue={endTime} handler={handleEndTimeChange}  options={timeOptions}/>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container item xs={12} alignItems="center" className={classes.checkBoxContainer}>
                <Grid item xs={12} style={{marginBottom:10}}>
                    <Typography variant="subtitle2">Available Days:</Typography>
                </Grid>
                <CheckBox />
            </Grid>
        </Onboarding>
    )
}

export default UserAvailability