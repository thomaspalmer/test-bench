<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\TwoFactorRequest;
use Illuminate\Http\Request;

class TwoFactorController extends Controller
{
    /**
     * @param TwoFactorRequest $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function store(TwoFactorRequest $request)
    {
        $user = $request->user();

            // Check OTP
        $google2fa = app('pragmarx.google2fa');

        $valid = $google2fa->verifyKey($user->two_factor_secret, $request->get('code'));

        if ($valid) {
            return $this->verified($user);
        }

        // Check recovery code
        if (in_array($request->get('code'), $user->recoveryCodes())) {
            return $this->verified($user);
        }

        return response()->json([
            'message' => 'Sorry, your code is invalid. Please try again'
        ], 422);
    }

    /**
     * @param $user
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     */
    private function verified($user)
    {
        $user->forceFill([
            'two_factor_verified_at' => now()
        ])->save();

        return response('', 201);
    }
}
