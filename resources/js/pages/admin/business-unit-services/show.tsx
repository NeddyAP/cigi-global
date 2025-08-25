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
                                Back to Services
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">{businessUnitService.title}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={route('admin.business-unit-services.edit', businessUnitService.id)}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this service?')) {
                                    // Handle delete
                                }
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Information */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Service Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Business Unit</label>
                                        <p className="text-lg">{businessUnitService.business_unit?.name}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        <div className="mt-1">
                                            <Badge variant={businessUnitService.status === 'active' ? 'default' : 'secondary'}>
                                                {businessUnitService.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    {businessUnitService.price && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Price</label>
                                            <p className="text-lg">${businessUnitService.price}</p>
                                        </div>
                                    )}

                                    {businessUnitService.duration && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Duration</label>
                                            <p className="text-lg">{businessUnitService.duration}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Description</label>
                                    <p className="mt-1 text-gray-700">{businessUnitService.description}</p>
                                </div>

                                {businessUnitService.short_description && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Short Description</label>
                                        <p className="mt-1 text-gray-700">{businessUnitService.short_description}</p>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium text-gray-500">Featured Service</label>
                                    <Badge variant={businessUnitService.featured ? 'destructive' : 'secondary'}>
                                        {businessUnitService.featured ? 'Yes' : 'No'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        {businessUnitService.features && businessUnitService.features.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Features</CardTitle>
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
                                    <CardTitle>Technologies</CardTitle>
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
                                    <CardTitle>Process Steps</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {businessUnitService.process_steps
                                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                                            .map((step, index) => (
                                                <div key={index} className="border-l-4 border-blue-500 pl-4">
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-500">Step {step.order || index + 1}</span>
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
                                    <CardTitle>Service Image</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative">
                                        <img
                                            src={`/storage/${businessUnitService.image}`}
                                            alt={businessUnitService.title}
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
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href={route('admin.business-unit-services.edit', businessUnitService.id)} className="w-full">
                                    <Button variant="outline" className="w-full">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Service
                                    </Button>
                                </Link>

                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this service?')) {
                                            // Handle delete
                                        }
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Service
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Service Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Service Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Created</span>
                                    <span className="text-sm">{new Date(businessUnitService.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Last Updated</span>
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
