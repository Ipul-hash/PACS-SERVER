<?php

namespace App\Services;

use App\Models\RadiologyWorklist;
use Illuminate\Support\Facades\Http;

class WorklistService
{
    private function client()
    {
        return Http::withHeaders([
            'X-API-Key' => config('worklist.api_key'),
        ])->timeout(10);
    }

    public function create(RadiologyWorklist $wl): bool
    {
        $r = $this->client()->post(config('worklist.api_url') . '/worklists', [
            'patient_id'            => $wl->patient_id,
            'patient_name'          => $wl->patient_name,
            'accession_number'      => $wl->accession_number,
            'modality'              => $wl->modality,
            'station_ae'            => $wl->station_ae,
            'procedure_description' => $wl->procedure_description,
            'scheduled_date'        => $wl->scheduled_date->format('Ymd'),
        ]);

        if ($r->successful()) {
            $wl->update([
                'wl_file'         => $r->json('file'),
                'sent_to_pacs_at' => now(),
            ]);

            return true;
        }

        return false;
    }

    public function complete(RadiologyWorklist $wl): bool
    {
        $ok = $this->client()
            ->delete(config('worklist.api_url') . '/worklists/' . $wl->accession_number)
            ->successful();

        if ($ok) {
            $wl->update([
                'status'       => 'completed',
                'completed_at' => now(),
            ]);
        }

        return $ok;
    }
}