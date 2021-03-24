import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../globals/UserContext';

const PrivateRoute = ({component: Component, ...rest}) => {
    const user = useContext(UserContext);
    return (
        <Route {...rest} render={props => (
            user.userId === "" ? <Redirect to="/login" /> : <Component {...props} />
        )} />
    );
};

export default PrivateRoute;