<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityClubActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'community_club_id',
        'title',
        'description',
        'short_description',
        'image',
        'duration',
        'max_participants',
        'requirements',
        'benefits',
        'status',
        'featured',
        'is_active',
        'schedule',
        'location',
        'contact_info',
    ];

    protected function casts(): array
    {
        return [
            'community_club_id' => 'integer',
            'max_participants' => 'integer',
            'benefits' => 'array',
            'featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function communityClub()
    {
        return $this->belongsTo(CommunityClub::class);
    }

    // Validation Rules
    public static function validationRules(): array
    {
        return [
            'community_club_id' => 'required|integer|exists:community_clubs,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'image' => 'nullable|string|max:500',
            'duration' => 'nullable|string|max:100',
            'max_participants' => 'nullable|integer|min:1',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|array',
            'benefits.*' => 'string|max:255',
            'status' => 'nullable|string|in:active,inactive,draft',
            'featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'schedule' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'contact_info' => 'nullable|string',
        ];
    }

    public static function updateValidationRules($id): array
    {
        return static::validationRules();
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
