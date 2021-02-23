<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     * @throws \Exception
     */
    public function toArray($request)
    {
        $data = parent::toArray($request);

        $data['email_verified_at_human_readable'] = $this->email_verified_at ? Carbon::parse($this->email_verified_at)->format("d/m/Y H:i") : null;
        $data['last_login_date_human_readable'] = $this->last_login_date ? Carbon::parse($this->last_login_date)->format("d/m/Y H:i") : null;
        $data['created_at_human_readable'] = Carbon::parse($this->created_at)->format("d/m/Y H:i");

        return $data;
    }
}
