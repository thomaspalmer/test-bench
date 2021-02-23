<?php

namespace App\Models;

use DualityStudio\Base\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainStageComment extends Model
{
    use HasFactory, UsesUuid;

    /**
     * @var string[]
     */
    protected $fillable = [
        'user_id', 'session_id', 'message'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function session()
    {
        return $this->belongsTo(MainStageSession::class, 'id', 'session_id');
    }
}
