<?php

namespace App\Services;

use App\Contracts\NewsSourceInterface;
use App\Models\NewsSource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NewsAPIService implements NewsSourceInterface
{
    protected ArticlesService $articlesService;
    public function __construct()
    {
        $this->articlesService = new ArticlesService();
    }

    /**
     * Fetch and persist articles from NewsAPI
     */
    public function fetchArticles(NewsSource $newsSource, array $params = []): Collection
    {
        $defaultParams = [
            'language' => 'en',
            'sortBy' => 'publishedAt',
            'pageSize' => 20,
            'page' => 1,
        ];

        $endpoint = rtrim($newsSource->base_url, '/').'/everything';

        try {
            $response = Http::withHeaders([
                'X-API-Key' => $newsSource->api_key ?? env('NEWS_API_KEY'),
                'User-Agent' => 'NewsAggregator/1.0',
            ])->timeout(30)->get($endpoint, array_merge($defaultParams, $params));

            if ($response->failed()) {
                throw new \RuntimeException("News API request failed: {$response->body()}");
            }

            $data = $response->json();

            if (($data['status'] ?? null) !== 'ok') {
                throw new \RuntimeException("NewsAPI error: ".($data['message'] ?? 'Unknown error'));
            }

            $saved = collect();

            foreach ($data['articles'] ?? [] as $article) {
                if ($stored = $this->articlesService->storeArticle($article, $newsSource)) {
                    $saved->push($stored);
                }
            }

            return $saved;
        } catch (\Throwable $e) {
            Log::error('Error fetching NewsAPI articles', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
}
