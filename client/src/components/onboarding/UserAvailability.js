import React, {useEffect, useContext} from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'; 
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import DropdownSelect from '../DropdownSelect';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import {AlertContext} from '../../globals/AlertContext';

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

function UserAvailability({setters}) {

    const classes = useStyles();

    const alertContext = useContext(AlertContext)
    
    const [startTime,setStartTime] = React.useState(9)

    const [endTime,setEndTime] = React.useState(17)

    const handleStartTimeChange = (event) => {
        setStartTime(event.target.value)
    }

    const handleEndTimeChange = (event) => {
        setEndTime(event.target.value)
    }

    useEffect( ()=>{
        setters.setTitle("Set your availability!")
        setters.setActiveStep(3)
    },[setters])

    const history = useHistory();

    const clickHandler = () => {
        history.push("/home")
        alertContext.setAlertStatus({
            isOpen:true,
            message:"Profile created!",
            type:"success"
            })    
    }



    return (
        <Grid container item xs={12}>
            <Grid item container xs={12} className={classes.body} direction="column" spacing={4} justify="center">
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