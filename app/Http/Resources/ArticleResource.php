<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'summary' => $this->summary,
            'content' => $this->content,
            'url' => $this->url,
            'image_url' => $this->image_url,
            'published_at' => $this->published_at?->toISOString(),
            'is_featured' => $this->is_featured,
            'source' => [
                'id' => $this->newsSource->id,
                'name' => $this->newsSource->name,
                'type' => $this->newsSource->source_type
            ],
            'category' => $this->when($this->category, [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug
            ]),
            'author' => $this->when($this->author, [
                'id' => $this->author?->id,
                'name' => $this->author?->name,
                'bio' => $this->author?->bio
            ]),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString()
        ];
    }
}
