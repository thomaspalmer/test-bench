<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Http\Requests\Team\UpdateUserRequest;
use App\Http\Requests\Team\CreateUserRequest;
use App\Http\Resources\Team\UserResource;
use App\Models\Team;
use App\Models\User;
use App\Notifications\AddedToTeam;
use App\Notifications\InvitedToTeam;

class UserController extends Controller
{
    /**
     * @param Team $team
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Team $team)
    {
        return UserResource::collection(
            User::whereHas('teams', function ($query) use ($team) {
                $query->where('team_id', $team->id);
            })->with(['teams' => function ($query) use ($team) {
                $query->where('team_id', $team->id);
            }, 'teams.group'])->paginate(20)
        );
    }

    /**
     * @param Team $team
     * @param CreateUserRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Team $team, CreateUserRequest $request)
    {
        $user = User::firstOrCreate([
            'email' => $request->get('email')
        ]);

        if ($user->belongsToTeam($team)) {
            return response()->json([
                'errors' => [
                    'This user already belongs to your team'
                ]
            ], 422);
        }

        $user->teams()->create([
            'team_id' => $team->id,
            'group_id' => $request->get('group_id')
        ]);

        if ($user->wasRecentlyCreated) {
            $user->notify(new InvitedToTeam($team->name));
        } else {
            $user->notify(new AddedToTeam($team->name));
        }
    }

    /**
     * @param Team $team
     * @param User $user
     * @return UserResource|void
     */
    public function show(Team $team, User $user)
    {
        if (!$user->belongsToTeam($team)) {
            return abort('', 404);
        }

        return new UserResource($user);
    }

    /**
     * @param Team $team
     * @param User $user
     * @param UpdateUserRequest $request
     * @return UserResource
     */
    public function update(Team $team, User $user, UpdateUserRequest $request)
    {
        $team = $user->teams()->where('team_id', $team->id)->firstOrFail();

        $team->update($request->validated());

        return new UserResource($team);
    }

    /**
     * @param Team $team
     * @param User $user
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Responsesq
     */
    public function destroy(Team $team, User $user)
    {
        $user->teams()->where('team_id', $team->id)->delete();

        return response('', 204);
    }
}
