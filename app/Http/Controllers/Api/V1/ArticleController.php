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
        $query = Article::with(['newsSource', 'category', 'author'])
            ->published()
            ->latest('published_at');

        // Apply filters
        if ($request->filled('source')) {
            $query->whereHas('newsSource', function ($q) use ($request) {
                $q->where('slug', $request->source);
            });
        }

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->filled('author')) {
            $query->whereHas('author', function ($q) use ($request) {
                $q->where('slug', $request->author);
            });
        }

        if ($request->filled('from_date')) {
            $query->where('published_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->where('published_at', '<=', $request->to_date);
        }

        $perPage = min($request->get('per_page', 20), 100); // Max 100 per page
        $articles = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => ArticleResource::collection($articles),
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
     * Search articles
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->validated('q');
        $filters = $request->only(['source', 'category', 'author', 'from_date', 'to_date']);

        $articles = Article::search($query)
            ->where('published_at', '<=', now());

        // Apply additional filters to the search
        if (!empty($filters['source'])) {
            $articles->whereHas('newsSource', function ($q) use ($filters) {
                $q->where('name', $filters['source']);
            });
        }

        if (!empty($filters['category'])) {
            $articles->whereHas('category', function ($q) use ($filters) {
                $q->where('slug', $filters['category']);
            });
        }

        $perPage = min($request->get('per_page', 15), 100);
        $results = $articles->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => ArticleResource::collection($results),
            'query' => $query,
            'filters_applied' => array_filter($filters),
            'meta' => [
                'current_page' => $results->currentPage(),
                'last_page' => $results->lastPage(),
                'per_page' => $results->perPage(),
                'total' => $results->total()
            ]
        ]);
    }

    /**
     * Get single article
     */
    public function show(Article $article): JsonResponse
    {
        $article->load(['newsSource', 'category', 'author', 'tags']);
        //TODO Increment Views
//        $article->incrementViews();

        return response()->json([
            'status' => 'success',
            'data' => new ArticleResource($article)
        ]);
    }

    /**
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
