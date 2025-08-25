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
        // Fix media tags JSON formatting
        $mediaRecords = DB::table('media')->whereNotNull('tags')->get();

        foreach ($mediaRecords as $media) {
            if (is_string($media->tags)) {
                try {
                    // Try to decode the JSON string
                    $decoded = json_decode($media->tags, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        // Update with properly formatted JSON array
                        DB::table('media')
                            ->where('id', $media->id)
                            ->update(['tags' => $decoded]);
                    } else {
                        // If it's not valid JSON, try to extract the content
                        if (preg_match('/\["(.*?)"\]/', $media->tags, $matches)) {
                            $tags = [$matches[1]];
                            DB::table('media')
                                ->where('id', $media->id)
                                ->update(['tags' => $tags]);
                        }
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
