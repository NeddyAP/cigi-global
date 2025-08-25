<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessUnitService extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_unit_id',
        'title',
        'description',
        'image',
        'price_range',
        'duration',
        'features',
        'technologies',
        'process_steps',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'technologies' => 'array',
            'process_steps' => 'array',
        ];
    }

    // Relationships
    public function businessUnit()
    {
        return $this->belongsTo(BusinessUnit::class);
    }

    // Validation Rules
    public static function validationRules(): array
    {
        return [
            'business_unit_id' => 'required|exists:business_units,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'price_range' => 'nullable|string|max:100',
            'duration' => 'nullable|string|max:100',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string|max:100',
            'process_steps' => 'nullable|array',
            'process_steps.*.step' => 'required|string|max:255',
            'process_steps.*.description' => 'nullable|string',
            'process_steps.*.order' => 'nullable|integer|min:1',
        ];
    }

    public static function updateValidationRules($id): array
    {
        return static::validationRules();
    }
}
