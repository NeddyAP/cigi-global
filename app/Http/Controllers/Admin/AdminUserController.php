<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = User::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        if (in_array($sortField, ['name', 'email', 'created_at', 'superadmin'])) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->get('per_page', 10);
        $users = $query->paginate($perPage);

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']),
            'currentUser' => [
                'id' => auth()->id(),
                'superadmin' => auth()->user()->superadmin,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        // All authenticated users can access create form
        return Inertia::render('admin/users/create', [
            'currentUser' => [
                'id' => auth()->id(),
                'superadmin' => auth()->user()->superadmin,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'superadmin' => 'boolean',
        ]);

        // Only superadmin can set superadmin status
        $superadminStatus = false;
        if (auth()->user()->superadmin && $request->has('superadmin')) {
            $superadminStatus = $request->boolean('superadmin');
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'superadmin' => $superadminStatus,
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Admin berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response
    {
        return Inertia::render('admin/users/show', [
            'user' => $user,
            'currentUser' => [
                'id' => auth()->id(),
                'superadmin' => auth()->user()->superadmin,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        // Check if current user can edit this user
        if (! auth()->user()->superadmin && auth()->id() !== $user->id) {
            abort(403, 'Anda tidak memiliki izin untuk mengedit admin lain.');
        }

        return Inertia::render('admin/users/edit', [
            'user' => $user,
            'currentUser' => [
                'id' => auth()->id(),
                'superadmin' => auth()->user()->superadmin,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        // Check if current user can update this user
        if (! auth()->user()->superadmin && auth()->id() !== $user->id) {
            abort(403, 'Anda tidak memiliki izin untuk mengupdate admin lain.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class.',email,'.$user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        // Only superadmin can update superadmin status
        if (auth()->user()->superadmin && $request->has('superadmin')) {
            $updateData['superadmin'] = $request->boolean('superadmin');
        }

        $user->update($updateData);

        if ($request->filled('password')) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'Admin berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Only superadmin can delete users
        if (! auth()->user()->superadmin) {
            abort(403, 'Anda tidak memiliki izin untuk menghapus admin.');
        }

        // Prevent admin from deleting themselves
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'Admin berhasil dihapus.');
    }
}
