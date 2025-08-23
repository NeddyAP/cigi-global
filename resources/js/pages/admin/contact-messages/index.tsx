import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { ContactMessage } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Archive, Eye, Inbox, Mail, MailCheck, MailOpen, Phone, Search, Send, Shield, Trash2, User } from 'lucide-react';
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
    const { flash } = usePage().props as { flash?: { success?: string } };
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
            unread: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
            read: 'bg-green-500/20 text-green-400 border border-green-500/30',
            archived: 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30',
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

            {/* Hero Section */}
            <div className="relative mb-8 overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-900/20 p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent"></div>
                <div className="relative z-10">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-600/20 px-4 py-2">
                        <Shield className="h-5 w-5 text-amber-400" />
                        <span className="text-sm font-medium text-amber-400">Inbox - CIGI Global</span>
                    </div>

                    <h1 className="mb-4 text-4xl font-bold">
                        <span className="block text-amber-400">Contact</span>
                        <span className="block text-white">Messages</span>
                    </h1>

                    <p className="max-w-2xl text-lg leading-relaxed text-zinc-300">
                        Kelola dan balas pesan kontak dari pengunjung website.
                        <span className="font-semibold text-amber-400"> Inbox terintegrasi</span> untuk komunikasi yang efektif.
                    </p>
                </div>
            </div>

            {/* Success Message */}
            {flash?.success && (
                <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
                    <div className="text-sm font-medium text-green-400">{flash.success}</div>
                </div>
            )}

            {/* Email Layout Container */}
            <div className="flex h-[800px] gap-6">
                {/* Left Sidebar - Email Navigation */}
                <div className="w-80 space-y-6">
                    {/* Quick Stats */}
                    <div className="section-card">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                                <Mail className="h-6 w-6 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Inbox Stats</h3>
                                <p className="text-sm text-zinc-400">Message overview</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg bg-zinc-800/50 p-3">
                                <div className="flex items-center gap-3">
                                    <Inbox className="h-4 w-4 text-blue-400" />
                                    <span className="text-sm text-zinc-300">Total Messages</span>
                                </div>
                                <span className="font-semibold text-white">{stats.total}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-zinc-800/50 p-3">
                                <div className="flex items-center gap-3">
                                    <MailOpen className="h-4 w-4 text-orange-400" />
                                    <span className="text-sm text-zinc-300">Unread</span>
                                </div>
                                <span className="font-semibold text-orange-400">{stats.unread}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-zinc-800/50 p-3">
                                <div className="flex items-center gap-3">
                                    <MailCheck className="h-4 w-4 text-green-400" />
                                    <span className="text-sm text-zinc-300">Read</span>
                                </div>
                                <span className="font-semibold text-green-400">{stats.read}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-zinc-800/50 p-3">
                                <div className="flex items-center gap-3">
                                    <Archive className="h-4 w-4 text-zinc-400" />
                                    <span className="text-sm text-zinc-300">Archived</span>
                                </div>
                                <span className="font-semibold text-zinc-400">{stats.archived}</span>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="section-card">
                        <h3 className="mb-4 text-lg font-bold text-white">Filters & Search</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-300">Search Messages</label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                    <Input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="Search by name, email, subject..."
                                        className="border-zinc-600 bg-zinc-800/50 pl-10 text-zinc-100 placeholder-zinc-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-300">Message Status</label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="border-zinc-600 bg-zinc-800/50 text-zinc-100">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Messages</SelectItem>
                                        <SelectItem value="unread">Unread Only</SelectItem>
                                        <SelectItem value="read">Read Only</SelectItem>
                                        <SelectItem value="archived">Archived Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleSearch} className="w-full bg-amber-600 hover:bg-amber-700">
                                <Search className="mr-2 h-4 w-4" />
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content - Email List */}
                <div className="flex-1 space-y-6">
                    {/* Bulk Actions */}
                    {selectedIds.length > 0 && (
                        <div className="section-card border-amber-500/20 bg-amber-500/10">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-amber-400">{selectedIds.length} messages selected</span>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleBulkAction('mark-as-read')}
                                        className="border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                    >
                                        <MailCheck className="mr-2 h-4 w-4" />
                                        Mark Read
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleBulkAction('mark-as-archived')}
                                        className="border-zinc-500/30 bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20"
                                    >
                                        <Archive className="mr-2 h-4 w-4" />
                                        Archive
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleBulkAction('bulk-delete')}
                                        className="border-red-500/30 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Email List Header */}
                    <div className="section-card">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Checkbox checked={selectedIds.length === contactMessages.data.length} onCheckedChange={handleSelectAll} />
                                <h3 className="text-lg font-bold text-white">Inbox Messages</h3>
                                <Badge className="border border-amber-500/30 bg-amber-500/20 text-amber-400">{contactMessages.total} total</Badge>
                            </div>
                        </div>

                        {/* Message List */}
                        <div className="space-y-1">
                            {contactMessages.data.map((message) => (
                                <div
                                    key={message.id}
                                    className={`group flex items-start gap-4 rounded-lg border p-4 transition-all duration-200 hover:border-amber-500/30 hover:bg-zinc-800/30 ${
                                        message.status === 'unread' ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-700 bg-zinc-800/20'
                                    }`}
                                >
                                    <Checkbox
                                        checked={selectedIds.includes(message.id)}
                                        onCheckedChange={(checked) => handleSelectMessage(message.id, checked as boolean)}
                                    />

                                    <div className="flex-shrink-0">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                                message.status === 'unread' ? 'bg-amber-500/20' : 'bg-zinc-600/50'
                                            }`}
                                        >
                                            <User className={`h-6 w-6 ${message.status === 'unread' ? 'text-amber-400' : 'text-zinc-400'}`} />
                                        </div>
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className={`font-semibold ${message.status === 'unread' ? 'text-white' : 'text-zinc-300'}`}>
                                                    {message.name}
                                                </h4>
                                                <div className="flex items-center gap-3 text-sm text-zinc-400">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {message.email}
                                                    </div>
                                                    {message.phone && (
                                                        <div className="flex items-center gap-1">
                                                            <Phone className="h-3 w-3" />
                                                            {message.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(message)}
                                                <span className="text-xs text-zinc-500">{formatDate(message.created_at)}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <p
                                                className={`mb-1 text-sm font-medium ${
                                                    message.status === 'unread' ? 'text-amber-400' : 'text-zinc-400'
                                                }`}
                                            >
                                                {message.subject}
                                            </p>
                                            <p className="line-clamp-2 text-sm text-zinc-500">
                                                {message.message.substring(0, 150)}
                                                {message.message.length > 150 && '...'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                asChild
                                                className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                            >
                                                <Link href={route('admin.contact-messages.show', message.id)}>
                                                    <Eye className="mr-2 h-3 w-3" />
                                                    View
                                                </Link>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                                onClick={() => {
                                                    window.open(`mailto:${message.email}?subject=Re: ${message.subject}`);
                                                }}
                                            >
                                                <Send className="mr-2 h-3 w-3" />
                                                Reply
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                                onClick={() => {
                                                    if (confirm('Delete this message?')) {
                                                        router.delete(route('admin.contact-messages.destroy', message.id));
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {contactMessages.data.length === 0 && (
                            <div className="py-16 text-center">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800/50">
                                    <Mail className="h-10 w-10 text-zinc-500" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-white">No Messages</h3>
                                <p className="text-zinc-400">Your inbox is empty. New contact messages will appear here.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {contactMessages.last_page > 1 && (
                        <div className="section-card">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-zinc-400">
                                    Showing {contactMessages.from} to {contactMessages.to} of {contactMessages.total} messages
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
                                            className={link.active ? 'bg-amber-600 hover:bg-amber-700' : ''}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
