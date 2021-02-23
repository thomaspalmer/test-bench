<?php

namespace App\Providers;

use App\Events\TeamCreated;
use App\Listeners\AssignTeamOrGroup;
use App\Listeners\CreateDefaultGroups;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use App\Events\UserEmailUpdated;
use App\Listeners\VerifyEmailUpdated;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        UserEmailUpdated::class => [
            VerifyEmailUpdated::class,
        ],
        Registered::class => [
            AssignTeamOrGroup::class,
        ],
        TeamCreated::class => [
            CreateDefaultGroups::class
        ]
    ];

    /**
     * The subscriber classes to register.
     *
     * @var array
     */
    protected $subscribe = [
        'App\Listeners\AuthEventSubscriber',
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
