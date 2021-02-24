<?php

namespace App\Http\Requests\Reaction;

use Illuminate\Foundation\Http\FormRequest;

class ReactionRequest extends FormRequest
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
            'resource_id' => 'required|int',
            'resource_type' => 'required|string',
            'reaction' => 'required|string|in:like,love,shocked,applaud'
        ];
    }
}
