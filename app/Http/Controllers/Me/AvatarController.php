<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Requests\Me\UpdateAvatarRequest;
use App\Http\Resources\Me\MeResource;
use DualityStudio\Base\Traits\HandlesUpload;

class AvatarController extends Controller
{
    use HandlesUpload;

    /**
     * @param UpdateAvatarRequest $request
     * @return MeResource
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function update(UpdateAvatarRequest $request)
    {
        $user = $request->user();

        $finalKey = $this->processUpload($request, 'key', '', $user->avatar_path);

        $user->update([
            'avatar_path' => $finalKey
        ]);

        return new MeResource($user);
    }
}
