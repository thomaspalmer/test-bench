<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Requests\Me\UpdateTeamRequest;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    /**
     * @param UpdateTeamRequest $request
     */
    public function update(UpdateTeamRequest $request)
    {
        $team = Team::findOrFail($request->get('team_id'));

        $request->user()->switchToTeam($team);

        return;
    }
}
