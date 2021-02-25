<?php

namespace App\Models;

use App\Events\PollsUpdated;
use DualityStudio\Base\Traits\Filterable;
use DualityStudio\Base\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainStagePoll extends Model
{
    use HasFactory, UsesUuid, Filterable;

    /**
     * @var string[]
     */
    protected $fillable = [
        'question', 'session_id', 'display_from'
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'display_from' => 'datetime'
    ];

    /**
     * @var string[]
     */
    protected $dispatchesEvents = [
        'created' => PollsUpdated::class,
        'updated' => PollsUpdated::class,
        'deleted' => PollsUpdated::class
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function session()
    {
        return $this->belongsTo(MainStageSession::class, 'id', 'session_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function answers()
    {
        return $this->hasMany(MainStagePollAnswer::class, 'question_id');
    }
}
