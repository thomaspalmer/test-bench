import {faUsersCog, faFileExcel, faUsers} from '@fortawesome/free-solid-svg-icons';

export default [
    {
        to: "/admin",
        icon: faUsersCog,
        title: "Admin",
    },
    {
        to: "/admin/reports",
        icon: faFileExcel,
        title: "Reports",
    },
    {
        to: "/admin/imports",
        icon: faFileExcel,
        title: "Imports",
    },
    {
        to: "/admin/users",
        icon: faUsers,
        title: "Users",
    }
];