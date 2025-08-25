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
            // Add tags field for business units and community clubs
            $table->json('tags')->nullable()->after('description');

            // Rename original_name to original_filename to match the model
            $table->renameColumn('original_name', 'original_filename');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {
            // Remove tags field
            $table->dropColumn('tags');

            // Rename back to original_name
            $table->renameColumn('original_filename', 'original_name');
        });
    }
};
