import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type ContactMessage } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Archive, ArrowLeft, Calendar, Globe, Mail, MailCheck, MailOpen, Phone, Trash2, User } from 'lucide-react';
import { useState } from 'react';

interface ContactMessageShowProps {
    contactMessage: ContactMessage;
}

export default function ContactMessageShow({ contactMessage }: ContactMessageShowProps) {
    const { flash } = usePage().props as any;
    const [status, setStatus] = useState(contactMessage.status);

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        router.patch(
            route('admin.contact-messages.update', contactMessage.id),
            {
                status: newStatus,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleDelete = () => {
        if (confirm('Hapus pesan ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(route('admin.contact-messages.destroy', contactMessage.id));
        }
    };

    const getStatusBadge = (messageStatus: string) => {
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

        return <Badge className={variants[messageStatus as keyof typeof variants]}>{labels[messageStatus as keyof typeof labels]}</Badge>;
    };

    const getStatusIcon = (messageStatus: string) => {
        const icons = {
            unread: MailOpen,
            read: MailCheck,
            archived: Archive,
        };

        const Icon = icons[messageStatus as keyof typeof icons];
        return Icon ? <Icon className="h-4 w-4" /> : null;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout>
            <Head title={`Pesan dari ${contactMessage.name} - Admin`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.contact-messages.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Detail Pesan Kontak</h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Pesan dari {contactMessage.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                {/* Success Message */}
                {flash?.success && (
                    <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/50">
                        <div className="text-sm text-green-700 dark:text-green-300">{flash.success}</div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Message Content */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    {getStatusIcon(status)}
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{contactMessage.subject}</h2>
                                </div>
                                {getStatusBadge(status)}
                            </div>

                            <div className="prose dark:prose-invert max-w-none">
                                <div className="leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">{contactMessage.message}</div>
                            </div>
                        </div>

                        {/* Technical Information */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Informasi Teknis</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {contactMessage.ip_address && (
                                    <div className="flex items-center space-x-3">
                                        <Globe className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">IP Address</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{contactMessage.ip_address}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Kirim</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(contactMessage.created_at)}</p>
                                    </div>
                                </div>

                                {contactMessage.read_at && (
                                    <div className="flex items-center space-x-3">
                                        <MailCheck className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dibaca Pada</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(contactMessage.read_at)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {contactMessage.user_agent && (
                                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                                    <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">User Agent</p>
                                    <p className="font-mono text-xs break-all text-gray-500 dark:text-gray-400">{contactMessage.user_agent}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Sender Information */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Informasi Pengirim</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                            <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{contactMessage.name}</p>
                                        <div className="mt-2 space-y-2">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <Mail className="mr-2 h-4 w-4" />
                                                <a href={`mailto:${contactMessage.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                                    {contactMessage.email}
                                                </a>
                                            </div>
                                            {contactMessage.phone && (
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <Phone className="mr-2 h-4 w-4" />
                                                    <a href={`tel:${contactMessage.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                                        {contactMessage.phone}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Management */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Kelola Status</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Status Pesan</label>
                                    <Select value={status} onValueChange={handleStatusChange}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unread">Belum Dibaca</SelectItem>
                                            <SelectItem value="read">Sudah Dibaca</SelectItem>
                                            <SelectItem value="archived">Diarsipkan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Ubah status pesan untuk mengelola workflow penanganan pesan kontak.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Aksi Cepat</h3>
                            <div className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <a href={`mailto:${contactMessage.email}?subject=Re: ${contactMessage.subject}`}>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Balas via Email
                                    </a>
                                </Button>

                                {contactMessage.phone && (
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <a href={`tel:${contactMessage.phone}`}>
                                            <Phone className="mr-2 h-4 w-4" />
                                            Telepon
                                        </a>
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => handleStatusChange('archived')}
                                    disabled={status === 'archived'}
                                >
                                    <Archive className="mr-2 h-4 w-4" />
                                    Arsipkan Pesan
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
