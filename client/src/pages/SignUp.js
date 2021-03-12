import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';

import GoogleLogin from 'react-google-login';

import Logo from '../images/logo.png';

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        width: '100%',
        height: 22,
        padding: '10px 12px',
        textAlign: 'center',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
    },
}))(InputBase);

const useStyles = makeStyles((theme) => ({

    logo: {
        height: '24px',
        margin: '25px auto'
    },

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

    label: {
        fontSize: '12px',
        fontWeight: 600
    },

    input: {
        margin: '10px 0',
    },

    body: {
        padding: '5px 50px'
    },

    description: {
        fontSize: 13,
        lineHeight: 1.8
    },

    btnOrange: {
        backgroundColor: 'rgb(255, 125, 19)',
        color: '#fff',
        fontWeight: 300,
        textTransform: 'none',
        margin: '40px auto',
        padding: '8px 30px',
        '&:hover': {
            backgroundColor: 'darkorange'
        }
    },

    textFooter: {
        fontWeight: 500
    },

}));

function Signup() {
    const classes = useStyles();
    const [confirmed, setConfirmed] = React.useState(false);
    const [email, setEmail] = React.useState('');

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
            <Grid item>
                <Link href="/">
                    <img src={Logo} alt="calendapp" className={classes.logo} />
                </Link>
            </Grid>

            {confirmed === false && (
                <Grid item className={classes.shadowCard}>
                    <CardContent className={classes.body}>
                        <Typography variant="h6" className={classes.title}>
                            Sign up with CalendApp
                            </Typography>
                        <Typography className={classes.label}>
                            Enter your e-mail to get started:
                            </Typography>
                        <BootstrapInput fullWidth id="email" placeholder="E-mail address"
                            type="email" variant="outlined" className={classes.input}
                            onChange={handleChange} value={email} />
                        <Button className={classes.btnOrange}
                            onClick={handleGetStarted}>Get Started</Button>
                    </CardContent>
                    <Divider light />
                    <CardContent>
                        <small className={classes.textFooter}>
                            Already have an account?&nbsp;
                                    <a href="/login" id="login"
                                className={classes.textOrange}>
                                Log in
                                    </a>
                        </small>
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
                            <GoogleLogin
                                clientId="802130452785-qc5dp590pd2qs6opc6udqa8qt6ofdihl.apps.googleusercontent.com"
                                render={renderProps => (
                                    <Button className={classes.btnOrange} onClick={renderProps.onClick}>
                                        <svg aria-hidden="true" focusable="false" height="16" width="16" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="svg-inline--fa fa-google fa-w-16 fa-5x"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                                        &nbsp;&nbsp;&nbsp;&nbsp;Sign up with Google
                                    </Button>
                                )}
                                buttonText="Login"
                                onSuccess={responseGoogle}
                            // onFailure={responseGoogle}
                            />
                        </CardActions>
                    </CardContent>
                    <Divider light />
                    <CardContent>
                        <small className={classes.textFooter}>
                            Prefer to create an account with a password?
                                <br /><a href="/Signup" id="signup"
                                className={classes.textOrange}>
                                Click here
                                    </a>
                        </small>
                    </CardContent>
                </Grid>
            )}

        </Grid>
    )
}

export default Signup;