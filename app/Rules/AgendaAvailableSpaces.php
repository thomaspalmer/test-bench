<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\Agenda;

class AgendaAvailableSpaces implements Rule
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

        if (!$agenda->spaces) {
            return true;
        }

        return ($agenda->available_spaces > 0);
    }

    /**
     * @return array|string
     */
    public function message()
    {
        return 'This session is fully booked.';
    }
}
