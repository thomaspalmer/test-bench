<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreAgendaRequest extends FormRequest
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
        return [
            'active' => 'required|boolean',
            'start_date_time' => 'required|date',
            'end_date_time' => 'required|date|after:start_date_time',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string|max:50000',
            'presenters' => 'nullable|string|max:50000',
            'show_add_to_agenda_button' => 'required|boolean',
            'show_add_to_agenda_button_start_date_time' => 'nullable|date',
            'show_add_to_agenda_button_end_date_time' => 'nullable|date',
            'show_add_to_calendar_button' => 'required|boolean',
            'show_add_to_calendar_button_only_if_in_agenda' => 'required|boolean',
            'join_link' => 'nullable|string|max:255',
            'join_link_display_start_date_time' => 'nullable|date',
            'join_link_display_end_date_time' => 'nullable|date',
            'join_link_display_only_if_in_agenda' => 'required|boolean',
            'spaces' => 'nullable|integer',
        ];
    }
}
