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
        Schema::table('community_clubs', function (Blueprint $table) {
            $table->json('gallery_images')->nullable()->after('image');
            $table->json('testimonials')->nullable()->after('gallery_images');
            $table->json('social_media_links')->nullable()->after('testimonials');
            $table->integer('founded_year')->nullable()->after('social_media_links');
            $table->integer('member_count')->nullable()->after('founded_year');
            $table->json('upcoming_events')->nullable()->after('member_count');
            $table->json('achievements')->nullable()->after('upcoming_events');
            $table->text('hero_subtitle')->nullable()->after('achievements');
            $table->string('hero_cta_text')->nullable()->after('hero_subtitle');
            $table->string('hero_cta_link')->nullable()->after('hero_cta_text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('community_clubs', function (Blueprint $table) {
            $table->dropColumn([
                'gallery_images',
                'testimonials',
                'social_media_links',
                'founded_year',
                'member_count',
                'upcoming_events',
                'achievements',
                'hero_subtitle',
                'hero_cta_text',
                'hero_cta_link',
            ]);
        });
    }
};
