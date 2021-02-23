<?php

namespace App\Models;

use DualityStudio\Base\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class EmailReset extends Model
{
    use UsesUuid, HasFactory;

    /**
     * @var array
     */
    protected $fillable = [
        'user_id', 'new_email', 'existing_email', 'token'
    ];

    /**
     * @boot
     */
    static function boot () {
        parent::boot();

        static::creating(function ($model) {
            $model->token = hash_hmac('sha256', Str::random(40), config('app.key'));
        });
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
