<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\AdminReport as AdminReportModel;

class AdminReport
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var AdminReportModel
     */
    public $report;

    /**
     * Create a new event instance.
     *
     * @param  AdminReportModel  $report
     * @return void
     */
    public function __construct($report)
    {
        $this->report = $report;
    }
}
