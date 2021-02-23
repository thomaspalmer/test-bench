<?php

namespace App\Models;

use DualityStudio\Base\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Login extends Model
{
    use HasFactory, UsesUuid;

    /**
     * @var string[]
     */
    protected $fillable = [
        'user_id', 'type'
    ];
}
