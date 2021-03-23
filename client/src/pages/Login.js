import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Cookies from 'universal-cookie';
import {HeadLogo, LoginComponent, GoogleLoginBtn} from '../components/LoginComponents';
import { UserContext } from '../globals/UserContext';
import { AlertContext } from '../globals/AlertContext';


const useStyles = makeStyles((theme) => ({

    shadowCard: {
        width: 390,
        border: 'none',
        boxShadow: '0px 0px 15px 0px rgba(215,214,235,1)',
        textAlign: 'center'
    },

    textOrange: {
        color: 'rgb(255, 125, 19)',
        textDecorationLine: 'none'
    },

    title: {
        margin: '40px auto',
        transform: 'scale(1.12,1)'
    },

    body: {
        padding: '5px 50px'
    },

    textFooter: {
        fontSize: 13,
        fontWeight: 500
    },

}));


function Login() {
    const classes = useStyles();
    const [confirmed, setConfirmed] = useState(false);
    const [email, setEmail] = useState('');
    const [text, setText] = useState({
        text1: "Log into your account",
        text2: "Enter your e-mail to get started:",
        text3: "Continue"
    })

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const handleGetStarted = () => {
        setConfirmed(true)
    }    

    const history = useHistory();
    const user = useContext(UserContext);
    const alertContext = useContext(AlertContext)

    const responseGoogle = (response) => {
        let status;
        fetch("/googlelogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ code: response.code })
        })
            .then(res => {
                status = res.status
                if (status < 500) 
                    return res.json()
                else 
                    throw Error("Server error")
            })
            .then(res => {
                if (status === 200) {
                    alertContext.setAlertStatus({
                        isOpen:true,
                        message:res.response,
                        type:"success"
                      })
                    user.setUserId(res.id);
                    
                    if (res.user_url.length === 0 || res.user_timezone.length === 0)
                        history.push("/onboarding/profile-settings");
                    else if (res.user_available_day.length === 0 || res.user_available_time.length === 0)
                        history.push("/onboarding/availability")
                    else
                        history.push("/home");
                } 
                else if (status === 401){
                    alertContext.setAlertStatus({
                        isOpen:true,
                        message:res.response,
                        type:"error"
                        })                     
                }
                else throw Error("Server error")               
            })
            .catch(err => {
                alertContext.setAlertStatus({
                    isOpen:true,
                    message:err.message,
                    type:"error"
                })   
            });
    }


    return (
        <Grid container direction="column" alignItems="center">
            <HeadLogo />
            <Grid item className={classes.shadowCard}>
                {confirmed === false && (
                    <LoginComponent confirmed={confirmed}
                        email={email} text={text}
                        handleChange={handleChange}
                        handleGetStarted={handleGetStarted}
                    />
                )}
                {confirmed === true && (
                    <CardContent className={classes.body}>
                        <Typography variant="h6" className={classes.title}>
                            Welcome back,                                
                        </Typography>
                        <Typography variant="h6" className={classes.title}>
                            {email}
                        </Typography>
                        <CardActions>
                            <GoogleLoginBtn responseGoogle={responseGoogle} type={'Login'} />
                        </CardActions>
                    </CardContent>
                )}

                <Divider light />
                <CardContent>
                    <Typography className={classes.textFooter}>
                        Don't have an account?&nbsp;
                        <Link to="/Signup" id="signup"
                            className={classes.textOrange}>
                            Sign up
                        </Link>
                    </Typography>
                </CardContent>
            </Grid>
        </Grid>
    )
}

export default Login;