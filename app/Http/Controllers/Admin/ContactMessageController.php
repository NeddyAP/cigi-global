<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = ContactMessage::query();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        // Order by newest first
        $contactMessages = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Get message counts for stats
        $stats = [
            'total' => ContactMessage::count(),
            'unread' => ContactMessage::unread()->count(),
            'read' => ContactMessage::read()->count(),
            'archived' => ContactMessage::archived()->count(),
            'recent' => ContactMessage::recent()->count(),
        ];

        return Inertia::render('admin/contact-messages/index', [
            'contactMessages' => $contactMessages,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(ContactMessage $contactMessage): Response
    {
        // Mark as read if currently unread
        if ($contactMessage->status === 'unread') {
            $contactMessage->markAsRead();
        }

        return Inertia::render('admin/contact-messages/show', [
            'contactMessage' => $contactMessage,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ContactMessage $contactMessage): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:unread,read,archived',
        ]);

        $contactMessage->update($validated);

        // Set read_at timestamp if marking as read
        if ($validated['status'] === 'read' && $contactMessage->read_at === null) {
            $contactMessage->update(['read_at' => now()]);
        }

        // Clear read_at timestamp if marking as unread
        if ($validated['status'] === 'unread') {
            $contactMessage->update(['read_at' => null]);
        }

        return redirect()->back()
            ->with('success', 'Status pesan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->delete();

        return redirect()->route('admin.contact-messages.index')
            ->with('success', 'Pesan kontak berhasil dihapus.');
    }

    /**
     * Mark multiple messages as read.
     */
    public function markAsRead(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_messages,id',
        ]);

        ContactMessage::whereIn('id', $validated['ids'])
            ->update([
                'status' => 'read',
                'read_at' => now(),
            ]);

        return redirect()->back()
            ->with('success', 'Pesan berhasil ditandai sebagai sudah dibaca.');
    }

    /**
     * Mark multiple messages as archived.
     */
    public function markAsArchived(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_messages,id',
        ]);

        ContactMessage::whereIn('id', $validated['ids'])
            ->update(['status' => 'archived']);

        return redirect()->back()
            ->with('success', 'Pesan berhasil diarsipkan.');
    }

    /**
     * Delete multiple messages.
     */
    public function bulkDelete(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_messages,id',
        ]);

        ContactMessage::whereIn('id', $validated['ids'])->delete();

        return redirect()->back()
            ->with('success', 'Pesan berhasil dihapus.');
    }
}
