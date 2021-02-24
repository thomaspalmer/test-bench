<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('sessions', function ($user) {
    return $user;
});

Broadcast::channel('reactions.{sessionId}', function ($user, $sessionId) {
    Log::info($sessionId);
    return \App\Models\MainStageSession::where([
        ['reactions', true],
        ['id', $sessionId]
    ])->first();
});

Broadcast::channel('comments.{sessionId}', function ($user, $sessionId) {
    return \App\Models\MainStageSession::where([
        ['reactions', true],
        ['id', $sessionId]
    ])->first();
});
