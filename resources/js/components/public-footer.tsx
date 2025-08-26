import AppLogo from '@/components/app-logo';
import { globalVariables } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, Mail, MapPin, Newspaper, Phone, Users } from 'lucide-react';

interface PageProps {
    globalVariables: globalVariables;
    [key: string]: unknown;
}

export default function PublicFooter() {
    const { globalVariables } = usePage<PageProps>().props;
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-20 glass-card border-t border-white/20">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <AppLogo />
                            <span className="text-lg font-bold text-white">{globalVariables.company_name}</span>
                        </div>
                        <p className="text-sm text-white/80">{globalVariables.company_description}</p>
                        <div className="space-y-2 text-sm text-white/70">
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span>{globalVariables.contact_address}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>{globalVariables.contact_phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>{globalVariables.contact_email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Menu Utama</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href={route('home')} className="text-white/80 transition-colors hover:text-white">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('business-units.index')}
                                    className="flex items-center text-white/80 transition-colors hover:text-white"
                                >
                                    <Building2 className="mr-2 h-4 w-4" />
                                    Unit Bisnis
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('community-clubs.index')}
                                    className="flex items-center text-white/80 transition-colors hover:text-white"
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Komunitas
                                </Link>
                            </li>
                            <li>
                                <Link href={route('news.index')} className="flex items-center text-white/80 transition-colors hover:text-white">
                                    <Newspaper className="mr-2 h-4 w-4" />
                                    Berita
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Business Units */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Unit Bisnis</h3>
                        <p className="text-sm text-white/70">Jelajahi berbagai unit bisnis kami yang melayani berbagai kebutuhan industri.</p>
                        <Link
                            href={route('business-units.index')}
                            className="inline-flex items-center text-sm text-blue-300 transition-colors hover:text-blue-200"
                        >
                            Lihat Semua Unit Bisnis
                            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Community */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Komunitas</h3>
                        <p className="text-sm text-white/70">Bergabunglah dengan komunitas-komunitas yang memiliki minat dan tujuan yang sama.</p>
                        <Link
                            href={route('community-clubs.index')}
                            className="inline-flex items-center text-sm text-green-300 transition-colors hover:text-green-200"
                        >
                            Jelajahi Komunitas
                            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 border-t border-white/20 pt-8">
                    <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                        <p className="text-sm text-white/60">© {currentYear} CIGI Global. Semua hak dilindungi.</p>
                        <div className="flex space-x-6 text-sm">
                            <a href="#" className="text-white/60 transition-colors hover:text-white">
                                Kebijakan Privasi
                            </a>
                            <a href="#" className="text-white/60 transition-colors hover:text-white">
                                Syarat & Ketentuan
                            </a>
                            <a href="#" className="text-white/60 transition-colors hover:text-white">
                                Kontak
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
