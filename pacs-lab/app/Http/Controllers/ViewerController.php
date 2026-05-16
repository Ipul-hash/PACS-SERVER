<?php

namespace App\Http\Controllers;

use App\Services\ViewerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class ViewerController extends Controller
{
    public function __construct(
        private readonly ViewerService $viewer
    ) {}

    public function open(string $accession): RedirectResponse
    {
        $data = $this->viewer->getViewerUrl($accession);

        return redirect()->away($data['viewer_url']);
    }

    public function info(string $accession): JsonResponse
    {
        $data = $this->viewer->getViewerUrl($accession);

        return response()->json($data);
    }
}