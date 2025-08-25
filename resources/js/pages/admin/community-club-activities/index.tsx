import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/AdminLayout';
import { CommunityClub, CommunityClubActivity } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Filter, Plus, Search, Trash2 } from 'lucide-react';

interface Props {
    communityClubActivities: CommunityClubActivity[];
    communityClubs: CommunityClub[];
    filters: {
        community_club_id?: string;
        search?: string;
    };
}

export default function Index({ communityClubActivities, communityClubs, filters }: Props) {
    const handleFilter = (key: string, value: string) => {
        router.get(
            route('admin.community-club-activities.index'),
            {
                ...filters,
                [key]: value,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSearch = (search: string) => {
        handleFilter('search', search);
    };

    const clearFilters = () => {
        router.get(route('admin.community-club-activities.index'));
    };

    return (
        <AdminLayout>
            <Head title="Community Club Activities" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Community Club Activities</h1>
                    <Link href={route('admin.community-club-activities.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Activity
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Search</label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        placeholder="Search activities..."
                                        defaultValue={filters.search}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Community Club</label>
                                <Select value={filters.community_club_id} onValueChange={(value) => handleFilter('community_club_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Clubs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Clubs</SelectItem>
                                        {communityClubs.map((club) => (
                                            <SelectItem key={club.id} value={club.id.toString()}>
                                                {club.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button variant="outline" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Activities List */}
                <div className="grid gap-4">
                    {communityClubActivities.map((activity) => (
                        <Card key={activity.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-2 flex items-center gap-3">
                                            <h3 className="text-xl font-semibold">{activity.title}</h3>
                                            <Badge variant={activity.status === 'active' ? 'default' : 'secondary'}>{activity.status}</Badge>
                                            {activity.featured && <Badge variant="destructive">Featured</Badge>}
                                        </div>

                                        <p className="mb-3 text-gray-600">{activity.description}</p>

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>Community Club: {activity.community_club?.name}</span>
                                            {activity.max_participants && <span>Max Participants: {activity.max_participants}</span>}
                                            {activity.duration && <span>Duration: {activity.duration}</span>}
                                        </div>

                                        {activity.benefits && activity.benefits.length > 0 && (
                                            <div className="mt-3">
                                                <span className="text-sm font-medium text-gray-500">Benefits: </span>
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {activity.benefits.slice(0, 3).map((benefit, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {benefit}
                                                        </Badge>
                                                    ))}
                                                    {activity.benefits.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{activity.benefits.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link href={route('admin.community-club-activities.show', activity.id)}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={route('admin.community-club-activities.edit', activity.id)}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this activity?')) {
                                                    router.delete(route('admin.community-club-activities.destroy', activity.id));
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {communityClubActivities.length === 0 && (
                        <Card>
                            <CardContent className="p-6 text-center text-gray-500">No activities found matching your criteria.</CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
