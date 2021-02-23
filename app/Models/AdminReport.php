<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DualityStudio\Base\Traits\UsesUuid;

class AdminReport extends Model
{
    use UsesUuid;

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'type', 'completed', 'path'
    ];

    /**
     * @var array
     */
    protected $casts = [
        'completed' => 'boolean',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
