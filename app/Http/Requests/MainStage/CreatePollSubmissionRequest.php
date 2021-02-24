<?php

namespace App\Http\Requests\MainStage;

use Illuminate\Foundation\Http\FormRequest;

class CreatePollSubmissionRequest extends FormRequest
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
            'poll_id' => 'required|uuid|exists:main_stage_polls,id',
            'answer_id' => 'required|uuid|exists:main_stage_poll_answers,id',
        ];
    }
}
