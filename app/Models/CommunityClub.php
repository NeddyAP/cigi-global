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
        'image',
        'contact_person',
        'contact_phone',
        'contact_email',
        'meeting_schedule',
        'location',
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
}
