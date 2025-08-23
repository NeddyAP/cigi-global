import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import { type BusinessUnit } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Mail, MapPin, Phone, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

interface BusinessUnitsIndexProps {
    businessUnits: BusinessUnit[];
}

export default function BusinessUnitsIndex({ businessUnits }: BusinessUnitsIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    // Get all unique services
    const allServices = useMemo(() => {
        const services = new Set<string>();
        businessUnits.forEach((unit) => {
            if (unit.services) {
                unit.services.split(',').forEach((service) => {
                    services.add(service.trim());
                });
            }
        });
        return Array.from(services);
    }, [businessUnits]);

    // Filter business units
    const filteredUnits = useMemo(() => {
        return businessUnits.filter((unit) => {
            const matchesSearch =
                unit.name.toLowerCase().includes(searchQuery.toLowerCase()) || unit.description?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesServices = selectedServices.length === 0 || selectedServices.some((service) => unit.services?.includes(service));

            return matchesSearch && matchesServices;
        });
    }, [businessUnits, searchQuery, selectedServices]);

    const toggleService = (service: string) => {
        setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]));
    };

    return (
        <PublicLayout
            title="Unit Bisnis"
            description="Jelajahi berbagai unit bisnis CIGI Global yang melayani berbagai kebutuhan industri dengan solusi terdepan."
        >
            <Head title="Unit Bisnis" />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="glass-hero-overlay absolute inset-0"></div>
                <div className="container relative mx-auto px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="text-shadow-lg mb-6 text-4xl font-bold text-white md:text-6xl">Unit Bisnis</h1>
                    <p className="text-shadow mx-auto mb-8 max-w-3xl text-xl text-white/90 md:text-2xl">
                        Jelajahi berbagai unit bisnis kami yang melayani berbagai kebutuhan industri dengan solusi terdepan dan inovasi berkelanjutan.
                    </p>

                    {/* Search Bar */}
                    <div className="mx-auto max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Cari unit bisnis..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="glass-card border-white/30 pl-10 text-white placeholder:text-white/60"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Services Filter */}
                    {allServices.length > 0 && (
                        <div className="mb-12">
                            <div className="glass-card rounded-xl p-6">
                                <h3 className="mb-4 text-lg font-semibold text-white">Filter berdasarkan layanan:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {allServices.map((service) => (
                                        <Badge
                                            key={service}
                                            variant={selectedServices.includes(service) ? 'default' : 'outline'}
                                            className={`cursor-pointer transition-all duration-200 ${
                                                selectedServices.includes(service)
                                                    ? 'bg-blue-500 text-white'
                                                    : 'glass-button border-white/30 text-white hover:bg-white/20'
                                            }`}
                                            onClick={() => toggleService(service)}
                                        >
                                            {service}
                                        </Badge>
                                    ))}
                                </div>
                                {selectedServices.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedServices([])}
                                        className="mt-3 text-white/80 hover:bg-white/10 hover:text-white"
                                    >
                                        Hapus semua filter
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Results Count */}
                    <div className="mb-8">
                        <p className="text-white/80">
                            Menampilkan {filteredUnits.length} dari {businessUnits.length} unit bisnis
                        </p>
                    </div>

                    {/* Business Units Grid */}
                    {filteredUnits.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredUnits.map((unit) => (
                                <div key={unit.id} className="glass-card-hover group">
                                    {/* Image */}
                                    {unit.image && (
                                        <div className="relative h-48 overflow-hidden rounded-t-xl">
                                            <img
                                                src={unit.image}
                                                alt={unit.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <h3 className="mb-3 text-xl font-bold text-white">{unit.name}</h3>

                                        {unit.description && <p className="mb-4 line-clamp-3 text-sm text-white/80">{unit.description}</p>}

                                        {/* Services */}
                                        {unit.services && (
                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {unit.services
                                                        .split(',')
                                                        .slice(0, 3)
                                                        .map((service, index) => (
                                                            <Badge key={index} variant="outline" className="border-white/30 text-xs text-white/70">
                                                                {service.trim()}
                                                            </Badge>
                                                        ))}
                                                    {unit.services.split(',').length > 3 && (
                                                        <Badge variant="outline" className="border-white/30 text-xs text-white/70">
                                                            +{unit.services.split(',').length - 3} lainnya
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Contact Info */}
                                        <div className="mb-6 space-y-2 text-sm text-white/70">
                                            {unit.contact_phone && (
                                                <div className="flex items-center">
                                                    <Phone className="mr-2 h-4 w-4" />
                                                    <span>{unit.contact_phone}</span>
                                                </div>
                                            )}
                                            {unit.contact_email && (
                                                <div className="flex items-center">
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    <span>{unit.contact_email}</span>
                                                </div>
                                            )}
                                            {unit.address && (
                                                <div className="flex items-center">
                                                    <MapPin className="mr-2 h-4 w-4" />
                                                    <span className="line-clamp-1">{unit.address}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <Link
                                            href={route('business-units.show', unit.slug)}
                                            className="glass-button inline-flex w-full items-center justify-center rounded-lg px-4 py-2 font-medium text-white transition-all duration-200 hover:scale-105"
                                        >
                                            Lihat Detail
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <div className="glass-card mx-auto max-w-md rounded-xl p-8">
                                <Search className="mx-auto mb-4 h-16 w-16 text-white/50" />
                                <h3 className="mb-2 text-xl font-semibold text-white">Tidak ditemukan hasil</h3>
                                <p className="mb-4 text-white/70">Tidak ada unit bisnis yang sesuai dengan pencarian Anda.</p>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedServices([]);
                                    }}
                                    className="text-white hover:bg-white/10"
                                >
                                    Reset Pencarian
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
