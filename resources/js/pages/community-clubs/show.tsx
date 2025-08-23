import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/public-layout';
import { type CommunityClub } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, ArrowLeft, Calendar, Clock, Mail, MapPin, Phone, User, Users } from 'lucide-react';

interface CommunityClubShowProps {
    communityClub: CommunityClub;
    relatedClubs?: CommunityClub[];
}

export default function CommunityClubShow({ communityClub, relatedClubs = [] }: CommunityClubShowProps) {
    const getClubActivities = (): string[] => {
        if (!communityClub.activities) return [];
        try {
            const activities = JSON.parse(communityClub.activities);
            return Array.isArray(activities) ? activities : [];
        } catch {
            return communityClub.activities.split(',').map((a) => a.trim());
        }
    };

    const activities = getClubActivities();

    return (
        <PublicLayout
            title={communityClub.name}
            description={communityClub.description || `Informasi lengkap tentang ${communityClub.name} - Komunitas CIGI Global`}
        >
            <Head title={communityClub.name} />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0">
                    {communityClub.image && <img src={communityClub.image} alt={communityClub.name} className="h-full w-full object-cover" />}
                    <div className="glass-hero-overlay absolute inset-0"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl">
                        {/* Back Button */}
                        <Link
                            href={route('community-clubs.index')}
                            className="glass-button mb-8 inline-flex items-center rounded-lg px-4 py-2 text-white"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Komunitas
                        </Link>

                        <div className="mb-4 flex items-center">
                            <Badge className="mr-4 bg-green-500 text-white">{communityClub.type}</Badge>
                        </div>

                        <h1 className="text-shadow-lg mb-6 text-4xl font-bold text-white md:text-6xl">{communityClub.name}</h1>

                        {communityClub.description && (
                            <p className="text-shadow text-xl leading-relaxed text-white/90 md:text-2xl">{communityClub.description}</p>
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
                            {/* Activities Section */}
                            {activities.length > 0 && (
                                <div className="glass-card rounded-xl p-8">
                                    <h2 className="mb-6 flex items-center text-2xl font-bold text-white">
                                        <Activity className="mr-3 h-6 w-6 text-green-400" />
                                        Aktivitas Komunitas
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {activities.map((activity, index) => (
                                            <div key={index} className="glass-button flex items-center rounded-lg p-4">
                                                <Activity className="mr-3 h-5 w-5 flex-shrink-0 text-green-400" />
                                                <span className="font-medium text-white">{activity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Meeting Information */}
                            {communityClub.meeting_schedule && (
                                <div className="glass-card rounded-xl p-8">
                                    <h2 className="mb-6 flex items-center text-2xl font-bold text-white">
                                        <Calendar className="mr-3 h-6 w-6 text-blue-400" />
                                        Jadwal Pertemuan
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="glass-button flex items-center rounded-lg p-4">
                                            <Clock className="mr-3 h-5 w-5 text-blue-400" />
                                            <span className="text-white">{communityClub.meeting_schedule}</span>
                                        </div>
                                        {communityClub.location && (
                                            <div className="glass-button flex items-center rounded-lg p-4">
                                                <MapPin className="mr-3 h-5 w-5 text-red-400" />
                                                <span className="text-white">{communityClub.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* About Section */}
                            <div className="glass-card rounded-xl p-8">
                                <h2 className="mb-6 text-2xl font-bold text-white">Tentang Komunitas</h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="leading-relaxed text-white/80">
                                        {communityClub.description ||
                                            'Komunitas ini merupakan bagian dari ekosistem CIGI Global yang bertujuan untuk memfasilitasi kolaborasi, pembelajaran, dan pengembangan diri anggotanya. Kami berkomitmen untuk menciptakan lingkungan yang mendukung pertumbuhan bersama dan inovasi berkelanjutan.'}
                                    </p>

                                    <div className="mt-6 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                        <div className="glass-button rounded-lg p-4">
                                            <h4 className="mb-2 font-semibold text-white">Tujuan Komunitas</h4>
                                            <p className="text-white/70">
                                                Membangun jaringan profesional dan personal yang kuat melalui kegiatan bersama dan pertukaran
                                                pengetahuan.
                                            </p>
                                        </div>
                                        <div className="glass-button rounded-lg p-4">
                                            <h4 className="mb-2 font-semibold text-white">Manfaat Bergabung</h4>
                                            <p className="text-white/70">
                                                Akses ke pelatihan eksklusif, networking, dan kesempatan kolaborasi dengan profesional lainnya.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Contact Information */}
                            <div className="glass-card rounded-xl p-6">
                                <h3 className="mb-6 text-xl font-bold text-white">Informasi Kontak</h3>
                                <div className="space-y-4">
                                    {communityClub.contact_person && (
                                        <div className="flex items-start space-x-3">
                                            <User className="mt-1 h-5 w-5 flex-shrink-0 text-green-400" />
                                            <div>
                                                <p className="text-sm text-white/60">Person in Charge</p>
                                                <p className="font-medium text-white">{communityClub.contact_person}</p>
                                            </div>
                                        </div>
                                    )}

                                    {communityClub.contact_phone && (
                                        <div className="flex items-start space-x-3">
                                            <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
                                            <div>
                                                <p className="text-sm text-white/60">Telepon</p>
                                                <a
                                                    href={`tel:${communityClub.contact_phone}`}
                                                    className="text-white transition-colors hover:text-blue-300"
                                                >
                                                    {communityClub.contact_phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {communityClub.contact_email && (
                                        <div className="flex items-start space-x-3">
                                            <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-purple-400" />
                                            <div>
                                                <p className="text-sm text-white/60">Email</p>
                                                <a
                                                    href={`mailto:${communityClub.contact_email}`}
                                                    className="text-white transition-colors hover:text-purple-300"
                                                >
                                                    {communityClub.contact_email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {communityClub.location && (
                                        <div className="flex items-start space-x-3">
                                            <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-red-400" />
                                            <div>
                                                <p className="text-sm text-white/60">Lokasi</p>
                                                <p className="text-white">{communityClub.location}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Separator className="my-6 bg-white/20" />

                                <div className="space-y-3">
                                    <Button asChild className="glass-button w-full border border-white/30 text-white hover:bg-white/20">
                                        <a
                                            href={`mailto:${communityClub.contact_email || 'info@cigi-global.com'}?subject=Bergabung dengan ${communityClub.name}`}
                                        >
                                            <Mail className="mr-2 h-4 w-4" />
                                            Bergabung Sekarang
                                        </a>
                                    </Button>

                                    {communityClub.contact_phone && (
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="glass-button w-full border border-white/30 text-white hover:bg-white/10"
                                        >
                                            <a href={`tel:${communityClub.contact_phone}`}>
                                                <Phone className="mr-2 h-4 w-4" />
                                                Hubungi via Telepon
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Community Stats */}
                            <div className="glass-card rounded-xl p-6">
                                <h3 className="mb-4 text-xl font-bold text-white">Info Komunitas</h3>
                                <div className="space-y-4">
                                    <div className="glass-button flex items-center justify-between rounded-lg p-3">
                                        <span className="text-white/70">Tipe Komunitas</span>
                                        <Badge className="bg-green-500 text-white">{communityClub.type}</Badge>
                                    </div>

                                    {activities.length > 0 && (
                                        <div className="glass-button flex items-center justify-between rounded-lg p-3">
                                            <span className="text-white/70">Jumlah Aktivitas</span>
                                            <span className="font-semibold text-white">{activities.length}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="glass-card rounded-xl p-6">
                                <h3 className="mb-4 text-xl font-bold text-white">Aksi Cepat</h3>
                                <div className="space-y-3">
                                    <Button asChild variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                                        <Link href={route('community-clubs.index')}>
                                            <Users className="mr-2 h-4 w-4" />
                                            Lihat Komunitas Lain
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Clubs */}
                    {relatedClubs.length > 0 && (
                        <div className="mt-16">
                            <h2 className="mb-12 text-center text-3xl font-bold text-white">Komunitas Terkait</h2>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {relatedClubs.slice(0, 3).map((club) => (
                                    <Link key={club.id} href={route('community-clubs.show', club.slug)} className="glass-card-hover group">
                                        {club.image && (
                                            <div className="relative h-32 overflow-hidden rounded-t-xl">
                                                <img
                                                    src={club.image}
                                                    alt={club.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute right-2 top-2">
                                                    <Badge className="bg-green-500 text-xs text-white">{club.type}</Badge>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="mb-2 text-lg font-bold text-white">{club.name}</h3>
                                            {club.description && <p className="line-clamp-2 text-sm text-white/70">{club.description}</p>}
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
