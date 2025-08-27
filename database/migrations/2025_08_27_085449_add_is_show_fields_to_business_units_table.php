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
            // Add is_show fields for portfolio sections
            $table->boolean('portfolio_is_show')->default(false)->after('portfolio_items');
            $table->boolean('certifications_is_show')->default(false)->after('certifications');
            $table->boolean('company_stats_is_show')->default(false)->after('company_stats');
            $table->boolean('core_values_is_show')->default(false)->after('core_values');
            $table->boolean('achievements_is_show')->default(false)->after('achievements');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_units', function (Blueprint $table) {
            $table->dropColumn([
                'portfolio_is_show',
                'certifications_is_show',
                'company_stats_is_show',
                'core_values_is_show',
                'achievements_is_show',
            ]);
        });
    }
};
