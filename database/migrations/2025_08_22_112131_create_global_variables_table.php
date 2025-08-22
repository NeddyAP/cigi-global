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
        Schema::create('global_variables', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // e.g., 'company_name', 'contact_phone'
            $table->text('value')->nullable(); // The actual value
            $table->string('type')->default('text'); // 'text', 'textarea', 'number', 'email', 'url', 'json'
            $table->string('category')->default('general'); // 'contact', 'social', 'company', 'settings'
            $table->text('description')->nullable(); // Description for admin interface
            $table->boolean('is_public')->default(true); // Whether to show on frontend
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('global_variables');
    }
};
