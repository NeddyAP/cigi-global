import { AdvancedFilters, type FilterField } from '@/components/ui/advanced-filters';
import { Button } from '@/components/ui/button';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, News } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Clock, Edit, Eye, Plus, Star, Trash2, Users } from 'lucide-react';

interface AdminNewsIndexProps {
    news: {
        data: News[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    categories: string[];
    filters: {
        search?: string;
        category?: string;
        status?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
        per_page?: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Berita', href: '/admin/news' },
];

export default function AdminNewsIndex({ news, categories = [], filters = {} }: AdminNewsIndexProps) {
    const handleDelete = (newsItem: News) => {
        if (confirm(`Apakah Anda yakin ingin menghapus artikel "${newsItem.title}"?`)) {
            router.delete(route('admin.news.destroy', newsItem.slug));
        }
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            bisnis: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            komunitas: 'bg-green-500/20 text-green-400 border-green-500/30',
            umum: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
            pengumuman: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            acara: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        };
        return colors[category as keyof typeof colors] || colors.umum;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const filterFields: FilterField[] = [
        {
            key: 'category',
            label: 'Kategori',
            type: 'select',
            options: [
                ...(categories || []).map((category) => ({
                    value: category,
                    label: category.charAt(0).toUpperCase() + category.slice(1),
                })),
            ],
            placeholder: 'Pilih kategori',
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'published', label: 'Dipublikasi' },
                { value: 'draft', label: 'Draft' },
                { value: 'featured', label: 'Unggulan' },
            ],
            placeholder: 'Pilih status',
        },
    ];

    const columns: ColumnDef<News>[] = [
        {
            key: 'title',
            header: 'Artikel',
            sortable: true,
            render: (newsItem: News) => (
                <div className="flex items-start">
                    {newsItem.featured_image && (
                        <div className="mr-4 h-12 w-16 flex-shrink-0">
                            <img className="h-12 w-16 rounded-lg object-cover" src={`${newsItem.featured_image}`} alt={newsItem.title} />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                            <div className="line-clamp-2 text-sm font-medium text-white">{newsItem.title}</div>
                            {newsItem.is_featured && <Star className="ml-2 h-4 w-4 flex-shrink-0 text-yellow-500" />}
                        </div>
                        {newsItem.excerpt && <div className="mt-1 line-clamp-1 text-sm text-zinc-400">{newsItem.excerpt}</div>}
                        <div className="mt-1 text-xs text-zinc-500">{newsItem.slug}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'category',
            header: 'Kategori',
            sortable: true,
            render: (newsItem: News) => (
                <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getCategoryColor(newsItem.category)}`}>
                    {newsItem.category.charAt(0).toUpperCase() + newsItem.category.slice(1)}
                </span>
            ),
        },
        {
            key: 'author',
            header: 'Penulis',
            render: (newsItem: News) => <div className="text-sm text-white">{newsItem.author?.name || 'Unknown'}</div>,
        },
        {
            key: 'is_published',
            header: 'Status',
            sortable: true,
            render: (newsItem: News) => (
                <div className="flex items-center">
                    {newsItem.is_published ? (
                        <>
                            <div className="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
                            <span className="text-sm text-green-400">Dipublikasi</span>
                        </>
                    ) : (
                        <>
                            <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-yellow-400">Draft</span>
                        </>
                    )}
                </div>
            ),
        },
        {
            key: 'published_at',
            header: 'Tanggal',
            sortable: true,
            render: (newsItem: News) => (
                <div className="text-sm text-zinc-300">
                    {newsItem.published_at ? formatDate(newsItem.published_at) : formatDate(newsItem.created_at)}
                </div>
            ),
        },
        {
            key: 'views_count',
            header: 'Views',
            className: 'text-center',
            render: (newsItem: News) => (
                <div className="flex items-center justify-center text-sm text-zinc-400">
                    <Users className="mr-1 h-4 w-4" />
                    {newsItem.views_count || 0}
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            className: 'text-right',
            render: (newsItem: News) => (
                <div className="flex items-center justify-end space-x-2">
                    <Link
                        href={route('admin.news.show', newsItem.slug)}
                        className="text-blue-400 transition-colors hover:text-blue-300"
                        title="Lihat Detail"
                    >
                        <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                        href={route('admin.news.edit', newsItem.slug)}
                        className="text-amber-400 transition-colors hover:text-amber-300"
                        title="Edit"
                    >
                        <Edit className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleDelete(newsItem)} className="text-red-400 transition-colors hover:text-red-300" title="Hapus">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    const emptyState = (
        <div className="py-12 text-center">
            <div className="mb-4 text-zinc-400">Belum ada berita yang terdaftar.</div>
            <Link href={route('admin.news.create')}>
                <Button className="cta-button">
                    <Plus className="mr-2 h-4 w-4" />
                    Tulis Berita Pertama
                </Button>
            </Link>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Berita" />

            {/* Hero Section */}
            <div className="relative mb-8 overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-900/20 p-6 md:p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                            <span className="text-amber-400">Kelola</span> Berita
                        </h1>
                        <p className="text-lg text-zinc-300">
                            Manajemen artikel dan berita CIGI Global dengan sistem pencarian dan filter yang canggih
                        </p>
                    </div>
                    <Link href={route('admin.news.create')}>
                        <Button className="cta-button">
                            <Plus className="mr-2 h-4 w-4" />
                            Tulis Berita
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="mb-6">
                <AdvancedFilters filters={filters} fields={filterFields} routeName="admin.news.index" searchPlaceholder="Cari berita..." />
            </div>

            {/* Data Table */}
            <DataTable
                data={news?.data || []}
                columns={columns}
                pagination={
                    news && {
                        current_page: news.current_page,
                        last_page: news.last_page,
                        per_page: news.per_page,
                        total: news.total,
                        from: news.from,
                        to: news.to,
                        links: news.links,
                    }
                }
                filters={filters}
                searchPlaceholder="Cari berita..."
                emptyState={emptyState}
                routeName="admin.news.index"
            />
        </AppLayout>
    );
}
