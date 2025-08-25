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
        Schema::table('business_units', function (Blueprint $table) {
            $table->json('team_members')->nullable()->after('image');
            $table->json('client_testimonials')->nullable()->after('team_members');
            $table->json('portfolio_items')->nullable()->after('client_testimonials');
            $table->json('certifications')->nullable()->after('portfolio_items');
            $table->json('company_stats')->nullable()->after('certifications');
            $table->json('gallery_images')->nullable()->after('company_stats');
            $table->json('achievements')->nullable()->after('gallery_images');
            $table->json('core_values')->nullable()->after('achievements');
            $table->text('hero_subtitle')->nullable()->after('core_values');
            $table->string('hero_cta_text')->nullable()->after('hero_subtitle');
            $table->string('hero_cta_link')->nullable()->after('hero_cta_text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_units', function (Blueprint $table) {
            $table->dropColumn([
                'team_members',
                'client_testimonials',
                'portfolio_items',
                'certifications',
                'company_stats',
                'gallery_images',
                'achievements',
                'core_values',
                'hero_subtitle',
                'hero_cta_text',
                'hero_cta_link',
            ]);
        });
    }
};
