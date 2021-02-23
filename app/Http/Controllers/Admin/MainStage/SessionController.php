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
     * @param $id
     * @return SessionResource
     */
    public function show($id)
    {
        $mainStageSession = MainStageSession::findOrFail($id);

        return new SessionResource($mainStageSession);
    }

    public function update(UpdateSessionRequest $request, $id)
    {
        $mainStageSession = MainStageSession::findOrFail($id);

        $mainStageSession->update($request->validated());

        return new SessionResource($mainStageSession);
    }

    /**
     * @param $id
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $mainStageSession = MainStageSession::findOrFail($id);

        $mainStageSession->delete();

        return response('', 204);
    }
}
