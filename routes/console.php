<?php

use App\Jobs\FetchArticlesJob;
use App\Models\NewsSource;
use Illuminate\Support\Facades\Schedule;

Schedule::job(function () {
    NewsSource::active()->each(function ($source) {
        FetchArticlesJob::dispatch($source);
    });
})->everyThirtyMinutes();

