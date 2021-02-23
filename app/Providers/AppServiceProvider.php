<?php

namespace App\Providers;

use App\Models\User;
use App\Observers\UserObserver;
use App\Models\TeamUser;
use App\Observers\TeamUserObserver;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $base = [
            'features' => config('ds-auth.features')
        ];

        if (config('ds-auth.features.teams')) {
            TeamUser::observe(TeamUserObserver::class);

            $base['scopes'] = config('ds-auth.scopes');
        }

        User::observe(UserObserver::class);

        View::share('base', $base);
    }
}
