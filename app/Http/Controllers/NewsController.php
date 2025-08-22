<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(Request $request): Response
    {
        $query = News::published()
            ->with('author')
            ->orderBy('published_at', 'desc');

        // Filter by category if provided
        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $news = $query->paginate(12)->withQueryString();

        $categories = News::published()
            ->select('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('news/index', [
            'news' => $news,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function show(News $news): Response
    {
        abort_unless($news->is_published && $news->published_at <= now(), 404);

        // Increment view count
        $news->incrementViews();

        // Load author relationship
        $news->load('author');

        // Get related news (same category, exclude current)
        $relatedNews = News::published()
            ->byCategory($news->category)
            ->where('id', '!=', $news->id)
            ->with('author')
            ->orderBy('published_at', 'desc')
            ->take(4)
            ->get();

        return Inertia::render('news/show', [
            'news' => $news,
            'relatedNews' => $relatedNews,
        ]);
    }
}
