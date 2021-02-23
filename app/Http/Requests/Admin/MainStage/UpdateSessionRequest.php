<?php

namespace App\Http\Requests\Admin\MainStage;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSessionRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'starts_at' => 'required|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'description' => 'nullable|string',
            'stream_src' => 'required|string|max:255',
            'chat' => 'nullable|boolean',
            'reactions' => 'nullable|boolean',
        ];
    }
}
