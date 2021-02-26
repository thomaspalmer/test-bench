<?php

use Illuminate\Support\Facades\Route;

Route::get('/auth/sso-login/{token}', [\App\Http\Controllers\Auth\LoginController::class, 'loginUsingSso'])
    ->name('auth.sso-login');

Route::view('/{path?}', 'app')
    ->where('path', '.*')
    ->name('react');
