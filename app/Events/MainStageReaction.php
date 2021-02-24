<?php

namespace App\Events;

use App\Models\MainStageReaction as ReactionModel;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MainStageReaction implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var ReactionModel
     */
    public ReactionModel $reaction;

    /**
     * Create a new event instance.
     *
     * @param ReactionModel $reaction
     */
    public function __construct(ReactionModel $reaction)
    {
        $this->reaction = $reaction;
        $this->reaction->load('user');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('reactions.' . $this->reaction->session_id);
    }
}
