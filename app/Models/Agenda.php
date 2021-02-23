<?php

namespace App\Models;

use DualityStudio\Base\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Agenda extends Model
{
    use HasFactory, UsesUuid;

    /**
     * @var string[]
     */
    protected $fillable = [
        'active', 'start_date_time', 'end_date_time', 'title', 'content',
        'presenters', 'show_add_to_agenda_button', 'show_add_to_agenda_button_start_date_time',
        'show_add_to_agenda_button_end_date_time', 'show_add_to_calendar_button',
        'show_add_to_calendar_button_only_if_in_agenda', 'join_link', 'join_link_display_start_date_time',
        'join_link_display_end_date_time', 'join_link_display_only_if_in_agenda', 'spaces'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'active' => 'boolean',
        'start_date_time' => 'datetime',
        'end_date_time' => 'datetime',
        'show_add_to_agenda_button' => 'boolean',
        'show_add_to_agenda_button_start_date_time' => 'datetime',
        'show_add_to_agenda_button_end_date_time' => 'datetime',
        'show_add_to_calendar_button' => 'boolean',
        'show_add_to_calendar_button_only_if_in_agenda' => 'boolean',
        'join_link_display_start_date_time' => 'datetime',
        'join_link_display_end_date_time' => 'datetime',
        'join_link_display_only_if_in_agenda' => 'boolean',
        'spaces' => 'integer'
    ];

    /**
     * @var string[]
     */
    protected $appends = [
        'available_spaces', 'show_add_to_agenda_button_now', 'show_join_link_now'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * @return mixed
     */
    public function getAvailableSpacesAttribute()
    {
        if ($this->spaces === null) {
            return null;
        }

        return $this->spaces - $this->users()->count();
    }

    /**
     * @return boolean
     */
    public function getShowAddToAgendaButtonNowAttribute()
    {
        if ($this->show_add_to_agenda_button === true) {
            // If dates are null then show.
            if ($this->show_add_to_agenda_button_start_date_time === null
                && $this->show_add_to_agenda_button_end_date_time === null) {

                return true;
            }

            if ($this->show_add_to_agenda_button_start_date_time === null
                && Carbon::now()->lessThan($this->show_add_to_agenda_button_end_date_time)) {

                return true;
            }

            if ($this->show_add_to_agenda_button_end_date_time === null
                && Carbon::now()->greaterThan($this->show_add_to_agenda_button_start_date_time)) {

                return true;
            }

            if (Carbon::now()->greaterThan($this->show_add_to_agenda_button_start_date_time)
                && Carbon::now()->lessThan($this->show_add_to_agenda_button_end_date_time)) {

                return true;
            }
        }

        return false;
    }

    /**
     * @return boolean
     */
    public function getShowJoinLinkNowAttribute()
    {
        if ($this->join_link) {
            // If dates are null then show.
            if ($this->join_link_display_start_date_time === null
                && $this->join_link_display_end_date_time === null) {

                return true;
            }

            if ($this->join_link_display_start_date_time === null
                && Carbon::now()->lessThan($this->join_link_display_end_date_time)) {

                return true;
            }

            if ($this->join_link_display_end_date_time === null
                && Carbon::now()->greaterThan($this->join_link_display_start_date_time)) {

                return true;
            }

            if (Carbon::now()->greaterThan($this->join_link_display_start_date_time)
                && Carbon::now()->lessThan($this->join_link_display_end_date_time)) {

                return true;
            }
        }

        return false;
    }
}
