<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RunReportRequest;
use App\Http\Resources\Admin\ReportResource;
use App\Models\AdminReport as AdminReportModel;
use App\Events\AdminReport;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class ReportsController extends Controller
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function availableReports(Request $request)
    {
        return response()->json(config('ds-admin.exports'), 200);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        return ReportResource::collection(
            AdminReportModel::where('user_id', $request->user()->id)
            ->orderBy(
                $request->get('order_by', 'created_at'),
                $request->get('order', 'desc')
            )
            ->paginate($request->get('per_page', 20))
        );
    }

    /**
     * @param RunReportRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(RunReportRequest $request)
    {
    	$type = $request->get('type');

        $adminReport = AdminReportModel::create([
            'user_id' => $request->user()->id,
            'type' => $type,
            'completed' => false,
        ]);

        event(new AdminReport($adminReport));

        return response()->json([], 201);
    }

    /**
     * @param AdminReportModel $report
     * @return mixed
     */
    public function show(AdminReportModel $report)
    {
        return Storage::download($report->path);
    }
}
