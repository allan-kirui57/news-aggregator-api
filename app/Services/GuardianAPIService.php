<?php

namespace App\Services;

use App\Contracts\NewsSourceInterface;
use App\Models\NewsSource;
use Illuminate\Support\Collection;

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

    }
}
