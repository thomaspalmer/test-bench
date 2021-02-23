<?php

namespace App\Http\Controllers\Auth\Password;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\PasswordEmailRequest;
use App\Models\PasswordReset;
use App\Models\User;
use App\Notifications\PasswordResetNotification;
use Illuminate\Http\Request;

class EmailController extends Controller
{
    /**
     * @param PasswordEmailRequest $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response|void
     */
    public function request(PasswordEmailRequest $request)
    {
        //Find a match for email on DB
        $user = User::where('email', $request->get('email'))->first();

        //Check if is null before anything
        if ($user === null) {
            return;
        }

        //Save on DB the generated Token
        $reset = PasswordReset::create([
            'email' => $user->email,
            'token' => PasswordReset::generateToken()
        ]);

        //Send notification
        $user->notify(new PasswordResetNotification($reset));

        return response('', 201);
    }
}
