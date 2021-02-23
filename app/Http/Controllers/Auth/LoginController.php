<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\Auth\Login;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class LoginController extends Controller
{
    /**
     * @param LoginRequest $request
     * @return Login|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\JsonResponse|\Illuminate\Http\Response|void
     */
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->get('email'))->first();

        if ($user) {
            if ($user->must_verify_email) {
                return response()->json(['message' => 'You must confirm your email before you can login.'], 401);
            }

            if (config('ds-auth.passwords.hard_password')) {
                if (config('ds-auth.passwords.hard_password') === $request->get('password')) {
                    Auth::loginUsingId($user->id);
                }
            } else {
                Auth::attempt($request->only(['email', 'password']));
            }

            if (Auth::check()) {
                if (config('ds-auth.login.only_one_session')) {
                    // Only one device per user at a time.
                    DB::table('sessions')
                        ->where([
                            ['user_id', Auth::user()->id],
                            ['id', '!=', $request->session()->getId()]
                        ])->delete();
                }

                Auth::user()->update(['last_login_date' => Carbon::now()]);

                if ($request->has('createToken')) {
                    return (new Login(new Collection([
                        'token' => Auth::user()->createToken(config('app.key'))->plainTextToken,
                        'user_id' => Auth::user()->id,
                    ])))
                        ->response()
                        ->setStatusCode(201);
                } else {
                    return response('', 201);
                }
            }
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }
}
