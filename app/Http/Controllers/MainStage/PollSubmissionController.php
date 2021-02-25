<?php

namespace App\Http\Controllers\MainStage;

use App\Http\Controllers\Controller;
use App\Http\Requests\MainStage\CreatePollSubmissionRequest;
use App\Http\Resources\MainStage\PollSubmissionResource;
use App\Models\MainStagePollSubmission;
use App\Models\MainStageSession;
use Illuminate\Http\Request;

class PollSubmissionController extends Controller
{
    /**
     * @param MainStageSession $session
     * @param Request $request
     * @return PollSubmissionResource
     */
    public function index(MainStageSession $session, Request $request)
    {
        return new PollSubmissionResource(
            MainStagePollSubmission::
                where([
                    ['poll_id', $request->get('poll_id')],
                    ['user_id', $request->user()->id]
                ])->firstOrFail()
        );
    }

    /**
     * @param MainStageSession $session
     * @param CreatePollSubmissionRequest $request
     * @return PollSubmissionResource
     */
    public function store(MainStageSession $session, CreatePollSubmissionRequest $request)
    {
        return new PollSubmissionResource(MainStagePollSubmission::create([
            'user_id' => $request->user()->id,
            'poll_id' => $request->get('poll_id'),
            'answer_id' => $request->get('answer_id')
        ]));
    }
}
