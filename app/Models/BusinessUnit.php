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
        'more_about',
        'services',
        'image',
        'contact_phone',
        'contact_email',
        'address',
        'website_url',
        'operating_hours',
        'is_active',
        'sort_order',
        'team_members',
        'client_testimonials',
        'portfolio_items',
        'certifications',
        'company_stats',
        'gallery_images',
        'achievements',
        'core_values',
        'hero_subtitle',
        'hero_cta_text',
        'hero_cta_link',
        'portfolio_is_show',
        'certifications_is_show',
        'company_stats_is_show',
        'core_values_is_show',
        'achievements_is_show',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'more_about' => 'array',
            'team_members' => 'array',
            'client_testimonials' => 'array',
            'portfolio_items' => 'array',
            'certifications' => 'array',
            'company_stats' => 'array',
            'gallery_images' => 'array',
            'achievements' => 'array',
            'core_values' => 'array',
            'portfolio_is_show' => 'boolean',
            'certifications_is_show' => 'boolean',
            'company_stats_is_show' => 'boolean',
            'core_values_is_show' => 'boolean',
            'achievements_is_show' => 'boolean',
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
    public function getServicesList(): array
    {
        $value = $this->getAttribute('services');
        
        if (!$value) {
            return [];
        }
        
        // Try to parse as JSON first (new format)
        $services = json_decode($value, true);
        if (is_array($services)) {
            return $services;
        }
        
        // Fallback: treat as newline-separated string (old format)
        return array_filter(array_map('trim', explode("\n", $value)));
    }

    protected function servicesArray(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->getServicesList();
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

    // Relationships
    public function unitServices()
    {
        return $this->hasMany(BusinessUnitService::class);
    }

    // Validation Rules
    public static function validationRules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:business_units,slug',
            'description' => 'nullable|string',
            'more_about' => 'nullable|array',
            'more_about.*.title' => 'required|string|max:255',
            'more_about.*.description' => 'required|string',
            'services' => 'nullable|string',
            'image' => 'nullable|string|max:500', // Changed from file validation to string validation
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'website_url' => 'nullable|url|max:500',
            'operating_hours' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'team_members' => 'nullable|array',
            'team_members.*.name' => 'required|string|max:255',
            'team_members.*.role' => 'required|string|max:255',
            'team_members.*.bio' => 'nullable|string',
            'team_members.*.image' => 'nullable|string|max:500',
            'team_members.*.social_links_linkedin' => 'nullable|url|max:500',
            'team_members.*.social_links_twitter' => 'nullable|url|max:500',
            'team_members.*.social_links_github' => 'nullable|url|max:500',
            'team_members.*.social_links' => 'nullable|array',
            'team_members.*.social_links.*.platform' => 'required|string|max:50',
            'team_members.*.social_links.*.url' => 'required|url|max:500',
            'client_testimonials' => 'nullable|array',
            'client_testimonials.*.name' => 'required|string|max:255',
            'client_testimonials.*.company' => 'nullable|string|max:255',
            'client_testimonials.*.content' => 'required|string',
            'client_testimonials.*.image' => 'nullable|string|max:500',
            'client_testimonials.*.rating' => 'nullable|integer|min:1|max:5',
            'portfolio_items' => 'nullable|array',
            'portfolio_items.*.title' => 'required|string|max:255',
            'portfolio_items.*.description' => 'nullable|string',
            'portfolio_items.*.image' => 'nullable|string|max:500',
            'portfolio_items.*.technologies' => 'nullable|array',
            'portfolio_items.*.technologies.*' => 'string|max:100',
            'portfolio_items.*.client' => 'nullable|string|max:255',
            'certifications' => 'nullable|array',
            'certifications.*.name' => 'required|string|max:255',
            'certifications.*.issuer' => 'required|string|max:255',
            'certifications.*.date' => 'nullable|date',
            'certifications.*.image' => 'nullable|string|max:500',
            'certifications.*.description' => 'nullable|string',
            'company_stats' => 'nullable|array',
            'company_stats.years_in_business' => 'nullable|string|max:100',
            'company_stats.projects_completed' => 'nullable|string|max:100',
            'company_stats.clients_served' => 'nullable|string|max:100',
            'company_stats.team_size' => 'nullable|string|max:100',
            'company_stats.*.label' => 'required|string|max:255',
            'company_stats.*.value' => 'required|string|max:100',
            'company_stats.*.icon' => 'nullable|string|max:100',
            'gallery_images' => 'nullable|array',
            'gallery_images.*.id' => 'nullable|string|max:255',
            'gallery_images.*.url' => 'nullable|string|max:500',
            'gallery_images.*.alt' => 'nullable|string|max:255',
            'gallery_images.*.caption' => 'nullable|string|max:500',
            'gallery_images.*.mediaId' => 'nullable|integer|exists:media,id',
            'achievements' => 'nullable|array',
            'achievements.*.title' => 'required|string|max:255',
            'achievements.*.description' => 'nullable|string',
            'achievements.*.date' => 'nullable|date',
            'achievements.*.image' => 'nullable|string|max:500',
            'core_values' => 'nullable|array',
            'core_values.*.title' => 'required|string|max:255',
            'core_values.*.description' => 'nullable|string',
            'core_values.*.icon' => 'nullable|string|max:100',
            'hero_subtitle' => 'nullable|string|max:500',
            'hero_cta_text' => 'nullable|string|max:100',
            'hero_cta_link' => 'nullable|string|max:500',
        ];
    }

    public static function updateValidationRules($id): array
    {
        $rules = static::validationRules();
        $rules['slug'] = 'nullable|string|max:255|unique:business_units,slug,'.$id;

        return $rules;
    }
}
