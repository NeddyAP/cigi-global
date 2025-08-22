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
    public function index(): Response
    {
        $businessUnits = BusinessUnit::orderBy('sort_order')->get();

        return Inertia::render('admin/business-units/index', [
            'businessUnits' => $businessUnits,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/business-units/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:business_units',
            'description' => 'nullable|string',
            'services' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'website_url' => 'nullable|url|max:255',
            'operating_hours' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        BusinessUnit::create($validated);

        return redirect()->route('admin.business-units.index')
            ->with('success', 'Unit bisnis berhasil ditambahkan.');
    }

    public function show(BusinessUnit $businessUnit): Response
    {
        return Inertia::render('admin/business-units/show', [
            'businessUnit' => $businessUnit,
        ]);
    }

    public function edit(BusinessUnit $businessUnit): Response
    {
        return Inertia::render('admin/business-units/edit', [
            'businessUnit' => $businessUnit,
        ]);
    }

    public function update(Request $request, BusinessUnit $businessUnit): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:business_units,slug,'.$businessUnit->id,
            'description' => 'nullable|string',
            'services' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'website_url' => 'nullable|url|max:255',
            'operating_hours' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

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
