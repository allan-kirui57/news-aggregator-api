<?php

use App\Http\Controllers\Api\V1\{ArticleController, NewsSourceController};
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'v1',
    'middleware' => ['api', 'throttle:api', 'auth:sanctum'],
], function () {

    Route::get('/articles', [ArticleController::class, 'index']);

    Route::get('/news-sources', [NewsSourceController::class, 'index']);
    Route::get('/news-sources/{id}', [NewsSourceController::class, 'show']);
    Route::post('/news-sources', [NewsSourceController::class, 'store']);
    Route::put('/news-sources/{id}', [NewsSourceController::class, 'update']);
    Route::delete('/news-sources/{id}', [NewsSourceController::class, 'destroy']);
});
