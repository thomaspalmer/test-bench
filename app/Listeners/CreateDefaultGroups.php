<?php

namespace App\Listeners;

use App\Events\TeamCreated;

class CreateDefaultGroups
{
    /**
     * Handle the event.
     *
     * @param  TeamCreated  $event
     * @return void
     */
    public function handle(TeamCreated $event)
    {
        $event->team->groups()->create([
            'name' => 'Owner',
            'scopes' => config('ds-auth.scopes'),
            'default' => true
        ]);
    }
}
