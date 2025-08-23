<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class BusinessUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'services',
        'image',
        'contact_phone',
        'contact_email',
        'address',
        'website_url',
        'operating_hours',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (BusinessUnit $businessUnit) {
            if (empty($businessUnit->slug)) {
                $businessUnit->slug = Str::slug($businessUnit->name);
            }
        });

        static::updating(function (BusinessUnit $businessUnit) {
            if ($businessUnit->isDirty('name') && empty($businessUnit->slug)) {
                $businessUnit->slug = Str::slug($businessUnit->name);
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    public function scopeWithMedia(Builder $query): Builder
    {
        return $query->whereNotNull('image');
    }

    public function scopeWithContact(Builder $query): Builder
    {
        return $query->where(function ($q) {
            $q->whereNotNull('contact_phone')
                ->orWhereNotNull('contact_email');
        });
    }

    public function scopeByService(Builder $query, string $service): Builder
    {
        return $query->where('services', 'like', '%'.$service.'%');
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', '%'.$search.'%')
                ->orWhere('description', 'like', '%'.$search.'%')
                ->orWhere('services', 'like', '%'.$search.'%');
        });
    }

    // Accessors & Mutators
    protected function servicesArray(): Attribute
    {
        return Attribute::make(
            get: function () {
                $value = $this->getAttribute('services');

                return $value ? array_filter(array_map('trim', explode(',', $value))) : [];
            },
        );
    }

    protected function operatingHoursArray(): Attribute
    {
        return Attribute::make(
            get: function () {
                $value = $this->getAttribute('operating_hours');

                return $value ? array_filter(array_map('trim', explode(',', $value))) : [];
            },
        );
    }

    protected function hasContact(): Attribute
    {
        return Attribute::make(
            get: fn () => ! empty($this->contact_phone) || ! empty($this->contact_email),
        );
    }

    protected function displayImage(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->image ?: '/images/default-business-unit.jpg',
        );
    }

    // Static Methods
    public static function getAllServices(): Collection
    {
        return static::active()
            ->whereNotNull('services')
            ->pluck('services')
            ->flatMap(function ($services) {
                return array_filter(array_map('trim', explode(',', $services)));
            })
            ->unique()
            ->values();
    }

    public static function getFeatured(int $limit = 4): Collection
    {
        return static::active()
            ->ordered()
            ->withMedia()
            ->limit($limit)
            ->get();
    }

    // Instance Methods
    public function getServicesCount(): int
    {
        return count($this->services_array);
    }

    public function hasService(string $service): bool
    {
        return in_array(trim($service), $this->services_array, true);
    }

    public function getContactMethods(): array
    {
        $methods = [];
        if ($this->contact_phone) {
            $methods[] = 'phone';
        }
        if ($this->contact_email) {
            $methods[] = 'email';
        }
        if ($this->website_url) {
            $methods[] = 'website';
        }

        return $methods;
    }

    public function toNavigationArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => Str::limit($this->description, 100),
            'image' => $this->display_image,
            'services_count' => $this->getServicesCount(),
        ];
    }
}
