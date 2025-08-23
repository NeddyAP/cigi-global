<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaFolder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MediaFolderController extends Controller
{
    /**
     * Display a listing of folders.
     */
    public function index()
    {
        $folders = MediaFolder::with(['parent', 'children', 'media'])
            ->withCount('media')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/media/folders/index', [
            'folders' => $folders,
        ]);
    }

    /**
     * Store a newly created folder.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('media_folders')->where(function ($query) use ($request) {
                    return $query->where('parent_id', $request->parent_id);
                }),
            ],
            'parent_id' => 'nullable|exists:media_folders,id',
        ], [
            'name.unique' => 'A folder with this name already exists in the selected location.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Check for circular dependency
        if ($request->parent_id) {
            $parent = MediaFolder::find($request->parent_id);
            // Additional validation could be added here to prevent circular dependencies
        }

        try {
            $folder = MediaFolder::create([
                'name' => $request->name,
                'parent_id' => $request->parent_id,
            ]);

            return back()->with('success', 'Folder created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['create' => 'Failed to create folder: '.$e->getMessage()]);
        }
    }

    /**
     * Update the specified folder.
     */
    public function update(Request $request, MediaFolder $mediaFolder)
    {
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('media_folders')->where(function ($query) use ($request, $mediaFolder) {
                    return $query->where('parent_id', $request->parent_id ?? $mediaFolder->parent_id)
                        ->where('id', '!=', $mediaFolder->id);
                }),
            ],
            'parent_id' => 'nullable|exists:media_folders,id',
        ], [
            'name.unique' => 'A folder with this name already exists in the selected location.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Prevent moving a folder into itself or its children
        if ($request->filled('parent_id')) {
            $newParent = MediaFolder::find($request->parent_id);
            if ($newParent && ($newParent->id === $mediaFolder->id || $newParent->isDescendantOf($mediaFolder))) {
                return back()->withErrors(['parent_id' => 'Cannot move folder into itself or its children.']);
            }
        }

        try {
            $mediaFolder->update([
                'name' => $request->name,
                'parent_id' => $request->parent_id,
            ]);

            return back()->with('success', 'Folder updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['update' => 'Failed to update folder: '.$e->getMessage()]);
        }
    }

    /**
     * Remove the specified folder.
     */
    public function destroy(MediaFolder $mediaFolder)
    {
        try {
            // Check if folder has media files
            if ($mediaFolder->media()->count() > 0) {
                return back()->withErrors(['delete' => 'Cannot delete folder that contains media files. Please move or delete the files first.']);
            }

            // Check if folder has subfolders
            if ($mediaFolder->children()->count() > 0) {
                return back()->withErrors(['delete' => 'Cannot delete folder that contains subfolders. Please delete or move the subfolders first.']);
            }

            $mediaFolder->delete();

            return back()->with('success', 'Folder deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['delete' => 'Failed to delete folder: '.$e->getMessage()]);
        }
    }

    /**
     * Get folder tree structure for API.
     */
    public function tree()
    {
        $folders = MediaFolder::with('children.children.children') // Nested loading up to 3 levels
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get();

        return response()->json($folders);
    }
}
