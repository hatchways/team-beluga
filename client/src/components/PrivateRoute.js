import React, { useContext, useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../globals/UserContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    loadingContainer: {
        paddingTop: 300
    }
}))

const PrivateRoute = ({ component: Component, ...rest }) => {
    const classes = useStyles();
    const user = useContext(UserContext);
    const [login, setLogin] = useState(null);

    useEffect(() => {
        let status;
        fetch("/getcookie", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
            .then(res => {
                status = res.status;
                if (status >= 400) throw Error('Fail to fetch data')
                else return res.json()
            })
            .then(res => {
                if (status === 200 && res.success === true) return setLogin(true);
                throw Error("error");
            })
            .catch(err => {
                user.setUserId("");
                return setLogin(false)
            });
    }, [])

    const Loading = () => {
        return (
            <Grid container direction="row" justify="center" alignItems="center"
                className={classes.loadingContainer}
            >
                <CircularProgress disableShrink />
            </Grid>
        )
    }

    if (login === null) return (
        <Route {...rest} component={Loading} />
    );
    return (
        <Route {...rest} render={props => (
            login ? <Component {...props} /> : <Redirect to="/login" />
        )} />

    );
};

export default PrivateRoute;