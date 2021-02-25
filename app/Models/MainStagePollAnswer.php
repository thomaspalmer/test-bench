<?php

namespace App\Models;

use DualityStudio\Base\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainStagePollAnswer extends Model
{
    use HasFactory, UsesUuid;

    /**
     * @var string[]
     */
    protected $fillable = [
        'question_id', 'answer'
    ];

    /**
     * @var string[]
     */
    protected $appends = [
        'submission_count'
    ];

    /**
     * @return int
     */
    public function getSubmissionCountAttribute()
    {
        return $this->submissions()->count();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function poll()
    {
        return $this->belongsTo(MainStagePoll::class, 'question_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function submissions()
    {
        return $this->hasMany(MainStagePollSubmission::class, 'answer_id');
    }
}
