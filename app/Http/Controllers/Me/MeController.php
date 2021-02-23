<?php

namespace App\Http\Controllers\Me;

use App\Events\UserEmailUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Me\DeleteUserRequest;
use App\Http\Requests\Me\UpdateUserRequest;
use App\Http\Resources\Me\MeResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class MeController extends Controller
{
    /**
     * @param Request $request
     * @return MeResource
     */
    public function show(Request $request)
    {
        if (config('ds-auth.features.teams')) {
            $request->user()->activeTeam;
        }

        $request->user()->scopes;

        return new MeResource(array_merge(
            $request->user()->toArray(),
            array_filter([
                'teams' => config('ds-auth.features.teams') ?
                    $request->user()->teams()->with('team')->get()->toArray() :
                    null
            ])
        ));
    }

    /**
     * @param UpdateUserRequest $request
     * @return MeResource
     */
    public function update(UpdateUserRequest $request)
    {
        $user = $request->user();

        $user->update($request->only(['first_name', 'last_name']));

        if (config('ds-auth.features.allow_email_change')) {
            if (
                config('ds-auth.features.verify_email_change') &&
                $request->has('email') && $request->get('email') != $user->email
            ) {
                event(new UserEmailUpdated($user, $request->get('email')));
            } else {
                $user->update([
                    'email' => $request->get('email')
                ]);
            }
        }

        return new MeResource($user);
    }

    /**
     * @param DeleteUserRequest $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function destroy(DeleteUserRequest $request)
    {
        if (!Hash::check($request->get('password'), $request->user()->password)) {
            return response()->json([
                'message' => 'The given password does not match our records',
                'errors' => [
                    'The given password does not match our records'
                ]
            ], 422);
        }

        $request->user()->delete();

        if ($request->has('hasToken')) {
            $request->user()->currentAccessToken()->delete();
        } else {
            Auth::guard('web')->logout();
        }

        return response('', 204);
    }
}
