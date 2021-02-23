<?php

namespace App\Models;

use App\Events\TeamCreated;
use DualityStudio\Base\Traits\Filterable;
use DualityStudio\Base\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory, UsesUuid;

    /**
     * @var string[]
     */
    protected $fillable = [
        'user_id', 'name', 'force_two_factor'
    ];

    /**
     * @var string[]
     */
    protected $dispatchesEvents = [
        'created' => TeamCreated::class
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'force_two_factor' => 'boolean'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany(TeamUser::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function groups()
    {
        return $this->hasMany(Group::class);
    }

    /**
     * @return Model|\Illuminate\Database\Eloquent\Relations\HasMany|object|null
     */
    public function defaultGroup()
    {
        return $this->groups()->where('default', true)->first();
    }
}
