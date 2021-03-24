import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
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

}));

const HeadLogo = () => {
    const classes = useStyles();
    return (
        <Grid item>
            <Link to="/">
                <img src={Logo} alt="calendapp" className={classes.logo} />
            </Link>
        </Grid>
    )
}

function LoginComponent(props) {
    const classes = useStyles();
    const { confirmed, email, text, handleChange, handleGetStarted } = props;
    return (
        <CardContent className={classes.body}>
            <Typography variant="h6" className={classes.title}>
                {props.text.text1}
            </Typography>
            <Typography className={classes.label}>
                {props.text.text2}
            </Typography>
            <BootstrapInput fullWidth id="email" placeholder="E-mail address"
                type="email" variant="outlined" className={classes.input}
                onChange={handleChange} value={email} />
            <Button className={classes.btnOrange}
                onClick={handleGetStarted}>{props.text.text3}</Button>
        </CardContent>
    )
}

function GoogleLoginBtn(props) {
    const classes = useStyles();
    const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID; 
    return (
        <GoogleLogin
            clientId={clientId}
            render={renderProps => (
                <Button className={classes.btnOrange} onClick={renderProps.onClick}>
                    <svg aria-hidden="true" focusable="false" height="16" width="16" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="svg-inline--fa fa-google fa-w-16 fa-5x"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                        &nbsp;&nbsp;&nbsp;&nbsp;{props.type} with Google
                </Button>
            )}
            buttonText="Login"
            onSuccess={props.responseGoogle}
            // onFailure={props.responseGoogle}
            // Matches scope of backend
            scope="https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar"
            responseType="code"
            prompt='consent'
            accessType='offline'
        />
    )
}

export { HeadLogo, LoginComponent, GoogleLoginBtn };