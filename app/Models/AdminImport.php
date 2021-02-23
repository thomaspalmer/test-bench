<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DualityStudio\Base\Traits\UsesUuid;

class AdminImport extends Model
{
    use UsesUuid;

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'type', 'completed', 'successful', 'errors',
        'path', 'file_name'
    ];

    /**
     * @var array
     */
    protected $casts = [
        'completed' => 'boolean',
        'successful' => 'boolean',
        'errors' => 'array'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
