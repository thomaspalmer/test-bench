<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')
	->prefix('admin')
	->name('admin.')
	->namespace('App\Http\Controllers\Admin')
	->middleware('admin')
	->group(function () {

		// ReportsController
		Route::get('reports/available-reports', 'ReportsController@availableReports')->name('reports.available-reports');
		Route::resource('reports', 'ReportsController')->only(['index', 'store', 'show']);

		// ImportsController
		Route::get('imports/available-imports', 'ImportsController@availableImports')->name('imports.available-imports');
		Route::resource('imports', 'ImportsController')->only(['index', 'store']);

		// UsersController
		Route::resource('users', 'UsersController')->only(['index', 'store', 'show', 'update', 'destroy']);
});