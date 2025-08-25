<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('media', function (Blueprint $table) {
            // Add index for title only (description is TEXT and would make index too long)
            if (! Schema::hasIndex('media', 'media_title_index')) {
                $table->index('title', 'media_title_index');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {
            if (Schema::hasIndex('media', 'media_title_index')) {
                $table->dropIndex('media_title_index');
            }
        });
    }
};
