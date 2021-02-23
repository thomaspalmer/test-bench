<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class AuthEventSubscriber
{
    /**
     * Handle user login events.
     */
    public function handleUserLogin($event) {
        $event->user->logins()->create([
            'type' => 'password'
        ]);
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @param  \Illuminate\Events\Dispatcher  $events
     * @return void
     */
    public function subscribe($events)
    {
        $events->listen(
            'Illuminate\Auth\Events\Login',
            [AuthEventSubscriber::class, 'handleUserLogin']
        );
    }
}
