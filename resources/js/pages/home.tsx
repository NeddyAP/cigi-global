import type { BusinessUnit, CommunityClub, GlobalVars, News } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface HomeProps {
    businessUnits: BusinessUnit[];
    communityClubs: CommunityClub[];
    featuredNews: News[];
    latestNews: News[];
    globalVars: GlobalVars;
}

export default function Home({ businessUnits, communityClubs, featuredNews, globalVars }: HomeProps) {
    return (
        <>
            <Head title="Beranda - Cigi Global" />

            <div className="min-h-screen bg-white dark:bg-gray-900">
                {/* Navigation */}
                <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex shrink-0 items-center">
                                    <img className="h-8 w-auto" src="/logo.svg" alt="Cigi Global" />
                                    <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                                        {globalVars.company_name || 'Cigi Global'}
                                    </span>
                                </div>
                                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                    <Link
                                        href={route('home')}
                                        className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Beranda
                                    </Link>
                                    <Link
                                        href={route('business-units.index')}
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                                    >
                                        Unit Bisnis
                                    </Link>
                                    <Link
                                        href={route('community-clubs.index')}
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                                    >
                                        Komunitas
                                    </Link>
                                    <Link
                                        href={route('news.index')}
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                                    >
                                        Berita
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                <Link
                                    href={route('admin.dashboard')}
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600">
                    <div className="absolute inset-0">
                        <img className="h-full w-full object-cover" src="/assets/cigi-global.jpg" alt="Cigi Global" />
                        <div className="absolute inset-0 bg-indigo-600 opacity-80 mix-blend-multiply" />
                    </div>
                    <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            {globalVars.company_name || 'Cigi Global'}
                        </h1>
                        <p className="mt-6 max-w-3xl text-xl text-indigo-100">{globalVars.company_tagline || 'Membangun Masa Depan Bersama'}</p>
                        <p className="mt-4 max-w-3xl text-lg text-indigo-200">{globalVars.company_description}</p>
                        <div className="mt-10 flex gap-4">
                            <Link
                                href={route('business-units.index')}
                                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50"
                            >
                                Lihat Unit Bisnis
                            </Link>
                            <Link
                                href={route('community-clubs.index')}
                                className="rounded-md border border-white px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-indigo-600"
                            >
                                Bergabung Komunitas
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Business Units Section */}
                <div className="bg-gray-50 py-16 dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Unit Bisnis Kami</h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                                Melayani berbagai kebutuhan masyarakat dengan kualitas terbaik
                            </p>
                        </div>

                        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {businessUnits.map((unit) => (
                                <Link
                                    key={unit.id}
                                    href={route('business-units.show', unit.slug)}
                                    className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-105 dark:bg-gray-700"
                                >
                                    <div className="aspect-h-9 aspect-w-16">
                                        <img className="h-48 w-full object-cover" src={`/${unit.image}`} alt={unit.name} />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{unit.name}</h3>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{unit.description?.substring(0, 100)}...</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-10 text-center">
                            <Link
                                href={route('business-units.index')}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                            >
                                Lihat Semua Unit Bisnis
                                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Community Clubs Section */}
                <div className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Komunitas Kami</h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                                Bergabunglah dengan komunitas yang sesuai dengan minat dan hobi Anda
                            </p>
                        </div>

                        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {communityClubs.map((club) => (
                                <Link
                                    key={club.id}
                                    href={route('community-clubs.show', club.slug)}
                                    className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-105 dark:bg-gray-700"
                                >
                                    <div className="aspect-h-9 aspect-w-16">
                                        <img className="h-48 w-full object-cover" src={`/${club.image}`} alt={club.name} />
                                    </div>
                                    <div className="p-6">
                                        <span className="inline-block rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-800">
                                            {club.type}
                                        </span>
                                        <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{club.name}</h3>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{club.description?.substring(0, 100)}...</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-10 text-center">
                            <Link
                                href={route('community-clubs.index')}
                                className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
                            >
                                Lihat Semua Komunitas
                                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Featured News Section */}
                {featuredNews.length > 0 && (
                    <div className="bg-gray-50 py-16 dark:bg-gray-800">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Berita Terkini</h2>
                                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Ikuti perkembangan terbaru dari Cigi Global</p>
                            </div>

                            <div className="mt-12 grid gap-8 lg:grid-cols-3">
                                {featuredNews.map((news) => (
                                    <Link
                                        key={news.id}
                                        href={route('news.show', news.slug)}
                                        className="group overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-105 dark:bg-gray-700"
                                    >
                                        {news.featured_image && (
                                            <div className="aspect-h-9 aspect-w-16">
                                                <img className="h-48 w-full object-cover" src={`/${news.featured_image}`} alt={news.title} />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                                                {news.category}
                                            </span>
                                            <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{news.title}</h3>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{news.excerpt}</p>
                                            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <span>{news.author?.name}</span>
                                                <span className="mx-2">•</span>
                                                <time>{new Date(news.published_at).toLocaleDateString('id-ID')}</time>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-10 text-center">
                                <Link
                                    href={route('news.index')}
                                    className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                                >
                                    Lihat Semua Berita
                                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Section */}
                <div className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Hubungi Kami</h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Kami siap melayani dan bekerja sama dengan Anda</p>
                        </div>

                        <div className="mt-12 grid gap-8 lg:grid-cols-3">
                            <div className="text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Telepon</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">{globalVars.contact_phone}</p>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">WhatsApp</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">{globalVars.contact_whatsapp}</p>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Email</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">{globalVars.contact_email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-900">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <img className="mx-auto h-8 w-auto" src="/logo.svg" alt="Cigi Global" />
                            <p className="mt-4 text-sm text-gray-300">
                                © 2024 {globalVars.company_name || 'Cigi Global'}. Semua hak cipta dilindungi.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
