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
        Schema::table('community_club_activities', function (Blueprint $table) {
            // Add missing fields for enhanced activity management
            $table->string('short_description')->nullable()->after('description');
            $table->string('status')->default('active')->after('max_participants');
            $table->boolean('featured')->default(false)->after('requirements');
            $table->boolean('is_active')->default(true)->after('featured');
            $table->string('schedule')->nullable()->after('is_active');
            $table->string('location')->nullable()->after('schedule');
            $table->text('contact_info')->nullable()->after('location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('community_club_activities', function (Blueprint $table) {
            $table->dropColumn([
                'short_description',
                'status',
                'featured',
                'is_active',
                'schedule',
                'location',
                'contact_info'
            ]);
        });
    }
};
