<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('main_stage_sessions', function ($user) {
    return $user;
});

Broadcast::channel('main_stage_reactions.{sessionId}', function ($user, $sessionId) {
    return \App\Models\MainStageSession::where([
        ['reactions', true],
        ['id', $sessionId]
    ])->first();
});

Broadcast::channel('main_stage_chat.{sessionId}', function ($user, $sessionId) {
    return \App\Models\MainStageSession::where([
        ['chat', true],
        ['id', $sessionId]
    ])->first();
});
