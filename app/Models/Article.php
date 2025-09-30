<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'content',
        'summary',
        'url',
        'image_url',
        'published_at',
        'news_source_id',
        'category_id',
        'author_id',
        'content_hash',
        'external_id',
        'is_featured'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
    ];

    public function newsSource()
    {
        return $this->belongsTo(NewsSource::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function author()
    {
        return $this->belongsTo(Author::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'article_tag');
    }

    // Scopes

    /**
     * Apply filters to the Article query.
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['source'] ?? null, fn($q, $source) => $q->where('news_source_id', $source)
            )
            ->when($filters['category'] ?? null, fn($q, $category) => $q->where('category_id', $category)
            )
            ->when($filters['author'] ?? null, fn($q, $author) => $q->where('author_id', $author)
            );
    }

    public function scopePublished($query)
    {
        return $query->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

}
