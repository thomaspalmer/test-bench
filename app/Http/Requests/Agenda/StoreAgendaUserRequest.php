<?php

namespace App\Http\Requests\Agenda;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Rules\AgendaConflict;
use App\Rules\AgendaAvailableSpaces;

class StoreAgendaUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $user = $this->user();
        $user_id = $user->id;

        return [
            'agenda_id' => [
                'required',
                'exists:agendas,id',
                Rule::unique('agenda_user', 'agenda_id')
                    ->where(function ($query) use($user_id) {
                        return $query->where([
                            ['user_id', $user_id],
                        ]);
                    }),
                new AgendaConflict($user),
                new AgendaAvailableSpaces($user)
            ],
        ];
    }
}
