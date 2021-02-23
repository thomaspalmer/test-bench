<?php

namespace App\Listeners;

use App\Models\Group;
use App\Models\Team;
use Illuminate\Support\Str;

class AssignTeamOrGroup
{
    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        if (config('ds-auth.features.teams')) {
            $team = Team::create([
                'user_id' => $event->user->id,
                'name' => Str::plural($event->user->first_name) . ' team',
            ]);

            $event->user->teams()->create([
                'team_id' => $team->id,
                'group_id' => $team->defaultGroup()->id
            ]);

            $event->user->update([
                'active_team_id' => $team->id
            ]);
        } else {
            // Get the default group to apply permissions
            $group = Group::where('default', true)->first();

            if ($group) {
                $event->user->update([
                    'group_id' => $group->id
                ]);
            }
        }
    }
}
