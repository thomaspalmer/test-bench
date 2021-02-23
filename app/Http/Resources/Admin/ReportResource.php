<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class ReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $pathSpliter = explode('/', $this->path);

        return [
            'id' => $this->id,
            'type' => $this->type,
            'completed' => $this->completed,
            'file_name' => end($pathSpliter),
            'created_at' => $this->created_at,
            'created_at_human_readable' => Carbon::parse($this->created_at)->format("d/m/Y H:i"),
        ];
    }
}
