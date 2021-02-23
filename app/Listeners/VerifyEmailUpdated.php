<?php

namespace App\Listeners;

use App\Events\UserEmailUpdated;
use App\Models\EmailReset;
use App\Notifications\VerifyEmailChange;
use App\Notifications\RejectEmailChange;
use Illuminate\Support\Facades\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerifyEmailUpdated implements ShouldQueue
{
    /**
     * Handle the event.
     *
     * @param  UserEmailUpdated  $event
     * @return void
     */
    public function handle(UserEmailUpdated $event)
    {
        $emailReset = EmailReset::create([
            'user_id' => $event->user->id,
            'new_email' => $event->email,
            'existing_email' => $event->user->email,
        ]);


        Notification::route('mail', $event->email)->notify(new VerifyEmailChange($emailReset));

        Notification::send($event->user, new RejectEmailChange($emailReset));
    }
}
