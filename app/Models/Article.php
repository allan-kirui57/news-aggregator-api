<?php

namespace App\Models;

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
        'view_count',
        'sentiment_score',
        'is_featured'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
        'sentiment_score' => 'float',
        'view_count' => 'integer'
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
}
