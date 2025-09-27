<?php

namespace App\Services;

use App\Models\Article;
use App\Models\NewsSource;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ArticlesService
{
    /**
     * Store a single article if not already present.
     */
    public function storeArticle(array $articleData, NewsSource $newsSource): ?Article
    {
        $url = $articleData['url'];
        $hash = hash('sha256', $articleData['content'] ?? $url);

        // Use firstOrCreate to handle deduplication atomically
        return Article::firstOrCreate(
            ['content_hash' => $hash],
            [
                'title' => $articleData['title'],
                'content' => $articleData['content'] ?? '',
                'summary' => $articleData['description'] ?? null,
                'url' => $url,
                'image_url' => $articleData['urlToImage'] ?? null,
                'published_at' => Carbon::parse($articleData['publishedAt']),
                'news_source_id' => $newsSource->id,
                'category_id' => null,
                'external_id' => Str::uuid(),
            ]
        );
    }
}
