<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')
    ->prefix('agenda')
    ->name('agenda.')
    ->namespace('App\Http\Controllers\Agenda')
    ->group(function () {

        Route::resource('agenda', 'AgendaController')->only(['index', 'store', 'destroy']);
});

Route::middleware('auth:sanctum')
    ->prefix('admin')
    ->name('admin.')
    ->namespace('App\Http\Controllers\Admin')
    ->middleware('admin')
    ->group(function () {

        Route::resource('agenda', 'AgendaController')->only(['index', 'store', 'show', 'update', 'destroy']);
});