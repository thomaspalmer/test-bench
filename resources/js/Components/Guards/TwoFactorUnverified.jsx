import React from 'react';
import {Redirect} from 'react-router-dom';

import User from 'Services/User';

class TwoFactorUnverified extends React.Component {
    /**
     * @var state
     * @type {{shouldVerify: null}}
     */
    state = {
        shouldVerify: null
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.checkShouldVerify();

        User.on('change', this.checkShouldVerify);
    };

    /**
     * @method componentWillUnmount
     */
    componentWillUnmount = () => {
        User.removeListener('change', this.checkShouldVerify);
    };

    /**
     * @method checkShouldVerify
     */
    checkShouldVerify = () => {
        this.setState({
            shouldVerify: User.loggedIn && User.data.two_factor_secret !== null &&
                (User.data.two_factor_verified_at === null || User.data.last_login_date > User.data.two_factor_verified_at)
        });
    };

    /**
     * @method render
     * @return {null|*|JSX.Element}
     */
    render () {
        const {shouldVerify} = this.state;
        const {component} = this.props;

        if (shouldVerify === null) {
            return null;
        }

        return shouldVerify ? component : <Redirect to="/" />;
    }
}

export default TwoFactorUnverified;
