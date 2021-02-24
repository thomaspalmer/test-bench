<?php

namespace App\Http\Controllers\MainStage;

use App\Http\Controllers\Controller;
use App\Http\Requests\MainStage\CreateReactionRequest;
use App\Http\Resources\Reaction\ReactionResource;
use App\Models\MainStageSession;
use App\Models\Reaction;
use Illuminate\Http\Request;

class ReactionController extends Controller
{
    /**
     * @param MainStageSession $session
     * @param CreateReactionRequest $request
     * @return ReactionResource
     */
    public function store(MainStageSession $session, CreateReactionRequest $request)
    {
        return new ReactionResource($session->reactions()->create(
            $request->only(['reaction', 'resource_id', 'resource_type'])
        ));
    }
}
