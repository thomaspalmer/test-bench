<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\Me\NotificationResource;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class NotificationController extends Controller
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $notifications = $user->notifications->sortBy('read_at');
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 20);
        $total = $notifications->count();
        $startFrom = ($perPage * $page) - $perPage;
        $slice = array_slice($notifications->toArray(), $startFrom, $perPage);

        if (config('ds-auth.features.teams')) {
            // TMP Cache
            $teams = [];

            foreach ($slice as &$notification) {
                if (!isset($teams[$notification['team_id']])) {
                    $teams[$notification['team_id']] = $user->teams()
                        ->where('team_id', $notification['team_id'])
                        ->firstOrFail()
                        ->team;
                }

                $notification['team'] = $teams[$notification['team_id']];
            }
        }

        return NotificationResource::collection(
            new LengthAwarePaginator(
                $slice,
                $total,
                $perPage,
                $page
            )
        );
    }

    /**
     * Mark the given notifications as read.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $notifications = $user->notifications()->whereIn('id', $request->get('ids'));

        $notifications->update(['read_at' => now()]);

        return NotificationResource::collection($notifications->get()->toArray());
    }
}
