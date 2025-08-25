<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'filename',
        'original_filename',
        'mime_type',
        'size',
        'path',
        'thumbnail_path',
        'alt_text',
        'title',
        'description',
        'tags',
        'uploaded_by',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'tags' => 'array',
        'size' => 'integer',
    ];

    protected $appends = [
        'url',
        'thumbnail_url',
        'human_size',
        'is_image',
        'tags_display',
    ];

    /**
     * Get the user who uploaded the media.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Get the public URL of the media file.
     */
    public function getUrlAttribute(): string
    {
        return Storage::url($this->path);
    }

    /**
     * Get the public URL of the thumbnail.
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        return $this->thumbnail_path ? Storage::url($this->thumbnail_path) : null;
    }

    /**
     * Get human-readable file size.
     */
    public function getHumanSizeAttribute(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2).' '.$units[$i];
    }

    /**
     * Check if the file is an image.
     */
    public function getIsImageAttribute(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    /**
     * Get the file extension.
     */
    public function getExtensionAttribute(): string
    {
        return pathinfo($this->original_filename, PATHINFO_EXTENSION);
    }

    /**
     * Get the dimensions from metadata if available.
     */
    public function getDimensionsAttribute(): ?array
    {
        if (isset($this->metadata['width']) && isset($this->metadata['height'])) {
            return [
                'width' => $this->metadata['width'],
                'height' => $this->metadata['height'],
            ];
        }

        return null;
    }

    /**
     * Get tags as a readable string.
     */
    public function getTagsDisplayAttribute(): string
    {
        if (empty($this->tags) || ! is_array($this->tags)) {
            return '';
        }

        return implode(', ', $this->tags);
    }

    /**
     * Scope to filter by mime type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('mime_type', 'like', $type.'%');
    }

    /**
     * Scope to filter images only.
     */
    public function scopeImages($query)
    {
        return $query->where('mime_type', 'like', 'image/%');
    }

    /**
     * Scope to search by filename or original name.
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($query) use ($search) {
            $query->where('filename', 'like', '%'.$search.'%')
                ->orWhere('original_filename', 'like', '%'.$search.'%')
                ->orWhere('title', 'like', '%'.$search.'%')
                ->orWhere('alt_text', 'like', '%'.$search.'%');
        });
    }

    /**
     * Scope to filter by tags.
     */
    public function scopeWithTags($query, array $tags)
    {
        return $query->whereJsonContains('tags', $tags);
    }

    /**
     * Scope to filter by specific tag.
     */
    public function scopeWithTag($query, string $tag)
    {
        return $query->whereJsonContains('tags', $tag);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($media) {
            // Delete the actual files when the model is deleted
            if (Storage::exists($media->path)) {
                Storage::delete($media->path);
            }

            if ($media->thumbnail_path && Storage::exists($media->thumbnail_path)) {
                Storage::delete($media->thumbnail_path);
            }
        });
    }
}
