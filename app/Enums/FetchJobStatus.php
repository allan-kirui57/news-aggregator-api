<?php

namespace App\Enums;

enum FetchJobStatus: string
{
    case STATUS_PENDING = 'pending';
    case STATUS_RUNNING = 'running';
    case STATUS_COMPLETED = 'completed';
    case STATUS_FAILED = 'failed';

    public function label(): string
    {
        return match($this) {
            self::STATUS_PENDING => 'Pending',
            self::STATUS_RUNNING => 'Running',
            self::STATUS_COMPLETED => 'Completed',
            self::STATUS_FAILED => 'Failed',
        };
    }

}
