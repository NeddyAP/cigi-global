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
        Schema::create('community_clubs', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., 'PB Cigi', 'Cigi FC', etc.
            $table->string('slug')->unique(); // URL-friendly version
            $table->text('description')->nullable();
            $table->string('type'); // e.g., 'Olahraga', 'Keagamaan', 'Lingkungan'
            $table->text('activities')->nullable(); // JSON or text list of activities
            $table->string('image')->nullable(); // Image path
            $table->string('contact_person')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->text('meeting_schedule')->nullable();
            $table->text('location')->nullable();
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
        Schema::dropIfExists('community_clubs');
    }
};
