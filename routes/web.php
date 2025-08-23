<?php

use App\Http\Controllers\BusinessUnitController;
use App\Http\Controllers\CommunityClubController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NavigationController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PublicPageController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/tentang-kami', [PublicPageController::class, 'about'])->name('about');
Route::get('/kontak', [PublicPageController::class, 'contact'])->name('contact');
Route::post('/kontak', [PublicPageController::class, 'storeContactMessage'])->name('contact.store');

// Navigation API
Route::get('/api/navigation-data', [NavigationController::class, 'data'])->name('api.navigation-data');
Route::post('/api/navigation-cache/clear', [NavigationController::class, 'clearCache'])->name('api.navigation-cache.clear');

// Business Units
Route::get('/unit-bisnis', [BusinessUnitController::class, 'index'])->name('business-units.index');
Route::get('/unit-bisnis/{businessUnit}', [BusinessUnitController::class, 'show'])->name('business-units.show');

// Community Clubs
Route::get('/komunitas', [CommunityClubController::class, 'index'])->name('community-clubs.index');
Route::get('/komunitas/{communityClub}', [CommunityClubController::class, 'show'])->name('community-clubs.show');

// News
Route::get('/berita', [NewsController::class, 'index'])->name('news.index');
Route::get('/berita/{news}', [NewsController::class, 'show'])->name('news.show');

// Admin routes
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return \Inertia\Inertia::render('admin/dashboard');
    })->name('dashboard');

    // Admin resource routes will be added here
    Route::resource('business-units', \App\Http\Controllers\Admin\BusinessUnitController::class);
    Route::resource('community-clubs', \App\Http\Controllers\Admin\CommunityClubController::class);
    Route::resource('news', \App\Http\Controllers\Admin\NewsController::class);
    Route::resource('global-variables', \App\Http\Controllers\Admin\GlobalVariableController::class);
    Route::resource('contact-messages', \App\Http\Controllers\Admin\ContactMessageController::class)->only(['index', 'show', 'update', 'destroy']);

    // Contact messages bulk actions
    Route::post('contact-messages/mark-as-read', [\App\Http\Controllers\Admin\ContactMessageController::class, 'markAsRead'])->name('contact-messages.mark-as-read');
    Route::post('contact-messages/mark-as-archived', [\App\Http\Controllers\Admin\ContactMessageController::class, 'markAsArchived'])->name('contact-messages.mark-as-archived');
    Route::post('contact-messages/bulk-delete', [\App\Http\Controllers\Admin\ContactMessageController::class, 'bulkDelete'])->name('contact-messages.bulk-delete');

    // Media Manager routes
    Route::resource('media', \App\Http\Controllers\Admin\MediaController::class);
    Route::post('media/ajax-upload', [\App\Http\Controllers\Admin\MediaController::class, 'ajaxUpload'])->name('media.ajax-upload');
    Route::get('media-picker', [\App\Http\Controllers\Admin\MediaController::class, 'picker'])->name('media.picker');
    Route::post('media/bulk-delete', [\App\Http\Controllers\Admin\MediaController::class, 'bulkDelete'])->name('media.bulk-delete');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
