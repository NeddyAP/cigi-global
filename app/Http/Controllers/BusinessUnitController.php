<?php

namespace App\Http\Controllers;

use App\Models\BusinessUnit;
use Inertia\Inertia;
use Inertia\Response;

class BusinessUnitController extends Controller
{
    public function index(): Response
    {
        $businessUnits = BusinessUnit::active()
            ->ordered()
            ->get();

        return Inertia::render('public/business-units/index', [
            'businessUnits' => $businessUnits,
        ]);
    }

    public function show(BusinessUnit $businessUnit): Response
    {
        abort_unless($businessUnit->is_active, 404);

        // Get related business units (same services or similar)
        $relatedUnits = BusinessUnit::active()
            ->where('id', '!=', $businessUnit->id)
            ->ordered()
            ->limit(3)
            ->get();

        return Inertia::render('public/business-units/show', [
            'businessUnit' => $businessUnit,
            'relatedUnits' => $relatedUnits,
        ]);
    }
}
