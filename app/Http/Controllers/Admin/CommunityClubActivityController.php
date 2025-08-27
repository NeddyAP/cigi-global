<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommunityClub;
use App\Models\CommunityClubActivity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CommunityClubActivityController extends Controller
{
    public function index(Request $request): Response
    {
        $query = CommunityClubActivity::with('communityClub');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('duration', 'like', "%{$search}%")
                    ->orWhereHas('communityClub', function ($clubQuery) use ($search) {
                        $clubQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by community club
        if ($request->filled('community_club_id')) {
            $query->where('community_club_id', $request->community_club_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $status = $request->status === 'active';
            $query->where('is_active', $status);
        }

        // Apply sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate
        $perPage = $request->get('per_page', 15);
        $activities = $query->paginate($perPage)->withQueryString();

        // Get community clubs for filter dropdown
        $communityClubs = CommunityClub::active()->ordered()->get(['id', 'name']);

        return Inertia::render('admin/community-club-activities/index', [
            'activities' => $activities,
            'communityClubs' => $communityClubs,
            'filters' => $request->only(['search', 'community_club_id', 'status', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function create(Request $request): Response
    {
        $communityClubs = CommunityClub::active()->ordered()->get(['id', 'name']);

        return Inertia::render('admin/community-club-activities/create', [
            'communityClubs' => $communityClubs,
            'selectedCommunityClubId' => $request->get('community_club_id'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate(CommunityClubActivity::validationRules());

        // Handle image - now expects a media ID or URL string
        if ($request->filled('image')) {
            $validated['image'] = $request->input('image');
        }

        // Set default values for new fields
        $validated['status'] = $validated['status'] ?? 'active';
        $validated['featured'] = $validated['featured'] ?? false;
        $validated['is_active'] = $validated['is_active'] ?? true;

        CommunityClubActivity::create($validated);

        return redirect()->route('admin.community-club-activities.index')
            ->with('success', 'Aktivitas komunitas berhasil ditambahkan.');
    }

    public function show(CommunityClubActivity $communityClubActivity): Response
    {
        $communityClubActivity->load('communityClub');

        return Inertia::render('admin/community-club-activities/show', [
            'activity' => $communityClubActivity,
        ]);
    }

    public function edit(CommunityClubActivity $communityClubActivity): Response
    {
        $communityClubActivity->load('communityClub');
        $communityClubs = CommunityClub::active()->ordered()->get(['id', 'name']);

        return Inertia::render('admin/community-club-activities/edit', [
            'activity' => $communityClubActivity,
            'communityClubs' => $communityClubs,
        ]);
    }

    public function update(Request $request, CommunityClubActivity $communityClubActivity): RedirectResponse
    {
        $validated = $request->validate(CommunityClubActivity::updateValidationRules($communityClubActivity->id));

        // Handle image - now expects a media ID or URL string
        if ($request->filled('image')) {
            $validated['image'] = $request->input('image');
        } elseif (isset($communityClubActivity->image)) {
            // Keep existing image if no new one provided
            $validated['image'] = $communityClubActivity->image;
        }

        // Set default values for new fields if not provided
        $validated['status'] = $validated['status'] ?? $communityClubActivity->status ?? 'active';
        $validated['featured'] = $validated['featured'] ?? $communityClubActivity->featured ?? false;
        $validated['is_active'] = $validated['is_active'] ?? $communityClubActivity->is_active ?? true;

        $communityClubActivity->update($validated);

        return redirect()->route('admin.community-club-activities.index')
            ->with('success', 'Aktivitas komunitas berhasil diperbarui.');
    }

    public function destroy(CommunityClubActivity $communityClubActivity): RedirectResponse
    {
        // Delete associated image if exists
        if ($communityClubActivity->image && Storage::disk('public')->exists($communityClubActivity->image)) {
            Storage::disk('public')->delete($communityClubActivity->image);
        }

        $communityClubActivity->delete();

        return redirect()->route('admin.community-club-activities.index')
            ->with('success', 'Aktivitas komunitas berhasil dihapus.');
    }
}
