<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Carbon\Carbon;

class AgendaUser extends Pivot
{
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function agenda()
    {
        return $this->belongsTo(Agenda::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
