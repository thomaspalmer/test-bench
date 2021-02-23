<?php

namespace App\Filters\Admin\MainStage;

use DualityStudio\Base\Filter\QueryFilter;

class SessionFilter extends QueryFilter
{
    /**
     * @param $term
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function search($term)
    {
        return $this->builder->where('title', $term);
    }
}
