<?php

namespace App\Http\Controllers\MainStage;

use App\Http\Controllers\Controller;
use App\Http\Resources\MainStage\RemoteConnectionResource;
use Illuminate\Http\Request;

class RemoteConnectionController extends Controller
{
    /**
     * @param Request $request
     * @return RemoteConnectionResource
     */
    public function index(Request $request)
    {
        $otp = $request->user()->generateOtpCode();

        return new RemoteConnectionResource([
            'otp' => $otp,
            'url' => route('auth.sso-login', [
                $otp['otp_code']
            ]) . '?redirect=/main-stage/remote'
        ]);
    }
}
