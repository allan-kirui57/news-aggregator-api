<?php

namespace App\Services;

use App\Contracts\NewsSourceInterface;
use App\Models\NewsSource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GuardianAPIService implements NewsSourceInterface
{
    protected ArticlesService $articlesService;

    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        $this->articlesService = new ArticlesService();
    }

    public function fetchArticles(NewsSource $newsSource, array $params = []): Collection
    {
        $saved = collect();

        $defaultParams = [
            'api-key' => $newsSource->api_key ?? env('GUARDIAN_API_KEY'),
            'show-fields' => 'trailText,body,thumbnail',
            'page-size' => 20,
            'page' => 1,
            'show-tags'   => 'contributor'
        ];

        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'User-Agent' => 'NewsAggregator/1.0',
                ])
                ->get($newsSource->base_url.'/search', array_merge($defaultParams, $params));

            if ($response->failed()) {
                throw new \Exception("Guardian API failed: ".$response->body());
            }

            $data = $response->json();

            if (!isset($data['response']['status']) || $data['response']['status'] !== 'ok') {
                throw new \Exception("Guardian API error: ".json_encode($data));
            }

            foreach ($data['response']['results'] ?? [] as $article) {

                $transformedArticleData = $this->transformCollection($article);

                if ($stored = $this->articlesService->storeArticle($transformedArticleData, $newsSource)) {
                    $saved->push($stored);
                }
            }

            return $saved;
        } catch (\Exception $e) {
            throw new \Exception("Error fetching articles from Guardian API: ".$e->getMessage());
        }
    }
    public function transformCollection(array $rawArticle, array $options = []): array
    {
        // Check if author exists (first contributor tag if present)
        $author = null;
        if (!empty($rawArticle['tags'])) {
            $contributor = collect($rawArticle['tags'])->firstWhere('type', 'contributor');
            if ($contributor) {
                $author = [
                    'slug'        => Str::slug($contributor['webTitle']),
                    'name'        => $contributor['webTitle'],
                    'profile_url' => $contributor['webUrl'] ?? null,
                    'bio'         => $contributor['bio'] ?? null,
                ];
            }
        }

        return [
            'title'        => $this->cleanTitle($rawArticle['webTitle'] ?? ''),
            'content'      => $this->cleanContent($rawArticle['fields']['body'] ?? ''),
            'summary'      => $this->generateSummary($rawArticle['fields']['trailText'] ?? ''),
            'url'          => $rawArticle['webUrl'] ?? null,
            'image_url'    => $rawArticle['fields']['thumbnail'] ?? null,
            'published_at' => $rawArticle['webPublicationDate'] ?? null,
            'external_id'  => $rawArticle['id'] ?? md5($rawArticle['webUrl'] ?? Str::uuid()),
            'author'       => $author,
            'category'     => [
                'slug'        => Str::slug($rawArticle['sectionId'] ?? 'general'),
                'name'        => $rawArticle['sectionName'] ?? 'General',
                'pillar'      => $rawArticle['pillarName'] ?? null,
                'external_id' => $rawArticle['sectionId'] ?? null,
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
}
