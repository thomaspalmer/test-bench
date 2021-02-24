<?php

namespace App\Filters\Admin\MainStage;

use DualityStudio\Base\Filter\QueryFilter;

class PollFilter extends QueryFilter
{
    /**
     * @param $term
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function search($term)
    {
        return $this->builder->where('question', 'LIKE', '%' . $term . '%');
    }
}
