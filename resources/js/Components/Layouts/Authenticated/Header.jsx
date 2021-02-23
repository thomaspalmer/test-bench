import React from 'react';
import {NavLink} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBell, faBars, faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import {withRouter} from 'react-router-dom';
import {DateTime} from 'luxon';

import {Container} from 'Components/Utilities';

import version from 'Config/Version';

import {User, Toast, Socket} from 'Services';
import Me from 'Services/Api/Me/Me';
import Notifications from 'Services/Api/Me/Notifications';
import Notification from 'Components/Partials/Notification';

class Header extends React.Component {
    /**
     * @var state
     * @type {{showUserMenu: boolean, unread: boolean, showNotifications: boolean, showMobileMenu: boolean, user: null, notifications: []}}
     */
    state = {
        showUserMenu: false,
        showMobileMenu: false,
        showNotifications: false,
        user: null,
        notifications: [],
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.setUser();

        if (window.base.features.notifications) {
            this.fetchNotifications();

            Socket.getConnection()
                .private(`App.Models.User.${User.id}`)
                .notification((notification) => {
                    const {notifications} = this.state;

                    notifications.unshift(notification);

                    this.setState({
                        notifications
                    });
                });
        }

        User.on('change', this.setUser);
    };

    /**
     * @method componentWillUnmount
     */
    componentWillUnmount = () => {
        User.removeListener('change', this.setUser);

        if (window.base.features.notifications) {
            Socket.getConnection().disconnect(`App.Models.User.${User.id}`);
        }
    };

    /**
     * @method
     */
    setUser = () => {
        this.setState({
            user: User.data
        });
    };

    /**
     * @method fetchNotifications
     * @param {number} page
     * @return {Promise<void>}
     */
    fetchNotifications = async (page = 1) => {
        const request = await Notifications.get(null, {
            page
        });

        if (request.success) {
            const {notifications} = this.state;

            request.data.data.forEach(notification => {
                notifications.push(notification);
            });

            this.setState({
                notifications,
                meta: request.data.meta
            });
        }
    };

    /**
     * @method handleReadNotification
     * @param {string} id
     */
    handleReadNotification = (id) => {
        const {notifications} = this.state;
        const i = notifications.map(n => n.id).indexOf(id);

        if (i !== -1) {
            notifications[i].read_at = DateTime.local();

            this.setState({
                notifications
            });
        }
    };

    /**
     * @method handleUpdateTeam
     * @param {object} team
     * @param {boolean} hasUrl
     * @return {Promise<void>}
     */
    handleUpdateTeam = async (team, hasUrl = false) => {
        const request = await Me.updateTeam({
            team_id: team.id
        });

        if (!request.success) {
            return Toast.error();
        }

        this.setState({
            showUserMenu: false
        }, () => {
            if (!hasUrl) {
                this.props.history.push('/');
            }
        });

        return true;
    };

    /**
     * @method handleToggleUserMenu
     */
    handleToggleUserMenu = () => {
        this.setState({
            showUserMenu: !this.state.showUserMenu,
            showMobileMenu: false,
            showNotifications: false
        });
    };

    /**
     * @method handleToggleMobileMenu
     */
    handleToggleMobileMenu = () => {
        this.setState({
            showMobileMenu: !this.state.showMobileMenu,
            showUserMenu: false,
            showNotifications: false
        });
    };

    /**
     * @method handleToggleNotifications
     */
    handleToggleNotifications = () => {
        this.setState({
            showNotifications: !this.state.showNotifications,
            showUserMenu: false,
            showMobileMenu: false
        });
    };

    /**
     * @method shouldShowProfileMenu
     * @return {*}
     */
    shouldShowProfileMenu = () => {
        const {features} = window.base;

        return features.allow_profile_change || features.allow_password_change ||
            features.avatar || features.two_factor;
    };

    /**
     * @method getProfileLink
     * @return {string}
     */
    getProfileLink = () => {
        let links = {
            allow_profile_change: '/settings/profile',
            allow_password_change: '/settings/password',
            avatar: '/settings/avatar',
            two_factor: '/settings/two-factor',
            delete_account: '/settings/delete-account'
        };

        const featuresToCheck = [
            'allow_profile_change', 'allow_password_change', 'avatar', 'two_factor', 'delete_account'
        ];
        const {features} = window.base;
        let link = null;

        featuresToCheck.forEach((feature) => {
            if (link === null) {
                if (features[feature]) {
                    link = links[feature];
                }
            }
        });

        return link ?? '';
    };

