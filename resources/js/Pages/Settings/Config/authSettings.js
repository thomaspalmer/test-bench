import {faKey, faUser, faTrash, faImage, faUserShield} from '@fortawesome/free-solid-svg-icons';

export default [
    {
        feature: "allow_profile_change",
        to: "/settings/profile",
        icon: faUser,
        title: "Profile",
    },
    {
        feature: "avatar",
        to: "/settings/avatar",
        icon: faImage,
        title: "Avatar",
    },
    {
        feature: "two_factor",
        to: "/settings/two-factor",
        icon: faUserShield,
        title: "Two Factor",
    },
    {
        feature: "allow_password_change",
        to: "/settings/password",
        icon: faKey,
        title: "Password",
    },
    {
        feature: "delete_account",
        to: "/settings/delete-account",
        icon: faTrash,
        title: "Delete Account",
    }
];