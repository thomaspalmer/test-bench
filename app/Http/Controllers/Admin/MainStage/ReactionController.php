<?php

namespace App\Http\Controllers\Admin\MainStage;

use App\Http\Controllers\Controller;
use App\Http\Resources\MainStage\ReactionResource;
use App\Models\MainStageSession;
use Illuminate\Http\Request;

class ReactionController extends Controller
{
    /**
     * @param MainStageSession $session
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(MainStageSession $session)
    {
        return ReactionResource::collection(
            $session->reactions()->with('user')->orderBy('created_at', 'desc')->paginate()
        );
    }
}
