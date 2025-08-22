<?php

namespace App\Http\Controllers;

use App\Models\BusinessUnit;
use Inertia\Inertia;
use Inertia\Response;

class BusinessUnitController extends Controller
{
    public function index(): Response
    {
        $businessUnits = BusinessUnit::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('business-units/index', [
            'businessUnits' => $businessUnits,
        ]);
    }

    public function show(BusinessUnit $businessUnit): Response
    {
        abort_unless($businessUnit->is_active, 404);

        return Inertia::render('business-units/show', [
            'businessUnit' => $businessUnit,
        ]);
    }
}
