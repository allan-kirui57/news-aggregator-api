<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class NewsSource extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'api_key',
        'base_url',
        'is_active',
        'last_fetched_at',
        'total_articles_fetched',
        'source_type'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_fetched_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
