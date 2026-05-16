<?php

use App\Http\Controllers\WorklistController;
use App\Http\Controllers\ViewerController;
use Illuminate\Support\Facades\Route;
 
Route::middleware('auth')->group(function () {
 
    Route::get('/radiology/worklist',
        [WorklistController::class, 'index']
    )->name('worklist.index');
 
    Route::post('/radiology/worklist',
        [WorklistController::class, 'store']
    )->name('worklist.store');
 
    Route::patch('/radiology/worklist/{w}/complete',
        [WorklistController::class, 'complete']
    )->name('worklist.complete');
 
    Route::delete('/radiology/worklist/{w}',
        [WorklistController::class, 'destroy']
    )->name('worklist.destroy');
 
    Route::get('/viewer/{accession}',
        [ViewerController::class, 'open']
    )->name('viewer.open');
 
});