    /**
     * @method render
     * @return {*}
     */
    render() {
        const {showUserMenu, showMobileMenu, showNotifications, user, notifications} = this.state;
        const {pageTitle} = this.props;

        return (
            <div className="relative bg-light-blue-700 pb-32">
                <nav
                    className="relative z-10 border-b border-teal-500 border-opacity-25 lg:bg-transparent lg:border-none">
                    <Container>
                        <div
                            className="relative h-16 flex items-center justify-between lg:border-b lg:border-light-blue-800">
                            <div className="px-2 flex items-center lg:px-0">
                                <div className="flex-shrink-0">
                                    <img
                                        className="block h-8 w-auto"
                                        src="https://tailwindui.com/img/logos/workflow-mark-teal-400.svg"
                                        alt="Workflow"/>
                                </div>
                                <div className="hidden lg:block lg:ml-6 lg:space-x-4">
                                    <div className="flex">
                                        {this.renderLink('/', 'Dashboard')}
                                    </div>
                                </div>
                            </div>

                            <div className="flex lg:hidden">
                                <button
                                    className="p-2 rounded-md inline-flex items-center justify-center text-light-blue-200 hover:text-white hover:bg-light-blue-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    aria-expanded="false"
                                    onClick={this.handleToggleMobileMenu}
                                >
                                    <FontAwesomeIcon icon={faBars}/>
                                </button>
                            </div>

                            <div className="hidden lg:block lg:ml-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 ml-4 text-sm text-gray-300">
                                        Version: {version}
                                    </div>

                                    {window.base.features.notifications && (
                                        <div className="relative flex-shrink-0 ml-4">
                                            <button
                                                onClick={this.handleToggleNotifications}
                                                className="flex-shrink-0 rounded-full p-1 text-light-blue-200 hover:bg-light-blue-800 hover:text-white focus:outline-none focus:bg-light-blue-900 focus:ring-2 focus:ring-offset-2 focus:ring-offset-light-blue-900 focus:ring-white">
                                                <FontAwesomeIcon icon={faBell}/>
                                                {notifications.filter(n => n.read_at === null).length !== 0 && (
                                                    <div className="rounded-full w-2 h-2 bg-red-400 absolute top-0 right-0"></div>
                                                )}
                                            </button>

                                            <div
                                                className={
                                                    `origin-top-right absolute right-0 max-h-96 overflow-y-scroll mt-2 w-96 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 ${showNotifications ? '' : 'hidden'}`
                                                }
                                            >
                                                {this.renderNotifications(notifications)}
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative flex-shrink-0 ml-4">
                                        <div>
                                            <button
                                                className="rounded-full flex text-sm text-white focus:outline-none focus:bg-light-blue-900 focus:ring-2 focus:ring-offset-2 focus:ring-offset-light-blue-900 focus:ring-white"
                                                id="user-menu"
                                                onClick={this.handleToggleUserMenu}
                                            >
                                                {window.base.features.avatar && (
                                                    <img
                                                        className="rounded-full h-8 w-8"
                                                        src={User.getAvatarUrl()}
                                                        alt={user?.full_name}
                                                    />
                                                )}

                                                {!window.base.features.avatar && (
                                                    <React.Fragment>
                                                        {user?.full_name}
                                                    </React.Fragment>
                                                )}
                                            </button>
                                        </div>

                                        <div
                                            className={
                                                `origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 ${showUserMenu ? '' : 'hidden'}`
                                            }
                                        >
                                            {this.renderUserNav()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>

                    <div className={`bg-light-blue-900 ${showMobileMenu ? '' : 'hidden'} lg:hidden`}>
                        <div className="pt-2 pb-3 px-2 space-y-1">
                            <a href="#"
                               className="block rounded-md py-2 px-3 bg-black bg-opacity-25 text-base font-medium text-white">Dashboard</a>
                        </div>
                        <div className="pt-4 pb-3 border-t border-light-blue-800">
                            <div className="flex items-center px-4">
                                {window.base.features.avatar && (
                                    <div className="flex-shrink-0">
                                        <img className="rounded-full h-10 w-10"
                                             src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80h"
                                             alt=""/>
                                    </div>
                                )}
                                <div className="ml-3">
                                    <div className="text-base font-medium text-white">
                                        {user?.full_name}
                                    </div>
                                    <div className="text-sm font-medium text-light-blue-200">
                                        {user?.email}
                                    </div>
                                </div>
                                <button
                                    className="ml-auto flex-shrink-0 rounded-full p-1 text-light-blue-200 hover:bg-light-blue-800 hover:text-white focus:outline-none focus:bg-light-blue-900 focus:ring-2 focus:ring-offset-2 focus:ring-offset-light-blue-900 focus:ring-white">
                                    <FontAwesomeIcon icon={faBell}/>
                                </button>
                            </div>
                            <div className="mt-3 px-2">
                                {this.renderUserNav(true)}
                            </div>
                        </div>
                    </div>
                </nav>
                <div
                    className="absolute flex justify-center inset-x-0 left-1/2 transform -translate-x-1/2 w-full overflow-hidden lg:inset-y-0"
                    aria-hidden="true">
                    <div className="flex-grow bg-light-blue-900 bg-opacity-75"></div>
                    <svg className="flex-shrink-0" width="1750" height="308" viewBox="0 0 1750 308"
                         xmlns="http://www.w3.org/2000/svg">
                        <path opacity=".75" d="M1465.84 308L16.816 0H1750v308h-284.16z" fill="#075985"/>
                        <path opacity=".75" d="M1733.19 0L284.161 308H0V0h1733.19z" fill="#0c4a6e"/>
                    </svg>
                    <div className="flex-grow bg-light-blue-800 bg-opacity-75"></div>
                </div>
                <header className="relative py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-white">
                            {pageTitle}
                        </h1>
                    </div>
                </header>
            </div>
        );
    }

    /**
     * @method renderUserNav
     * @param {boolean} mobile
     * @return {JSX.Element}
     */
    renderUserNav = (mobile) => {
        const {user} = this.state;
        const styles = mobile ?
            'block rounded-md py-2 px-3 text-base font-medium text-light-blue-200 hover:text-white hover:bg-light-blue-800' :
            'block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 leading-5';

        return (
            <React.Fragment>
                {this.shouldShowProfileMenu() && (
                    <React.Fragment>
                        <div className="block px-4 py-2 text-xs text-gray-400">
                            Manage Account
                        </div>
                        <NavLink to={this.getProfileLink()} className={styles}>Profile</NavLink>
                        <div className="border-t border-gray-100"></div>
                    </React.Fragment>
                )}

                {window.base.features.teams && (
                    <React.Fragment>
                        <div className="block px-4 py-2 text-xs text-gray-400">
                            Manage Team
                        </div>
                        <NavLink to={`/teams/${user?.active_team.id}/settings`} className={styles}>Team
                            Settings</NavLink>
                        <NavLink to="/teams/create" className={styles}>Create New Team</NavLink>
                        <div className="border-t border-gray-100"></div>
                        <div className="block px-4 py-2 text-xs text-gray-400">
                            Switch Team
                        </div>
                        {user?.teams.map(team => (
                            <button
                                key={team.team_id}
                                className={`${styles} w-full text-left`}
                                onClick={() => this.handleUpdateTeam(team.team)}
                            >
                                {team.team_id === user?.active_team.id && (
                                    <React.Fragment>
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 mr-2"/>
                                    </React.Fragment>
                                )}
                                {team.team.name}
                            </button>
                        ))}
                        <div className="border-t border-gray-100"></div>
                    </React.Fragment>
                )}

                <NavLink to="/logout" className={styles}>Sign Out</NavLink>
            </React.Fragment>
        );
    };

    /**
     * @method renderLink
     * @param {string} link
     * @param {*} display
     * @param {string} target
     * @return {*}
     */
    renderLink = (link, display, target = '_self') => {
        return (
            <NavLink
                to={link}
                target={target}
                exact={true}
                activeClassName="bg-black bg-opacity-25 text-sm font-medium text-white"
                className="rounded-md py-2 px-3 text-sm font-medium text-white hover:bg-light-blue-800">
                {display}
            </NavLink>
        );
    };

    /**
     * @method renderNotifications
     * @return {JSX.Element}
     */
    renderNotifications = (notifications) => {
        return (
            <div className="relative bg-white p-2">
                {notifications.length === 0 && (
                    <div className="p-2 text-center text-sm text-gray-500">
                        You currently do not have any notifications
                    </div>
                )}

                {notifications.map(notification => (
                    <Notification
                        notification={notification}
                        key={notification.id}
                        onRead={this.handleReadNotification}
                        onSwitchToTeam={this.handleUpdateTeam}
                    />
                ))}
            </div>
        );
    };
}

export default withRouter(Header);
