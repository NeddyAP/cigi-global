import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Building2, Eye, Newspaper, Plus, Settings, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard Admin Cigi Global</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Kelola konten website dan pengaturan sistem</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href={route('admin.business-units.index')}
                        className="block rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg dark:bg-gray-800"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Building2 className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Unit Bisnis</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Kelola unit bisnis</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href={route('admin.community-clubs.index')}
                        className="block rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg dark:bg-gray-800"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Komunitas</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Kelola komunitas</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href={route('admin.news.index')}
                        className="block rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg dark:bg-gray-800"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Newspaper className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Berita</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Kelola berita</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href={route('admin.global-variables.index')}
                        className="block rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg dark:bg-gray-800"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Settings className="h-8 w-8 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pengaturan</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Variabel global</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Quick Add Actions */}
                <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aksi Cepat</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Link
                                href={route('admin.business-units.create')}
                                className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <Plus className="mr-3 h-5 w-5 text-blue-600" />
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Tambah Unit Bisnis</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Buat unit bisnis baru</p>
                                </div>
                            </Link>

                            <Link
                                href={route('admin.community-clubs.create')}
                                className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <Plus className="mr-3 h-5 w-5 text-green-600" />
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Tambah Komunitas</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Buat komunitas baru</p>
                                </div>
                            </Link>

                            <Link
                                href={route('admin.news.create')}
                                className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <Plus className="mr-3 h-5 w-5 text-purple-600" />
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Tulis Berita</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Publikasikan berita</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Website Link */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">Lihat Website Public</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-200">Kunjungi halaman depan website Cigi Global</p>
                        </div>
                        <Link
                            href={route('home')}
                            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Website
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
