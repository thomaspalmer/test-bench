<?php

namespace App\Http\Controllers\Auth\Password;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\PasswordResetRequest;
use App\Models\PasswordReset;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ResetController extends Controller
{
    /**
     * @param $token
     * @param PasswordResetRequest $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function reset($token, PasswordResetRequest $request)
    {
        // Look up the reset
        $reset = PasswordReset::where([
            ['token', $token],
            ['email', $request->get('email')],
            ['created_at', '>=', Carbon::now()->subMinutes(config('ds-auth.passwords.reset_expire'))]
        ])->first();

        // Invalid request
        if (is_null($reset)) {
            return response()->json([
                'message' => 'Sorry, your request could not be validated. Please check your email address'
            ], 422);
        }

        // Look up the user and update the password
        $user = User::where('email', $request->get('email'))->firstOrFail();

        $user->update([
            'password' => Hash::make($request->get('password'))
        ]);

        // Delete reset request
        PasswordReset::where('token', $request->get('token'))->delete();

        return response('', 201);
    }
}
