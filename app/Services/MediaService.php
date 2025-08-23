<?php

namespace App\Services;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class MediaService
{
    private ImageManager $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver);
    }

    /**
     * Upload and process a file.
     */
    public function uploadFile(UploadedFile $file, array $options = []): Media
    {
        // Validate file
        $this->validateFile($file);

        // Generate unique filename
        $filename = $this->generateUniqueFilename($file);

        // Determine storage path
        $year = date('Y');
        $month = date('m');
        $relativePath = "media/originals/{$year}/{$month}";
        $fullPath = "{$relativePath}/{$filename}";

        // Store the file
        $storedPath = $file->storeAs($relativePath, $filename, 'public');

        // Extract metadata
        $metadata = $this->extractMetadata($file, $storedPath);

        // Create media record
        $media = Media::create([
            'filename' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'path' => $storedPath,
            'uploaded_by' => auth()->id(),
            'metadata' => $metadata,
            'title' => $options['title'] ?? pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'alt_text' => $options['alt_text'] ?? null,
            'description' => $options['description'] ?? null,
        ]);

        // Process image if it's an image file
        if ($this->isImage($file)) {
            $this->processImage($media);
        }

        return $media->fresh();
    }

    /**
     * Process image (create thumbnails and optimized versions).
     */
    public function processImage(Media $media): void
    {
        if (!$media->is_image) {
            return;
        }

        $originalPath = Storage::disk('public')->path($media->path);

        // Create thumbnail
        $this->createThumbnail($media, $originalPath);

        // Optimize original if needed
        $this->optimizeImage($originalPath);
    }

    /**
     * Create thumbnail for image.
     */
    private function createThumbnail(Media $media, string $originalPath): void
    {
        try {
            $image = $this->imageManager->read($originalPath);

            // Create thumbnail (300x300)
            $thumbnail = $image->cover(300, 300);

            // Generate thumbnail path
            $pathInfo = pathinfo($media->path);
            $thumbnailPath = "media/thumbnails/300x300/{$pathInfo['dirname']}/{$pathInfo['filename']}.jpg";
            $fullThumbnailPath = Storage::disk('public')->path($thumbnailPath);

            // Ensure directory exists
            $thumbnailDir = dirname($fullThumbnailPath);
            if (!is_dir($thumbnailDir)) {
                mkdir($thumbnailDir, 0755, true);
            }

            // Save thumbnail as JPEG with 85% quality
            $thumbnail->toJpeg(85)->save($fullThumbnailPath);

            // Update media record
            $media->update(['thumbnail_path' => $thumbnailPath]);
        } catch (\Exception $e) {
            // Log error but don't fail the upload
            \Log::error('Failed to create thumbnail for media ID: ' . $media->id, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Optimize image file.
     */
    private function optimizeImage(string $path): void
    {
        try {
            // Basic optimization - reduce file size while maintaining quality
            $image = $this->imageManager->read($path);

            // Resize if too large (max 1920px width)
            if ($image->width() > 1920) {
                $image->scale(width: 1920);
                $image->toJpeg(85)->save($path);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to optimize image: ' . $path, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Delete media and its files.
     */
    public function deleteMedia(Media $media): bool
    {
        try {
            // Delete files
            if (Storage::disk('public')->exists($media->path)) {
                Storage::disk('public')->delete($media->path);
            }

            if ($media->thumbnail_path && Storage::disk('public')->exists($media->thumbnail_path)) {
                Storage::disk('public')->delete($media->thumbnail_path);
            }

            // Delete database record
            return $media->delete();
        } catch (\Exception $e) {
            \Log::error('Failed to delete media ID: ' . $media->id, ['error' => $e->getMessage()]);

            return false;
        }
    }

    /**
     * Bulk upload multiple files.
     */
    public function bulkUpload(array $files, array $options = []): array
    {
        $results = [];

        foreach ($files as $file) {
            try {
                $results[] = [
                    'success' => true,
                    'media' => $this->uploadFile($file, $options),
                    'filename' => $file->getClientOriginalName(),
                ];
            } catch (\Exception $e) {
                $results[] = [
                    'success' => false,
                    'error' => $e->getMessage(),
                    'filename' => $file->getClientOriginalName(),
                ];
            }
        }

        return $results;
    }

    /**
     * Search media files.
     */
    public function searchMedia(array $criteria = [])
    {
        $query = Media::with(['uploader']);

        if (!empty($criteria['search'])) {
            $query->search($criteria['search']);
        }

        if (!empty($criteria['type'])) {
            $query->ofType($criteria['type']);
        }

        if (!empty($criteria['uploader_id'])) {
            $query->where('uploaded_by', $criteria['uploader_id']);
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate($criteria['per_page'] ?? 24);
    }

    /**
     * Validate uploaded file.
     */
    private function validateFile(UploadedFile $file): void
    {
        $maxSize = 10 * 1024 * 1024; // 10MB
        $allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if ($file->getSize() > $maxSize) {
            throw new \Exception('File size exceeds 10MB limit.');
        }

        if (!in_array($file->getMimeType(), $allowedMimes)) {
            throw new \Exception('File type not allowed.');
        }
    }

    /**
     * Generate unique filename.
     */
    private function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $slug = Str::slug($name);
        $hash = Str::random(8);

        return "{$slug}-{$hash}.{$extension}";
    }

    /**
     * Extract file metadata.
     */
    private function extractMetadata(UploadedFile $file, string $storedPath): array
    {
        $metadata = [];

        if ($this->isImage($file)) {
            try {
                $image = $this->imageManager->read(Storage::disk('public')->path($storedPath));
                $metadata['width'] = $image->width();
                $metadata['height'] = $image->height();
            } catch (\Exception $e) {
                // Could not extract image dimensions
            }
        }

        return $metadata;
    }

    /**
     * Check if file is an image.
     */
    private function isImage(UploadedFile $file): bool
    {
        return str_starts_with($file->getMimeType(), 'image/');
    }
}
