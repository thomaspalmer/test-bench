<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RunImportRequest;
use App\Http\Resources\Admin\ImportResource;
use App\Models\AdminImport as AdminImportModel;
use App\Events\AdminImport;
use Illuminate\Http\Request;
use DualityStudio\Base\Traits\HandlesUpload;

class ImportsController extends Controller
{
    use HandlesUpload;

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function availableImports(Request $request)
    {
        $available_imports = [];

        foreach (config('ds-admin.imports') as $import) {
            $className = 'App\Imports\\' . $import . 'Import';
            $importClass = new $className;

            $available_imports[] = [
                'import' => $import,
                'available_columns' => method_exists($importClass, 'availableColumns') ? $importClass->availableColumns() : null
            ];
        }

        return response()->json($available_imports, 200);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        return ImportResource::collection(
            AdminImportModel::where('user_id', $request->user()->id)
            ->orderBy(
                $request->get('order_by', 'created_at'),
                $request->get('order', 'desc')
            )
            ->paginate($request->get('per_page', 20))
        );
    }

    /**
     * @param RunImportRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(RunImportRequest $request)
    {
        $adminImport = AdminImportModel::create([
            'user_id' => $request->user()->id,
            'type' => $request->get('type'),
            'completed' => false,
            'path' => $this->processUpload($request, 'import_file'),
            'file_name' => $request->get('import_file_name') 
        ]);

        event(new AdminImport($adminImport));

        return response()->json([], 201);
    }
}
