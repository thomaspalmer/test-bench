<?php

namespace App\Http\Controllers\MainStage;

use App\Http\Controllers\Controller;
use App\Http\Requests\MainStage\CreateChatRequest;
use App\Http\Resources\MainStage\ChatResource;
use App\Models\MainStageSession;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * @param MainStageSession $session
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(MainStageSession $session)
    {
        return ChatResource::collection(
            $session->chats()
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->paginate()
        );
    }

    /**
     * @param MainStageSession $session
     * @param CreateChatRequest $request
     * @return ChatResource
     */
    public function store(MainStageSession $session, CreateChatRequest $request)
    {
        return new ChatResource(
            $session->chats()->create($request->validated() + [
                'user_id' => $request->user()->id
            ])
        );
    }
}
