<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\AdminImport as AdminImportModel;

class AdminImport
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var AdminImportModel
     */
    public $import;

    /**
     * Create a new event instance.
     *
     * @param  AdminImportModel  $import
     * @return void
     */
    public function __construct($import)
    {
        $this->import = $import;
    }
}
