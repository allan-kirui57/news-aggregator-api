<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\NewsSource;
use Illuminate\Http\Request;

class NewsSourceController extends Controller
{
    public function index(Request $request)
    {
        $query = NewsSource::query();

        if ($type = $request->get('type')) {
            $query->where('source_type', $type);
        }

        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->boolean('active')) {
            $query->where('is_active', true);
        }

        return response()->json(
            $query->orderBy('name')
                ->paginate($request->integer('per_page', 20))
        );
    }
}
