<?php

namespace App\Models;

use DualityStudio\Base\Traits\Filterable;
use DualityStudio\Base\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainStageChat extends Model
{
    use HasFactory, UsesUuid, Filterable;

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

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
