<?php

namespace App\Http\Requests\Admin;

use DualityStudio\Base\Rules\StorageFileExists;
use DualityStudio\Base\Rules\StorageFileValidate;
use Illuminate\Foundation\Http\FormRequest;

class RunImportRequest extends FormRequest
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
        $maxSize = '20000000'; // 20000 kb

        // https://stackoverflow.com/questions/42089659/laravel-validator-and-excel-files-error
        $mimes = [
            'application/csv',
            'application/excel',
            'application/vnd.ms-excel',
            'application/vnd.msexcel',
            'text/csv',
            'text/anytext',
            'text/plain',
            'text/x-c',
            'text/comma-separated-values',
            'inode/x-empty',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        
        return [
            'type' => 'required|string|in:' . implode(',', config('ds-admin.imports')),
            'import_file' => [
                'required',
                'string',
                new StorageFileExists(),
                new StorageFileValidate($maxSize, $mimes)
            ],
            'import_file_name' => 'required|string|max:255'
        ];
    }
}
