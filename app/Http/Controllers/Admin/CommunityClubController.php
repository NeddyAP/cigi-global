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

        // Apply status filter
        if ($request->filled('status')) {
            $status = $request->status === 'active';
            $query->where('is_active', $status);
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
            'filters' => $request->only(['search', 'status', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/community-clubs/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate(CommunityClub::validationRules());

        // Handle main image - now expects a media ID or URL string
        if ($request->filled('image')) {
            // If it's a media ID, we can store it directly
            // If it's a URL, we can store it directly
            $validated['image'] = $request->input('image');
        }

        // Handle testimonial images - now expects media IDs or URL strings
        if (isset($validated['testimonials'])) {
            foreach ($validated['testimonials'] as $index => $testimonial) {
                if (isset($testimonial['image']) && $testimonial['image']) {
                    // Store the media ID or URL directly
                    $validated['testimonials'][$index]['image'] = $testimonial['image'];
                }
            }
        }

        // Handle event images - now expects media IDs or URL strings
        if (isset($validated['upcoming_events'])) {
            foreach ($validated['upcoming_events'] as $index => $event) {
                if (isset($event['image']) && $event['image']) {
                    // Store the media ID or URL directly
                    $validated['upcoming_events'][$index]['image'] = $event['image'];
                }
            }
        }

        // Handle achievement images - now expects media IDs or URL strings
        if (isset($validated['achievements'])) {
            foreach ($validated['achievements'] as $index => $achievement) {
                if (isset($achievement['image']) && $achievement['image']) {
                    // Store the media ID or URL directly
                    $validated['achievements'][$index]['image'] = $achievement['image'];
                }
            }
        }

        CommunityClub::create($validated);

        return redirect()->route('admin.community-clubs.index')
            ->with('success', 'Komunitas berhasil ditambahkan.');
    }

    public function show(CommunityClub $communityClub): Response
    {
        $communityClub->load('clubActivities');

        return Inertia::render('admin/community-clubs/show', [
            'communityClub' => $communityClub,
        ]);
    }

    public function edit(CommunityClub $communityClub): Response
    {
        $communityClub->load('clubActivities');

        return Inertia::render('admin/community-clubs/edit', [
            'communityClub' => $communityClub,
        ]);
    }

    public function update(Request $request, CommunityClub $communityClub): RedirectResponse
    {
        $validated = $request->validate(CommunityClub::updateValidationRules($communityClub->id));

        // Handle main image - now expects a media ID or URL string
        if ($request->filled('image')) {
            // If it's a media ID, we can store it directly
            // If it's a URL, we can store it directly
            $validated['image'] = $request->input('image');
        }

        // Handle testimonial images - now expects media IDs or URL strings
        if (isset($validated['testimonials'])) {
            foreach ($validated['testimonials'] as $index => $testimonial) {
                if (isset($testimonial['image']) && $testimonial['image']) {
                    // Store the media ID or URL directly
                    $validated['testimonials'][$index]['image'] = $testimonial['image'];
                } elseif (isset($communityClub->testimonials[$index]['image'])) {
                    // Keep existing image if no new one provided
                    $validated['testimonials'][$index]['image'] = $communityClub->testimonials[$index]['image'];
                }
            }
        }

        // Handle event images - now expects media IDs or URL strings
        if (isset($validated['upcoming_events'])) {
            foreach ($validated['upcoming_events'] as $index => $event) {
                if (isset($event['image']) && $event['image']) {
                    // Store the media ID or URL directly
                    $validated['upcoming_events'][$index]['image'] = $event['image'];
                } elseif (isset($communityClub->upcoming_events[$index]['image'])) {
                    // Keep existing image if no new one provided
                    $validated['upcoming_events'][$index]['image'] = $communityClub->upcoming_events[$index]['image'];
                }
            }
        }

        // Handle achievement images - now expects media IDs or URL strings
        if (isset($validated['achievements'])) {
            foreach ($validated['achievements'] as $index => $achievement) {
                if (isset($achievement['image']) && $achievement['image']) {
                    // Store the media ID or URL directly
                    $validated['achievements'][$index]['image'] = $achievement['image'];
                } elseif (isset($communityClub->achievements[$index]['image'])) {
                    // Keep existing image if no new one provided
                    $validated['achievements'][$index]['image'] = $communityClub->achievements[$index]['image'];
                }
            }
        }

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

    /**
     * Transform data before saving
     */
    private function transformData(array $data): array
    {
        // Transform more_about data - filter out empty entries
        if (isset($data['more_about'])) {
            $data['more_about'] = array_filter($data['more_about'], function ($item) {
                return ! empty($item['title']) && ! empty($item['description']);
            });
            // Reset array keys
            $data['more_about'] = array_values($data['more_about']);
        }

        return $data;
    }
}
