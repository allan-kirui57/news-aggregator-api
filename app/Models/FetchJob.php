<?php

namespace App\Models;

use App\Enums\FetchJobStatus;
use Illuminate\Database\Eloquent\Model;

class FetchJob extends Model
{
    protected $fillable = [
        'news_source_id',
        'status',
        'started_at',
        'completed_at',
        'articles_fetched',
        'articles_stored',
        'articles_skipped',
        'error_message'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime'
    ];

    public function newsSource()
    {
        return $this->belongsTo(NewsSource::class, 'news_source_id');
    }

    // Check if job is currently running
    public function isRunning(): bool
    {
        return $this->status === FetchJobStatus::STATUS_RUNNING;
    }

    // Mark job as started
    public function markAsStarted(): void
    {
        $this->update([
            'status' => FetchJobStatus::STATUS_RUNNING,
            'started_at' => now()
        ]);
    }

    // Mark job as completed
    public function markAsCompleted(int $fetched, int $stored, int $skipped): void
    {
        $this->update([
            'status' => FetchJobStatus::STATUS_COMPLETED,
            'completed_at' => now(),
            'articles_fetched' => $fetched,
            'articles_stored' => $stored,
            'articles_skipped' => $skipped
        ]);
    }

    // Mark job as failed
    public function markAsFailed(string $errorMessage): void
    {
        $this->update([
            'status' => FetchJobStatus::STATUS_FAILED,
            'completed_at' => now(),
            'error_message' => $errorMessage
        ]);
    }
}
