import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';

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

const useStyles = theme => ({

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

});

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmed: false,
            email: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleGetStarted = this.handleGetStarted.bind(this);
    }

    handleChange(e) {
        this.setState({
            email: e.target.value
        });
    }

    handleGetStarted() {
        this.setState({
            confirmed: true
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid container direction="column" alignItems="center">
                <Grid item>
                    <Link item href="/">
                        <img src={Logo} alt="calendapp" className={classes.logo} />
                    </Link>
                </Grid>

                {this.state.confirmed === false && (
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
                                onChange={this.handleChange} value={this.state.email} />
                            <Button className={classes.btnOrange}
                                onClick={this.handleGetStarted}>Get Started</Button>
                        </CardContent>
                        <Divider light />
                        <CardContent>
                            <small className={classes.textFooter}>
                                Already have an account?&nbsp;
                                    <a href="/Signup" id="signup"
                                    className={classes.textOrange}>
                                    Log in
                                    </a>
                            </small>
                        </CardContent>
                    </Grid>
                )}
                {this.state.confirmed === true && (
                    <Grid item className={classes.shadowCard}>
                        <CardContent className={classes.body}>
                            <Typography variant="h6" className={classes.title}>
                                Hi {this.state.email}!
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p"
                                className={classes.description}>
                                The easiest way for you to sign up is with Google.
                                <br />This will automatically connect your calendar
                                so you can start using CalendApp right away!
                            </Typography>
                            <CardActions>
                                <Button className={classes.btnOrange}>
                                    <svg aria-hidden="true" focusable="false" height="16" width="16" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" class="svg-inline--fa fa-google fa-w-16 fa-5x"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" class=""></path></svg>
                                    &nbsp;&nbsp;&nbsp;&nbsp;Sign up with Google
                                </Button>
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
}

export default withStyles(useStyles, { withTheme: true })(Login);