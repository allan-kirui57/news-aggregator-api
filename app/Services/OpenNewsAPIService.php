<?php

namespace App\Services;

use App\Models\NewsSource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;

class OpenNewsAPIService
{
    protected ArticlesService $articlesService;

    public function __construct(ArticlesService $articlesService)
    {
        $this->articlesService = $articlesService;
    }

    /**
     * Fetch and store articles from OpenNews API
     */
    public function fetchArticles(NewsSource $newsSource, array $params = []): Collection
    {
        $saved = collect();

        $defaultParams = [
            'limit' => 20,
            'page'  => 1,
        ];

        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . ($newsSource->api_key ?? env('OPEN_NEWS_API_KEY')),
                    'User-Agent'    => 'NewsAggregator/1.0',
                ])
                ->get($newsSource->base_url . '/articles', array_merge($defaultParams, $params));

            if ($response->failed()) {
                throw new \Exception("OpenNews API request failed: " . $response->body());
            }

            $data = $response->json();

            if (!isset($data['status']) || $data['status'] !== 'ok') {
                throw new \Exception("OpenNews API error: " . json_encode($data));
            }

            foreach ($data['articles'] ?? [] as $item) {
                // Map OpenNews fields to the structure expected by ArticlesService
                $articleData = [
                    'title'       => $item['headline'] ?? null,
                    'content'     => $item['body'] ?? null,
                    'description' => $item['summary'] ?? null,
                    'url'         => $item['link'] ?? null,
                    'urlToImage'  => $item['image'] ?? null,
                    'publishedAt' => $item['published_at'] ?? null,
                ];

                if ($stored = $this->articlesService->storeArticle($articleData, $newsSource)) {
                    $saved->push($stored);
                }
            }

            return $saved;
        } catch (\Exception $e) {
            throw new \Exception("Error fetching articles from OpenNews API: " . $e->getMessage());
        }
    }
}
