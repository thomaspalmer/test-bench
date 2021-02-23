<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\VerifyRequest;
use App\Http\Resources\Auth\VerificationStatus;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Hash;

class VerifyController extends Controller
{
    /**
     * @param $user
     * @param $token
     * @return mixed
     * @throws AuthorizationException
     */
    private function getUser($user, $token)
    {
        $user = User::findOrFail($user);

        if (sha1($user->getEmailForVerification()) !== $token) {
            throw new AuthorizationException;
        }

        return $user;
    }

    /**
     * @param $user
     * @param $token
     * @return VerificationStatus
     * @throws AuthorizationException
     */
    public function status($user, $token)
    {
        $user = $this->getUser($user, $token);

        return new VerificationStatus($user);
    }

    /**
     * @param $user
     * @param $token
     * @param VerifyRequest $request
     * @return \Illuminate\Http\JsonResponse
     * @throws AuthorizationException
     */
    public function verify($user, $token, VerifyRequest $request)
    {
        $user = $this->getUser($user, $token);

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'User has already verified email!'], 422);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        if (!$user->has_profile) {
            foreach (array_keys(User::$profileFields) as $field) {
                if ($request->filled($field)) {
                    $user->{$field} = $request->get($field);
                }
            }
        }

        if (!$user->has_password) {
            $user->password = Hash::make($request->get('password'));
        }

        $user->save();

        return response()->json(['message' => 'Email verified!']);
    }
}
