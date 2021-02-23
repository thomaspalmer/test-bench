<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use DualityStudio\Base\Traits\UsesUuid;

class PasswordReset extends Model
{
    use HasFactory, UsesUuid;

    /**
     * Disables the timestamps
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email', 'token', 'created_at'
    ];

    /**
     * Set the created_at only
     */
    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->created_at = $model->freshTimestamp();
        });
    }

    /**
     * Generate a unique token
     *
     * @return string
     */
    public static function generateToken()
    {
        do {
            $token = Str::random(32);
        } while (self::where('token', $token)->count() !== 0);

        return $token;
    }
}
