<?php

namespace App\Http\Requests\Team;

use Illuminate\Foundation\Http\FormRequest;

class CreateGroupRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'scopes' => 'required|array',
            'scopes.*' => 'required|string|in:' . implode(',', config('ds-auth.scopes'))
        ];
    }
}
