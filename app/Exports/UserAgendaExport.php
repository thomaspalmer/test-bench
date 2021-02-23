<?php

namespace App\Exports;

use App\Models\AgendaUser;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Carbon\Carbon;

class UserAgendaExport implements FromCollection, WithHeadings, WithMapping
{
	use Exportable;

    public function collection()
    {
        return AgendaUser::all();
    }

	public function headings(): array
    {
        return [
            'First Name',
            'Last Name',
            'Email',
            'Agenda Start Date (UTC)',
            'Agenda Start Time (UTC)',
            'Agenda Title',
        ];
    }

    /**
    * @var AgendaUser $agendaUser
    */
    public function map($agendaUser): array
    {
        return [
            $agendaUser->user->first_name,
            $agendaUser->user->last_name,
            $agendaUser->user->email,
            Carbon::parse($agendaUser->agenda->start_date_time)->format('d-m-Y'),
            Carbon::parse($agendaUser->agenda->start_date_time)->format('H:i'),
            $agendaUser->agenda->title,
        ];
    }
}
