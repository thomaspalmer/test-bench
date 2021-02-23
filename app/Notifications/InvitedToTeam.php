<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;

class InvitedToTeam extends Notification
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
     * Get the notification's channels.
     *
     * @param  mixed  $notifiable
     * @return array|string
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $verificationUrl = $notifiable->generateVerifyRegistrationUrl();

        return (new MailMessage)
            ->subject(Lang::get(':appName - Welcome to :teamName', [
                'appName' => config('app.name'),
                'teamName' => $this->teamName
            ]))
            ->line(Lang::get('You\'ve been invited to join your team mates on :appName.', [
                'appName' => config('app.name'),
            ]))
            ->line(Lang::get('Please click the button below to confirm your invite and finish setting up your account.'))
            ->action(Lang::get('Confirm Invite'), $verificationUrl);
    }
}
