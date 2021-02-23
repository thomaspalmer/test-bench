<?php

namespace App\Models;

use DualityStudio\Base\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory, UsesUuid;

    /**
     * @var string[]
     */
    protected $fillable = [
        'name', 'scopes', 'team_id', 'default'
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'scopes' => 'array'
    ];

    /**
     * @var string[]
     */
    protected $appends = [
        'user_count'
    ];

    /**
     * @return int
     */
    public function getUserCountAttribute()
    {
        return $this->users()->count();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany(TeamUser::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
