import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/public-layout';
import { type BusinessUnit } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, CheckCircle, Clock, ExternalLink, Globe, Mail, MapPin, Phone } from 'lucide-react';

interface BusinessUnitShowProps {
    businessUnit: BusinessUnit;
    relatedUnits?: BusinessUnit[];
}

export default function BusinessUnitShow({ businessUnit, relatedUnits = [] }: BusinessUnitShowProps) {
    const services = businessUnit.services ? businessUnit.services.split(',').map((s) => s.trim()) : [];
    const operatingHours = businessUnit.operating_hours ? businessUnit.operating_hours.split(',').map((h) => h.trim()) : [];

    return (
        <PublicLayout
            title={businessUnit.name}
            description={businessUnit.description || `Informasi lengkap tentang ${businessUnit.name} - Unit Bisnis CIGI Global`}
        >
            <Head title={businessUnit.name} />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0">
                    {businessUnit.image && <img src={businessUnit.image} alt={businessUnit.name} className="h-full w-full object-cover" />}
                    <div className="glass-hero-overlay absolute inset-0"></div>
                </div>

                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl">
                        {/* Back Button */}
                        <Link
                            href={route('business-units.index')}
                            className="mb-8 inline-flex items-center glass-button rounded-lg px-4 py-2 text-white"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Unit Bisnis
                        </Link>

                        <h1 className="mb-6 text-4xl font-bold text-white text-shadow-lg md:text-6xl">{businessUnit.name}</h1>

                        {businessUnit.description && (
                            <p className="text-shadow text-xl leading-relaxed text-white/90 md:text-2xl">{businessUnit.description}</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Services Section */}
                            {services.length > 0 && (
                                <div className="glass-card rounded-xl p-8">
                                    <h2 className="mb-6 flex items-center text-2xl font-bold text-white">
                                        <CheckCircle className="mr-3 h-6 w-6 text-green-400" />
                                        Layanan Kami
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {services.map((service, index) => (
                                            <div key={index} className="flex items-center glass-button rounded-lg p-4">
                                                <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-green-400" />
                                                <span className="font-medium text-white">{service}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Operating Hours */}
                            {operatingHours.length > 0 && (
                                <div className="glass-card rounded-xl p-8">
                                    <h2 className="mb-6 flex items-center text-2xl font-bold text-white">
                                        <Clock className="mr-3 h-6 w-6 text-blue-400" />
                                        Jam Operasional
                                    </h2>
                                    <div className="space-y-3">
                                        {operatingHours.map((hour, index) => (
                                            <div key={index} className="flex items-center glass-button rounded-lg p-3">
                                                <Clock className="mr-3 h-4 w-4 text-blue-400" />
                                                <span className="text-white">{hour}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Info */}
                            <div className="glass-card rounded-xl p-8">
                                <h2 className="mb-6 text-2xl font-bold text-white">Informasi Tambahan</h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="leading-relaxed text-white/80">
                                        {businessUnit.description ||
                                            'Unit bisnis ini merupakan bagian integral dari ekosistem CIGI Global yang berkomitmen untuk memberikan layanan terbaik dan solusi inovatif bagi mitra dan klien kami.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Contact Information */}
                            <div className="glass-card rounded-xl p-6">
                                <h3 className="mb-6 text-xl font-bold text-white">Informasi Kontak</h3>
                                <div className="space-y-4">
                                    {businessUnit.contact_phone && (
                                        <div className="flex items-start space-x-3">
                                            <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
                                            <div>
                                                <p className="text-sm text-white/60">Telepon</p>
                                                <a
                                                    href={`tel:${businessUnit.contact_phone}`}
                                                    className="text-white transition-colors hover:text-blue-300"
                                                >
                                                    {businessUnit.contact_phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {businessUnit.contact_email && (
                                        <div className="flex items-start space-x-3">
                                            <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-green-400" />
                                            <div>
                                                <p className="text-sm text-white/60">Email</p>
                                                <a
                                                    href={`mailto:${businessUnit.contact_email}`}
                                                    className="text-white transition-colors hover:text-green-300"
                                                >
                                                    {businessUnit.contact_email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {businessUnit.address && (
                                        <div className="flex items-start space-x-3">
                                            <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-red-400" />
                                            <div>
                                                <p className="text-sm text-white/60">Alamat</p>
                                                <p className="text-white">{businessUnit.address}</p>
                                            </div>
                                        </div>
                                    )}

                                    {businessUnit.website_url && (
                                        <div className="flex items-start space-x-3">
                                            <Globe className="mt-1 h-5 w-5 flex-shrink-0 text-purple-400" />
                                            <div>
                                                <p className="text-sm text-white/60">Website</p>
                                                <a
                                                    href={businessUnit.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-white transition-colors hover:text-purple-300"
                                                >
                                                    Kunjungi Website
                                                    <ExternalLink className="ml-1 h-4 w-4" />
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Separator className="my-6 bg-white/20" />

                                <Button asChild className="w-full glass-button border border-white/30 text-white hover:bg-white/20">
                                    <a href={`mailto:${businessUnit.contact_email || 'info@cigi-global.com'}`}>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Hubungi Kami
                                    </a>
                                </Button>
                            </div>

                            {/* Quick Actions */}
                            <div className="glass-card rounded-xl p-6">
                                <h3 className="mb-4 text-xl font-bold text-white">Aksi Cepat</h3>
                                <div className="space-y-3">
                                    <Button asChild variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                                        <Link href={route('business-units.index')}>
                                            <Building2 className="mr-2 h-4 w-4" />
                                            Lihat Unit Bisnis Lain
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Units */}
                    {relatedUnits.length > 0 && (
                        <div className="mt-16">
                            <h2 className="mb-12 text-center text-3xl font-bold text-white">Unit Bisnis Terkait</h2>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {relatedUnits.slice(0, 3).map((unit) => (
                                    <Link key={unit.id} href={route('business-units.show', unit.slug)} className="group glass-card-hover">
                                        {unit.image && (
                                            <div className="relative h-32 overflow-hidden rounded-t-xl">
                                                <img
                                                    src={unit.image}
                                                    alt={unit.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="mb-2 text-lg font-bold text-white">{unit.name}</h3>
                                            {unit.description && <p className="line-clamp-2 text-sm text-white/70">{unit.description}</p>}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
