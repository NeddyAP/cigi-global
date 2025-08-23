import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PublicLayout from '@/layouts/public-layout';
import { type CommunityClub } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, ChevronRight, Filter, MapPin, Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

interface CommunityClubsIndexProps {
    communityClubs: CommunityClub[];
    clubsByType: Record<string, CommunityClub[]>;
}

export default function CommunityClubsIndex({ communityClubs, clubsByType }: CommunityClubsIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

    // Get all unique activities
    const allActivities = useMemo(() => {
        const activities = new Set<string>();
        communityClubs.forEach((club) => {
            if (club.activities) {
                try {
                    const clubActivities = JSON.parse(club.activities);
                    if (Array.isArray(clubActivities)) {
                        clubActivities.forEach((activity) => activities.add(activity));
                    }
                } catch {
                    // If not valid JSON, treat as comma-separated string
                    club.activities.split(',').forEach((activity) => {
                        activities.add(activity.trim());
                    });
                }
            }
        });
        return Array.from(activities);
    }, [communityClubs]);

    const clubTypes = Object.keys(clubsByType);

    // Filter community clubs
    const filteredClubs = useMemo(() => {
        let filtered = communityClubs;

        // Filter by type
        if (selectedType !== 'all') {
            filtered = filtered.filter((club) => club.type === selectedType);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (club) =>
                    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    club.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    club.type.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        // Filter by activities
        if (selectedActivities.length > 0) {
            filtered = filtered.filter((club) => {
                if (!club.activities) return false;
                try {
                    const clubActivities = JSON.parse(club.activities);
                    return selectedActivities.some((activity) => clubActivities.includes(activity));
                } catch {
                    const clubActivities = club.activities.split(',').map((a) => a.trim());
                    return selectedActivities.some((activity) => clubActivities.includes(activity));
                }
            });
        }

        return filtered;
    }, [communityClubs, selectedType, searchQuery, selectedActivities]);

    const toggleActivity = (activity: string) => {
        setSelectedActivities((prev) => (prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]));
    };

    const getClubActivities = (club: CommunityClub): string[] => {
        if (!club.activities) return [];
        try {
            const activities = JSON.parse(club.activities);
            return Array.isArray(activities) ? activities : [];
        } catch {
            return club.activities.split(',').map((a) => a.trim());
        }
    };

    return (
        <PublicLayout
            title="Komunitas"
            description="Bergabunglah dengan berbagai komunitas CIGI Global yang memiliki minat dan tujuan yang sama untuk berkembang bersama."
        >
            <Head title="Komunitas" />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="glass-hero-overlay absolute inset-0"></div>
                <div className="container relative mx-auto px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="text-shadow-lg mb-6 text-4xl font-bold text-white md:text-6xl">Komunitas</h1>
                    <p className="text-shadow mx-auto mb-8 max-w-3xl text-xl text-white/90 md:text-2xl">
                        Bergabunglah dengan berbagai komunitas yang memiliki minat dan tujuan yang sama untuk berkembang dan berinovasi bersama.
                    </p>

                    {/* Search Bar */}
                    <div className="mx-auto max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Cari komunitas..."
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
                    {/* Type Tabs */}
                    <div className="mb-12">
                        <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
                            <TabsList className="glass-card grid h-auto w-full grid-cols-2 gap-2 p-2 lg:grid-cols-4">
                                <TabsTrigger value="all" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                                    Semua ({communityClubs.length})
                                </TabsTrigger>
                                {clubTypes.map((type) => (
                                    <TabsTrigger
                                        key={type}
                                        value={type}
                                        className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                                    >
                                        {type} ({clubsByType[type].length})
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Activities Filter */}
                    {allActivities.length > 0 && (
                        <div className="mb-12">
                            <div className="glass-card rounded-xl p-6">
                                <div className="mb-4 flex items-center">
                                    <Filter className="mr-2 h-5 w-5 text-white" />
                                    <h3 className="text-lg font-semibold text-white">Filter berdasarkan aktivitas:</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {allActivities.map((activity) => (
                                        <Badge
                                            key={activity}
                                            variant={selectedActivities.includes(activity) ? 'default' : 'outline'}
                                            className={`cursor-pointer transition-all duration-200 ${
                                                selectedActivities.includes(activity)
                                                    ? 'bg-green-500 text-white'
                                                    : 'glass-button border-white/30 text-white hover:bg-white/20'
                                            }`}
                                            onClick={() => toggleActivity(activity)}
                                        >
                                            {activity}
                                        </Badge>
                                    ))}
                                </div>
                                {selectedActivities.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedActivities([])}
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
                            Menampilkan {filteredClubs.length} dari {communityClubs.length} komunitas
                        </p>
                    </div>

                    {/* Community Clubs Grid */}
                    {filteredClubs.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredClubs.map((club) => (
                                <div key={club.id} className="glass-card-hover group">
                                    {/* Image */}
                                    {club.image && (
                                        <div className="relative h-48 overflow-hidden rounded-t-xl">
                                            <img
                                                src={club.image}
                                                alt={club.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                            <div className="absolute right-4 top-4">
                                                <Badge className="bg-green-500 text-white">{club.type}</Badge>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <h3 className="mb-3 text-xl font-bold text-white">{club.name}</h3>

                                        {club.description && <p className="mb-4 line-clamp-3 text-sm text-white/80">{club.description}</p>}

                                        {/* Activities */}
                                        {club.activities && (
                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {getClubActivities(club)
                                                        .slice(0, 3)
                                                        .map((activity, index) => (
                                                            <Badge key={index} variant="outline" className="border-white/30 text-xs text-white/70">
                                                                {activity}
                                                            </Badge>
                                                        ))}
                                                    {getClubActivities(club).length > 3 && (
                                                        <Badge variant="outline" className="border-white/30 text-xs text-white/70">
                                                            +{getClubActivities(club).length - 3} lainnya
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Contact & Meeting Info */}
                                        <div className="mb-6 space-y-2 text-sm text-white/70">
                                            {club.meeting_schedule && (
                                                <div className="flex items-center">
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    <span>{club.meeting_schedule}</span>
                                                </div>
                                            )}
                                            {club.location && (
                                                <div className="flex items-center">
                                                    <MapPin className="mr-2 h-4 w-4" />
                                                    <span className="line-clamp-1">{club.location}</span>
                                                </div>
                                            )}
                                            {club.contact_person && (
                                                <div className="flex items-center">
                                                    <Users className="mr-2 h-4 w-4" />
                                                    <span>PIC: {club.contact_person}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <Link
                                            href={route('community-clubs.show', club.slug)}
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
                                <p className="mb-4 text-white/70">Tidak ada komunitas yang sesuai dengan pencarian Anda.</p>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedType('all');
                                        setSelectedActivities([]);
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
