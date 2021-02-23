<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'feature:teams'])
    ->namespace('App\Http\Controllers\Team')
	->group(function () {

		Route::resource('teams', 'TeamController')
		    ->only(['store', 'update']);

		Route::resource('teams.users', 'UserController')
		    ->only(['index', 'store', 'show', 'update', 'destroy'])
		    ->middleware('has-scope:team.manage-users');

		Route::resource('teams.groups', 'GroupController')
		    ->only(['index', 'store', 'show', 'update', 'destroy'])
		    ->middleware('has-scope:team.manage-groups');
});