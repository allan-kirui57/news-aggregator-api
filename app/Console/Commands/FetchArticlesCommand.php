<?php

namespace App\Console\Commands;

use App\Jobs\FetchArticlesJob;
use Illuminate\Console\Command;
use App\Models\NewsSource;

class FetchArticlesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fetch:articles {--source=} {--category=} {--limit=20}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch news articles from News Data sources';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $sourceName = $this->option('source');
        $category = $this->option('category');
        $limit = (int) $this->option('limit');

        if ($sourceName) {
            $source = NewsSource::where('name', $sourceName)->orWhere('source_type', $sourceName)->first();

            if (!$source) {
                $this->error("News source {$sourceName} not found!");
                return 1;
            }

            $sources = collect([$source]);

        } else {
            $sources = NewsSource::where('is_active', true)->get();
        }

        foreach ($sources as $source) {
            // Dispatch Job

            $this->info("Dispatching fetch job for: {$source->name}");
            FetchArticlesJob::dispatch($source, $category, $limit);
        }

        $this->info("Dispatched all jobs Successfully");

        return 0;
    }
}
