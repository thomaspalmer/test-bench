<?php

namespace App\Notifications;

use App\Channels\DatabaseChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification as LaravelNotification;

class Notification extends LaravelNotification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @param $title
     * @param $message
     * @param null $actionType
     * @param null $actionUrl
     * @param null $teamId
     */
    public function __construct($title, $message, $actionType = null, $actionUrl = null, $teamId = null)
    {
        $this->data = array_filter([
            'title' => $title,
            'message' => $message,
            'action_type' => $actionType,
            'action_url' => $actionUrl,
        ]);

        $this->teamId = $teamId;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return [DatabaseChannel::class, 'broadcast'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return $this->data;
    }

    /**
     * @param $notifiable
     * @return BroadcastMessage
     */
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage(array_filter([
            'data' => $this->data,
            'id' => $this->id,
            'team_id' => $this->teamId,
            'created_at' => now(),
            'updated_at' => now(),
        ]) + [
            'read_at' => null
        ]);
    }

    /**
     * @return string
     */
    public function broadcastType()
    {
        return 'notification';
    }
}
