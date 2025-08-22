<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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

    protected function activitiesArray(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? explode("\n", $value) : [],
            set: fn (array $value) => implode("\n", $value),
        );
    }
}
