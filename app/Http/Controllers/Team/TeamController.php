<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Http\Requests\Team\CreateTeamRequest;
use App\Http\Requests\Team\UpdateTeamRequest;
use App\Http\Resources\Team\TeamResource;
use App\Models\Team;

class TeamController extends Controller
{
    /**
     * TeamController constructor.
     */
    public function __construct()
    {
        $this->middleware(['has-scope:team.manage-settings', 'belongs-to-team'])->only([
            'update'
        ]);
    }

    /**
     * @param CreateTeamRequest $request
     * @return TeamResource
     */
    public function store(CreateTeamRequest $request)
    {
        $team = Team::create([
            'name' => $request->get('name'),
            'user_id' => $request->user()->id
        ]);

        $team->users()->create([
            'group_id' => $team->defaultGroup()->id,
            'user_id' => $request->user()->id
        ]);

        return new TeamResource($team);
    }

    /**
     * @param Team $team
     * @param UpdateTeamRequest $request
     * @return TeamResource
     */
    public function update(Team $team, UpdateTeamRequest $request)
    {
        $team->name = $request->get('name');

        if (config('ds-auth.features.two_factor')) {
            $team->force_two_factor = $request->get('force_two_factor');
        }

        $team->save();

        return new TeamResource($team);
    }
}
