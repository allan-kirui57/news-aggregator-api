<?php

namespace App\Services;

use App\Contracts\NewsSourceInterface;
use App\Models\NewsSource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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
            'limit' => $params['limit'] ?? 20,
            'q' => $params['q'] ?? 'general',
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

                $transformedArticleData = $this->transformCollection($article,
                    ['defaultCategory' => $defaultParams['q']]);

                if ($stored = $this->articlesService->storeArticle($transformedArticleData, $newsSource)) {
                    $saved->push($stored);
                }
            }

            return $saved;
        } catch (\Throwable $e) {
            Log::error('Error fetching NewsAPI articles', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    public function transformCollection(array $rawArticle, array $options = []): array
    {

        // Author as a nested structure
        $author = !empty($rawArticle['author']) ? [
            'slug' => Str::slug($rawArticle['author']),
            'name' => $rawArticle['author'],
            'profile_url' => null,
            'bio' => null,
        ] : null;

        // Category – taken from the query/category parameter in command
        $category = [
            'slug' => Str::slug($options['defaultCategory']),
            'name' => ucfirst($options['defaultCategory']),
            'pillar' => null,
            'external_id' => null,
        ];

        return [
            'title' => $this->cleanTitle($rawArticle['title'] ?? ''),
            'content' => $this->cleanContent($rawArticle['content'] ?? ''),
            'summary' => $this->generateSummary($rawArticle['description'] ?? ''),
            'url' => $rawArticle['url'] ?? null,
            'image_url' => $rawArticle['urlToImage'] ?? null,
            'published_at' => $rawArticle['publishedAt'] ?? null,
            'external_id' => md5($rawArticle['url'] ?? Str::uuid()),
            'author' => $author,
            'category' => $category,
        ];
    }

    protected function cleanTitle(string $title): string
    {
        return trim(strip_tags($title));
    }

    protected function cleanContent(string $content): string
    {
        return trim(preg_replace('/\[\+\d+ chars\]/', '', strip_tags($content)));
    }

    protected function generateSummary(string $description): string
    {
        return Str::limit(trim(strip_tags($description)), 280);
    }
}
