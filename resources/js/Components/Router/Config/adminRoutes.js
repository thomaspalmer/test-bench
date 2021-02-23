import AdminIndex from 'Pages/Admin';
import ReportsIndex from 'Pages/Admin/Reports';
import ImportsIndex from 'Pages/Admin/Imports';
import UsersIndex from 'Pages/Admin/Users';
import UsersShow from 'Pages/Admin/Users/show';
import UsersStore from 'Pages/Admin/Users/store';

export default [
    { path: '/admin', component: AdminIndex, guards: ['admin'] },
    { path: '/admin/reports', component: ReportsIndex, guards: ['admin'] },
    { path: '/admin/imports', component: ImportsIndex, guards: ['admin'] },
    { path: '/admin/users', component: UsersIndex, guards: ['admin'] },
    { path: '/admin/users/show/:user', component: UsersShow, guards: ['admin'] },
    { path: '/admin/users/store/:user?', component: UsersStore, guards: ['admin'] },
];
