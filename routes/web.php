<?php

use App\Http\Controllers\BusinessUnitController;
use App\Http\Controllers\CommunityClubController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');

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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
