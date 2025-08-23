import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type ContactMessage } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Archive, CheckCheck, Eye, Mail, MailCheck, MailOpen, Phone, Search, Trash2, User } from 'lucide-react';
import { useState } from 'react';

interface ContactMessagesIndexProps {
    contactMessages: {
        data: ContactMessage[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    stats: {
        total: number;
        unread: number;
        read: number;
        archived: number;
        recent: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function ContactMessagesIndex({ contactMessages, stats, filters }: ContactMessagesIndexProps) {
    const { flash } = usePage().props as any;
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(contactMessages.data.map((message) => message.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectMessage = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
        }
    };

    const handleSearch = () => {
        router.get(
            route('admin.contact-messages.index'),
            {
                search: searchTerm,
                status: statusFilter === 'all' ? undefined : statusFilter,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleBulkAction = (action: string) => {
        if (selectedIds.length === 0) {
            alert('Silakan pilih pesan terlebih dahulu.');
            return;
        }

        const confirmMessage = {
            'mark-as-read': 'Tandai sebagai sudah dibaca?',
            'mark-as-archived': 'Arsipkan pesan yang dipilih?',
            'bulk-delete': 'Hapus pesan yang dipilih? Tindakan ini tidak dapat dibatalkan.',
        }[action];

        if (!confirm(confirmMessage)) return;

        const routeName = {
            'mark-as-read': 'admin.contact-messages.mark-as-read',
            'mark-as-archived': 'admin.contact-messages.mark-as-archived',
            'bulk-delete': 'admin.contact-messages.bulk-delete',
        }[action];

        router.post(
            route(routeName as string),
            {
                ids: selectedIds,
            },
            {
                onSuccess: () => {
                    setSelectedIds([]);
                },
            },
        );
    };

    const getStatusBadge = (message: ContactMessage) => {
        const variants = {
            unread: 'bg-blue-100 text-blue-800',
            read: 'bg-green-100 text-green-800',
            archived: 'bg-gray-100 text-gray-800',
        };

        const labels = {
            unread: 'Belum Dibaca',
            read: 'Sudah Dibaca',
            archived: 'Diarsipkan',
        };

        return <Badge className={variants[message.status]}>{labels[message.status]}</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout>
            <Head title="Pesan Kontak - Admin" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pesan Kontak</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Kelola pesan kontak dari pengunjung website</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">Total</span>
                        </div>
                        <div className="mt-1">
                            <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.total}</span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center">
                            <MailOpen className="h-5 w-5 text-blue-500" />
                            <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">Belum Dibaca</span>
                        </div>
                        <div className="mt-1">
                            <span className="text-2xl font-semibold text-blue-600">{stats.unread}</span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center">
                            <MailCheck className="h-5 w-5 text-green-500" />
                            <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">Sudah Dibaca</span>
                        </div>
                        <div className="mt-1">
                            <span className="text-2xl font-semibold text-green-600">{stats.read}</span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center">
                            <Archive className="h-5 w-5 text-gray-500" />
                            <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">Diarsipkan</span>
                        </div>
                        <div className="mt-1">
                            <span className="text-2xl font-semibold text-gray-600">{stats.archived}</span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center">
                            <CheckCheck className="h-5 w-5 text-amber-500" />
                            <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">7 Hari Terakhir</span>
                        </div>
                        <div className="mt-1">
                            <span className="text-2xl font-semibold text-amber-600">{stats.recent}</span>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {flash?.success && (
                    <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/50">
                        <div className="text-sm text-green-700 dark:text-green-300">{flash.success}</div>
                    </div>
                )}

                {/* Filters and Search */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                        <div className="flex-1">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Pencarian
                            </label>
                            <div className="relative mt-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Cari berdasarkan nama, email, subjek, atau pesan..."
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="sm:w-48">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Status
                            </label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="unread">Belum Dibaca</SelectItem>
                                    <SelectItem value="read">Sudah Dibaca</SelectItem>
                                    <SelectItem value="archived">Diarsipkan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleSearch} className="sm:w-auto">
                            <Search className="mr-2 h-4 w-4" />
                            Cari
                        </Button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedIds.length > 0 && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-amber-700 dark:text-amber-300">{selectedIds.length} pesan dipilih</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleBulkAction('mark-as-read')}>
                                    <MailCheck className="mr-2 h-4 w-4" />
                                    Tandai Dibaca
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleBulkAction('mark-as-archived')}>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Arsipkan
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleBulkAction('bulk-delete')}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="w-12 px-4 py-3">
                                        <Checkbox checked={selectedIds.length === contactMessages.data.length} onCheckedChange={handleSelectAll} />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Pengirim
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Subjek & Pesan
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Tanggal
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {contactMessages.data.map((message) => (
                                    <tr
                                        key={message.id}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-900/50 ${
                                            message.status === 'unread' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                        }`}
                                    >
                                        <td className="px-4 py-4">
                                            <Checkbox
                                                checked={selectedIds.includes(message.id)}
                                                onCheckedChange={(checked) => handleSelectMessage(message.id, checked as boolean)}
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                                        <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{message.name}</p>
                                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                        <Mail className="mr-1 h-3 w-3" />
                                                        {message.email}
                                                    </div>
                                                    {message.phone && (
                                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                            <Phone className="mr-1 h-3 w-3" />
                                                            {message.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="max-w-xs">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{message.subject}</p>
                                                <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                                                    {message.message.substring(0, 100)}
                                                    {message.message.length > 100 && '...'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">{getStatusBadge(message)}</td>
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(message.created_at)}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center space-x-2">
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={route('admin.contact-messages.show', message.id)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        if (confirm('Hapus pesan ini?')) {
                                                            router.delete(route('admin.contact-messages.destroy', message.id));
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {contactMessages.data.length === 0 && (
                        <div className="py-12 text-center">
                            <Mail className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Tidak ada pesan</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Belum ada pesan kontak yang masuk.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {contactMessages.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Menampilkan {contactMessages.from} sampai {contactMessages.to} dari {contactMessages.total} hasil
                        </div>
                        <div className="flex items-center space-x-2">
                            {contactMessages.links.map((link, index) => (
                                <Button
                                    key={index}
                                    size="sm"
                                    variant={link.active ? 'default' : 'outline'}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
