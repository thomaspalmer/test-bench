<?php

namespace App\Http\Controllers\Agenda;

use App\Http\Controllers\Controller;
use App\Http\Resources\Agenda\AgendaResource;
use App\Http\Requests\Agenda\StoreAgendaUserRequest;
use App\Models\Agenda;
use Illuminate\Http\Request;

class AgendaController extends Controller
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        return AgendaResource::collection(
            Agenda::where('active', true)
                ->orderBy(
                    $request->get('order_by', 'start_date_time'),
                    $request->get('order', 'asc')
                )
                ->get()
        );
    }

    /**
     * @param StoreAgendaUserRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreAgendaUserRequest $request)
    {
        $agenda = Agenda::find($request->get('agenda_id'));

        $agenda->users()->attach($request->user()->id);

        return response()->json([], 201);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, Agenda $agenda)
    {
        $agenda->users()->detach($request->user()->id);

        return response()->json([], 204);
    }
}
