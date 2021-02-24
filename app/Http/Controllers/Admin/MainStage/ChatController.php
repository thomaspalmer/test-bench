<?php

namespace App\Http\Controllers\Admin\MainStage;

use App\Filters\Admin\MainStage\ChatFilter;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\MainStage\ChatResource;
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
                ->filter($filter)
                ->paginate()
        );
    }

    public function update()
    {

    }

    public function destroy()
    {

    }
}
