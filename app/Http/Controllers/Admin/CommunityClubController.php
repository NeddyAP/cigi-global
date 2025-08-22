<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommunityClub;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunityClubController extends Controller
{
    public function index(): Response
    {
        $communityClubs = CommunityClub::orderBy('sort_order')->get();

        return Inertia::render('admin/community-clubs/index', [
            'communityClubs' => $communityClubs,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/community-clubs/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:community_clubs',
            'description' => 'nullable|string',
            'type' => 'required|string|max:255',
            'activities' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'meeting_schedule' => 'nullable|string',
            'location' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        CommunityClub::create($validated);

        return redirect()->route('admin.community-clubs.index')
            ->with('success', 'Komunitas berhasil ditambahkan.');
    }

    public function show(CommunityClub $communityClub): Response
    {
        return Inertia::render('admin/community-clubs/show', [
            'communityClub' => $communityClub,
        ]);
    }

    public function edit(CommunityClub $communityClub): Response
    {
        return Inertia::render('admin/community-clubs/edit', [
            'communityClub' => $communityClub,
        ]);
    }

    public function update(Request $request, CommunityClub $communityClub): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:community_clubs,slug,' . $communityClub->id,
            'description' => 'nullable|string',
            'type' => 'required|string|max:255',
            'activities' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'meeting_schedule' => 'nullable|string',
            'location' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $communityClub->update($validated);

        return redirect()->route('admin.community-clubs.index')
            ->with('success', 'Komunitas berhasil diperbarui.');
    }

    public function destroy(CommunityClub $communityClub): RedirectResponse
    {
        $communityClub->delete();

        return redirect()->route('admin.community-clubs.index')
            ->with('success', 'Komunitas berhasil dihapus.');
    }
}
