import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Cookies from 'universal-cookie';
import {HeadLogo, LoginComponent, GoogleLoginBtn} from '../components/LoginComponents';


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

    const responseGoogle = (response) => {
        let status;
        fetch("/googlelogin", {
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
                const cookies = new Cookies();
                cookies.set('token', res.token, { path: '/', httpOnly: true })
                if (status === 401) alert(res.response);
            })
            .catch(err => {
                alert(err.message);
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
                            <GoogleLoginBtn responseGoogle={responseGoogle} />
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