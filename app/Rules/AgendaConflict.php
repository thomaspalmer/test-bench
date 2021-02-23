<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\Agenda;

class AgendaConflict implements Rule
{
    /**
     * @var \App\Models\User
     */
    private $user;

    /**
     * Create a new rule instance.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $agenda = Agenda::find($value);

        $conflicts = $this->user->agenda()
            ->where(function($query) use ($agenda){ 
                $query->where([
                    ['start_date_time', '<=', $agenda->start_date_time],
                    ['end_date_time', '>', $agenda->start_date_time],
                ]);

                $query->orWhere([
                    ['start_date_time', '<', $agenda->end_date_time],
                    ['end_date_time', '>=', $agenda->end_date_time],
                ]);
            })
            ->count();

        return ($conflicts === 0);
    }

    /**
     * @return array|string
     */
    public function message()
    {
        return 'You are already booked into a session at this time, to change session please remove the existing session and re-book.';
    }
}
