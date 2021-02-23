<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Models\EmailReset;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmailController extends Controller
{
    /**
     * Validate the email.
     *
     * @param User $user
     * @param string $email
     * @throws \Illuminate\Validation\ValidationException
     */
    private function validateEmail($user, $email)
    {
        $values['email'] = $email;
        $rules['email'] = 'email|max:255|unique:users,email,' . $user->id;

        Validator::make($values, $rules)->validate();
    }

    /**
     * Complete the email change request.
     *
     * @param User $user
     * @param string $token
     * @throws \Exception
     */
    public function verify(User $user, $token)
    {
        $emailReset = EmailReset::where([
            ['user_id', '=', $user->id],
            ['token', '=', $token],
            ['created_at', '>', Carbon::now()->subHours(24)]
        ])->firstOrFail();

        if ($emailReset === null) {
            throw new \Exception('Sorry, invalid parameters');
        }

        $this->validateEmail($user, $emailReset->new_email);

        $user->email = $emailReset->new_email;
        $user->email_verified_at = Carbon::now();
        $user->save();

        // DO NOT DELETE $emailReset INCASE THE USER WANTS TO REJECT THE CHANGE.

        return;
    }

    /**
     * Reject the email change request.
     *
     * @param User $user
     * @param string $token
     * @throws \Exception
     */
    public function reject(User $user, $token)
    {
        $emailReset = EmailReset::where([
            ['user_id', '=', $user->id],
            ['token', '=', $token]
        ])->firstOrFail();

        if ($emailReset === null) {
            throw new \Exception('Sorry, invalid parameters');
        }

        $this->validateEmail($user, $emailReset->existing_email);

        if ($user->email != $emailReset->existing_email) {
            $user->email = $emailReset->existing_email;
            $user->email_verified_at = Carbon::now();
            $user->save();
        }

        $emailReset->delete();

        return;
    }
}
