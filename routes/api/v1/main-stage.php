<?php

use App\Http\Controllers\Admin\MainStage\CommentController;
use App\Http\Controllers\Admin\MainStage\SessionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')
    ->prefix('admin')
    ->name('admin.')
    ->middleware('admin')
    ->group(function () {
        Route::prefix('main-stage')->group(function () {
            Route::resource('sessions', SessionController::class);

            Route::resource('sessions.comments', CommentController::class)
                ->only(['index', 'update', 'destroy']);
        });
    });
