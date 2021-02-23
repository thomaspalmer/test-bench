<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;

class AddedToTeam extends Notification
{
    use Queueable;

    /**
     * @var string
     */
    public string $teamName;

    /**
     * Create a new notification instance.
     *
     * @param string $teamName
     */
    public function __construct(string $teamName)
    {
        $this->teamName = $teamName;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject(Lang::get(':appName - Welcome to :teamName', [
                'appName' => config('app.name'),
                'teamName' => $this->teamName
            ]))
            ->line(Lang::get('You\'ve been invited to join your team mates on :appName.', [
                'appName' => config('app.name')
            ]))
            ->line(Lang::get('Simply log into your account and select your new team from the profile menu.'));
    }
}
