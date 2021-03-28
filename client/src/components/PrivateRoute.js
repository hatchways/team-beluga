import React, { useContext, useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../globals/UserContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const user = useContext(UserContext);
    const [login, setLogin] = useState(false);

    useEffect(() => {
        return (() => {
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
        })
    })

    return (
        <Route {...rest} render={props => (
            login ? <Component {...props} /> : <Redirect to="/login" />
        )} />
    );
};

export default PrivateRoute;