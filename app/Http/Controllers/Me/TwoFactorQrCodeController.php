<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\Me\QrCodeResource;
use Illuminate\Http\Request;

class TwoFactorQrCodeController extends Controller
{
    /**
     * @param  \Illuminate\Http\Request  $request
     * @return QrCodeResource
     */
    public function show(Request $request)
    {
        return new QrCodeResource(['svg' => $request->user()->twoFactorQrCodeSvg()]);
    }
}
