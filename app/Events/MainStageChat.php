<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\MainStageChat as MainStageChatModel;

class MainStageChat implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var MainStageChatModel
     */
    public MainStageChatModel $comment;

    /**
     * Create a new event instance.
     *
     * @param MainStageChatModel $comment
     */
    public function __construct(MainStageChatModel $comment)
    {
        $this->comment = $comment;
        $this->comment->load('user');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('comments.' . $this->comment->session_id);
    }
}
