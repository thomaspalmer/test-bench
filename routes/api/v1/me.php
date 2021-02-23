<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')
    ->prefix('me')
    ->name('me.')
    ->namespace('App\Http\Controllers\Me')
    ->group(function () {

        Route::get('', 'MeController@show')
            ->name('show');

        Route::patch('', 'MeController@update')
            ->name('update')
            ->middleware('feature:allow_profile_change');

        Route::delete('', 'MeController@destroy')
            ->name('delete')
            ->middleware('feature:delete_account');

        Route::patch('password', 'PasswordController@update')
            ->name('password.update')
            ->middleware('feature:allow_password_change');

        Route::patch('avatar', 'AvatarController@update')
            ->name('avatar.update')
            ->middleware('feature:avatar');

        Route::patch('team', 'TeamController@update')
            ->name('team.update')
            ->middleware('feature:teams');

        Route::prefix('notifications')
            ->middleware('feature:notifications')
            ->group(function() {
                Route::get('/', 'NotificationController@index')->name('notifications.index');
                Route::patch('', 'NotificationController@update')->name('notifications.read');
            });

        Route::post('email/verify/{user}/{token}', 'EmailController@verify')
            ->name('email.verify')
            ->withoutMiddleware('auth:sanctum')
            ->middleware('feature:verify_email_change');

        Route::post('email/reject/{user}/{token}', 'EmailController@reject')
            ->name('email.reject')
            ->withoutMiddleware('auth:sanctum')
            ->middleware('feature:verify_email_change');

        Route::prefix('two-factor')
            ->middleware('feature:two_factor')
            ->group(function () {
                Route::get('qr-code', 'TwoFactorQrCodeController@show')
                    ->name('two-factor.qr-code');

                Route::post('authentication', 'TwoFactorController@store')
                    ->name('two-factor.authentication.create');
                Route::delete('authentication', 'TwoFactorController@destroy')
                    ->name('two-factor.authentication.delete');

                Route::get('recovery-codes', 'RecoveryCodeController@index')
                    ->name('two-factor.recovery-code');
                Route::post('recovery-codes', 'RecoveryCodeController@store')
                    ->name('two-factor.recovery-code.create');
            });
});