import React from 'react';
import {Redirect, withRouter} from 'react-router-dom';

import User from 'Services/User';

/**
 * @function TwoFactorVerified
 * @param {JSX.Element} component
 * @return {JSX.Element}
 * @constructor
 */
const TwoFactorVerified = ({component, location}) => {
    if (User.data.two_factor_secret === null && User.data.teams) {
        // Check if one of the users teams forces two factor for its users
        if (
            User.data.teams.filter(team => team.team?.force_two_factor).length > 0 &&
            location.pathname !== '/settings/two-factor'
        ) {
            return <Redirect to="/settings/two-factor" />
        }
    }

    const shouldVerify = User.loggedIn && User.data.two_factor_secret !== null &&
        (User.data.two_factor_verified_at === null || User.data.last_login_date > User.data.two_factor_verified_at);

    return !shouldVerify ? component : <Redirect to="/login/two-factor-challenge" />;
}

export default withRouter(TwoFactorVerified);
