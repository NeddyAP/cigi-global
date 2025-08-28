import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Building2, Eye, FileText, Globe2, MessageSquare, Newspaper, Plus, Settings, Shield, Users, Zap } from 'lucide-react';

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
            {/* Hero Section */}
            <div className="relative mb-12 overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-900/20 p-8 md:p-12">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent"></div>
                <div className="relative z-10">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-600/20 px-4 py-2">
                        <Shield className="h-5 w-5 text-amber-400" />
                        <span className="text-sm font-medium text-amber-400">Panel Admin - CIGI Global</span>
                    </div>

                    <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                        <span className="block text-amber-400">Dashboard</span>
                        <span className="block text-white">Kontrol Admin</span>
                    </h1>

                    <p className="max-w-2xl text-lg leading-relaxed text-zinc-300">
                        Kelola seluruh konten website dan pengaturan sistem dengan mudah.
                        <span className="font-semibold text-amber-400">Panel kontrol lengkap</span> untuk administrasi CIGI Global.
                    </p>
                </div>
            </div>

            {/* Main Management Modules */}
            <div className="mb-12">
                <h2 className="mb-8 text-2xl font-bold text-white">Modul Utama</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Link href={route('admin.business-units.index')} className="section-card group">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                            <Building2 className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-white group-hover:text-amber-400">Unit Bisnis</h3>
                        <p className="text-zinc-300">Kelola dan organisasi unit bisnis perusahaan</p>
                        <div className="mt-4 flex items-center text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="text-sm font-semibold">Kelola →</span>
                        </div>
                    </Link>

                    <Link href={route('admin.community-clubs.index')} className="section-card group">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                            <Users className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-white group-hover:text-amber-400">Komunitas</h3>
                        <p className="text-zinc-300">Atur komunitas dan klub yang terdaftar</p>
                        <div className="mt-4 flex items-center text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="text-sm font-semibold">Kelola →</span>
                        </div>
                    </Link>

                    <Link href={route('admin.news.index')} className="section-card group">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20">
                            <Newspaper className="h-8 w-8 text-purple-400" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-white group-hover:text-amber-400">Berita & Media</h3>
                        <p className="text-zinc-300">Publikasi berita dan konten media</p>
                        <div className="mt-4 flex items-center text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="text-sm font-semibold">Kelola →</span>
                        </div>
                    </Link>

                    <Link href={route('admin.global-variables.index')} className="section-card group">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20">
                            <Settings className="h-8 w-8 text-orange-400" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-white group-hover:text-amber-400">Konfigurasi</h3>
                        <p className="text-zinc-300">Pengaturan sistem dan variabel global</p>
                        <div className="mt-4 flex items-center text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="text-sm font-semibold">Kelola →</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-12">
                <h2 className="mb-8 text-2xl font-bold text-white">Aksi Cepat</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Link href={route('admin.business-units.create')} className="section-card group text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 transition-all group-hover:scale-110">
                            <Plus className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-white group-hover:text-amber-400">Tambah Unit Bisnis</h3>
                        <p className="text-zinc-300">Buat unit bisnis baru untuk perusahaan</p>
                    </Link>

                    <Link href={route('admin.community-clubs.create')} className="section-card group text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 transition-all group-hover:scale-110">
                            <Plus className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-white group-hover:text-amber-400">Tambah Komunitas</h3>
                        <p className="text-zinc-300">Daftarkan komunitas atau klub baru</p>
                    </Link>

                    <Link href={route('admin.news.create')} className="section-card group text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 transition-all group-hover:scale-110">
                            <Plus className="h-8 w-8 text-purple-400" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-white group-hover:text-amber-400">Tulis Berita</h3>
                        <p className="text-zinc-300">Publikasikan artikel dan berita terbaru</p>
                    </Link>
                </div>
            </div>

            {/* System Overview */}
            <div className="mb-12">
                <h2 className="mb-8 text-2xl font-bold text-white">Ringkasan Sistem</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="contact-card text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                            <BarChart3 className="h-6 w-6 text-amber-400" />
                        </div>
                        <h4 className="mb-2 text-lg font-bold text-white">Analitik</h4>
                        <p className="text-sm text-zinc-300">Monitor performa website</p>
                    </div>

                    <div className="contact-card text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                            <FileText className="h-6 w-6 text-emerald-400" />
                        </div>
                        <h4 className="mb-2 text-lg font-bold text-white">Konten</h4>
                        <p className="text-sm text-zinc-300">Kelola semua konten</p>
                    </div>

                    <div className="contact-card text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                            <MessageSquare className="h-6 w-6 text-blue-400" />
                        </div>
                        <h4 className="mb-2 text-lg font-bold text-white">Pesan</h4>
                        <p className="text-sm text-zinc-300">Pesan dari pengunjung</p>
                    </div>

                    <div className="contact-card text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20">
                            <Zap className="h-6 w-6 text-violet-400" />
                        </div>
                        <h4 className="mb-2 text-lg font-bold text-white">Performa</h4>
                        <p className="text-sm text-zinc-300">Status sistem real-time</p>
                    </div>
                </div>
            </div>

            {/* Public Website Access */}
            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-amber-600/10 p-8 text-center md:p-12">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20">
                    <Globe2 className="h-10 w-10 text-amber-400" />
                </div>
                <h3 className="mb-4 text-3xl font-bold text-white">Preview Website Public</h3>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-300">
                    Lihat bagaimana website CIGI Global tampil untuk pengunjung. Pastikan semua konten dan fitur berfungsi dengan baik.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Link href={route('home')} className="cta-button">
                        <Eye className="mr-2 h-5 w-5" />
                        Lihat Website Public
                    </Link>
                    <Link href={route('news.index')} className="cta-button-outline">
                        <Newspaper className="mr-2 h-5 w-5" />
                        Halaman Berita
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
