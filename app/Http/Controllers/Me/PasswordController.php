<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Requests\Me\UpdatePasswordRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    /**
     * @param UpdatePasswordRequest $request
     * @return \Illuminate\Http\JsonResponse|void
     */
    public function update(UpdatePasswordRequest $request)
    {
        $password = $request->get('current_password');
        $newPassword = $request->get('new_password');

        if (!Hash::check($password, $request->user()->password)) {
            return response()->json([
                'message' => 'The given password does not match our records',
                'errors' => [
                    'The given password does not match our records'
                ]
            ], 422);
        }

        $request->user()->update([
            'password' => Hash::make($newPassword)
        ]);

        return;
    }
}
