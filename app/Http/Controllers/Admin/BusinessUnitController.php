<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BusinessUnit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BusinessUnitController extends Controller
{
    public function index(Request $request): Response
    {
        $query = BusinessUnit::query();

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('services', 'like', "%{$search}%")
                    ->orWhere('contact_email', 'like', "%{$search}%")
                    ->orWhere('contact_phone', 'like', "%{$search}%");
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
        $businessUnits = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/business-units/index', [
            'businessUnits' => $businessUnits,
            'filters' => $request->only(['search', 'status', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/business-units/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate(BusinessUnit::validationRules());

        // Handle image uploads for gallery
        if ($request->hasFile('gallery_images')) {
            $galleryImages = [];
            foreach ($request->file('gallery_images') as $file) {
                $path = $file->store('business-units/gallery', 'public');
                $galleryImages[] = $path;
            }
            $validated['gallery_images'] = $galleryImages;
        }

        // Handle main image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('business-units', 'public');
        }

        // Handle team member images
        if (isset($validated['team_members'])) {
            foreach ($validated['team_members'] as $index => $member) {
                if ($request->hasFile("team_member_images.{$index}")) {
                    $path = $request->file("team_member_images.{$index}")->store('business-units/team', 'public');
                    $validated['team_members'][$index]['image'] = $path;
                }
            }
        }

        // Handle client testimonial images
        if (isset($validated['client_testimonials'])) {
            foreach ($validated['client_testimonials'] as $index => $testimonial) {
                if ($request->hasFile("testimonial_images.{$index}")) {
                    $path = $request->file("testimonial_images.{$index}")->store('business-units/testimonials', 'public');
                    $validated['client_testimonials'][$index]['image'] = $path;
                }
            }
        }

        // Handle portfolio item images
        if (isset($validated['portfolio_items'])) {
            foreach ($validated['portfolio_items'] as $index => $item) {
                if ($request->hasFile("portfolio_images.{$index}")) {
                    $path = $request->file("portfolio_images.{$index}")->store('business-units/portfolio', 'public');
                    $validated['portfolio_items'][$index]['image'] = $path;
                }
            }
        }

        // Handle certification images
        if (isset($validated['certifications'])) {
            foreach ($validated['certifications'] as $index => $certification) {
                if ($request->hasFile("certification_images.{$index}")) {
                    $path = $request->file("certification_images.{$index}")->store('business-units/certifications', 'public');
                    $validated['certifications'][$index]['image'] = $path;
                }
            }
        }

        // Handle achievement images
        if (isset($validated['achievements'])) {
            foreach ($validated['achievements'] as $index => $achievement) {
                if ($request->hasFile("achievement_images.{$index}")) {
                    $path = $request->file("achievement_images.{$index}")->store('business-units/achievements', 'public');
                    $validated['achievements'][$index]['image'] = $path;
                }
            }
        }

        BusinessUnit::create($validated);

        return redirect()->route('admin.business-units.index')
            ->with('success', 'Unit bisnis berhasil ditambahkan.');
    }

    public function show(BusinessUnit $businessUnit): Response
    {
        $businessUnit->load('unitServices');

        return Inertia::render('admin/business-units/show', [
            'businessUnit' => $businessUnit,
        ]);
    }

    public function edit(BusinessUnit $businessUnit): Response
    {
        $businessUnit->load('unitServices');

        return Inertia::render('admin/business-units/edit', [
            'businessUnit' => $businessUnit,
        ]);
    }

    public function update(Request $request, BusinessUnit $businessUnit): RedirectResponse
    {
        $validated = $request->validate(BusinessUnit::updateValidationRules($businessUnit->id));

        // Handle image uploads for gallery
        if ($request->hasFile('gallery_images')) {
            $galleryImages = $businessUnit->gallery_images ?? [];
            foreach ($request->file('gallery_images') as $file) {
                $path = $file->store('business-units/gallery', 'public');
                $galleryImages[] = $path;
            }
            $validated['gallery_images'] = $galleryImages;
        }

        // Handle main image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('business-units', 'public');
        }

        // Handle team member images
        if (isset($validated['team_members'])) {
            foreach ($validated['team_members'] as $index => $member) {
                if ($request->hasFile("team_member_images.{$index}")) {
                    $path = $request->file("team_member_images.{$index}")->store('business-units/team', 'public');
                    $validated['team_members'][$index]['image'] = $path;
                } elseif (isset($businessUnit->team_members[$index]['image'])) {
                    // Keep existing image if no new one uploaded
                    $validated['team_members'][$index]['image'] = $businessUnit->team_members[$index]['image'];
                }
            }
        }

        // Handle client testimonial images
        if (isset($validated['client_testimonials'])) {
            foreach ($validated['client_testimonials'] as $index => $testimonial) {
                if ($request->hasFile("testimonial_images.{$index}")) {
                    $path = $request->file("testimonial_images.{$index}")->store('business-units/testimonials', 'public');
                    $validated['client_testimonials'][$index]['image'] = $path;
                } elseif (isset($businessUnit->client_testimonials[$index]['image'])) {
                    // Keep existing image if no new one uploaded
                    $validated['client_testimonials'][$index]['image'] = $businessUnit->client_testimonials[$index]['image'];
                }
            }
        }

        // Handle portfolio item images
        if (isset($validated['portfolio_items'])) {
            foreach ($validated['portfolio_items'] as $index => $item) {
                if ($request->hasFile("portfolio_images.{$index}")) {
                    $path = $request->file("portfolio_images.{$index}")->store('business-units/portfolio', 'public');
                    $validated['portfolio_items'][$index]['image'] = $path;
                } elseif (isset($businessUnit->portfolio_items[$index]['image'])) {
                    // Keep existing image if no new one uploaded
                    $validated['portfolio_items'][$index]['image'] = $businessUnit->portfolio_items[$index]['image'];
                }
            }
        }

        // Handle certification images
        if (isset($validated['certifications'])) {
            foreach ($validated['certifications'] as $index => $certification) {
                if ($request->hasFile("certification_images.{$index}")) {
                    $path = $request->file("certification_images.{$index}")->store('business-units/certifications', 'public');
                    $validated['certifications'][$index]['image'] = $path;
                } elseif (isset($businessUnit->certifications[$index]['image'])) {
                    // Keep existing image if no new one uploaded
                    $validated['certifications'][$index]['image'] = $businessUnit->certifications[$index]['image'];
                }
            }
        }

        // Handle achievement images
        if (isset($validated['achievements'])) {
            foreach ($validated['achievements'] as $index => $achievement) {
                if ($request->hasFile("achievement_images.{$index}")) {
                    $path = $request->file("achievement_images.{$index}")->store('business-units/achievements', 'public');
                    $validated['achievements'][$index]['image'] = $path;
                } elseif (isset($businessUnit->achievements[$index]['image'])) {
                    // Keep existing image if no new one uploaded
                    $validated['achievements'][$index]['image'] = $businessUnit->achievements[$index]['image'];
                }
            }
        }

        $businessUnit->update($validated);

        return redirect()->route('admin.business-units.index')
            ->with('success', 'Unit bisnis berhasil diperbarui.');
    }

    public function destroy(BusinessUnit $businessUnit): RedirectResponse
    {
        $businessUnit->delete();

        return redirect()->route('admin.business-units.index')
            ->with('success', 'Unit bisnis berhasil dihapus.');
    }
}
