<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogoutController extends Controller
{
    /**
     * @param Request $request
     */
    public function logout(Request $request)
    {
        if ($request->has('hasToken')) {
            $request->user()->currentAccessToken()->delete();
        } else {
            Auth::guard('web')->logout();
        }

        return response('', 204);
    }
}
