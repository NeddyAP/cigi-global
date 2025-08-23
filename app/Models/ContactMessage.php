<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    /** @use HasFactory<\Database\Factories\ContactMessageFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'read_at',
        'ip_address',
        'user_agent',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * The model's default values for attributes.
     */
    protected $attributes = [
        'status' => 'unread',
    ];

    /**
     * Scope to get unread messages.
     */
    public function scopeUnread(Builder $query): Builder
    {
        return $query->where('status', 'unread');
    }

    /**
     * Scope to get read messages.
     */
    public function scopeRead(Builder $query): Builder
    {
        return $query->where('status', 'read');
    }

    /**
     * Scope to get archived messages.
     */
    public function scopeArchived(Builder $query): Builder
    {
        return $query->where('status', 'archived');
    }

    /**
     * Scope to get recent messages.
     */
    public function scopeRecent(Builder $query, int $days = 7): Builder
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Mark message as read.
     */
    public function markAsRead(): bool
    {
        return $this->update([
            'status' => 'read',
            'read_at' => now(),
        ]);
    }

    /**
     * Mark message as archived.
     */
    public function markAsArchived(): bool
    {
        return $this->update([
            'status' => 'archived',
        ]);
    }

    /**
     * Mark message as unread.
     */
    public function markAsUnread(): bool
    {
        return $this->update([
            'status' => 'unread',
            'read_at' => null,
        ]);
    }

    /**
     * Get the status badge color.
     */
    protected function statusColor(): Attribute
    {
        return Attribute::make(
            get: fn () => match ($this->status) {
                'unread' => 'bg-blue-100 text-blue-800',
                'read' => 'bg-green-100 text-green-800',
                'archived' => 'bg-gray-100 text-gray-800',
                default => 'bg-gray-100 text-gray-800',
            },
        );
    }

    /**
     * Get the status label.
     */
    protected function statusLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => match ($this->status) {
                'unread' => 'Belum Dibaca',
                'read' => 'Sudah Dibaca',
                'archived' => 'Diarsipkan',
                default => 'Tidak Diketahui',
            },
        );
    }

    /**
     * Get excerpt of the message.
     */
    protected function excerpt(): Attribute
    {
        return Attribute::make(
            get: fn () => str($this->message)->limit(100),
        );
    }

    /**
     * Check if message is unread.
     */
    protected function isUnread(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status === 'unread',
        );
    }

    /**
     * Check if message is read.
     */
    protected function isRead(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status === 'read',
        );
    }

    /**
     * Check if message is archived.
     */
    protected function isArchived(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status === 'archived',
        );
    }
}
