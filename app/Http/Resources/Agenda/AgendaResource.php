<?php

namespace App\Http\Resources\Agenda;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class AgendaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $data = parent::toArray($request);

        // Check if this item is in the logged in user's agenda.
        $data['in_my_agenda'] = $this->users()->where('users.id', $request->user()->id)->exists();

        // Get the start and end datetimes for the timezone provided.
        $timezone = $request->get('timezone');
        $timezone_start_date_time = Carbon::parse($this->start_date_time)->setTimezone($timezone);
        $timezone_end_date_time = Carbon::parse($this->end_date_time)->setTimezone($timezone);
        $data['timezone_start_date'] = $timezone_start_date_time->format('d/m/Y');
        $data['timezone_start_time'] = $timezone_start_date_time->format('H:i');
        $data['timezone_end_date'] = $timezone_end_date_time->format('d/m/Y');
        $data['timezone_end_time'] = $timezone_end_date_time->format('H:i');

        return $data;
    }
}
