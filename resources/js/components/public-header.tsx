import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { type BusinessUnit, type CommunityClub } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, ChevronDown, Menu, Newspaper, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PublicHeaderProps {
    businessUnits: BusinessUnit[];
    communityClubs: CommunityClub[];
}

export default function PublicHeader({ businessUnits = [], communityClubs = [] }: PublicHeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { url } = usePage();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Group community clubs by type
    const clubsByType = communityClubs.reduce(
        (acc, club) => {
            if (!acc[club.type]) {
                acc[club.type] = [];
            }
            acc[club.type].push(club);
            return acc;
        },
        {} as Record<string, CommunityClub[]>,
    );

    const isActive = (path: string) => url.startsWith(path);

    return (
        <header className={cn('glass-nav transition-all duration-300', scrolled && 'shadow-lg')}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between md:h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href={route('home')} className="flex items-center space-x-2">
                            <AppLogo className="h-8 w-8 md:h-10 md:w-10" />
                            <span className="text-shadow text-lg font-bold text-white md:text-xl">CIGI Global</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-8 md:flex">
                        <Link
                            href={route('home')}
                            className={cn(
                                'font-medium text-white/90 transition-colors duration-200 hover:text-white',
                                isActive('/') &&
                                    !isActive('/unit-bisnis') &&
                                    !isActive('/komunitas') &&
                                    !isActive('/berita') &&
                                    'border-b-2 border-white/50 text-white',
                            )}
                        >
                            Beranda
                        </Link>

                        {/* Business Units Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        'h-auto p-0 font-medium text-white/90 hover:bg-white/10 hover:text-white',
                                        isActive('/unit-bisnis') && 'text-white',
                                    )}
                                >
                                    <Building2 className="mr-2 h-4 w-4" />
                                    Unit Bisnis
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="glass-dropdown w-80 p-4">
                                <div className="grid grid-cols-1 gap-3">
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={route('business-units.index')}
                                            className="flex items-center rounded-lg p-3 transition-colors hover:bg-white/10"
                                        >
                                            <Building2 className="mr-3 h-5 w-5 text-blue-500" />
                                            <div>
                                                <div className="font-medium">Semua Unit Bisnis</div>
                                                <div className="text-muted-foreground text-sm">Lihat seluruh unit bisnis kami</div>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>

                                    {businessUnits.slice(0, 4).map((unit) => (
                                        <DropdownMenuItem key={unit.id} asChild>
                                            <Link
                                                href={route('business-units.show', unit.slug)}
                                                className="flex items-center rounded-lg p-3 transition-colors hover:bg-white/10"
                                            >
                                                {unit.image && (
                                                    <img src={unit.image} alt={unit.name} className="mr-3 h-12 w-12 rounded-lg object-cover" />
                                                )}
                                                <div className="flex-1">
                                                    <div className="font-medium">{unit.name}</div>
                                                    {unit.description && (
                                                        <div className="text-muted-foreground line-clamp-2 text-sm">{unit.description}</div>
                                                    )}
                                                </div>
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Community Clubs Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        'h-auto p-0 font-medium text-white/90 hover:bg-white/10 hover:text-white',
                                        isActive('/komunitas') && 'text-white',
                                    )}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Komunitas
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="glass-dropdown w-80 p-4">
                                <div className="space-y-3">
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={route('community-clubs.index')}
                                            className="flex items-center rounded-lg p-3 transition-colors hover:bg-white/10"
                                        >
                                            <Users className="mr-3 h-5 w-5 text-green-500" />
                                            <div>
                                                <div className="font-medium">Semua Komunitas</div>
                                                <div className="text-muted-foreground text-sm">Jelajahi komunitas kami</div>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>

                                    {Object.entries(clubsByType)
                                        .slice(0, 3)
                                        .map(([type, clubs]) => (
                                            <div key={type} className="space-y-2">
                                                <div className="text-muted-foreground px-3 text-sm font-medium">{type}</div>
                                                {clubs.slice(0, 2).map((club) => (
                                                    <DropdownMenuItem key={club.id} asChild>
                                                        <Link
                                                            href={route('community-clubs.show', club.slug)}
                                                            className="ml-3 flex items-center rounded-lg p-3 transition-colors hover:bg-white/10"
                                                        >
                                                            {club.image && (
                                                                <img
                                                                    src={club.image}
                                                                    alt={club.name}
                                                                    className="mr-3 h-10 w-10 rounded-lg object-cover"
                                                                />
                                                            )}
                                                            <div className="flex-1">
                                                                <div className="text-sm font-medium">{club.name}</div>
                                                                {club.description && (
                                                                    <div className="text-muted-foreground line-clamp-1 text-xs">
                                                                        {club.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                ))}
                                            </div>
                                        ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* News Link */}
                        <Link
                            href={route('news.index')}
                            className={cn(
                                'flex items-center font-medium text-white/90 transition-colors duration-200 hover:text-white',
                                isActive('/berita') && 'border-b-2 border-white/50 text-white',
                            )}
                        >
                            <Newspaper className="mr-2 h-4 w-4" />
                            Berita
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white hover:bg-white/10"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="mt-4 border-t border-white/20 pb-4 pt-4 md:hidden">
                        <div className="space-y-4">
                            <Link
                                href={route('home')}
                                className="block py-2 font-medium text-white/90 hover:text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Beranda
                            </Link>

                            <Link
                                href={route('business-units.index')}
                                className="block py-2 font-medium text-white/90 hover:text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Building2 className="mr-2 inline h-4 w-4" />
                                Unit Bisnis
                            </Link>

                            <Link
                                href={route('community-clubs.index')}
                                className="block py-2 font-medium text-white/90 hover:text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Users className="mr-2 inline h-4 w-4" />
                                Komunitas
                            </Link>

                            <Link
                                href={route('news.index')}
                                className="block py-2 font-medium text-white/90 hover:text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Newspaper className="mr-2 inline h-4 w-4" />
                                Berita
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
