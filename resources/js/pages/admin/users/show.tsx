import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    user: User;
    currentUser: {
        id: number;
        superadmin: boolean;
    };
}

export default function AdminUsersShow({ user, currentUser }: Props) {
    const breadcrumbs = [
        { label: 'Dashboard', href: route('admin.dashboard'), title: 'Dashboard' },
        { label: 'Kelola Admin', href: route('admin.users.index'), title: 'Kelola Admin' },
        { label: `Detail Admin - ${user.name}`, href: route('admin.users.show', user.id), title: `Detail Admin - ${user.name}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Admin - ${user.name}`} />

            <div className="mb-6 flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                    <Link href={route('admin.users.index')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Detail Admin</h1>
                    <p className="text-muted-foreground">Informasi lengkap admin</p>
                </div>
            </div>

            <div className="max-w-2xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Admin</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Nama</label>
                            <p className="text-lg">{user.name}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <p className="text-lg">{user.email}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</label>
                            <p className="text-lg">
                                {new Date(user.created_at).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Terakhir Diperbarui</label>
                            <p className="text-lg">
                                {new Date(user.updated_at).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    {(currentUser.superadmin || currentUser.id === user.id) && (
                        <Button asChild>
                            <Link href={route('admin.users.edit', user.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Admin
                            </Link>
                        </Button>
                    )}

                    <Button variant="outline" asChild>
                        <Link href={route('admin.users.index')}>Kembali ke Daftar</Link>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
