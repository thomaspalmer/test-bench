<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\AdminReport as AdminReportEvent;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class AdminReport implements ShouldQueue
{
    /**
     * Handle the event.
     *
     * @param  AdminReportEvent  $event
     * @return void
     */
    public function handle(AdminReportEvent $event)
    {
        $className = 'App\Exports\\' . $event->report->type . 'Export';
        
        $fileName = $event->report->type . '_report_' . Carbon::now()->format('d-m-Y H:i:s') . '.csv';

        $path = 'reports/' . $fileName;

        Excel::store(
            new $className,
            $path,
        );

        Storage::setVisibility($path, 'private');

        $event->report->completed = true;
        $event->report->path = $path;
        $event->report->save();
    }
}
