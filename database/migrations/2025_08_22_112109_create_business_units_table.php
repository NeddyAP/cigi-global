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
        Schema::create('business_units', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., 'Cigi Net', 'Cigi Mart', etc.
            $table->string('slug')->unique(); // URL-friendly version
            $table->text('description')->nullable();
            $table->text('services')->nullable(); // JSON or text list of services
            $table->string('image')->nullable(); // Image path
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->text('address')->nullable();
            $table->string('website_url')->nullable();
            $table->text('operating_hours')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_units');
    }
};
