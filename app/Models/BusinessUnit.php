<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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

    protected function servicesArray(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? explode("\n", $value) : [],
            set: fn (array $value) => implode("\n", $value),
        );
    }
}
