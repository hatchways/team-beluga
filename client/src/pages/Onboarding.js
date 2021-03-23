import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MobileStepper from '@material-ui/core/MobileStepper';
import Typography from '@material-ui/core/Typography';
import logo from '../images/logo.png';
import { theme } from "../themes/theme";
import ProfileSetting from "../components/onboarding/ProfileSetting";
import CalendarConfirm from "../components/onboarding/CalendarConfirm";
import UserAvailability from "../components/onboarding/UserAvailability";


const useStyles = makeStyles({

    logo: {
        margin: "100px 0px 40px 0px"
    },

    layout:{
        width:"700px",
        boxShadow: "0px 0px 4px 3px rgb(0 0 0 / 15%)",
        margin:"auto"
    },

    stepper:{
        backgroundColor:theme.bgcolor,
        height:"20px"
    },

    progress:{
        width:"100%",
        height:"8px",
        borderRadius: "25px"
    },

    header:{
        boxShadow: "0px 1px 4px 0px rgb(0 0 0 / 15%)",
        height:"80px"
    },

    body: {
        padding: "50px 50px 50px 50px",
        marginBottom:"20px"
    },

    button: {
        marginBottom:"70px"
    },

    link: {
        textDecoration: 'none',
        color:"#ffffff",
    }
});

function ProgressMobileStepper({activeStep}) {
    const classes = useStyles();
  
    return (
      <MobileStepper
        variant="progress"
        steps={4}
        position="static"
        activeStep={activeStep}
        className={classes.stepper}
        classes={{progress:classes.progress,
            root:classes.root}}
      />
    );
}

function OnboardingLayout({children,title,activeStep}) {

    const classes = useStyles();

    return (

        <Grid container>
            <Grid container item xs={12} justify="center" alignItems="center" className={classes.logo}>
                <img src={logo}></img>
            </Grid>

            <Grid container item className={classes.layout}>
                <Grid item container xs={12} justify="space-around" alignItems="center" className={classes.header}> 
                    <Grid item xs={4}>
                        <Typography variant="h6" >{title}</Typography>
                    </Grid>
                    <Grid item xs={4}> 
                    <ProgressMobileStepper activeStep={activeStep}></ProgressMobileStepper>
                    </Grid>
                </Grid>

                {children}
            </Grid>
        </Grid>
    )
};

function renderSwitch(currPage, setters) {
    switch(currPage) {
        case "/onboarding/profile-settings":
            return <ProfileSetting setters={setters}/>        
        case "/onboarding/calendar-confirm":
            return <CalendarConfirm setters={setters}/>
        case "/onboarding/availability":
            return <UserAvailability setters={setters}/>
        default:
            return <ProfileSetting  setters={setters}/>    
    }
}

function Onboarding(props) {

    const [activeStep, setActiveStep] = useState(1)
    const [title, setTitle] = useState("Welcome to CalendApp!")
    const currPage = props.location.pathname
    
    const setters = {
        setActiveStep:setActiveStep,
        setTitle:setTitle,
    }

    return (
            <OnboardingLayout title={title} activeStep={activeStep}>
                {renderSwitch(currPage, setters)}
            </OnboardingLayout>
        )
}

export default Onboarding