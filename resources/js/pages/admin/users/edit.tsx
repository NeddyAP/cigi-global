import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    user: User;
    currentUser: {
        id: number;
        superadmin: boolean;
    };
}

export default function AdminUsersEdit({ user, currentUser }: Props) {
    const breadcrumbs = [
        { label: 'Dashboard', href: route('admin.dashboard'), title: 'Dashboard' },
        { label: 'Kelola Admin', href: route('admin.users.index'), title: 'Kelola Admin' },
        { label: `Edit Admin - ${user.name}`, href: route('admin.users.edit', user.id), title: `Edit Admin - ${user.name}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Admin" />

            <div className="mb-6 flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                    <Link href={route('admin.users.index')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Admin</h1>
                    <p className="text-muted-foreground">Edit informasi admin</p>
                </div>
            </div>

            <div className="max-w-2xl">
                <Form method="put" action={route('admin.users.update', user.id)} disableWhileProcessing className="space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nama lengkap admin"
                                    defaultValue={user.name}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Alamat email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@contoh.com"
                                    defaultValue={user.email}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Kata sandi baru (opsional)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Kosongkan jika tidak ingin mengubah kata sandi"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Konfirmasi kata sandi baru</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Konfirmasi kata sandi baru"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {currentUser.superadmin && (
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="superadmin"
                                            name="superadmin"
                                            value="1"
                                            defaultChecked={user.superadmin}
                                            className="rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-800"
                                        />
                                        <Label htmlFor="superadmin">Super Admin</Label>
                                    </div>
                                    <p className="text-sm text-zinc-400">Super admin memiliki akses penuh untuk mengelola semua admin</p>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Simpan Perubahan
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('admin.users.index')}>Batal</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
