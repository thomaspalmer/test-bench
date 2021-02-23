<?php

return [
    'features' => [
        'allow_registrations' => false,
        'verify_registrations' => false,
        'allow_password_resets' => false,
        'allow_email_change' => false,
        'verify_email_change' => false,
        'allow_profile_change' => false,
        'allow_password_change' => false,
        'avatar' => true,
        'two_factor' => false,
        'delete_account' => false,
        'teams' => false,
        'notifications' => false
    ],

    'login' => [
        'only_one_session' => true // Must use DB sessions php artisan session:table, change user_id to uuid
    ],

    'passwords' => [
        'hard_password' => ENV('DS_AUTH_HARD_PASSWORD', false),

        'reset_expire' => 60
    ],

    'scopes' => [
        'team.manage-settings',
        'team.manage-users',
        'team.manage-groups'
    ]
];
