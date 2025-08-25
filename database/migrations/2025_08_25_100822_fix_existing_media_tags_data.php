<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Fix existing media tags that might be stored as JSON strings
        $mediaRecords = DB::table('media')->whereNotNull('tags')->get();

        foreach ($mediaRecords as $media) {
            if (is_string($media->tags)) {
                try {
                    // Try to decode the JSON string
                    $decoded = json_decode($media->tags, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        // Update with properly formatted JSON
                        DB::table('media')
                            ->where('id', $media->id)
                            ->update(['tags' => json_encode($decoded)]);
                    }
                } catch (\Exception $e) {
                    // Log error but continue
                    \Log::warning("Failed to fix tags for media ID {$media->id}: ".$e->getMessage());
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration fixes data, so no rollback needed
    }
};
