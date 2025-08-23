<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\MediaFolder;
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
        $query = Media::with(['folder', 'uploader']);

        // Apply filters
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('folder_id') && $request->folder_id !== 'all-folders') {
            // Convert placeholder to null for root folder
            $folderId = $request->folder_id === 'root' ? null : $request->folder_id;
            $query->inFolder($folderId);
        }

        if ($request->filled('type') && $request->type !== 'all-types') {
            $query->ofType($request->type);
        }

        // Pagination
        $media = $query->orderBy('created_at', 'desc')
            ->paginate(24)
            ->withQueryString();

        // Get folders for navigation
        $folders = MediaFolder::with('children')
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get();

        $currentFolder = null;
        if ($request->filled('folder_id')) {
            $currentFolder = MediaFolder::with('parent')->find($request->folder_id);
        }

        return Inertia::render('admin/media/index', [
            'media' => $media,
            'folders' => $folders,
            'currentFolder' => $currentFolder,
            'filters' => [
                'search' => $request->search,
                'folder_id' => $request->folder_id,
                'type' => $request->type,
            ],
        ]);
    }

    /**
     * Show the media upload page.
     */
    public function create(Request $request)
    {
        $folders = MediaFolder::orderBy('name')->get();
        $selectedFolderId = $request->get('folder_id');

        return Inertia::render('admin/media/create', [
            'folders' => $folders,
            'selectedFolderId' => $selectedFolderId,
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
            'folder_id' => ['nullable', 'string'],
            'title' => 'nullable|string|max:255',
            'alt_text' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        // Add custom validation for folder_id
        $validator->after(function ($validator) use ($request) {
            $folderId = $request->folder_id;
            if ($folderId && $folderId !== 'root' && ! \App\Models\MediaFolder::find($folderId)) {
                $validator->errors()->add('folder_id', 'The selected folder id is invalid.');
            }
        });

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            // Convert placeholder value to null for database
            $folderId = $request->folder_id === 'root' ? null : $request->folder_id;

            $results = $this->mediaService->bulkUpload($request->file('files'), [
                'folder_id' => $folderId,
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
        $media->load(['folder', 'uploader']);

        return Inertia::render('admin/media/show', [
            'media' => $media,
        ]);
    }

    /**
     * Show the form for editing the specified media.
     */
    public function edit(Media $media)
    {
        $media->load(['folder']);
        $folders = MediaFolder::orderBy('name')->get();

        return Inertia::render('admin/media/edit', [
            'media' => $media,
            'folders' => $folders,
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
            'folder_id' => ['nullable', 'string'],
        ]);

        // Add custom validation for folder_id
        $validator->after(function ($validator) use ($request) {
            $folderId = $request->folder_id;
            if ($folderId && $folderId !== 'root' && ! \App\Models\MediaFolder::find($folderId)) {
                $validator->errors()->add('folder_id', 'The selected folder id is invalid.');
            }
        });

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            // Convert placeholder value to null for database
            $folderId = $request->folder_id === 'root' ? null : $request->folder_id;

            $updateData = $request->only([
                'title',
                'alt_text',
                'description',
            ]);
            $updateData['folder_id'] = $folderId;

            $media->update($updateData);

            return back()->with('success', 'Media updated successfully.');
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
        $query = Media::with(['folder']);

        // Apply filters
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('folder_id') && $request->folder_id !== 'all-folders') {
            // Convert placeholder to null for root folder
            $folderId = $request->folder_id === 'root' ? null : $request->folder_id;
            $query->inFolder($folderId);
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

        $folders = MediaFolder::orderBy('name')->get();

        return response()->json([
            'media' => $media,
            'folders' => $folders,
        ]);
    }

    /**
     * Upload files via AJAX for auto-upload feature.
     */
    public function ajaxUpload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240', // 10MB max
            'folder_id' => ['nullable', 'string'],
        ]);

        // Add custom validation for folder_id
        $validator->after(function ($validator) use ($request) {
            $folderId = $request->folder_id;
            if ($folderId && $folderId !== 'root' && ! \App\Models\MediaFolder::find($folderId)) {
                $validator->errors()->add('folder_id', 'The selected folder id is invalid.');
            }
        });

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Convert placeholder value to null for database
            $folderId = $request->folder_id === 'root' ? null : $request->folder_id;

            $media = $this->mediaService->uploadFile($request->file('file'), [
                'folder_id' => $folderId,
            ]);

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

    /**
     * Move media files to a folder.
     */
    public function bulkMove(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|exists:media,id',
            'folder_id' => 'nullable|exists:media_folders,id',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        try {
            $folder = $request->folder_id ? MediaFolder::find($request->folder_id) : null;
            $moved = 0;

            foreach ($request->ids as $id) {
                $media = Media::find($id);
                if ($media && $this->mediaService->moveToFolder($media, $folder)) {
                    $moved++;
                }
            }

            $folderName = $folder ? $folder->name : 'Root';

            return back()->with('success', "Moved {$moved} files to {$folderName}.");
        } catch (\Exception $e) {
            return back()->withErrors(['bulk_move' => 'Bulk move failed: '.$e->getMessage()]);
        }
    }
}
