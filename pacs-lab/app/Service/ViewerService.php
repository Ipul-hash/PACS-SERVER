<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ViewerService
{
    public function getViewerUrl(string $accession): ?array
    {
        $r = Http::withHeaders([
            'X-API-Key' => config('worklist.api_key'),
        ])->get(config('worklist.api_url') . '/viewer/' . $accession);

        return $r->successful() ? $r->json() : null;
    }
}