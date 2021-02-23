<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TwoFactorController extends Controller
{
    /**
     * @param Request $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $google2fa = app('pragmarx.google2fa');

        $request->user()->forceFill([
            'two_factor_secret' => $google2fa->generateSecretKey(),
            'two_factor_recovery_codes' => $request->user()->generateRecoveryCodes(),
            'two_factor_verified_at' => now()
        ])->save();

        return response('', 201);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $request->user()->forceFill([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_verified_at' => null,
        ])->save();

        return response('', 204);
    }
}
