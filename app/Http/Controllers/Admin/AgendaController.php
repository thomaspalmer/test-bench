<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use App\Http\Requests\Admin\StoreAgendaRequest;
use App\Http\Resources\Admin\AgendaResource;
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
            Agenda::orderBy(
                $request->get('order_by', 'start_date_time'),
                $request->get('order', 'asc')
            )
            ->paginate($request->get('per_page', 20))
        );
    }

    /**
     * @param StoreAgendaRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreAgendaRequest $request)
    {
        $agenda = Agenda::create($request->validated());

        return response('', 201);
    }

    /**
     * @param Agenda $agenda
     * @return AgendaResource
     */
    public function show(Agenda $agenda)
    {
        return new AgendaResource($agenda);
    }

    /**
     * @param Agenda $agenda
     * @param StoreAgendaRequest $request
     * @return AgendaResource
     */
    public function update(Agenda $agenda, StoreAgendaRequest $request)
    {        
        $agenda->update($request->validated());

        return new AgendaResource($agenda);
    }

    /**
     * @param Agenda $agenda
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|void
     */
    public function destroy(Agenda $agenda, Request $request)
    {
        if (!$request->has('confirmed') || $request->get('confirmed') !== true) {
            return response()->json(['message' => 'Confirmation required.'], 422);
        }

        $agenda->delete();

        return response('', 204);
    }
}
