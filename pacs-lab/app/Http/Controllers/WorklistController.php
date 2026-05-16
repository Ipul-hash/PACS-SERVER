<?php

namespace App\Http\Controllers;

use App\Models\RadiologyWorklist;
use App\Services\WorklistService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class WorklistController extends Controller
{
    public function __construct(
        private readonly WorklistService $worklist
    ) {}

    public function index(): View
    {
        $worklists = RadiologyWorklist::orderByDesc('scheduled_date')->paginate(20);

        return view('radiology.worklist.index', compact('worklists'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'patient_id'            => 'required|string|max:50',
            'patient_name'          => 'required|string|max:255',
            'accession_number'      => 'required|string|max:100|unique:radiology_worklists',
            'modality'              => 'required|in:CT,MRI,USG,CR',
            'station_ae'            => 'required|string|max:50',
            'procedure_description' => 'required|string|max:255',
            'scheduled_date'        => 'required|date',
        ]);

        $wl = RadiologyWorklist::create($validated);

        $this->worklist->create($wl);

        return redirect()->route('worklist.index');
    }

    public function complete(RadiologyWorklist $w): RedirectResponse
    {
        $this->worklist->complete($w);

        return redirect()->route('worklist.index');
    }

    public function destroy(RadiologyWorklist $w): RedirectResponse
    {
        $w->delete();

        return redirect()->route('worklist.index');
    }
}