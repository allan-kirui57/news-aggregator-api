<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\NewsSource;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ArticlesService
{

    public function storeArticle(array $data, NewsSource $newsSource): ?Article
    {
        return DB::transaction(function () use ($data, $newsSource) {
            //Category
            $categoryData = Arr::get($data, 'category', []);
            $category = null;
            if (!empty($categoryData)) {
                $category = Category::firstOrCreate(
                    ['slug' => $categoryData['slug']],
                    [
                        'name'        => $categoryData['name'] ?? $categoryData['slug'],
                        'pillar'      => $categoryData['pillar'] ?? null,
                        'external_id' => $categoryData['external_id'] ?? null,
                    ]
                );
            }
            //Author
            $authorData = Arr::get($data, 'author');
            $author = null;
            if (!empty($authorData) && !empty($authorData['name'])) {
                $author = Author::firstOrCreate(
                    ['slug' => $authorData['slug']],
                    [
                        'name'        => $authorData['name'],
                        'profile_url' => $authorData['profile_url'] ?? null,
                        'bio'         => $authorData['bio'] ?? null,
                    ]
                );
            }

            //Get the external id that distinguishes the articles
            // A content hash ensures uniqueness if external_id is missing
            $contentHash = hash(
                'sha256',
                $data['external_id'] ?? ($data['url'] ?? Str::uuid()->toString())
            );

            return Article::updateOrCreate(
                ['content_hash' => $contentHash],
                [
                    'title'         => $data['title'] ?? 'Untitled',
                    'summary'       => $data['summary'] ?? null,
                    'content'       => $data['content'] ?? null,
                    'url'           => $data['url'] ?? null,
                    'image_url'     => $data['image_url'] ?? null,
                    'published_at'  => $data['published_at'] ?? now(),
                    'news_source_id'=> $newsSource->id,
                    'category_id'   => $category?->id,
                    'author_id'     => $author?->id,
                    'external_id'   => $data['external_id'] ?? null,
                ]
            );
        });
    }
}
