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
    public function index(Request $request): Response
    {
        $query = CommunityClub::query();

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('contact_person', 'like', "%{$search}%")
                    ->orWhere('contact_email', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $sortField = $request->get('sort', 'sort_order');
        $sortDirection = $request->get('direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate
        $perPage = $request->get('per_page', 15);
        $communityClubs = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/community-clubs/index', [
            'communityClubs' => $communityClubs,
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']),
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
