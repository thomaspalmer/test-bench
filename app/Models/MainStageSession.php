<?php

namespace App\Models;

use App\Events\MainStageSessionsUpdated;
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
        'id', 'title', 'starts_at', 'ends_at', 'stream_src', 'description', 'chat', 'reactions', 'remote_control'
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'chat' => 'boolean',
        'reactions' => 'boolean',
        'remote_control' => 'boolean',
        'starts_soon' => 'boolean',
        'live' => 'boolean'
    ];

    /**
     * @var string[]
     */
    protected $dispatchesEvents = [
        'created' => MainStageSessionsUpdated::class,
        'updated' => MainStageSessionsUpdated::class,
        'deleted' => MainStageSessionsUpdated::class
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

        return Carbon::now()->between($startDate, $endDate);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function chats()
    {
        return $this->hasMany(MainStageChat::class, 'session_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reactions()
    {
        return $this->hasMany(MainStageReaction::class, 'session_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function polls()
    {
        return $this->hasMany(MainStagePoll::class, 'session_id')
            ->orderBy('display_from', 'asc');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function pollSubmission()
    {
        return $this->hasMany(MainStagePollSubmission::class, 'session_id');
    }
}
