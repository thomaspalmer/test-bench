<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')
	->prefix('uploads')
	->name('upload.')
    ->namespace('App\Http\Controllers\Upload')
	->group(function () {

		Route::post('', 'UploadController@store')
		    ->name('store');
});