<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('sessions', function ($user) {
    return $user;
});

Broadcast::channel('reactions.{sessionId}', function ($user, $sessionId) {
    return \App\Models\MainStageSession::where([
        ['reactions', true],
        ['id', $sessionId]
    ])->first();
});

Broadcast::channel('chat.{sessionId}', function ($user, $sessionId) {
    return \App\Models\MainStageSession::where([
        ['chat', true],
        ['id', $sessionId]
    ])->first();
});
