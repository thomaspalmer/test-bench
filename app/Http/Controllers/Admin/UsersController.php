<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\Admin\UserResource;
use App\Filters\Admin\UserFilter;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    /**
     * @param Request $request
     * @param UserFilter $filter
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request, UserFilter $filter)
    {
        return UserResource::collection(
            User::filter($filter)
            ->orderBy(
                $request->get('order_by', 'created_at'),
                $request->get('order', 'desc')
            )
            ->paginate($request->get('per_page', 20))
        );
    }

    /**
     * @param StoreUserRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreUserRequest $request)
    {
        event(new Registered($user = User::create([
            'first_name' => $request->get('first_name'),
            'last_name' => $request->get('last_name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
        ])));

        if (config('ds-auth.features.verify_registrations')) {
            if ($request->get('automatically_verify_email') === true) {
                $user->markEmailAsVerified();
            } else {
                $user->sendEmailVerificationNotification();
            }
        } else {
            $user->markEmailAsVerified();
        }

        return response('', 201);
    }

    /**
     * @param User $user
     * @return UserResource
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * @param User $user
     * @param UpdateUserRequest $request
     * @return UserResource
     */
    public function update(User $user, UpdateUserRequest $request)
    {        
        $user->update($request->only(['first_name', 'last_name']));

        return new UserResource($user);
    }

    /**
     * @param User $user
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|void
     */
    public function destroy(User $user, Request $request)
    {
        if (!$request->has('confirmed') || $request->get('confirmed') !== true) {
            return response()->json(['message' => 'Confirmation required.'], 422);
        }

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot delete your own user account.'], 422);
        }

        $user->delete();

        return response('', 204);
    }
}
