<?php

use App\Jobs\FetchArticlesJob;
use App\Models\NewsSource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

Schedule::job(function () {
    $category = 'technology';
    $limit    = 20;

    NewsSource::active()->each(function ($source) use ($category, $limit) {
        FetchArticlesJob::dispatch($source, $category, $limit);
    });
})->everySixHours();

