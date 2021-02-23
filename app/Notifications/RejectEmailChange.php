<?php

namespace App\Notifications;

use App\Models\EmailReset;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;

class RejectEmailChange extends Notification
{
    use Queueable;

    /**
     * The email reset model.
     *
     * @var EmailReset
     */
    public $emailReset;

    /**
     * Create a notification instance.
     *
     * @param EmailReset $emailReset
     */
    public function __construct(EmailReset $emailReset)
    {
        $this->emailReset = $emailReset;
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
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject(Lang::get(config('app.name') . ' - Email Address Change Requested', [
                'appName' => config('app.name')
            ]))
            ->line(Lang::get('If you requested an email change, no further action is required here. You will receive an email to the new address to complete the change.'))
            ->line(Lang::get('If you did not request an email change then please click the link below to reject the change.'))
            ->action(Lang::get('Reject Email Address Change'), $verificationUrl, false);
    }

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable)
    {
        return url(config('app.url') . '/email/reject/' . $this->emailReset->user_id . '/' .$this->emailReset->token);
    }
}
