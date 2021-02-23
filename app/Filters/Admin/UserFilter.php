<?php

namespace App\Filters\Admin;

use DualityStudio\Base\Filter\QueryFilter;

class UserFilter extends QueryFilter
{
    /**
     * @param $search
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function search($search)
    {
        return $this->builder->where(function ($subquery) use ($search) {
            $subquery->where('first_name', 'LIKE', '%' . $search . '%');
            $subquery->orWhere('last_name', 'LIKE', '%' . $search . '%');
            $subquery->orWhere('email', 'LIKE', '%' . $search . '%');
        });
    }
}
