<?php

namespace App\Models;

use App\Events\MainStageReaction as ReactionEvent;
use DualityStudio\Base\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainStageReaction extends Model
{
    use HasFactory, UsesUuid;

    /**
     * @var string[]
     */
    protected $fillable = [
        'user_id', 'reaction', 'session_id'
    ];

    /**
     * @var string[]
     */
    protected $dispatchesEvents = [
        'created' => ReactionEvent::class
    ];

    /**
     * @boot
     */
    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if ($model->user_id === null) {
                $model->user_id = request()->user()->id;
            }
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
