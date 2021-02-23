<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\RegisterResource;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    /**
     * @param RegisterRequest $request
     * @return RegisterResource
     */
    public function register(RegisterRequest $request)
    {
        // Create user
        event(new Registered($user = User::create([
            'first_name' => $request->get('first_name'),
            'last_name' => $request->get('last_name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
        ])));


        // Send email verification notification
        if (config('ds-auth.features.verify_registrations')) {
            $user->sendEmailVerificationNotification();
        } else {
            // Verify
            $user->markEmailAsVerified();

            Auth::loginUsingId($user->id);
        }

        // Return response
        return new RegisterResource($user);
    }
}
