import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import logo from '../images/logo.png';
import { theme } from "../themes/theme";
import { Link } from 'react-router-dom';


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
        steps={5}
        position="static"
        activeStep={activeStep}
        className={classes.stepper}
        classes={{progress:classes.progress,
            root:classes.root}}
      />
    );
}

function Onboarding({children,title,activeStep,path}) {

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

                <Grid item container xs={12} className={classes.body} direction="column" spacing={4} justify="center">
                    {children}
                </Grid>

                <Grid item container xs={12} justify="center"> 
                    <Grid item xs={2}>
                        <Button color="primary" variant="contained" fullWidth={true} className={classes.button}>
                            <Link to={path} className={classes.link}>
                                <Typography variant="body2">{activeStep === 3? "Finish":"Continue"}</Typography>
                            </Link>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )

};

export default Onboarding