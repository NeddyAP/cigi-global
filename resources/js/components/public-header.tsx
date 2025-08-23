import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { type BusinessUnit, type CommunityClub } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PublicHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const { url, props } = usePage<{
        navBusinessUnits: BusinessUnit[];
        navCommunityClubs: CommunityClub[];
    }>();

    const businessUnits = props.navBusinessUnits || [];
    const communityClubs = props.navCommunityClubs || [];

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => {
        if (path === '/') {
            return url === '/';
        }
        return url.startsWith(path);
    };

    const navItems = [
        { href: route('home'), label: 'Beranda', path: '/', type: 'link' as const },
        { href: route('business-units.index'), label: 'Unit Usaha', path: '/unit-bisnis', type: 'dropdown' as const, key: 'business' },
        { href: route('community-clubs.index'), label: 'Komunitas', path: '/komunitas', type: 'dropdown' as const, key: 'community' },
        { href: route('about'), label: 'Tentang Kami', path: '/tentang-kami', type: 'link' as const },
        { href: route('news.index'), label: 'Berita', path: '/berita', type: 'link' as const },
        { href: route('contact'), label: 'Kontak', path: '/kontak', type: 'link' as const },
    ];

    return (
        <header
            className={cn(
                'fixed top-0 right-0 left-0 z-50 border-b border-zinc-800/50 bg-black/95 backdrop-blur-md transition-all duration-300',
                scrolled && 'bg-black/98 shadow-lg',
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between md:h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href={route('home')} className="flex items-center space-x-3">
                            <AppLogo className="h-8 w-8 md:h-10 md:w-10" />
                            <div className="flex items-center space-x-0">
                                <span className="text-xl font-bold text-white md:text-2xl">Cigi</span>
                                <span className="text-xl font-bold text-amber-400 md:text-2xl">Global</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-8 md:flex lg:space-x-12">
                        {navItems.map((item) => {
                            if (item.type === 'dropdown') {
                                return (
                                    <DropdownMenu
                                        key={item.key}
                                        open={dropdownOpen === item.key}
                                        onOpenChange={(open) => setDropdownOpen(open ? item.key || null : null)}
                                    >
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                className={cn(
                                                    'group relative flex items-center font-medium transition-all duration-300 hover:text-amber-400',
                                                    isActive(item.path) ? 'text-amber-400' : 'text-white/90',
                                                )}
                                            >
                                                <span className="relative z-10">{item.label}</span>
                                                <ChevronDown
                                                    className={cn(
                                                        'ml-2 h-4 w-4 transition-all duration-300 ease-out',
                                                        dropdownOpen === item.key && 'rotate-180 text-amber-400',
                                                        'group-hover:text-amber-400',
                                                    )}
                                                />

                                                {/* Enhanced active indicator */}
                                                {isActive(item.path) && (
                                                    <span className="absolute right-0 -bottom-2 left-0 h-0.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 shadow-sm shadow-amber-400/50" />
                                                )}

                                                {/* Hover effect background */}
                                                <span className="absolute inset-0 -m-2 rounded-lg bg-amber-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                            </button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent
                                            className="mt-2 w-[650px] rounded-xl border border-zinc-800/30 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-xl"
                                            align="center"
                                            sideOffset={8}
                                        >
                                            {/* Dropdown glow effect */}
                                            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-b from-amber-500/10 to-transparent opacity-50 blur-sm" />

                                            <div className="relative z-10">
                                                {item.key === 'community' && (
                                                    <div>
                                                        <h3 className="mb-4 text-center text-lg font-semibold text-white">Pilih Komunitas</h3>

                                                        {/* All Communities Link - Compact */}
                                                        <div className="mb-4">
                                                            <Link
                                                                href={route('community-clubs.index')}
                                                                className="group flex items-center gap-3 rounded-lg border border-zinc-700/20 bg-zinc-800/40 p-3 transition-all duration-300 hover:border-amber-500/20 hover:bg-amber-500/10"
                                                                onClick={() => setDropdownOpen(null)}
                                                            >
                                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/20 transition-colors duration-300 group-hover:bg-amber-400/30">
                                                                    <AppLogo className="h-8 w-8 text-amber-400" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-white transition-colors group-hover:text-amber-400">
                                                                        Semua Komunitas
                                                                    </div>
                                                                    <div className="text-xs text-zinc-400">Lihat Semua</div>
                                                                </div>
                                                            </Link>
                                                        </div>

                                                        {/* Communities Grid - Compact */}
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {communityClubs.slice(0, 6).map((club) => (
                                                                <Link
                                                                    key={club.id}
                                                                    href={route('community-clubs.show', club.slug)}
                                                                    className="group flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all duration-300 hover:border-zinc-700/30 hover:bg-zinc-800/40"
                                                                    onClick={() => setDropdownOpen(null)}
                                                                >
                                                                    <div className="relative">
                                                                        {club.image ? (
                                                                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-110">
                                                                                <img
                                                                                    src={`/${club.image}`}
                                                                                    alt={club.name}
                                                                                    className="h-full w-full object-cover"
                                                                                />
                                                                                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-amber-400/20 transition-all duration-300 group-hover:from-amber-400/10 group-hover:to-amber-400/30" />
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/15 to-amber-600/15 transition-all duration-300 group-hover:scale-110 group-hover:from-amber-400/25 group-hover:to-amber-500/25">
                                                                                <AppLogo className="h-8 w-8 text-amber-400" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="line-clamp-1 text-sm font-medium text-white transition-colors group-hover:text-amber-400">
                                                                            {club.name}
                                                                        </div>
                                                                        <div className="text-xs text-zinc-400">{club.type}</div>
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {item.key === 'business' && (
                                                    <div>
                                                        <h3 className="mb-4 text-center text-lg font-semibold text-white">Pilih Unit Usaha</h3>

                                                        {/* All Business Units Link - Compact */}
                                                        <div className="mb-4">
                                                            <Link
                                                                href={route('business-units.index')}
                                                                className="group flex items-center gap-3 rounded-lg border border-zinc-700/20 bg-zinc-800/40 p-3 transition-all duration-300 hover:border-amber-500/20 hover:bg-amber-500/10"
                                                                onClick={() => setDropdownOpen(null)}
                                                            >
                                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/20 transition-colors duration-300 group-hover:bg-amber-400/30">
                                                                    <AppLogo className="h-8 w-8 text-amber-400" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-white transition-colors group-hover:text-amber-400">
                                                                        Semua Unit Usaha
                                                                    </div>
                                                                    <div className="text-xs text-zinc-400">Lihat Semua</div>
                                                                </div>
                                                            </Link>
                                                        </div>

                                                        {/* Business Units Grid - Compact */}
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {businessUnits.slice(0, 6).map((unit) => (
                                                                <Link
                                                                    key={unit.id}
                                                                    href={route('business-units.show', unit.slug)}
                                                                    className="group flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all duration-300 hover:border-zinc-700/30 hover:bg-zinc-800/40"
                                                                    onClick={() => setDropdownOpen(null)}
                                                                >
                                                                    <div className="relative">
                                                                        {unit.image ? (
                                                                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-110">
                                                                                <img
                                                                                    src={`/${unit.image}`}
                                                                                    alt={unit.name}
                                                                                    className="h-full w-full object-cover"
                                                                                />
                                                                                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-amber-400/20 transition-all duration-300 group-hover:from-amber-400/10 group-hover:to-amber-400/30" />
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/15 to-amber-600/15 transition-all duration-300 group-hover:scale-110 group-hover:from-amber-400/25 group-hover:to-amber-500/25">
                                                                                <AppLogo className="h-8 w-8 text-amber-400" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="line-clamp-1 text-sm font-medium text-white transition-colors group-hover:text-amber-400">
                                                                            {unit.name}
                                                                        </div>
                                                                        <div className="text-xs text-zinc-400">Bisnis</div>
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                );
                            }

                            return (
                                <Link
                                    key={item.path}
                                    href={item.href}
                                    className={cn(
                                        'group relative flex items-center font-medium transition-all duration-300 hover:text-amber-400',
                                        isActive(item.path) ? 'text-amber-400' : 'text-white/90',
                                    )}
                                >
                                    <span className="relative z-10">{item.label}</span>

                                    {/* Enhanced active indicator */}
                                    {isActive(item.path) && (
                                        <span className="absolute right-0 -bottom-2 left-0 h-0.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 shadow-sm shadow-amber-400/50" />
                                    )}

                                    {/* Hover effect background */}
                                    <span className="absolute inset-0 -m-2 rounded-lg bg-amber-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                    {/* Hover underline for non-active items */}
                                    {!isActive(item.path) && (
                                        <span className="absolute -bottom-2 left-1/2 h-0.5 w-0 -translate-x-1/2 transform rounded-full bg-amber-400/60 transition-all duration-300 group-hover:left-0 group-hover:w-full group-hover:translate-x-0" />
                                    )}
                                </Link>
                            );
                        })}
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
                    <div className="border-t border-zinc-800/50 py-4 md:hidden">
                        <div className="space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.href}
                                    className={cn(
                                        'block py-2 font-medium transition-colors',
                                        isActive(item.path) ? 'text-amber-400' : 'text-white/90 hover:text-amber-400',
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
