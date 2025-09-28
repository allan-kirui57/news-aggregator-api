<?php

namespace App\Providers;

use App\Services\GuardianAPIService;
use App\Services\NewsAPIService;
use App\Services\NewYorkTimesAPIService;
use Illuminate\Support\ServiceProvider;

class NewsSourceServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind('news_api', function () {
            return new NewsApiService();
        });
        $this->app->bind('guardian', function () {
            return new GuardianAPIService();
        });
        $this->app->bind('nyt', function () {
            return new NewYorkTimesAPIService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
