<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    /**
     * Get paginated list of articles
     */
    public function index(Request $request): JsonResponse
    {
        $query = trim($request->input('search'));
        $filters = array_filter($request->only(['source', 'category', 'author', 'from_date', 'to_date']),
            function ($v) {
                return $v && $v !== 'all';
            });

        $articles = Article::query()
            ->with(['newsSource', 'category', 'author'])
            ->published()
            ->latest('published_at')
            ->filter($filters)
            ->when($query, function ($q) use ($query) {
                $q->where(function ($sub) use ($query) {
                    $sub->where('title', 'like', "%{$query}%")
                        ->orWhere('content', 'like', "%{$query}%");
                });
            });

        // default 20, Max 100 per page
        $perPage = min($request->get('per_page', 20), 100);
        $articles = $articles->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => ArticleResource::collection($articles),
            'filters_applied' => $filters,
            'meta' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'per_page' => $articles->perPage(),
                'total' => $articles->total(),
                'from' => $articles->firstItem(),
                'to' => $articles->lastItem()
            ]
        ]);
    }

    /**
     * Get single article
     */
    public function show(Article $article): JsonResponse
    {
        $article->load(['newsSource', 'category', 'author', 'tags']);
        //TODO Increment Views to find trending
//        $article->incrementViews();

        return response()->json([
            'status' => 'success',
            'data' => new ArticleResource($article)
        ]);
    }

    /**
     * TODO
     * Get featured articles
     */
    public function featured(Request $request): JsonResponse
    {
        $perPage = min($request->get('per_page', 10), 50);

        $articles = Article::with(['newsSource', 'category', 'author'])
            ->featured()
            ->published()
            ->latest('published_at')
            ->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => ArticleResource::collection($articles)
        ]);
    }

    /**
     * TODO
     * Get trending articles (by view count)
     */
    public function trending(Request $request): JsonResponse
    {
        $perPage = min($request->get('per_page', 10), 50);
        $days = min($request->get('days', 7), 30); // Max 30 days

        $articles = Article::with(['newsSource', 'category', 'author'])
            ->published()
            ->where('published_at', '>=', now()->subDays($days))
            ->orderByDesc('view_count')
            ->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => ArticleResource::collection($articles),
            'meta' => [
                'days' => $days,
                'total_articles' => $articles->total()
            ]
        ]);
    }
}
