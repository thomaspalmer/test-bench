import React from 'react';
import {Redirect} from 'react-router-dom';

import User from 'Services/User';

/**
 * @function Auth
 * @param {*|JSX.Element} component
 * @return {*|JSX.Element}
 * @constructor
 */
const Auth = ({component}) => {
    const auth = User.loggedIn;

    return auth ? component : <Redirect to="/login" />;
};

export default Auth;
