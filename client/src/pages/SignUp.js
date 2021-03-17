import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';
import { HeadLogo, LoginComponent, GoogleLoginBtn } from '../components/LoginComponents';


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

    description: {
        fontSize: 13,
        lineHeight: 1.8
    },

}));

function Signup() {
    const classes = useStyles();
    const [confirmed, setConfirmed] = useState(false);
    const [email, setEmail] = useState('');
    const [text, setText] = useState({
        text1: "Sign up with CalendApp",
        text2: "Enter your e-mail to get started:",
        text3: "Get Started"
    })

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const handleGetStarted = () => {
        setConfirmed(true)
    }

    const responseGoogle = (response) => {
        let status;
        fetch("/googlesignup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tokenId: response.tokenId })
        })
            .then(res => {
                status = res.status;
                if (status < 500) return res.json();
                else throw Error("Server error");
            })
            .then(res => {
                if (status === 200) alert(res.response);
            })
            .catch(err => {
                alert(err.message);
            });
    }

    return (
        <Grid container direction="column" alignItems="center">
            <HeadLogo />
            {confirmed === false && (
                <Grid item className={classes.shadowCard}>
                    <LoginComponent confirmed={confirmed} 
                        email={email} text={text}
                        handleChange={handleChange}
                        handleGetStarted={handleGetStarted}
                    />
                    <Divider light />
                    <CardContent>
                        <Typography className={classes.textFooter}>
                            Already have an account?&nbsp;
                            <Link to="/login" id="login"
                                className={classes.textOrange}
                            >
                                Log in
                            </Link>
                        </Typography>
                    </CardContent>
                </Grid>
            )}
            {confirmed === true && (
                <Grid item className={classes.shadowCard}>
                    <CardContent className={classes.body}>
                        <Typography variant="h6" className={classes.title}>
                            Hi {email}!
                            </Typography>
                        <Typography variant="body2" color="textSecondary" component="p"
                            className={classes.description}>
                            The easiest way for you to sign up is with Google.
                                <br />This will automatically connect your calendar
                                so you can start using CalendApp right away!
                            </Typography>
                        <CardActions>
                            <GoogleLoginBtn responseGoogle={responseGoogle} />
                        </CardActions>
                    </CardContent>
                    <Divider light />
                    <CardContent>
                        <Typography className={classes.textFooter}>
                            Prefer to create an account with a password?
                        </Typography>
                        <Typography className={classes.textFooter}>
                            <Link to="/Signup" id="signup"
                                className={classes.textOrange}
                            >
                                Click here
                            </Link>
                        </Typography>
                    </CardContent>
                </Grid>
            )}

        </Grid>
    )
}

export default Signup;