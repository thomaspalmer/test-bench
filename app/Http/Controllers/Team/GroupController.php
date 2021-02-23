<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Http\Requests\Team\CreateGroupRequest;
use App\Http\Requests\Team\UpdateGroupRequest;
use App\Http\Resources\Team\GroupResource;
use App\Models\Group;
use App\Models\Team;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    /**
     * @param Team $team
     * @param Request $request
     * @return mixed
     */
    public function index(Team $team, Request $request)
    {
        $groups = Group::where('team_id', $team->id);

        if ($request->has('page')) {
            $groups = $groups->paginate(20);
        } else {
            $groups = $groups->get();
        }

        return GroupResource::collection(
            $groups
        );
    }

    /**
     * @param Team $team
     * @param CreateGroupRequest $request
     * @return GroupResource
     */
    public function store(Team $team, CreateGroupRequest $request)
    {
        $group = $team->groups()->create($request->validated());

        return new GroupResource($group);
    }

    /**
     * @param Team $team
     * @param Group $group
     * @return GroupResource
     */
    public function show(Team $team, Group $group)
    {
        return new GroupResource($group);
    }

    /**
     * @param Team $team
     * @param Group $group
     * @param UpdateGroupRequest $request
     * @return GroupResource
     */
    public function update(Team $team, Group $group, UpdateGroupRequest $request)
    {
        $group->update($request->validated());

        return new GroupResource($group);
    }

    /**
     * @param Team $team
     * @param Group $group
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Team $team, Group $group)
    {
        if ($group->user_count !== 0) {
            return response()->json([
                'errors' => [
                    'Sorry, this group still has one or more users on it and cannot be deleted'
                ]
            ], 422);
        }

        $group->delete();

        return response('', 204);
    }
}
