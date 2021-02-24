<?php

namespace App\Http\Requests\Admin\MainStage;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePollRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'question' => 'required|string|max:255',
            'display_from' => 'nullable|date',
            'answers' => 'required|array',
            'answers.*' => 'required|string|max:255'
        ];
    }
}
