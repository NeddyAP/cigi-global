import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type ContactMessage } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Archive, ArrowLeft, Calendar, Globe, Mail, MailCheck, MailOpen, Phone, Reply, Shield, Trash2, User } from 'lucide-react';
import { useState } from 'react';

interface ContactMessageShowProps {
    contactMessage: ContactMessage;
}

export default function ContactMessageShow({ contactMessage }: ContactMessageShowProps) {
    const { flash } = usePage().props as { flash?: { success?: string } };
    const [status, setStatus] = useState(contactMessage.status);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleStatusChange = (newStatus: string) => {
        const typedStatus = newStatus as 'unread' | 'read' | 'archived';
        setStatus(typedStatus);
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
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        router.delete(route('admin.contact-messages.destroy', contactMessage.id), {
            onSuccess: () => {
                setShowDeleteDialog(false);
            },
        });
    };

    const getStatusBadge = (messageStatus: string) => {
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

            {/* Email Header */}
            <div className="relative mb-8 overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-900/20 p-6">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent"></div>
                <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="border-amber-500/30 bg-amber-600/10 text-amber-400 hover:bg-amber-600/20"
                            >
                                <Link href={route('admin.contact-messages.index')}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali ke Kotak Masuk
                                </Link>
                            </Button>
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-600/20 px-4 py-2">
                                <Shield className="h-4 w-4 text-amber-400" />
                                <span className="text-sm font-medium text-amber-400">Pesan Kontak</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => window.open(`mailto:${contactMessage.email}?subject=Re: ${contactMessage.subject}`)}
                                className="border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                            >
                                <Reply className="mr-2 h-4 w-4" />
                                Balas
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleDelete}
                                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                            </Button>
                        </div>
                    </div>

                    <h1 className="mb-2 text-3xl font-bold text-white">{contactMessage.subject}</h1>
                    <p className="text-lg text-zinc-300">
                        Pesan dari <span className="font-semibold text-amber-400">{contactMessage.name}</span>
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
            <div className="flex gap-6">
                {/* Main Content - Email Body */}
                <div className="flex-1 space-y-6">
                    {/* Message Header */}
                    <div className="section-card">
                        <div className="mb-6 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                        status === 'unread' ? 'bg-amber-500/20' : 'bg-zinc-600/50'
                                    }`}
                                >
                                    <User className={`h-6 w-6 ${status === 'unread' ? 'text-amber-400' : 'text-zinc-400'}`} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{contactMessage.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                                        <div className="flex items-center gap-1">
                                            <Mail className="h-4 w-4" />
                                            <a href={`mailto:${contactMessage.email}`} className="text-amber-400 hover:text-amber-300">
                                                {contactMessage.email}
                                            </a>
                                        </div>
                                        {contactMessage.phone && (
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-4 w-4" />
                                                <a href={`tel:${contactMessage.phone}`} className="text-amber-400 hover:text-amber-300">
                                                    {contactMessage.phone}
                                                </a>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(contactMessage.created_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {getStatusBadge(status)}
                        </div>
                    </div>

                    {/* Message Content */}
                    <div className="section-card">
                        <div className="mb-4 flex items-center gap-3">
                            {getStatusIcon(status)}
                            <h3 className="text-lg font-bold text-white">Konten Pesan</h3>
                        </div>

                        <div className="rounded-lg bg-zinc-800/30 p-6">
                            <div className="prose prose-invert max-w-none">
                                <div className="leading-relaxed whitespace-pre-wrap text-zinc-200">{contactMessage.message}</div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Information */}
                    <div className="section-card">
                        <h3 className="mb-4 text-lg font-bold text-white">Informasi Teknis</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {contactMessage.ip_address && (
                                    <div className="flex items-center gap-3 rounded-lg bg-zinc-800/50 p-3">
                                        <Globe className="h-4 w-4 text-blue-400" />
                                        <div>
                                            <p className="text-sm font-medium text-zinc-300">Alamat IP</p>
                                            <p className="text-sm text-zinc-500">{contactMessage.ip_address}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 rounded-lg bg-zinc-800/50 p-3">
                                    <Calendar className="h-4 w-4 text-green-400" />
                                    <div>
                                        <p className="text-sm font-medium text-zinc-300">Tanggal Dikirim</p>
                                        <p className="text-sm text-zinc-500">{formatDate(contactMessage.created_at)}</p>
                                    </div>
                                </div>

                                {contactMessage.read_at && (
                                    <div className="flex items-center gap-3 rounded-lg bg-zinc-800/50 p-3">
                                        <MailCheck className="h-4 w-4 text-amber-400" />
                                        <div>
                                            <p className="text-sm font-medium text-zinc-300">Dibaca Pada</p>
                                            <p className="text-sm text-zinc-500">{formatDate(contactMessage.read_at)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {contactMessage.user_agent && (
                                <div className="rounded-lg bg-zinc-800/50 p-4">
                                    <p className="mb-2 text-sm font-medium text-zinc-300">Agen Pengguna</p>
                                    <p className="font-mono text-xs break-all text-zinc-500">{contactMessage.user_agent}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-80 space-y-6">
                    {/* Sender Information */}
                    <div className="section-card">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                                <User className="h-6 w-6 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Info Pengirim</h3>
                                <p className="text-sm text-zinc-400">Detail kontak</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="rounded-lg bg-zinc-800/50 p-4">
                                <p className="mb-2 text-sm font-medium text-zinc-300">Nama Lengkap</p>
                                <p className="font-semibold text-white">{contactMessage.name}</p>
                            </div>

                            <div className="rounded-lg bg-zinc-800/50 p-4">
                                <p className="mb-2 text-sm font-medium text-zinc-300">Alamat Email</p>
                                <a href={`mailto:${contactMessage.email}`} className="font-medium text-amber-400 hover:text-amber-300">
                                    {contactMessage.email}
                                </a>
                            </div>

                            {contactMessage.phone && (
                                <div className="rounded-lg bg-zinc-800/50 p-4">
                                    <p className="mb-2 text-sm font-medium text-zinc-300">Nomor Telepon</p>
                                    <a href={`tel:${contactMessage.phone}`} className="font-medium text-amber-400 hover:text-amber-300">
                                        {contactMessage.phone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Management */}
                    <div className="section-card">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                                <MailCheck className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Manajemen Status</h3>
                                <p className="text-sm text-zinc-400">Ubah status pesan</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-300">Status Pesan</label>
                                <Select value={status} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="border-zinc-600 bg-zinc-800/50 text-zinc-100">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unread">Belum Dibaca</SelectItem>
                                        <SelectItem value="read">Sudah Dibaca</SelectItem>
                                        <SelectItem value="archived">Diarsipkan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="rounded-lg bg-zinc-800/50 p-4">
                                <p className="text-sm text-zinc-400">Ubah status pesan untuk mengelola alur kerja kontak Anda secara efisien.</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="section-card">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                                <Reply className="h-6 w-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Tindakan Cepat</h3>
                                <p className="text-sm text-zinc-400">Tanggapi pesan</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                asChild
                            >
                                <a href={`mailto:${contactMessage.email}?subject=Re: ${contactMessage.subject}`}>
                                    <Mail className="mr-3 h-4 w-4" />
                                    Balas via Email
                                </a>
                            </Button>

                            {contactMessage.phone && (
                                <Button
                                    variant="outline"
                                    className="w-full justify-start border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                    asChild
                                >
                                    <a href={`tel:${contactMessage.phone}`}>
                                        <Phone className="mr-3 h-4 w-4" />
                                        Telepon
                                    </a>
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                className="w-full justify-start border-zinc-500/30 bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20"
                                onClick={() => handleStatusChange('archived')}
                                disabled={status === 'archived'}
                            >
                                <Archive className="mr-3 h-4 w-4" />
                                Arsipkan Pesan
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <DeleteConfirmationDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={confirmDelete}
                    title="Hapus Pesan Kontak"
                    description={`Apakah Anda yakin ingin menghapus pesan dari "${contactMessage.name}"? Tindakan ini tidak dapat dibatalkan.`}
                    confirmText="Ya, Hapus Pesan"
                    itemName={contactMessage.name}
                />
            </div>
        </AppLayout>
    );
}
