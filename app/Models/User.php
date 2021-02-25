<?php

namespace App\Models;

use App\Notifications\VerifyEmail;
use DualityStudio\Auth\Traits\HasOtp;
use DualityStudio\Auth\Traits\HasTeams;
use DualityStudio\Auth\Traits\HasTwoFactor;
use DualityStudio\Base\Traits\UsesUuid;
use DualityStudio\Base\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, UsesUuid, Filterable, HasApiTokens, HasTeams, HasTwoFactor, HasOtp;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name', 'last_name', 'email', 'password', 'last_login_date', 'enabled', 'avatar_path', 'group_id',
        'active_team_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'last_login_date' => 'datetime',
        'email_verified_at' => 'datetime',
        'enabled' => 'boolean'
    ];

    /**
     * @var string[]
     */
    protected $appends = [
        'full_name', 'must_verify_email', 'has_password', 'avatar_path_url'
    ];

    /**
     * @var string[]
     */
    public static $profileFields = [
        'first_name' => 'First Name',
        'last_name' => 'Last Name',
        'email' => 'Email',
    ];

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmail);
    }

    /**
     * @return string
     */
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * @return bool
     */
    public function getMustVerifyEmailAttribute()
    {
        return config('ds-auth.features.verify_registrations') && !$this->hasVerifiedEmail();
    }

    /**
     * @return bool
     */
    public function getHasPasswordAttribute()
    {
        return $this->password !== null;
    }

    /**
     * @return bool
     */
    public function getHasProfileAttribute()
    {
        $profile = true;

        foreach (array_keys(self::$profileFields) as $field) {
            if (!$this->{$field}) {
                $profile = false;
            }
        }

        return $profile;
    }

    /**
     * @return string|null
     */
    public function getAvatarPathUrlAttribute()
    {
        return $this->avatar_path ? Storage::url($this->avatar_path) : null;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function logins()
    {
        return $this->hasMany(Login::Class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * @return string
     */
    public function generateVerifyRegistrationUrl()
    {
        return config('app.url') . '/verify/' . $this->id . '/' . sha1($this->getEmailForVerification());
    }

    /**
     * @return array
     */
    public function getScopesAttribute()
    {
        if (config('ds-auth.features.teams')) {
            $teamUser = TeamUser::where([
                ['user_id', $this->id],
                ['team_id', $this->active_team_id],
            ])->firstOrFail();

            $scopes = $teamUser->group->scopes;
        } else {
            $scopes = $this->group ? $this->group->scopes : [];
        }

        return $scopes;
    }

    /**
     * @param $scope
     * @return bool
     */
    public function hasScope($scope)
    {
        return $this->scopes && in_array($scope, $this->scopes);
    }
}
