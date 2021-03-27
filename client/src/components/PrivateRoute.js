import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../globals/UserContext';

const PrivateRoute = ({component: Component, ...rest}) => {
    const user = useContext(UserContext);
    useEffect(() => {
        fetch("/getcookie", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
            .then(res => {
                if (res.status === 200 && res.success === true) {
                    if (res.userId === user.userId) return user.setUserId(res.userId);
                }
                throw Error("error");
            })
            .catch(err => {
                user.setUserId("")
            });
    });
    return (
        <Route {...rest} render={props => (
            user.userId === "" ? <Redirect to="/login" /> : <Component {...props} />
        )} />
    );
};

export default PrivateRoute;