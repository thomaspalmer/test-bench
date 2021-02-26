<?php

namespace App\Filters\MainStage;

use Carbon\Carbon;
use DualityStudio\Base\Filter\QueryFilter;

class SessionFilter extends QueryFilter
{
    /**
     * @param $term
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function startsToday($term)
    {
        return $this->builder->whereBetween(
            'starts_at',
            [Carbon::now()->startOfDay(), Carbon::now()->endOfDay()]
        );
    }

    /**
     * @param $term
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function remoteControl($term)
    {
        return $this->builder->where('remote_control', $term);
    }
}
