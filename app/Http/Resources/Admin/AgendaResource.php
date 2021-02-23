<?php

namespace App\Http\Resources\Admin;

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

        $data['start_date'] = Carbon::parse($this->start_date_time)->format('d/m/Y');
        $data['start_time'] = Carbon::parse($this->start_date_time)->format('H:i');

        return $data;
    }
}
