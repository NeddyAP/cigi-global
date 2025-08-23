<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class MediaFolder extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'parent_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($folder) {
            if (empty($folder->slug)) {
                $folder->slug = Str::slug($folder->name);
            }
        });

        static::updating(function ($folder) {
            if ($folder->isDirty('name') && empty($folder->slug)) {
                $folder->slug = Str::slug($folder->name);
            }
        });
    }

    /**
     * Get the parent folder.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(MediaFolder::class, 'parent_id');
    }

    /**
     * Get the child folders.
     */
    public function children(): HasMany
    {
        return $this->hasMany(MediaFolder::class, 'parent_id');
    }

    /**
     * Get all media files in this folder.
     */
    public function media(): HasMany
    {
        return $this->hasMany(Media::class, 'folder_id');
    }

    /**
     * Get all descendant folders recursively.
     */
    public function descendants(): HasMany
    {
        return $this->hasMany(MediaFolder::class, 'parent_id')->with('descendants');
    }

    /**
     * Get the full path of the folder including parent folders.
     */
    public function getFullPathAttribute(): string
    {
        $path = collect();
        $folder = $this;

        while ($folder) {
            $path->prepend($folder->name);
            $folder = $folder->parent;
        }

        return $path->implode(' / ');
    }

    /**
     * Get breadcrumb array for the folder.
     */
    public function getBreadcrumbsAttribute(): array
    {
        $breadcrumbs = collect();
        $folder = $this;

        while ($folder) {
            $breadcrumbs->prepend([
                'id' => $folder->id,
                'name' => $folder->name,
                'slug' => $folder->slug,
            ]);
            $folder = $folder->parent;
        }

        return $breadcrumbs->toArray();
    }

    /**
     * Scope to get root folders only.
     */
    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Check if the folder is a descendant of another folder.
     */
    public function isDescendantOf(MediaFolder $folder): bool
    {
        $parent = $this->parent;

        while ($parent) {
            if ($parent->id === $folder->id) {
                return true;
            }
            $parent = $parent->parent;
        }

        return false;
    }
}
