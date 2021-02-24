<?php

namespace App\Rules;

use App\Models\MainStageSession;
use Illuminate\Contracts\Validation\Rule;

class NoSessionOverlap implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $check = MainStageSession::where('starts_at', '<=', $value)
            ->where(function ($query) use ($value) {
                $query->whereNull('ends_at')
                    ->orWhere('ends_at', '>=', $value);
            });

        if (request()->route('session')) {
            $check = $check->where('id', '!=', request()->route('session')->id);
        }

        return $check->first() === null;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'There is another session running at this time';
    }
}
