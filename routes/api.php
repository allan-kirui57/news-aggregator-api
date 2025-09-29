<?php

use App\Http\Controllers\Api\V1\{ArticleController, MetaController, NewsSourceController};
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'v1',
    'middleware' => ['api'],
], function () {

    Route::get('/articles', [ArticleController::class, 'index']);

    Route::get('/news-sources', [NewsSourceController::class, 'index']);
    Route::put('/news-sources/{newsSource}', [NewsSourceController::class, 'update']);
    Route::get('/authors',    [MetaController::class, 'authors']);
    Route::get('/categories', [MetaController::class, 'categories']);
});
