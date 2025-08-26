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

        // Transform data before saving
        $validated = $this->transformData($validated);

        // Handle main image - now expects a media ID or URL string
        if ($request->filled('image')) {
            // If it's a media ID, we can store it directly
            // If it's a URL, we can store it directly
            $validated['image'] = $request->input('image');
        }

        // Handle team member images - now expects media IDs or URL strings
        if (isset($validated['team_members'])) {
            foreach ($validated['team_members'] as $index => $member) {
                if (isset($member['image']) && $member['image']) {
                    // Store the media ID or URL directly
                    $validated['team_members'][$index]['image'] = $member['image'];
                }
            }
        }

        // Handle client testimonial images - now expects media IDs or URL strings
        if (isset($validated['client_testimonials'])) {
            foreach ($validated['client_testimonials'] as $index => $testimonial) {
                if (isset($testimonial['image']) && $testimonial['image']) {
                    // Store the media ID or URL directly
                    $validated['client_testimonials'][$index]['image'] = $testimonial['image'];
                }
            }
        }

        // Handle portfolio item images - now expects media IDs or URL strings
        if (isset($validated['portfolio_items'])) {
            foreach ($validated['portfolio_items'] as $index => $item) {
                if (isset($item['image']) && $item['image']) {
                    // Store the media ID or URL directly
                    $validated['portfolio_items'][$index]['image'] = $item['image'];
                }
            }
        }

        // Handle certification images - now expects media IDs or URL strings
        if (isset($validated['certifications'])) {
            foreach ($validated['certifications'] as $index => $certification) {
                if (isset($certification['image']) && $certification['image']) {
                    // Store the media ID or URL directly
                    $validated['certifications'][$index]['image'] = $certification['image'];
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

        BusinessUnit::create($validated);

        return redirect()->route('admin.business-units.index')
            ->with('success', 'Unit bisnis berhasil ditambahkan.');
    }

    private function transformData(array $data): array
    {
        // Debug logging for more_about
        \Log::info('TransformData input more_about:', ['more_about' => $data['more_about'] ?? 'not set']);

        // Transform more_about data - filter out empty entries
        if (isset($data['more_about'])) {
            $data['more_about'] = array_filter($data['more_about'], function ($item) {
                return ! empty($item['title']) && ! empty($item['description']);
            });
            // Reset array keys
            $data['more_about'] = array_values($data['more_about']);

            // Debug logging after transform
            \Log::info('TransformData output more_about:', ['more_about' => $data['more_about']]);
        }

        // Transform team members social links
        if (isset($data['team_members'])) {
            $data['team_members'] = array_map(function ($member) {
                $socialLinks = [];

                if (! empty($member['social_links_linkedin'])) {
                    $socialLinks[] = [
                        'platform' => 'linkedin',
                        'url' => $member['social_links_linkedin'],
                    ];
                }

                if (! empty($member['social_links_twitter'])) {
                    $socialLinks[] = [
                        'platform' => 'twitter',
                        'url' => $member['social_links_twitter'],
                    ];
                }

                if (! empty($member['social_links_github'])) {
                    $socialLinks[] = [
                        'platform' => 'github',
                        'url' => $member['social_links_github'],
                    ];
                }

                return array_merge($member, ['social_links' => $socialLinks]);
            }, $data['team_members']);
        }

        // Transform company stats
        if (isset($data['company_stats'])) {
            // Check if data is already in the correct format (has label and value)
            if (is_array($data['company_stats']) && count($data['company_stats']) > 0 && isset($data['company_stats'][0]['label'])) {
                // Data is already in correct format, don't transform
                // Do nothing, keep the data as is
            } else {
                // Data is in old format, transform it
                $companyStats = [];

                if (! empty($data['company_stats']['years_in_business'])) {
                    $companyStats[] = [
                        'label' => 'Years in Business',
                        'value' => $data['company_stats']['years_in_business'],
                        'icon' => '📅',
                    ];
                }

                if (! empty($data['company_stats']['projects_completed'])) {
                    $companyStats[] = [
                        'label' => 'Projects Completed',
                        'value' => $data['company_stats']['projects_completed'],
                        'icon' => '🚀',
                    ];
                }

                if (! empty($data['company_stats']['clients_served'])) {
                    $companyStats[] = [
                        'label' => 'Clients Served',
                        'value' => $data['company_stats']['clients_served'],
                        'icon' => '👥',
                    ];
                }

                if (! empty($data['company_stats']['team_size'])) {
                    $companyStats[] = [
                        'label' => 'Team Size',
                        'value' => $data['company_stats']['team_size'],
                        'icon' => '👨‍💼',
                    ];
                }

                $data['company_stats'] = $companyStats;
            }
        }

        return $data;
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

        // Transform data before saving
        $validated = $this->transformData($validated);

        // Handle main image - now expects a media ID or URL string
        if ($request->filled('image')) {
            // If it's a media ID, we can store it directly
            // If it's a URL, we can store it directly
            $validated['image'] = $request->input('image');
        }

        // Handle team member images - now expects media IDs or URL strings
        if (isset($validated['team_members'])) {
            foreach ($validated['team_members'] as $index => $member) {
                if (isset($member['image']) && $member['image']) {
                    // Store the media ID or URL directly
                    $validated['team_members'][$index]['image'] = $member['image'];
                } elseif (isset($businessUnit->team_members[$index]['image'])) {
                    // Keep existing image if no new one provided
                    $validated['team_members'][$index]['image'] = $businessUnit->team_members[$index]['image'];
                }
            }
        }

        // Handle client testimonial images - now expects media IDs or URL strings
        if (isset($validated['client_testimonials'])) {
            foreach ($validated['client_testimonials'] as $index => $testimonial) {
                if (isset($testimonial['image']) && $testimonial['image']) {
                    // Store the media ID or URL directly
                    $validated['client_testimonials'][$index]['image'] = $testimonial['image'];
                } elseif (isset($businessUnit->client_testimonials[$index]['image'])) {
                    // Keep existing image if no new one provided
                    $validated['client_testimonials'][$index]['image'] = $businessUnit->client_testimonials[$index]['image'];
                }
            }
        }

        // Handle portfolio item images - now expects media IDs or URL strings
        if (isset($validated['portfolio_items'])) {
            foreach ($validated['portfolio_items'] as $index => $item) {
                if (isset($item['image']) && $item['image']) {
                    // Store the media ID or URL directly
                    $validated['portfolio_items'][$index]['image'] = $item['image'];
                } elseif (isset($businessUnit->portfolio_items[$index]['image'])) {
                    // Keep existing image if no new one provided
                    $validated['portfolio_items'][$index]['image'] = $businessUnit->portfolio_items[$index]['image'];
                }
            }
        }

        // Handle certification images - now expects media IDs or URL strings
        if (isset($validated['certifications'])) {
            foreach ($validated['certifications'] as $index => $certification) {
                if (isset($certification['image']) && $certification['image']) {
                    // Store the media ID or URL directly
                    $validated['certifications'][$index]['image'] = $certification['image'];
                } elseif (isset($businessUnit->certifications[$index]['image'])) {
                    // Keep existing image if no new one provided
                    $validated['certifications'][$index]['image'] = $businessUnit->certifications[$index]['image'];
                }
            }
        }

        // Handle achievement images - now expects media IDs or URL strings
        if (isset($validated['achievements'])) {
            foreach ($validated['achievements'] as $index => $achievement) {
                if (isset($achievement['image']) && $achievement['image']) {
                    // Store the media ID or URL directly
                    $validated['achievements'][$index]['image'] = $achievement['image'];
                } elseif (isset($businessUnit->achievements[$index]['image'])) {
                    // Keep existing image if no new one provided
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
