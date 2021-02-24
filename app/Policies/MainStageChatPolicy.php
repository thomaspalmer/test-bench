<?php

namespace App\Policies;

use App\Models\MainStageChat;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MainStageChatPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\MainStageChat  $mainStageChat
     * @return mixed
     */
    public function view(User $user, MainStageChat $mainStageChat)
    {
        //
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\MainStageChat  $mainStageChat
     * @return mixed
     */
    public function update(User $user, MainStageChat $mainStageChat)
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\MainStageChat  $mainStageChat
     * @return mixed
     */
    public function delete(User $user, MainStageChat $mainStageChat)
    {
        // TODO Update to scopes
        return $user->is_admin;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\MainStageChat  $mainStageChat
     * @return mixed
     */
    public function restore(User $user, MainStageChat $mainStageChat)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\MainStageChat  $mainStageChat
     * @return mixed
     */
    public function forceDelete(User $user, MainStageChat $mainStageChat)
    {
        //
    }
}
