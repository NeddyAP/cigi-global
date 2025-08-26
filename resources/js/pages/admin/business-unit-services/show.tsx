import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/AdminLayout';
import { BusinessUnitService } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Eye, Trash2 } from 'lucide-react';

interface Props {
    businessUnitService: BusinessUnitService;
}

export default function Show({ businessUnitService }: Props) {
    return (
        <AdminLayout>
            <Head title={businessUnitService.title} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.business-unit-services.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Layanan
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">{businessUnitService.title}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={route('admin.business-unit-services.edit', businessUnitService.id)}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Ubah
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
                                    // Handle delete
                                }
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Information */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Layanan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Unit Bisnis</label>
                                        <p className="text-lg">{businessUnitService.business_unit?.name}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        <div className="mt-1">
                                            <Badge variant={businessUnitService.status === 'active' ? 'default' : 'secondary'}>
                                                {businessUnitService.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                        </div>
                                    </div>

                                    {businessUnitService.price && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Harga</label>
                                            <p className="text-lg">${businessUnitService.price}</p>
                                        </div>
                                    )}

                                    {businessUnitService.duration && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Durasi</label>
                                            <p className="text-lg">{businessUnitService.duration}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                                    <p className="mt-1 text-gray-700">{businessUnitService.description}</p>
                                </div>

                                {businessUnitService.short_description && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Deskripsi Singkat</label>
                                        <p className="mt-1 text-gray-700">{businessUnitService.short_description}</p>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium text-gray-500">Layanan Unggulan</label>
                                    <Badge variant={businessUnitService.featured ? 'destructive' : 'secondary'}>
                                        {businessUnitService.featured ? 'Ya' : 'Tidak'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        {businessUnitService.features && businessUnitService.features.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Fitur</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {businessUnitService.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Technologies */}
                        {businessUnitService.technologies && businessUnitService.technologies.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Teknologi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {businessUnitService.technologies.map((tech, index) => (
                                            <Badge key={index} variant="outline">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Process Steps */}
                        {businessUnitService.process_steps && businessUnitService.process_steps.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Langkah Proses</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {businessUnitService.process_steps
                                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                                            .map((step, index) => (
                                                <div key={index} className="border-l-4 border-blue-500 pl-4">
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-500">Langkah {step.order || index + 1}</span>
                                                        <h4 className="font-semibold">{step.title}</h4>
                                                    </div>
                                                    <p className="text-gray-600">{step.description}</p>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Service Image */}
                        {businessUnitService.image && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gambar Layanan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative">
                                        <img
                                            src={`/storage/${businessUnitService.image}`}
                                            alt={`Gambar layanan saat ini`}
                                            className="h-48 w-full rounded-lg object-cover"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Link href={`/storage/${businessUnitService.image}`} target="_blank">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Aksi Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href={route('admin.business-unit-services.edit', businessUnitService.id)} className="w-full">
                                    <Button variant="outline" className="w-full">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Ubah Layanan
                                    </Button>
                                </Link>

                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => {
                                        if (confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
                                            // Handle delete
                                        }
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus Layanan
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Service Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Layanan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Dibuat</span>
                                    <span className="text-sm">{new Date(businessUnitService.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Terakhir Diperbarui</span>
                                    <span className="text-sm">{new Date(businessUnitService.updated_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">ID</span>
                                    <span className="font-mono text-sm">{businessUnitService.id}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
