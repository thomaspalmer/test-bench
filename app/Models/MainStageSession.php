<?php

namespace App\Models;

use Carbon\Carbon;
use DualityStudio\Base\Traits\Filterable;
use DualityStudio\Base\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainStageSession extends Model
{
    use HasFactory, UsesUuid, Filterable;

    /**
     * @var string[]
     */
    protected $fillable = [
        'id', 'title', 'starts_at', 'ends_at', 'stream_src', 'description', 'chat', 'reactions'
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'chat' => 'boolean',
        'reactions' => 'boolean',
        'starts_soon' => 'boolean',
        'live' => 'boolean'
    ];

    /**
     * @var string[]
     */
    protected $appends = [
        'live'
    ];

    /**
     * @return bool
     */
    public function getLiveAttribute()
    {
        $startDate = Carbon::parse($this->starts_at);
        $endDate = $this->ends_at !== null ? Carbon::parse($this->ends_at) : Carbon::now()->addMinute();

        return Carbon::now()->between($startDate,$endDate);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments()
    {
        return $this->hasMany(MainStageComment::class, 'session_id');
    }
}
