import React from 'react';
import {Redirect} from 'react-router-dom';

import User from 'Services/User';

/**
 * @function HasScope
 * @param {*|JSX.Element} component
 * @param {string[]} parameters
 * @return {*|JSX.Element}
 * @constructor
 */
const HasScope = ({component, parameters}) => {
    const canAccess = User.loggedIn && User.hasScope(parameters);

    return canAccess ? component : <Redirect to="/login" />;
};

export default HasScope;
