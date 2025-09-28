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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title', 500);
            $table->longText('content')->nullable();
            $table->text('summary')->nullable();
            $table->string('url', 255)->unique();
            $table->string('image_url', 1000)->nullable();
            $table->timestamp('published_at')->nullable();
            $table->foreignId('news_source_id')->nullable()->constrained('news_sources')->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->foreignId('author_id')->nullable()->constrained('authors')->onDelete('set null');
            $table->string('content_hash', 64)->unique(); // For deduplication
            $table->string('external_id')->nullable(); // ID from external API
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
