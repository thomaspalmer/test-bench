<?php

namespace App\Http\Controllers\Admin\MainStage;

use App\Events\MainStagePollsUpdated;
use App\Filters\Admin\MainStage\PollFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MainStage\CreatePollRequest;
use App\Http\Requests\Admin\MainStage\UpdatePollRequest;
use App\Http\Resources\MainStage\PollResource;
use App\Models\MainStagePoll;
use App\Models\MainStageSession;

class PollController extends Controller
{
    /**
     * @param MainStageSession $session
     * @param PollFilter $filter
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(MainStageSession $session, PollFilter $filter)
    {
        return PollResource::collection(
            $session->polls()->filter($filter)->paginate()
        );
    }

    /**
     * @param MainStageSession $session
     * @param CreatePollRequest $request
     * @return PollResource
     */
    public function store(MainStageSession $session, CreatePollRequest $request)
    {
        $poll = $session->polls()->create($request->validated());

        foreach ($request->get('answers') as $answer) {
            $poll->answers()->create([
                'answer' => $answer
            ]);
        }

        return new PollResource($poll);
    }

    /**
     * @param MainStageSession $session
     * @param MainStagePoll $poll
     * @return PollResource
     */
    public function show(MainStageSession $session, MainStagePoll $poll)
    {
        return new PollResource($poll->load('answers'));
    }

    /**
     * @param MainStageSession $session
     * @param MainStagePoll $poll
     * @param UpdatePollRequest $request
     * @return PollResource
     */
    public function update(MainStageSession $session, MainStagePoll $poll, UpdatePollRequest $request)
    {
        $poll->update($request->validated());

        $ids = [];
        foreach ($request->get('answers') as $answer) {
            $a = $poll->answers()->updateOrCreate([
                'answer' => $answer
            ], []);

            $ids[] = $a->id;
        }

        $poll->answers()->whereNotIn('id', $ids)->delete();

        event(new MainStagePollsUpdated($poll));

        return new PollResource($poll);
    }

    /**
     * @param MainStageSession $session
     * @param MainStagePoll $poll
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response|void
     * @throws \Exception
     */
    public function destroy(MainStageSession $session, MainStagePoll $poll)
    {
        if ($session->id !== $poll->session_id) {
            return abort(404);
        }

        $poll->delete();

        return response('', 204);
    }
}
