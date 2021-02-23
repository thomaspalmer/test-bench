<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\AdminImport as AdminImportEvent;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class AdminImport implements ShouldQueue
{
    /**
     * Handle the event.
     *
     * @param  AdminImportEvent  $event
     * @return void
     */
    public function handle(AdminImportEvent $event)
    {
        $className = 'App\Imports\\' . $event->import->type . 'Import';

        $spliter = explode('.', $event->import->file_name);
        $file_type = end($spliter);

        try {
            // TODO messy but could not find another solution
            Excel::import(
                new $className,
                $event->import->path,
                's3',
                $file_type === 'csv' ? \Maatwebsite\Excel\Excel::CSV : 
                    ($file_type === 'xls' ? \Maatwebsite\Excel\Excel::XLS : 
                        ($file_type === 'xlsx' ? \Maatwebsite\Excel\Excel::XLSX : null))
            );

            $event->import->successful = true;
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();

            $errors = [];

            foreach ($failures as $failure) {
                $errors[] = [
                    'row' => $failure->row(),
                    'attribute' => $failure->attribute(),
                    'errors' => $failure->errors()
                ];
            }

            $event->import->successful = false;
            $event->import->errors = $errors;
        }

        $event->import->completed = true;
        $event->import->save();

        Storage::delete($event->import->path);
    }
}
