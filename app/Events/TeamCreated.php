<?php

namespace App\Events;

use App\Models\Team;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TeamCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var Team
     */
    public Team $team;

    /**
     * Create a new event instance.
     *
     * @param Team $team
     */
    public function __construct(Team $team)
    {
        $this->team = $team;
    }
}
