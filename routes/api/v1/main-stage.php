<?php

use App\Http\Controllers\Admin\MainStage\ChatController;
use App\Http\Controllers\Admin\MainStage\SessionController as AdminSessionController;
use App\Http\Controllers\MainStage\ReactionController;
use App\Http\Controllers\MainStage\SessionController;
use App\Http\Controllers\Admin\MainStage\ReactionController as AdminReactionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::prefix('main-stage')->group(function () {
            Route::resource('sessions', AdminSessionController::class);

            Route::resource('sessions.chat', ChatController::class)
                ->only(['index', 'update', 'destroy']);

            Route::resource('sessions.reactions', AdminReactionController::class)
                ->only(['index']);
        });
    });

Route::middleware('auth:sanctum')
    ->prefix('main-stage')
    ->name('main-stage.')
    ->group(function () {
        Route::resource('sessions', SessionController::class)
            ->only(['index']);

        Route::resource('sessions.reactions', ReactionController::class)
            ->only(['store']);
        Route::resource('sessions.chats', ChatController::class)
            ->only(['index', 'store']);
    });
