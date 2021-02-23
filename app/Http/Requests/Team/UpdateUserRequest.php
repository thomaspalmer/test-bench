<?php

namespace App\Http\Requests\Team;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $user = $this->route('user');
        $team = $this->route('team');

        return $user->belongsToTeam($team);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'group_id' => [
                'required',
                'uuid',
                Rule::exists('groups', 'id')->where('team_id', $this->user()->active_team_id)
            ]
        ];
    }
}
