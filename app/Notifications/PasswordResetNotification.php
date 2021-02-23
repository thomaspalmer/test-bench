<?php

namespace App\Notifications;

use App\Models\PasswordReset;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;

class PasswordResetNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @var PasswordReset
     */
    public PasswordReset $reset;

    /**
     * Create a new notification instance.
     *
     * @param PasswordReset $reset
     */
    public function __construct(PasswordReset $reset)
    {
        $this->reset = $reset;
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
        $url = config('app.url') . '/password/reset/' . $this->reset->token;

        return (new MailMessage)
            ->subject(Lang::get(':appName - Password reset', [
                'appName' => config('app.name')
            ]))
            ->action('Reset your password', $url)
            ->line('Please note that the link will expire in ' . config('ds-auth.passwords.reset_expire') . ' minutes.');
    }

}
