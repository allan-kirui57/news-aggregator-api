<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\NewsSource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $totalArticles = Article::count();
        $totalSources = NewsSource::count();
        $featuredArticles = Article::where('is_featured', true)->count();
        $todayArticles = Article::whereDate('created_at', today())->count();

        // Get source statistics
        $sourceStats = NewsSource::withCount('articles')
            ->get()
            ->map(function ($source) {
                return [
                    'id' => $source->id,
                    'name' => $source->name,
                    'type' => $source->source_type,
                    'articles_count' => $source->articles_count,
                    'last_updated' => $source->updated_at->diffForHumans()
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => [
                'totalArticles' => $totalArticles,
                'totalSources' => $totalSources,
                'featuredArticles' => $featuredArticles,
                'todayArticles' => $todayArticles,
            ],
            'sourceStats' => $sourceStats
        ]);
    }
}
