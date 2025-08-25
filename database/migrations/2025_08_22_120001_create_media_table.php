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
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->string('original_filename'); // Renamed from original_name
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('size');
            $table->string('path', 500);
            $table->string('thumbnail_path', 500)->nullable();
            $table->text('alt_text')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->json('tags')->nullable(); // Added tags field
            $table->unsignedBigInteger('uploaded_by');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('cascade');

            $table->index(['uploaded_by']);
            $table->index(['mime_type']);
            $table->index(['created_at']);
            $table->index('title', 'media_title_index'); // Added title index
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
