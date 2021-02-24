<?php

namespace App\Http\Controllers\Admin\MainStage;

use App\Filters\Admin\MainStage\SessionFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MainStage\CreateSessionRequest;
use App\Http\Requests\Admin\MainStage\UpdateSessionRequest;
use App\Http\Resources\Admin\MainStage\SessionResource;
use App\Models\MainStageSession;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    /**
     * @param SessionFilter $filter
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(SessionFilter $filter)
    {
        return SessionResource::collection(
            MainStageSession::filter($filter)
                ->paginate()
        );
    }

    /**
     * @param CreateSessionRequest $request
     * @return SessionResource
     */
    public function store(CreateSessionRequest $request)
    {
        return new SessionResource(MainStageSession::create(
            $request->validated()
        ));
    }

    /**
     * @param MainStageSession $session
     * @return SessionResource
     */
    public function show(MainStageSession $session)
    {
        return new SessionResource($session);
    }

    /**
     * @param MainStageSession $session
     * @param UpdateSessionRequest $request
     * @return SessionResource
     */
    public function update(MainStageSession $session, UpdateSessionRequest $request)
    {
        $session->update($request->validated());

        return new SessionResource($session);
    }

    /**
     * @param MainStageSession $session
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     */
    public function destroy(MainStageSession $session)
    {
        $session->delete();

        return response('', 204);
    }
}
