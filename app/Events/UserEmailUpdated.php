<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class UserEmailUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var User
     */
    public User $user;

    /**
     * @var string
     */
    public string $email;

    /**
     * Create a new event instance.
     * @param  User  $user
     * @param  string  $email
     * @return void
     */
    public function __construct(User $user, string $email)
    {
        $this->user = $user;
        $this->email = $email;
    }
}
