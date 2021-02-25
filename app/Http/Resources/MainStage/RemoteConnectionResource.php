<?php

namespace App\Http\Resources\MainStage;

use Illuminate\Http\Resources\Json\JsonResource;

class RemoteConnectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
