<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('news_sources', function (Blueprint $table) {
             $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('api_key')->nullable();
            $table->string('base_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_fetched_at')->nullable();
            $table->integer('total_articles_fetched')->default(0);
            $table->enum('source_type', ['news_api', 'guardian', 'nyt'])->default('news_api');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'last_fetched_at']);
            $table->index('source_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news_sources');
    }
};
