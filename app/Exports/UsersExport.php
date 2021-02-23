<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Carbon\Carbon;

class UsersExport implements FromCollection, WithHeadings, WithMapping
{
    use Exportable;

    public function collection()
    {
        return User::all();
    }

    public function headings(): array
    {
        return [
            'Id',
            'First Name',
            'Last Name',
            'Email',
            'Email Verified At',
            'Last Login Date',
            'Enabled',
            'Created At',
            'Last Updated At'
        ];
    }

    /**
    * @var User $user
    */
    public function map($user): array
    {
        return [
            $user->id,
            $user->first_name,
            $user->last_name,
            $user->email,
            $user->email_verified_at ? Carbon::parse($user->email_verified_at)->format('d-m-Y H:i') : '',
            $user->last_login_date ? Carbon::parse($user->last_login_date)->format('d-m-Y H:i') : '',
            $user->enabled ? 'Yes' : 'No',
            Carbon::parse($user->created_at)->format('d-m-Y H:i'),
            Carbon::parse($user->updated_at)->format('d-m-Y H:i'),
        ];
    }
}