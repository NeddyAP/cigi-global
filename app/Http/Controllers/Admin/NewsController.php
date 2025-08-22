<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(): Response
    {
        $news = News::with('author')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('admin/news/index', [
            'news' => $news,
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
        if ($validated['is_published'] && !$validated['published_at']) {
            $validated['published_at'] = now();
        }

        News::create($validated);

        return redirect()->route('admin.news.index')
            ->with('success', 'Artikel berhasil disimpan.');
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
            'slug' => 'nullable|string|max:255|unique:news,slug,' . $news->id,
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
        if ($validated['is_published'] && !$news->is_published && !$validated['published_at']) {
            $validated['published_at'] = now();
        }

        $news->update($validated);

        return redirect()->route('admin.news.index')
            ->with('success', 'Artikel berhasil diperbarui.');
    }

    public function destroy(News $news): RedirectResponse
    {
        $news->delete();

        return redirect()->route('admin.news.index')
            ->with('success', 'Artikel berhasil dihapus.');
    }
}
