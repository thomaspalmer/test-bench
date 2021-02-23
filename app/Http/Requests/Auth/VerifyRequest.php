<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class VerifyRequest extends FormRequest
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
        $user = User::findOrFail($this->route('user'));
        $rules = [];

        if (!$user->has_profile) {
            $rules['first_name'] = 'required|string|max:255';
            $rules['last_name'] = 'required|string|max:255';
        }

        if (!$user->has_password) {
            $rules['password'] = 'required|string|min:10|confirmed';
        }

        return $rules;
    }
}
