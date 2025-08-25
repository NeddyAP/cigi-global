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

        // Handle image uploads for gallery
        if ($request->hasFile('gallery_images')) {
            $galleryImages = [];
            foreach ($request->file('gallery_images') as $file) {
                $path = $file->store('community-clubs/gallery', 'public');
                $galleryImages[] = $path;
            }
            $validated['gallery_images'] = $galleryImages;
        }

        // Handle main image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('community-clubs', 'public');
        }

        // Handle testimonial images
        if (isset($validated['testimonials'])) {
            foreach ($validated['testimonials'] as $index => $testimonial) {
                if ($request->hasFile("testimonial_images.{$index}")) {
                    $path = $request->file("testimonial_images.{$index}")->store('community-clubs/testimonials', 'public');
                    $validated['testimonials'][$index]['image'] = $path;
                }
            }
        }

        // Handle event images
        if (isset($validated['upcoming_events'])) {
            foreach ($validated['upcoming_events'] as $index => $event) {
                if ($request->hasFile("event_images.{$index}")) {
                    $path = $request->file("event_images.{$index}")->store('community-clubs/events', 'public');
                    $validated['upcoming_events'][$index]['image'] = $path;
                }
            }
        }

        // Handle achievement images
        if (isset($validated['achievements'])) {
            foreach ($validated['achievements'] as $index => $achievement) {
                if ($request->hasFile("achievement_images.{$index}")) {
                    $path = $request->file("achievement_images.{$index}")->store('community-clubs/achievements', 'public');
                    $validated['achievements'][$index]['image'] = $path;
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

        // Handle image uploads for gallery
        if ($request->hasFile('gallery_images')) {
            $galleryImages = $communityClub->gallery_images ?? [];
            foreach ($request->file('gallery_images') as $file) {
                $path = $file->store('community-clubs/gallery', 'public');
                $galleryImages[] = $path;
            }
            $validated['gallery_images'] = $galleryImages;
        }

        // Handle main image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('community-clubs', 'public');
        }

        // Handle testimonial images
        if (isset($validated['testimonials'])) {
            foreach ($validated['testimonials'] as $index => $testimonial) {
                if ($request->hasFile("testimonial_images.{$index}")) {
                    $path = $request->file("testimonial_images.{$index}")->store('community-clubs/testimonials', 'public');
                    $validated['testimonials'][$index]['image'] = $path;
                } elseif (isset($communityClub->testimonials[$index]['image'])) {
                    // Keep existing image if no new one uploaded
                    $validated['testimonials'][$index]['image'] = $communityClub->testimonials[$index]['image'];
                }
            }
        }

        // Handle event images
        if (isset($validated['upcoming_events'])) {
            foreach ($validated['upcoming_events'] as $index => $event) {
                if ($request->hasFile("event_images.{$index}")) {
                    $path = $request->file("event_images.{$index}")->store('community-clubs/events', 'public');
                    $validated['upcoming_events'][$index]['image'] = $path;
                } elseif (isset($communityClub->upcoming_events[$index]['image'])) {
                    // Keep existing image if no new one uploaded
                    $validated['upcoming_events'][$index]['image'] = $communityClub->upcoming_events[$index]['image'];
                }
            }
        }

        // Handle achievement images
        if (isset($validated['achievements'])) {
            foreach ($validated['achievements'] as $index => $achievement) {
                if ($request->hasFile("achievement_images.{$index}")) {
                    $path = $request->file("achievement_images.{$index}")->store('community-clubs/achievements', 'public');
                    $validated['achievements'][$index]['image'] = $path;
                } elseif (isset($communityClub->achievements[$index]['image'])) {
                    // Keep existing image if no new one uploaded
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
}
