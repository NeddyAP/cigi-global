<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GlobalVariable extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'category',
        'description',
        'is_public',
    ];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public static function getValue(string $key, mixed $default = null): mixed
    {
        $variable = static::where('key', $key)->first();

        if (! $variable) {
            return $default;
        }

        return match ($variable->type) {
            'json' => json_decode($variable->value, true),
            'number' => (float) $variable->value,
            'boolean' => (bool) $variable->value,
            default => $variable->value,
        };
    }

    public static function setValue(string $key, mixed $value, string $type = 'text', string $category = 'general'): void
    {
        $formattedValue = match ($type) {
            'json' => json_encode($value),
            'boolean' => $value ? '1' : '0',
            default => (string) $value,
        };

        static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $formattedValue,
                'type' => $type,
                'category' => $category,
            ]
        );
    }
}
