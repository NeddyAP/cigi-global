import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public-layout';
import { type News } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, Eye, Search, Tag, User } from 'lucide-react';
import { useState } from 'react';

interface NewsIndexProps {
    news: {
        data: News[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: string[];
    filters: {
        category?: string;
        search?: string;
    };
}

export default function NewsIndex({ news, categories, filters }: NewsIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');

    const handleSearch = () => {
        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;

        router.get(route('news.index'), params, { preserveState: true });
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        if (category && category !== 'all') params.category = category;

        router.get(route('news.index'), params, { preserveState: true });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        router.get(route('news.index'));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getCategoryLabel = (category: string) => {
        const categoryMap: Record<string, string> = {
            umum: 'Umum',
            bisnis: 'Bisnis',
            teknologi: 'Teknologi',
            komunitas: 'Komunitas',
        };
        return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
    };

    return (
        <PublicLayout
            title="Berita"
            description="Baca berita terbaru dan artikel terkini dari CIGI Global tentang bisnis, teknologi, dan perkembangan komunitas."
        >
            <Head title="Berita" />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="glass-hero-overlay absolute inset-0"></div>
                <div className="relative container mx-auto px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="mb-6 text-4xl font-bold text-white text-shadow-lg md:text-6xl">Berita & Artikel</h1>
                    <p className="text-shadow mx-auto mb-8 max-w-3xl text-xl text-white/90 md:text-2xl">
                        Tetap terhubung dengan berita terbaru, insight bisnis, dan perkembangan teknologi dari CIGI Global.
                    </p>

                    {/* Search and Filter Bar */}
                    <div className="mx-auto max-w-4xl">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Cari berita..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="glass-card border-white/30 pl-10 text-white placeholder:text-white/60"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                                    <SelectTrigger className="w-40 glass-card border-white/30 text-white">
                                        <SelectValue placeholder="Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kategori</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {getCategoryLabel(category)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleSearch} className="glass-button px-6">
                                    Cari
                                </Button>
                            </div>
                        </div>
                        {(filters.search || filters.category) && (
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <span className="text-sm text-white/70">Filter aktif:</span>
                                {filters.search && (
                                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm text-white">Pencarian: "{filters.search}"</span>
                                )}
                                {filters.category && (
                                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm text-white">
                                        Kategori: {getCategoryLabel(filters.category)}
                                    </span>
                                )}
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-white/70 hover:text-white">
                                    Hapus Filter
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Results Count */}
                    <div className="mb-8">
                        <p className="text-white/80">
                            Menampilkan {news.data.length} dari {news.total} berita
                            {news.current_page > 1 && ` (Halaman ${news.current_page} dari ${news.last_page})`}
                        </p>
                    </div>

                    {/* News Grid */}
                    {news.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {news.data.map((article) => (
                                    <article key={article.id} className="group glass-card-hover">
                                        {/* Featured Image */}
                                        {article.featured_image && (
                                            <div className="relative h-48 overflow-hidden rounded-t-xl">
                                                <img
                                                    src={article.featured_image}
                                                    alt={article.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                                                {/* Category Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <span className="inline-flex items-center rounded-full bg-amber-500/90 px-3 py-1 text-xs font-medium text-black">
                                                        <Tag className="mr-1 h-3 w-3" />
                                                        {getCategoryLabel(article.category)}
                                                    </span>
                                                </div>

                                                {/* Featured Badge */}
                                                {article.is_featured && (
                                                    <div className="absolute top-3 right-3">
                                                        <span className="inline-flex items-center rounded-full bg-red-500/90 px-3 py-1 text-xs font-medium text-white">
                                                            ⭐ Unggulan
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="p-6">
                                            <h3 className="mb-3 line-clamp-2 text-xl font-bold text-white transition-colors group-hover:text-amber-400">
                                                <Link href={route('news.show', article.slug)}>{article.title}</Link>
                                            </h3>

                                            {article.excerpt && <p className="mb-4 line-clamp-3 text-sm text-white/80">{article.excerpt}</p>}

                                            {/* Meta Information */}
                                            <div className="mb-4 space-y-2 text-xs text-white/60">
                                                <div className="flex items-center">
                                                    <Calendar className="mr-2 h-3 w-3" />
                                                    <span>{formatDate(article.published_at)}</span>
                                                </div>
                                                {article.author && (
                                                    <div className="flex items-center">
                                                        <User className="mr-2 h-3 w-3" />
                                                        <span>{article.author.name}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center">
                                                    <Eye className="mr-2 h-3 w-3" />
                                                    <span>{article.views_count.toLocaleString()} views</span>
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            {article.tags && article.tags.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {article.tags.slice(0, 3).map((tag) => (
                                                            <span key={tag} className="rounded-md bg-white/10 px-2 py-1 text-xs text-white/70">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                        {article.tags.length > 3 && (
                                                            <span className="rounded-md bg-white/10 px-2 py-1 text-xs text-white/70">
                                                                +{article.tags.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Read More Button */}
                                            <Link
                                                href={route('news.show', article.slug)}
                                                className="inline-flex w-full items-center justify-center glass-button rounded-lg px-4 py-2 font-medium text-white transition-all duration-200 hover:scale-105"
                                            >
                                                Baca Selengkapnya
                                                <Clock className="ml-2 h-4 w-4" />
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination */}
                            {news.last_page > 1 && (
                                <div className="mt-12 flex justify-center">
                                    <nav className="flex items-center space-x-2">
                                        {news.links.map((link, index) => {
                                            if (!link.url) {
                                                return (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-2 text-sm text-white/50"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-2 text-sm transition-colors ${
                                                        link.active
                                                            ? 'glass-button font-semibold text-white'
                                                            : 'rounded text-white/70 hover:bg-white/10 hover:text-white'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-16 text-center">
                            <div className="mx-auto max-w-md glass-card rounded-xl p-8">
                                <Search className="mx-auto mb-4 h-16 w-16 text-white/50" />
                                <h3 className="mb-2 text-xl font-semibold text-white">Tidak ditemukan berita</h3>
                                <p className="mb-4 text-white/70">
                                    {filters.search || filters.category
                                        ? 'Tidak ada berita yang sesuai dengan pencarian Anda.'
                                        : 'Belum ada berita yang dipublikasikan.'}
                                </p>
                                {(filters.search || filters.category) && (
                                    <Button variant="ghost" onClick={clearFilters} className="text-white hover:bg-white/10">
                                        Reset Pencarian
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
