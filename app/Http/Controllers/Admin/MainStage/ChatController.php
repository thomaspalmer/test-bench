<?php

namespace App\Http\Controllers\Admin\MainStage;

use App\Filters\Admin\MainStage\ChatFilter;
use App\Http\Controllers\Controller;
use App\Http\Resources\MainStage\ChatResource;
use App\Models\MainStageChat;
use App\Models\MainStageSession;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * @param MainStageSession $session
     * @param ChatFilter $filter
     * @return ChatResource
     */
    public function index(MainStageSession $session, ChatFilter $filter)
    {
        return new ChatResource(
            $session->chats()
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->filter($filter)
                ->paginate()
        );
    }

    /**
     * @param MainStageSession $session
     * @param MainStageChat $chat
     */
    public function destroy(MainStageSession $session, MainStageChat $chat)
    {
        if ($session->id !== $chat->session_id) {
            return abort(404);
        }

        $this->authorize('delete', $chat);

        $chat->delete();

        return response('', 204);
    }
}
