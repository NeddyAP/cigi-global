<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GlobalVariable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GlobalVariableController extends Controller
{
    public function index(): Response
    {
        $variables = GlobalVariable::orderBy('category')
            ->orderBy('key')
            ->get()
            ->groupBy('category');

        return Inertia::render('admin/global-variables/index', [
            'variables' => $variables,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/global-variables/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:global_variables',
            'value' => 'nullable|string',
            'type' => 'required|in:text,textarea,number,email,url,json,boolean',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
        ]);

        GlobalVariable::create($validated);

        return redirect()->route('admin.global-variables.index')
            ->with('success', 'Variabel global berhasil ditambahkan.');
    }

    public function show(GlobalVariable $globalVariable): Response
    {
        return Inertia::render('admin/global-variables/show', [
            'variable' => $globalVariable,
        ]);
    }

    public function edit(GlobalVariable $globalVariable): Response
    {
        return Inertia::render('admin/global-variables/edit', [
            'variable' => $globalVariable,
        ]);
    }

    public function update(Request $request, GlobalVariable $globalVariable): RedirectResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:global_variables,key,'.$globalVariable->id,
            'value' => 'nullable|string',
            'type' => 'required|in:text,textarea,number,email,url,json,boolean',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
        ]);

        $globalVariable->update($validated);

        return redirect()->route('admin.global-variables.index')
            ->with('success', 'Variabel global berhasil diperbarui.');
    }

    public function destroy(GlobalVariable $globalVariable): RedirectResponse
    {
        $globalVariable->delete();

        return redirect()->route('admin.global-variables.index')
            ->with('success', 'Variabel global berhasil dihapus.');
    }
}
