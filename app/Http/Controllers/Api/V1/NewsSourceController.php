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

    /**
     * Update only api_key and base_url.
     */
    public function update(Request $request, NewsSource $newsSource)
    {
        $validated = $request->validate([
            'base_url' => ['required', 'url', 'max:255'],
            'api_key'  => ['required', 'string', 'max:255'],
            'is_active'  => ['required', 'boolean'],
        ]);

        $newsSource->update([
            'base_url' => $validated['base_url'],
            'api_key'  => $validated['api_key'] ?? null,
            'is_active'  => $validated['is_active'] ?? null,
        ]);

        return response()->json([
            'message' => 'News source updated successfully.',
            'data'    => $newsSource->fresh(),
        ]);
    }
}
