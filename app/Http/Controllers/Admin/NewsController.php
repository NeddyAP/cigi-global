<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Traits\FlashMessages;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    use FlashMessages;

    public function index(Request $request): Response
    {
        $query = News::with('author');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Apply category filter
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Apply status filter
        if ($request->filled('status')) {
            $status = $request->status;
            if ($status === 'published') {
                $query->where('is_published', true);
            } elseif ($status === 'draft') {
                $query->where('is_published', false);
            } elseif ($status === 'featured') {
                $query->where('is_featured', true);
            }
        }

        // Apply sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate
        $perPage = $request->get('per_page', 15);
        $news = $query->paginate($perPage)->withQueryString();

        // Get categories for filter dropdown
        $categories = News::select('category')
            ->distinct()
            ->pluck('category')
            ->toArray();

        return Inertia::render('admin/news/index', [
            'news' => $news,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'status', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/news/create', [
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:news',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'featured_image' => 'nullable|string|max:255',
            'category' => 'required|string|max:255',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'author_id' => 'required|exists:users,id',
            'tags' => 'nullable|string',
        ]);

        // Convert tags string to array
        if ($validated['tags']) {
            $validated['tags'] = array_map('trim', explode(',', $validated['tags']));
        }

        // Set published_at if publishing
        if ($validated['is_published'] && ! $validated['published_at']) {
            $validated['published_at'] = now();
        }

        News::create($validated);

        return $this->success('Artikel berhasil disimpan.', 'admin.news.index');
    }

    public function show(News $news): Response
    {
        $news->load('author');

        return Inertia::render('admin/news/show', [
            'news' => $news,
        ]);
    }

    public function edit(News $news): Response
    {
        $news->load('author');

        // Convert tags array to string for editing
        $news->tags_string = $news->tags ? implode(', ', $news->tags) : '';

        return Inertia::render('admin/news/edit', [
            'news' => $news,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    public function update(Request $request, News $news): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:news,slug,'.$news->id,
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'featured_image' => 'nullable|string|max:255',
            'category' => 'required|string|max:255',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'tags' => 'nullable|string',
        ]);

        // Convert tags string to array
        if ($validated['tags']) {
            $validated['tags'] = array_map('trim', explode(',', $validated['tags']));
        }

        // Set published_at if publishing for the first time
        if ($validated['is_published'] && ! $news->is_published && ! $validated['published_at']) {
            $validated['published_at'] = now();
        }

        $news->update($validated);

        return $this->success('Artikel berhasil diperbarui.', 'admin.news.index');
    }

    public function destroy(News $news): RedirectResponse
    {
        $news->delete();

        return $this->success('Artikel berhasil dihapus.', 'admin.news.index');
    }
}
