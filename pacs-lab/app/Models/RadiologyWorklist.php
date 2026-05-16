<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RadiologyWorklist extends Model
{
    protected $fillable = [
        'accession_number',
        'patient_id',
        'patient_name',
        'modality',
        'station_ae',
        'procedure_description',
        'scheduled_date',
        'status',
        'wl_file',
        'sent_to_pacs_at',
        'completed_at',
    ];

    protected $casts = [
        'scheduled_date'  => 'date',
        'sent_to_pacs_at' => 'datetime',
        'completed_at'    => 'datetime',
    ];
}