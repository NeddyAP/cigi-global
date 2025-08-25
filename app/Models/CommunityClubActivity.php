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
        'image',
        'duration',
        'max_participants',
        'requirements',
        'benefits',
    ];

    protected function casts(): array
    {
        return [
            'community_club_id' => 'integer',
            'max_participants' => 'integer',
            'benefits' => 'array',
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
            'image' => 'nullable|string|max:500', // Changed from file validation to string validation
            'duration' => 'nullable|string|max:100',
            'max_participants' => 'nullable|integer|min:1',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|array',
            'benefits.*' => 'string|max:255',
        ];
    }

    public static function updateValidationRules($id): array
    {
        return static::validationRules();
    }
}
