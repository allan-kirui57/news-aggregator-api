<?php

namespace App\Contracts;

use App\Models\NewsSource;
use Illuminate\Support\Collection;

interface NewsSourceInterface
{
    public function fetchArticles(NewsSource $newsSource, array $params = []): Collection;

    public function transformCollection(array $rawArticle, array $options = []): array;

}
