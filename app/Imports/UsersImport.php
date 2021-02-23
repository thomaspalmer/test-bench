<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class UsersImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
    * @return array
    */
    public function availableColumns()
    {
        $columns = [
            'first_name' => 'Required',
            'last_name' => 'Required',
            'email' => 'Required',
            'password' => 'Optional, if no password is provide then a random password will be set that the user can reset themselves',
        ];

        if (config('ds-auth.features.verify_registrations')) {
            $columns['automatically_verify_email'] = 'Required, set to 1 for true or 0 for false';
        }

        return $columns;
    }

    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        $user = new User([
            'first_name' => $row['first_name'],
            'last_name' => $row['last_name'],
            'email' => $row['email'],
            'password' => isset($row['password']) ? Hash::make($row['password']) : Hash::make(Str::random(12)),
        ]);

        if (config('ds-auth.features.verify_registrations')) {
            if ($row['automatically_verify_email'] == '1') {
                $user->markEmailAsVerified();
            } else {
                $user->sendEmailVerificationNotification();
            }
        } else {
            $user->markEmailAsVerified();
        }

        return $user;
    }

    /**
    * @return array
    */
    public function rules(): array
    {
        $rules = [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'nullable|string|min:10',
        ];

        if (config('ds-auth.features.verify_registrations')) {
            $rules['automatically_verify_email'] = 'required|boolean';
        }

        return $rules;
    }
}
