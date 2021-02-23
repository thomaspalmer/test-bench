<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Resources\Json\JsonResource;

class VerificationStatus extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'email' => $this->email,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'has_password' => $this->has_password,
            'has_profile' => $this->has_profile,
        ];
    }
}
