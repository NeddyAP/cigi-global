<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BusinessUnit;
use App\Models\CommunityClub;
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

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('original_filename', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%");
            });
        }

        // Filter by tags if provided
        if ($request->filled('tags') && is_array($request->tags) && count($request->tags) > 0) {
            $tags = array_filter($request->tags); // Remove empty values
            if (! empty($tags)) {
                $query->where(function ($q) use ($tags) {
                    foreach ($tags as $tag) {
                        $q->whereJsonContains('tags', $tag);
                    }
                });
            }
        }

        // Filter by homepage if provided
        if ($request->filled('show_homepage') && $request->show_homepage !== 'all') {
            if ($request->show_homepage === 'homepage') {
                $query->where('show_homepage', true);
            } elseif ($request->show_homepage === 'not_homepage') {
                $query->where('show_homepage', false);
            }
        }

        // Filter by type if provided (for backward compatibility)
        if ($request->filled('type') && $request->type !== 'all-types') {
            $query->ofType($request->type);
        }

        // Pagination with proper Laravel Inertia format
        $media = $query->orderBy('created_at', 'desc')
            ->paginate(24)
            ->through(function ($item) {
                // Ensure proper data structure for frontend
                return [
                    'id' => $item->id,
                    'filename' => $item->filename,
                    'original_filename' => $item->original_filename,
                    'mime_type' => $item->mime_type,
                    'size' => $item->size,
                    'human_size' => $this->formatFileSize($item->size),
                    'url' => $item->url,
                    'thumbnail_url' => $item->thumbnail_url,
                    'alt_text' => $item->alt_text,
                    'title' => $item->title,
                    'description' => $item->description,
                    'tags' => $item->tags,
                    'show_homepage' => $item->show_homepage,
                    'uploaded_by' => $item->uploaded_by,
                    'metadata' => $item->metadata,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                    'is_image' => $this->isImage($item->mime_type),
                    'dimensions' => $this->getImageDimensions($item),
                    'uploader' => $item->uploader ? [
                        'id' => $item->uploader->id,
                        'name' => $item->uploader->name,
                        'email' => $item->uploader->email,
                    ] : null,
                ];
            })
            ->withQueryString();

        // Get all unique tags for filter dropdown (not affected by pagination)
        $allTags = Media::distinct()
            ->whereNotNull('tags')
            ->pluck('tags')
            ->flatten()
            ->filter()
            ->unique()
            ->sort()
            ->values();

        return Inertia::render('admin/media/index', [
            'media' => [
                'data' => $media->items(),
                'current_page' => $media->currentPage(),
                'last_page' => $media->lastPage(),
                'per_page' => $media->perPage(),
                'total' => $media->total(),
                'from' => $media->firstItem(),
                'to' => $media->lastItem(),
                'links' => $this->formatPaginationLinks($media),
            ],
            'allTags' => $allTags,
            'filters' => [
                'search' => $request->search,
                'tags' => $request->tags ?: [],
                'show_homepage' => $request->show_homepage ?: 'all',
            ],
        ]);
    }

    /**
     * Show the media upload page.
     */
    public function create(Request $request)
    {
        $businessUnits = BusinessUnit::select('id', 'name')->get();
        $communityClubs = CommunityClub::select('id', 'name')->get();

        return Inertia::render('admin/media/create', [
            'businessUnits' => $businessUnits,
            'communityClubs' => $communityClubs,
        ]);
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
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string',
            'show_homepage' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            // Log upload attempt
            \Log::info('Media upload started', [
                'file_count' => count($request->file('files')),
                'tags' => $request->tags,
                'user_id' => auth()->id(),
            ]);

            $results = $this->mediaService->bulkUpload($request->file('files'), [
                'title' => $request->title,
                'alt_text' => $request->alt_text,
                'description' => $request->description,
                'tags' => $request->tags,
                'show_homepage' => $request->boolean('show_homepage'),
            ]);

            $successful = collect($results)->where('success', true)->count();
            $failed = collect($results)->where('success', false)->count();

            $message = "Uploaded {$successful} files successfully.";
            if ($failed > 0) {
                $message .= " {$failed} files failed to upload.";
            }

            // Log successful upload
            \Log::info('Media upload completed', [
                'successful' => $successful,
                'failed' => $failed,
                'user_id' => auth()->id(),
            ]);

            return redirect()->route('admin.media.index')->with('success', $message);
        } catch (\Exception $e) {
            // Log upload error
            \Log::error('Media upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => auth()->id(),
            ]);

            return back()->withErrors(['upload' => 'Upload failed: '.$e->getMessage()]);
        }
    }

    /**
     * Show the form for editing the specified media.
     */
    public function edit(Media $media)
    {
        $media->load(['uploader']);
        $businessUnits = BusinessUnit::select('id', 'name')->get();
        $communityClubs = CommunityClub::select('id', 'name')->get();

        return Inertia::render('admin/media/edit', [
            'media' => $media,
            'businessUnits' => $businessUnits,
            'communityClubs' => $communityClubs,
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
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string',
            'show_homepage' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $updateData = $request->only([
                'title',
                'alt_text',
                'description',
                'tags',
                'show_homepage',
            ]);

            $media->update($updateData);

            return redirect()->route('admin.media.index')->with('success', 'Media updated successfully.');
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

            return redirect()->route('admin.media.index')->with('success', 'Media deleted successfully.');
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
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('original_filename', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%");
            });
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

        // Get business units and community clubs for tags dropdown
        $businessUnits = BusinessUnit::active()->select('id', 'name')->get();
        $communityClubs = CommunityClub::active()->select('id', 'name')->get();

        return response()->json([
            'media' => $media,
            'businessUnits' => $businessUnits,
            'communityClubs' => $communityClubs,
        ]);
    }

    /**
     * Upload files via AJAX for auto-upload feature.
     */
    public function ajaxUpload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240', // 10MB max
            'title' => 'nullable|string|max:255',
            'alt_text' => 'nullable|string',
            'description' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $options = $request->only([
                'title',
                'alt_text',
                'description',
                'tags',
                'show_homepage',
            ]);

            $media = $this->mediaService->uploadFile($request->file('file'), $options);

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

            return redirect()->route('admin.media.index')->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['bulk_delete' => 'Bulk delete failed: '.$e->getMessage()]);
        }
    }

    /**
     * Format file size to human readable format.
     */
    private function formatFileSize(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2).' '.$units[$i];
    }

    /**
     * Check if file is an image.
     */
    private function isImage(string $mimeType): bool
    {
        return str_starts_with($mimeType, 'image/');
    }

    /**
     * Get image dimensions if available.
     */
    private function getImageDimensions(Media $media): ?array
    {
        if (! $this->isImage($media->mime_type)) {
            return null;
        }

        // Try to get dimensions from metadata if available
        if ($media->metadata && isset($media->metadata['width']) && isset($media->metadata['height'])) {
            return [
                'width' => $media->metadata['width'],
                'height' => $media->metadata['height'],
            ];
        }

        // Try to get dimensions from file path
        $filePath = storage_path('app/public/'.$media->path);
        if (file_exists($filePath)) {
            $imageInfo = getimagesize($filePath);
            if ($imageInfo) {
                return [
                    'width' => $imageInfo[0],
                    'height' => $imageInfo[1],
                ];
            }
        }

        return null;
    }

    /**
     * Format pagination links for Inertia frontend.
     */
    private function formatPaginationLinks($paginator): array
    {
        $links = [];

        // Previous page
        if ($paginator->previousPageUrl()) {
            $links[] = [
                'url' => $paginator->previousPageUrl(),
                'label' => '&laquo; Previous',
                'active' => false,
            ];
        }

        // Page numbers
        foreach ($paginator->getUrlRange(1, $paginator->lastPage()) as $page => $url) {
            $links[] = [
                'url' => $url,
                'label' => (string) $page,
                'active' => $page == $paginator->currentPage(),
            ];
        }

        // Next page
        if ($paginator->nextPageUrl()) {
            $links[] = [
                'url' => $paginator->nextPageUrl(),
                'label' => 'Next &raquo;',
                'active' => false,
            ];
        }

        return $links;
    }
}
