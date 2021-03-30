import React, {useContext, useEffect, useState} from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'; 
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../globals/UserContext';
import { AlertContext } from '../../globals/AlertContext';

const useStyles =  makeStyles({
    header: {
        padding:"5px 16px 16px 16px !important",
        marginBottom:"10px"
    },

    body: {
        padding: "50px 50px 50px 50px",
        marginBottom:"20px"
    },

    button: {
        marginBottom:"70px",
        color:"#ffffff"
    },
})

function CalendarConfirm({setters}) {

    const classes = useStyles();
    const [email,setEmail] = useState("")

    const userContext = useContext(UserContext)

    const alertContext = useContext(AlertContext)
    const user_id = userContext.userId

    useEffect( ()=>{
        setters.setTitle("Your Google calendar is connected!")
        setters.setActiveStep(2)
        let status=200
        fetch(`/user/${user_id}/email`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials:"include"
            })
            .then((res) => {
                status = res.status
                if (status < 500)
                    return res.json()
                else throw Error("Server error");
            })
            .then((data) => {
                if (status === 200)
                    setEmail(data.email)
                else throw Error("User email not set");
            })
            .catch(err => {
                alertContext.setAlertStatus({
                    isOpen:true,
                    message:err.message,
                    type:"error"
                    })    
            });
    },[setters])

    const history = useHistory();

    const clickHandler = () => {
        history.push("/onboarding/availability")
    }

    return (
        <Grid container item xs={12}>
            <Grid item container xs={12} className={classes.body} direction="column" spacing={4} justify="center">
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
            </Grid>

            <Grid item container xs={12} justify="center"> 
                <Button color="primary" variant="contained"  onClick={clickHandler} className={classes.button} type="submit">
                    <Typography variant="body2">Continue</Typography>
                </Button>
            </Grid>
        </Grid>
    )
}

export default CalendarConfirm