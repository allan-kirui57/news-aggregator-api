<?php

namespace App\Jobs;

use App\Enums\FetchJobStatus;
use App\Models\FetchJob;
use App\Models\NewsSource;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class FetchArticlesJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(protected NewsSource $source, protected ?string $category, protected int $limit)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $fetchJob = FetchJob::create([
            'news_source_id' => $this->source->id,
            'status' => FetchJobStatus::STATUS_PENDING
        ]);

        try {
            $fetchJob->markAsStarted();
            $service = app($this->source->source_type);

            if (!$service) {
                throw new \Exception("Error fetching service for the source: {$this->source->name}");
            }

            $articles = $service->fetchArticles($this->source, [
                'q' => $this->category,
                'limit' => $this->limit,
            ]);

            $fetchJob->markAsCompleted($articles->count());

        } catch (\Illuminate\Http\Client\RequestException $e) {
            // Rate limit or network error - retry
            $this->release(300); // Retry in 5 minutes
        } catch (\Exception $e) {

            $fetchJob->markAsFailed($e->getMessage());
            // Log the error
            \Log::error("FetchArticlesJob failed for {$this->source->name}: ".$e->getMessage());

            throw $e;
        }


    }
}
