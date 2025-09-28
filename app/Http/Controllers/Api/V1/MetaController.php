<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Author;
use App\Models\Category;
use App\Models\NewsSource;
use Illuminate\Http\Request;

class MetaController extends Controller
{
    /**
     * GET /api/meta/authors
     * ?search=tom&per_page=20
     */
    public function authors(Request $request)
    {
        $query = Author::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('bio', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query->orderBy('name')
                ->paginate($request->integer('per_page', 20))
        );
    }

    /**
     * GET /api/meta/categories
     * ?search=politics&active=1
     */
    public function categories(Request $request)
    {
        $query = Category::query();

        if ($request->boolean('active')) {
            $query->where('is_active', true);
        }

        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return response()->json(
            $query->orderBy('name')
                ->paginate($request->integer('per_page', 20))
        );
    }
}

