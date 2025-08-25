<?php

namespace App\Http\Middleware;

use App\Models\BusinessUnit;
use App\Models\CommunityClub;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Cache navigation data for performance (5 minutes)
        $navigationData = Cache::remember('global_navigation_data', 300, function () {
            return [
                'navBusinessUnits' => BusinessUnit::active()
                    ->ordered()
                    ->limit(6)
                    ->select('id', 'name', 'slug', 'image')
                    ->get()
                    ->map(function ($unit) {
                        return $unit->toNavigationArray();
                    }),
                'navCommunityClubs' => CommunityClub::active()
                    ->ordered()
                    ->limit(8)
                    ->select('id', 'name', 'slug', 'image', 'type')
                    ->get()
                    ->map(function ($club) {
                        return $club->toNavigationArray();
                    }),
            ];
        });

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            // Global navigation data
            ...$navigationData,
        ];
    }
}
