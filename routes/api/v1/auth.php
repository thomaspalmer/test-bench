<?php

use Illuminate\Support\Facades\Route;

Route::prefix('auth')
    ->name('auth.')
    ->namespace('App\Http\Controllers\Auth')
    ->group(function () {

        Route::post('login', 'LoginController@login')
            ->name('login');

        Route::post('register', 'RegisterController@register')
            ->name('register')
            ->middleware('feature:allow_registrations');

        Route::get('verify/{user}/{token}', 'VerifyController@status')
            ->name('verify.status')
            ->middleware('feature:verify_registrations,teams');

        Route::post('verify/{user}/{token}', 'VerifyController@verify')
            ->name('verify')
            ->middleware('feature:verify_registrations,teams');

        Route::delete('logout', 'LogoutController@logout')
            ->name('logout');

        Route::middleware('feature:allow_password_resets')->prefix('password')->group(function () {
            Route::post('request', 'Password\EmailController@request')
                ->name('password.request');
            Route::post('reset/{token}', 'Password\ResetController@reset')
                ->name('password.reset');
        });

        Route::middleware('feature:two_factor')
            ->post('two-factor', 'TwoFactorController@store')
            ->name('two-factor.reset');
});