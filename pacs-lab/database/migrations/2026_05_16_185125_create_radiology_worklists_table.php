<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('radiology_worklists', function (Blueprint $table) {
            $table->id();
            $table->string('accession_number')->unique();
            $table->string('patient_id');
            $table->string('patient_name');
            $table->enum('modality', ['CT', 'MRI', 'USG', 'CR']);
            $table->string('station_ae');
            $table->string('procedure_description');
            $table->date('scheduled_date');
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])->default('scheduled');
            $table->string('wl_file')->nullable();
            $table->timestamp('sent_to_pacs_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('radiology_worklists');
    }
};