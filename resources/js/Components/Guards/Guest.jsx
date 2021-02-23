import React from 'react';
import {Redirect} from 'react-router-dom';

import User from 'Services/User';

/**
 * @function Guest
 * @param {*|JSX.Element} component
 * @return {*|JSX.Element}
 * @constructor
 */
const Guest = ({component}) => {
    const auth = User.loggedIn;

    return !auth ? component : <Redirect to="/" />;
};

export default Guest;
