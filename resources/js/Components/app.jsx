import React from 'react';
import ReactDOM from 'react-dom';
import {ToastContainer} from 'react-toastify';

import Router from 'Components/Router';
import {Loading} from 'Components/Partials';

import User from 'Services/User';
import Auth from 'Services/Api/Auth/Auth';
import Me from 'Services/Api/Me/Me';
import TwoFactor from 'Services/Api/Me/TwoFactor';
import Teams from 'Services/Api/Teams/Teams';
import {Event} from 'Services';
import ModalContainer from 'Components/Modal/ModalContainer';

import 'react-toastify/dist/ReactToastify.min.css';

export default class App extends React.Component {
    /**
     * @var state
     * @type {{loading: boolean}}
     */
    state = {
        loading: true,
        redirect: null,
        deepLink: null
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.loadUser();

        Auth.on('login', this.fetchUser);
        Auth.on('logout', this.logoutUser);

        if (window.base.features.allow_profile_change) {
            Me.on('update', User.refresh);
        }

        if (window.base.features.avatar) {
            Me.on('update-avatar', User.refresh);
        }

        if (window.base.features.delete_account) {
            Me.on('delete', this.logoutUser);
        }

        if (!window.base.features.verify_registrations) {
            Auth.on('register', this.fetchUser);
        }

        if (window.base.features.teams) {
            Me.on('update-team', User.refresh);
            Teams.on('create', User.refresh);
        }

        if (window.base.features.two_factor) {
            TwoFactor.on('disable', User.refresh);
            TwoFactor.on('enable', User.refresh);

            Auth.on('two-factor', User.refresh);
        }
    };

    /**
     * @method loadUser
     * @return {Promise<void>}
     */
    loadUser = async () => {
        await User.refresh();

        let deepLink = null;

        if (User.loggedIn) {
            Event.on('api-connection-expired', this.logoutUser);
        } else if (window.location.pathname !== '' && window.location.pathname !== '/') {
            deepLink = window.location.pathname;
        }

        this.finishLoading(deepLink, null);
    }

    /**
     * @method fetchUser
     * @return {Promise<void>}
     */
    fetchUser = async () => {
        await User.refresh();

        Event.on('api-connection-expired', this.logoutUser);

        this.finishLoading(null, this.state.deepLink);
    };

    /**
     * @method finishLoading
     * @param {string} deepLink
     * @param {string} redirect
     */
    finishLoading = (deepLink = null, redirect = null) => {
        this.setState({
            loading: false,
            deepLink,
            redirect
        });
    };

    /**
     * @method fetchUser
     * @return {Promise<void>}
     */
    logoutUser = () => {
        User.logout();

        Event.removeListener('api-connection-expired', this.logoutUser);

        this.finishLoading();
    };

    /**
     * @method componentWillUnmount
     */
    componentWillUnmount = () => {
        Auth.removeListener('login', this.fetchUser);
        Auth.removeListener('logout', this.logoutUser);

        if (window.base.features.allow_profile_change) {
            Me.removeListener('update', User.refresh);
        }

        if (window.base.features.avatar) {
            Me.removeListener('update-avatar', User.refresh);
        }

        if (window.base.features.delete_account) {
            Me.removeListener('delete', this.logoutUser);
        }

        if (!window.base.features.verify_registrations) {
            Auth.removeListener('register', this.fetchUser);
        }

        if (window.base.features.teams) {
            Me.removeListener('update-team', User.refresh);
            Teams.removeListener('create', User.refresh);
        }

        if (window.base.features.two_factor) {
            TwoFactor.removeListener('disable', User.refresh);
            TwoFactor.removeListener('enable', User.refresh);

            Auth.removeListener('two-factor', User.refresh);
        }
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {loading, redirect} = this.state;

        return (
            <React.Fragment>
                {loading ? <Loading /> : <Router redirect={redirect} />}

                <ToastContainer
                    hideProgressBar={true}
                    closeButton={false}
                    autoClose={5000}
                />

                <ModalContainer />
            </React.Fragment>
        );
    };
}

ReactDOM.render(<App/>, document.getElementById('app'));
