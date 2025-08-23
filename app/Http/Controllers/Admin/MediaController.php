<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class MediaController extends Controller
{
    private MediaService $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

    /**
     * Display the media manager.
     */
    public function index(Request $request)
    {
        $query = Media::with(['uploader']);

        // Apply filters
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('type') && $request->type !== 'all-types') {
            $query->ofType($request->type);
        }

        // Pagination
        $media = $query->orderBy('created_at', 'desc')
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('admin/media/index', [
            'media' => $media,
            'filters' => [
                'search' => $request->search,
                'type' => $request->type,
            ],
        ]);
    }

    /**
     * Show the media upload page.
     */
    public function create(Request $request)
    {
        return Inertia::render('admin/media/create');
    }

    /**
     * Upload media files.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'files' => 'required|array|min:1',
            'files.*' => 'required|file|max:10240', // 10MB max
            'title' => 'nullable|string|max:255',
            'alt_text' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $results = $this->mediaService->bulkUpload($request->file('files'), [
                'title' => $request->title,
                'alt_text' => $request->alt_text,
                'description' => $request->description,
            ]);

            $successful = collect($results)->where('success', true)->count();
            $failed = collect($results)->where('success', false)->count();

            $message = "Uploaded {$successful} files successfully.";
            if ($failed > 0) {
                $message .= " {$failed} files failed to upload.";
            }

            return redirect()->route('admin.media.index')->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['upload' => 'Upload failed: '.$e->getMessage()]);
        }
    }

    /**
     * Display the specified media.
     */
    public function show(Media $media)
    {
        $media->load(['uploader']);

        return Inertia::render('admin/media/show', [
            'media' => $media,
        ]);
    }

    /**
     * Show the form for editing the specified media.
     */
    public function edit(Media $media)
    {
        $media->load(['uploader']);

        return Inertia::render('admin/media/edit', [
            'media' => $media,
        ]);
    }

    /**
     * Update the specified media.
     */
    public function update(Request $request, Media $media)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'alt_text' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $updateData = $request->only([
                'title',
                'alt_text',
                'description',
            ]);

            $media->update($updateData);

            return redirect()->route('admin.media.show', $media)->with('success', 'Media updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['update' => 'Update failed: '.$e->getMessage()]);
        }
    }

    /**
     * Remove the specified media.
     */
    public function destroy(Media $media)
    {
        try {
            $this->mediaService->deleteMedia($media);

            return back()->with('success', 'Media deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['delete' => 'Delete failed: '.$e->getMessage()]);
        }
    }

    /**
     * API endpoint for media picker modal.
     */
    public function picker(Request $request)
    {
        $query = Media::query();

        // Apply filters
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('type') && $request->type !== 'all-types') {
            $query->ofType($request->type);
        }

        // Default to images only if no type specified
        if (! $request->filled('type') || $request->type === 'all-types') {
            $query->images();
        }

        $media = $query->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'media' => $media,
        ]);
    }

    /**
     * Upload files via AJAX for auto-upload feature.
     */
    public function ajaxUpload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $media = $this->mediaService->uploadFile($request->file('file'));

            return response()->json([
                'success' => true,
                'media' => $media,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Bulk delete media files.
     */
    public function bulkDelete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|exists:media,id',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        try {
            $deleted = 0;
            $failed = 0;

            foreach ($request->ids as $id) {
                $media = Media::find($id);
                if ($media && $this->mediaService->deleteMedia($media)) {
                    $deleted++;
                } else {
                    $failed++;
                }
            }

            $message = "Deleted {$deleted} files.";
            if ($failed > 0) {
                $message .= " {$failed} files failed to delete.";
            }

            return back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['bulk_delete' => 'Bulk delete failed: '.$e->getMessage()]);
        }
    }
}
