import Dashboard from 'Pages/Dashboard';

import Login from 'Pages/Auth/Login';
import TwoFactorChallenge from 'Pages/Auth/Login/TwoFactorChallenge';
import Logout from 'Pages/Auth/Logout';
import Request from 'Pages/Auth/Password/Request';
import Reset from 'Pages/Auth/Password/Reset';
import Register from 'Pages/Auth/Register';
import Verify from 'Pages/Auth/Verify';

import Avatar from 'Pages/Settings/Avatar';
import Password from 'Pages/Settings/Password';
import Profile from 'Pages/Settings/Profile';
import TwoFactor from 'Pages/Settings/TwoFactor';
import DeleteAccount from 'Pages/Settings/DeleteAccount';

import Create from 'Pages/Team/Create';
import Settings from 'Pages/Team/Settings';
import Groups from 'Pages/Team/Groups';
import Users from 'Pages/Team/Users';

import Email from 'Pages/Email';

export default [
    { path: '/login', component: Login, guards: ['guest'] },
    { path: '/login/two-factor-challenge', component: TwoFactorChallenge, guards: ['auth', 'two-factor-unverified'] },
    { path: '/logout', component: Logout, guards: ['auth'] },
    { path: '/password/request', component: Request, guards: ['guest'], feature: 'allow_password_resets' },
    { path: '/password/reset/:token', component: Reset, guards: ['guest'], feature: 'allow_password_resets' },
    { path: '/register', component: Register, feature: 'allow_registrations', guards: ['guest'] },
    { path: '/verify/:user/:token', component: Verify },

    { path: '/email/:update/:user/:token', component: Email, feature: 'verify_email_change'},

    { path: '/', component: Dashboard, guards: ['auth', 'two-factor-verified'] },

    { path: '/settings/avatar', component: Avatar, guards: ['auth', 'two-factor-verified', 'has-scope:test'], feature: 'avatar' },
    { path: '/settings/password', component: Password, guards: ['auth', 'two-factor-verified'], feature: 'allow_password_change' },
    { path: '/settings/profile', component: Profile, guards: ['auth', 'two-factor-verified'], feature: 'allow_profile_change' },
    { path: '/settings/two-factor', component: TwoFactor, guards: ['auth', 'two-factor-verified'], feature: 'two_factor' },
    { path: '/settings/delete-account', component: DeleteAccount, guards: ['auth', 'two-factor-verified'], feature: 'delete_account' },

    { path: '/teams/create', component: Create, guards: ['auth', 'two-factor-verified'] },
    { path: '/teams/:team/settings', component: Settings, guards: ['auth', 'two-factor-verified'] },
    { path: '/teams/:team/groups', component: Groups, guards: ['auth', 'two-factor-verified'] },
    { path: '/teams/:team/users', component: Users, guards: ['auth', 'two-factor-verified'] },
];
