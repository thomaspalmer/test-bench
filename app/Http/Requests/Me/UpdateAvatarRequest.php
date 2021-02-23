<?php

namespace App\Http\Requests\Me;

use DualityStudio\Base\Rules\StorageFileExists;
use DualityStudio\Base\Rules\StorageFileValidate;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAvatarRequest extends FormRequest
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
        $maxSize = '20000000'; // 2000 kb
        $mimes = ['image/jpg', 'image/jpeg', 'image/png'];

        return [
            'key' => [
                'required',
                'string',
                new StorageFileExists(),
                new StorageFileValidate($maxSize, $mimes)
            ],
        ];
    }
}
