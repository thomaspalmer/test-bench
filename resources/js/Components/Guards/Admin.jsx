import React from 'react';
import {Redirect} from 'react-router-dom';

import User from 'Services/User';

/**
 * @function Auth
 * @param {*|JSX.Element} component
 * @return {*|JSX.Element}
 * @constructor
 */
const Admin = ({component}) => {
    const admin = User.loggedIn && User.data.is_admin;

    return admin ? component : <Redirect to="/login" />;
};

export default Admin;
