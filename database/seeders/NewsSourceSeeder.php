<?php

namespace Database\Seeders;

use App\Models\NewsSource;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NewsSourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sources = [
            [
                'name' => 'NewsAPI',
                'base_url' => 'https://newsapi.org/v2',
                'source_type' => 'news_api',
            ],
            [
                'name' => 'The Guardian',
                'base_url' => 'https://content.guardianapis.com',
                'source_type' => 'guardian',
            ],
            [
                'name' => 'New York Times',
                'base_url' => 'https://api.nytimes.com/svc',
                'source_type' => 'nyt',
            ],
            [
                'name' => 'BBC News',
                'base_url' => 'https://newsapi.org/v2',
                'source_type' => 'bbc',
            ]
        ];

        foreach ($sources as $sourceData) {
            $baseSlug = Str::slug($sourceData['name']);
            $slug = $baseSlug;
            $counter = 1;

            // Ensure slug is unique in DB
            while (NewsSource::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }
            $sourceData['slug'] = $slug;
            NewsSource::create($sourceData);
        }
    }
}
