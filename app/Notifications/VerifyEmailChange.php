<?php

namespace App\Notifications;

use App\Models\EmailReset;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerifyEmailChange extends Notification implements ShouldQueue
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
     * @param  string  $token
     * @return void
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
            ->subject(Lang::get(':appName - Verify Email Address', [
                'appName' => config('app.name')
            ]))
            ->line(Lang::get('You are receiving this email because we received an email change request for your account.'))
            ->action(Lang::get('Verify Email Address'), $verificationUrl, false)
            ->line(Lang::get('If you did not request an email change, no further action is required.'));
    }

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable)
    {
        return url(config('app.url') . '/email/verify/' . $this->emailReset->user_id . '/' .$this->emailReset->token);

    }
}
