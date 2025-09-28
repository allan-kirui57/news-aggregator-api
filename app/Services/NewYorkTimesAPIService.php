<?php

namespace App\Services;

use App\Contracts\NewsSourceInterface;
use App\Models\NewsSource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class NewYorkTimesAPIService implements NewsSourceInterface
{
    protected ArticlesService $articlesService;

    public function __construct()
    {
        $this->articlesService = new ArticlesService();
    }

    /**
     * Fetch articles from the New York Times API
     *
     * @param  NewsSource  $newsSource
     * @param  array       $params
     */
    public function fetchArticles(NewsSource $newsSource, array $params = []): Collection
    {
        $saved = collect();
        $section = $params['section'] ?? 'world';
        $baseUrl = $newsSource->base_url ?? env('NYT_API_URL', 'https://api.nytimes.com/svc');
        $apiKey  = $newsSource->api_key ?? env('NYT_API_KEY');

        try {
            $response = Http::timeout(30)
                ->withHeaders(['User-Agent' => 'NewsAggregator/1.0'])
                ->get("{$baseUrl}/topstories/v2/{$section}.json", [
                    'api-key' => $apiKey,
                ]);

            if ($response->failed()) {
                throw new \Exception("NYT API failed: " . $response->body());
            }

            $data = $response->json();

            if (($data['status'] ?? null) !== 'OK') {
                throw new \Exception("NYT API error: " . json_encode($data));
            }

            foreach ($data['results'] ?? [] as $article) {
                $transformed = $this->transformCollection($article);

                if ($stored = $this->articlesService->storeArticle($transformed, $newsSource)) {
                    $saved->push($stored);
                }
            }

            return $saved;
        } catch (\Exception $e) {
            throw new \Exception("Error fetching articles from NYT API: " . $e->getMessage());
        }
    }

    /**
     * Transform a single NYT article to the internal format
     */
    public function transformCollection(array $rawArticle, array $options = []): array
    {
        // Author: NYT gives an "byline" field (e.g. "By John Doe")
        $authorName = $this->extractAuthor($rawArticle['byline'] ?? null);
        $author = $authorName ? [
            'slug' => Str::slug($authorName),
            'name' => $authorName,
        ] : null;

        // Category/section
        $categorySlug = Str::slug($rawArticle['section'] ?? 'general');
        $categoryName = $rawArticle['section'] ?? 'General';

        // Image: NYT multimedia array
        $image = null;
        if (!empty($rawArticle['multimedia'])) {
            // choose first 'superJumbo' or fallback
            $imageItem = collect($rawArticle['multimedia'])->firstWhere('format', 'superJumbo')
                ?? $rawArticle['multimedia'][0];
            $image = $imageItem['url'] ?? null;
        }

        return [
            'title'        => $this->cleanTitle($rawArticle['title'] ?? ''),
            'content'      => $this->cleanContent($rawArticle['abstract'] ?? ''),
            'summary'      => $this->generateSummary($rawArticle['abstract'] ?? ''),
            'url'          => $rawArticle['url'] ?? null,
            'image_url'    => $image,
            'published_at' => $rawArticle['published_date'] ?? null,
            'external_id'  => $rawArticle['uri'] ?? md5($rawArticle['url'] ?? Str::uuid()),
            'author'       => $author,
            'category'     => [
                'slug'        => $categorySlug,
                'name'        => $categoryName,
                'external_id' => $categorySlug,
            ],
        ];
    }

    protected function cleanTitle(string $title): string
    {
        return trim(strip_tags($title));
    }

    protected function cleanContent(string $content): string
    {
        return trim(strip_tags($content));
    }

    protected function generateSummary(string $summary): string
    {
        return Str::limit(trim(strip_tags($summary)), 280);
    }

    /**
     * Extract clean author name from NYT byline (e.g. "By John Doe")
     */
    protected function extractAuthor(?string $byline): ?string
    {
        if (!$byline) {
            return null;
        }

        return trim(preg_replace('/^By\s+/i', '', $byline));
    }
}
