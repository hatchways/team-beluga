import React, { useState, createContext, useEffect } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Route } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    loadingContainer: {
        paddingTop: 300
    }
}))

export const UserContext = createContext({
    userId: "",
    setUserId: () => {},
    isSubscribed:false,
    setIsSubscribed: ()=>{}
  });

export const UserContextProvider = (props) => {
    const [userId, setUserId] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [isComplete, setIsComplete] = useState(false);
    const classes = useStyles();
    const value = { userId, setUserId, isSubscribed, setIsSubscribed, userEmail, setUserEmail };
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
                if (status === 200 && res.success === true) {
                    setIsComplete(true)
                    setIsSubscribed(res.isSubscribed)
                    setUserEmail(res.userEmail)
                    return setUserId(res.userId);
                }
                throw Error("error");
            })
            .catch(err => {
                setIsComplete(true)
                setUserId("")
                setUserEmail("")
                setIsSubscribed(false)
            });
    },[]);

    if (!isComplete) {
        return (
            <Grid container direction="row" justify="center" alignItems="center"
            className={classes.loadingContainer}>
            <CircularProgress disableShrink />
        </Grid>
        )
    };

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>

    )
}