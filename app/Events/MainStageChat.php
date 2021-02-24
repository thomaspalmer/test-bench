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
    public MainStageChatModel $message;

    /**
     * Create a new event instance.
     *
     * @param MainStageChatModel $message
     */
    public function __construct(MainStageChatModel $message)
    {
        $this->message = $message;
        $this->message->load('user');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('chat.' . $this->message->session_id);
    }
}
