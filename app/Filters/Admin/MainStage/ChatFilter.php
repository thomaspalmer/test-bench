<?php

namespace App\Filters\Admin\MainStage;

use DualityStudio\Base\Filter\QueryFilter;

class ChatFilter extends QueryFilter
{
    /**
     * @param $term
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function search($term)
    {
        $search = '%' . $term . '%';

        return $this->builder->where('message', 'LIKE', $search)
            ->orWhereHas([
                'user' => function ($query) use ($search) {
                    $query->where('first_name', 'LIKE',  $search)
                        ->orWhere('last_name', 'LIKE', $search)
                        ->orWhere('email', 'LIKE', $search);
                }
            ]);
    }
}
