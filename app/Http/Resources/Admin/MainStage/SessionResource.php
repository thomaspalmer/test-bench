<?php

namespace App\Http\Resources\Admin\MainStage;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class SessionResource extends JsonResource
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

        $data['starts_at_format'] = $this->starts_at !== null ? Carbon::parse($this->starts_at)->format('d/m/Y H:i') : null;
        $data['ends_at_format'] = $this->ends_at !== null ? Carbon::parse($this->ends_at)->format('d/m/Y H:i') : null;

        return $data;
    }
}
