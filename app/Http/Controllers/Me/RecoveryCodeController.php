<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\Me\RecoveryCodeResource;
use Illuminate\Http\Request;

class RecoveryCodeController extends Controller
{
    /**
     * Get the two factor authentication recovery codes for authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return RecoveryCodeResource|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (!$request->user()->two_factor_secret || !$request->user()->two_factor_recovery_codes) {
            return response('', 204);
        }

        return new RecoveryCodeResource([
            'codes' => $request->user()->recoveryCodes()
        ]);
    }

    /**
     * Generate a fresh set of two factor authentication recovery codes.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->user()->forceFill([
            'two_factor_recovery_codes' => $request->user()->generateRecoveryCodes(),
        ])->save();

        return (new RecoveryCodeResource([
            'codes' => $request->user()->recoveryCodes()
        ]))
            ->response()
            ->setStatusCode(201);
    }
}
