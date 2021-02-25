<?php

namespace App\Http\Controllers\MainStage;

use App\Filters\MainStage\SessionFilter;
use App\Http\Controllers\Controller;
use App\Http\Resources\MainStage\SessionResource;
use App\Models\MainStageSession;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    /**
     * @param SessionFilter $filter
     * @return mixed
     */
    public function index(SessionFilter $filter)
    {
        return SessionResource::collection(
            MainStageSession::filter($filter)
                ->with('polls.answers')
                ->get()
        );
    }
}
