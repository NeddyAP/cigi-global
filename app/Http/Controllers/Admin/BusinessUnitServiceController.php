<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BusinessUnit;
use App\Models\BusinessUnitService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BusinessUnitServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $query = BusinessUnitService::with('businessUnit');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('price_range', 'like', "%{$search}%")
                    ->orWhere('duration', 'like', "%{$search}%")
                    ->orWhereHas('businessUnit', function ($unitQuery) use ($search) {
                        $unitQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by business unit
        if ($request->filled('business_unit_id')) {
            $query->where('business_unit_id', $request->business_unit_id);
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
        $services = $query->paginate($perPage)->withQueryString();

        // Get business units for filter dropdown
        $businessUnits = BusinessUnit::active()->ordered()->get(['id', 'name']);

        return Inertia::render('admin/business-unit-services/index', [
            'services' => $services,
            'businessUnits' => $businessUnits,
            'filters' => $request->only(['search', 'business_unit_id', 'status', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function create(Request $request): Response
    {
        $businessUnits = BusinessUnit::active()->ordered()->get(['id', 'name']);

        return Inertia::render('admin/business-unit-services/create', [
            'businessUnits' => $businessUnits,
            'selectedBusinessUnitId' => $request->get('business_unit_id'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate(BusinessUnitService::validationRules());

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('business-unit-services', 'public');
        }

        BusinessUnitService::create($validated);

        return redirect()->route('admin.business-unit-services.index')
            ->with('success', 'Layanan unit bisnis berhasil ditambahkan.');
    }

    public function show(BusinessUnitService $businessUnitService): Response
    {
        $businessUnitService->load('businessUnit');

        return Inertia::render('admin/business-unit-services/show', [
            'service' => $businessUnitService,
        ]);
    }

    public function edit(BusinessUnitService $businessUnitService): Response
    {
        $businessUnitService->load('businessUnit');
        $businessUnits = BusinessUnit::active()->ordered()->get(['id', 'name']);

        return Inertia::render('admin/business-unit-services/edit', [
            'service' => $businessUnitService,
            'businessUnits' => $businessUnits,
        ]);
    }

    public function update(Request $request, BusinessUnitService $businessUnitService): RedirectResponse
    {
        $validated = $request->validate(BusinessUnitService::updateValidationRules($businessUnitService->id));

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($businessUnitService->image && Storage::disk('public')->exists($businessUnitService->image)) {
                Storage::disk('public')->delete($businessUnitService->image);
            }
            $validated['image'] = $request->file('image')->store('business-unit-services', 'public');
        }

        $businessUnitService->update($validated);

        return redirect()->route('admin.business-unit-services.index')
            ->with('success', 'Layanan unit bisnis berhasil diperbarui.');
    }

    public function destroy(BusinessUnitService $businessUnitService): RedirectResponse
    {
        // Delete associated image if exists
        if ($businessUnitService->image && Storage::disk('public')->exists($businessUnitService->image)) {
            Storage::disk('public')->delete($businessUnitService->image);
        }

        $businessUnitService->delete();

        return redirect()->route('admin.business-unit-services.index')
            ->with('success', 'Layanan unit bisnis berhasil dihapus.');
    }
}
