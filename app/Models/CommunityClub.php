<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class CommunityClub extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'activities',
        'more_about',
        'image',
        'contact_person',
        'contact_phone',
        'contact_email',
        'meeting_schedule',
        'location',
        'is_active',
        'sort_order',
        'gallery_images',
        'testimonials',
        'social_media_links',
        'founded_year',
        'member_count',
        'upcoming_events',
        'achievements',
        'hero_subtitle',
        'hero_cta_text',
        'hero_cta_link',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'founded_year' => 'integer',
            'member_count' => 'integer',
            'more_about' => 'array',
            'gallery_images' => 'array',
            'testimonials' => 'array',
            'social_media_links' => 'array',
            'upcoming_events' => 'array',
            'achievements' => 'array',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (CommunityClub $communityClub) {
            if (empty($communityClub->slug)) {
                $communityClub->slug = Str::slug($communityClub->name);
            }
        });

        static::updating(function (CommunityClub $communityClub) {
            if ($communityClub->isDirty('name') && empty($communityClub->slug)) {
                $communityClub->slug = Str::slug($communityClub->name);
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

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeWithActivities(Builder $query): Builder
    {
        return $query->whereNotNull('activities');
    }

    public function scopeWithContact(Builder $query): Builder
    {
        return $query->where(function ($q) {
            $q->whereNotNull('contact_person')
                ->orWhereNotNull('contact_phone')
                ->orWhereNotNull('contact_email');
        });
    }

    public function scopeWithMeetingInfo(Builder $query): Builder
    {
        return $query->whereNotNull('meeting_schedule')
            ->whereNotNull('location');
    }

    public function scopeByActivity(Builder $query, string $activity): Builder
    {
        return $query->where('activities', 'like', '%'.$activity.'%');
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', '%'.$search.'%')
                ->orWhere('description', 'like', '%'.$search.'%')
                ->orWhere('type', 'like', '%'.$search.'%')
                ->orWhere('activities', 'like', '%'.$search.'%');
        });
    }

    public function scopeGroupedByType(Builder $query): Collection
    {
        return $query->active()->ordered()->get()->groupBy('type');
    }

    // Accessors & Mutators
    protected function activitiesArray(): Attribute
    {
        return Attribute::make(
            get: function () {
                $value = $this->getAttribute('activities');
                if (! $value) {
                    return [];
                }

                // Try to decode as JSON first
                $decoded = json_decode($value, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    return array_filter($decoded);
                }

                // Fallback to comma-separated values
                return array_filter(array_map('trim', explode(',', $value)));
            },
        );
    }

    protected function hasContact(): Attribute
    {
        return Attribute::make(
            get: fn () => ! empty($this->contact_person) || ! empty($this->contact_phone) || ! empty($this->contact_email),
        );
    }

    protected function displayImage(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->image ?: '/images/default-community-club.jpg',
        );
    }

    protected function hasMeetingInfo(): Attribute
    {
        return Attribute::make(
            get: fn () => ! empty($this->meeting_schedule) && ! empty($this->location),
        );
    }

    // Static Methods
    public static function getTypes(): Collection
    {
        return static::active()
            ->distinct()
            ->pluck('type')
            ->filter()
            ->values();
    }

    public static function getAllActivities(): Collection
    {
        return static::active()
            ->withActivities()
            ->get()
            ->flatMap(function ($club) {
                return $club->activities_array;
            })
            ->unique()
            ->values();
    }

    public static function getByTypeGrouped(): Collection
    {
        return static::active()->ordered()->get()->groupBy('type');
    }

    public static function getFeatured(int $limit = 4): Collection
    {
        return static::active()
            ->ordered()
            ->limit($limit)
            ->get();
    }

    // Instance Methods
    public function getActivitiesCount(): int
    {
        return count($this->activities_array);
    }

    public function hasActivity(string $activity): bool
    {
        return in_array(trim($activity), $this->activities_array, true);
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
        if ($this->contact_person) {
            $methods[] = 'person';
        }

        return $methods;
    }

    public function getRelatedClubs(int $limit = 3): Collection
    {
        return static::active()
            ->byType($this->type)
            ->where('id', '!=', $this->id)
            ->ordered()
            ->limit($limit)
            ->get();
    }

    public function toNavigationArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => Str::limit($this->description, 100),
            'type' => $this->type,
            'image' => $this->display_image,
            'activities_count' => $this->getActivitiesCount(),
        ];
    }

    // Relationships
    public function clubActivities()
    {
        return $this->hasMany(CommunityClubActivity::class);
    }

    // Validation Rules
    public static function validationRules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:community_clubs,slug',
            'description' => 'nullable|string',
            'type' => 'nullable|string|max:100',
            'activities' => 'nullable|string',
            'more_about' => 'nullable|array',
            'more_about.*.title' => 'required|string|max:255',
            'more_about.*.description' => 'required|string',
            'image' => 'nullable|string|max:500', // Changed from file validation to string validation
            'contact_person' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'meeting_schedule' => 'nullable|string',
            'location' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'gallery_images' => 'nullable|array',
            'gallery_images.*.id' => 'nullable|string|max:255',
            'gallery_images.*.url' => 'nullable|string|max:500',
            'gallery_images.*.alt' => 'nullable|string|max:255',
            'gallery_images.*.caption' => 'nullable|string|max:500',
            'gallery_images.*.mediaId' => 'nullable|integer|exists:media,id',
            'testimonials' => 'nullable|array',
            'testimonials.*.name' => 'required|string|max:255',
            'testimonials.*.content' => 'required|string',
            'testimonials.*.role' => 'nullable|string|max:255',
            'testimonials.*.image' => 'nullable|string|max:500',
            'social_media_links' => 'nullable|array',
            'social_media_links.*.platform' => 'required|string|max:50',
            'social_media_links.*.url' => 'required|url|max:500',
            'founded_year' => 'nullable|integer|min:1800|max:'.date('Y'),
            'member_count' => 'nullable|integer|min:0',
            'upcoming_events' => 'nullable|array',
            'upcoming_events.*.title' => 'nullable|string|max:255',
            'upcoming_events.*.description' => 'nullable|string',
            'upcoming_events.*.date' => 'nullable|date',
            'upcoming_events.*.image' => 'nullable|string|max:500',
            'achievements' => 'nullable|array',
            'achievements.*.title' => 'nullable|string|max:255',
            'achievements.*.description' => 'nullable|string',
            'achievements.*.date' => 'nullable|date',
            'achievements.*.image' => 'nullable|string|max:500',
            'hero_subtitle' => 'nullable|string|max:500',
            'hero_cta_text' => 'nullable|string|max:100',
            'hero_cta_link' => 'nullable|string|max:500',
        ];
    }

    public static function updateValidationRules($id): array
    {
        $rules = static::validationRules();
        $rules['slug'] = 'nullable|string|max:255|unique:community_clubs,slug,'.$id;

        return $rules;
    }
}
