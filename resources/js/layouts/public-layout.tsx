import PublicFooter from '@/components/public-footer';
import PublicHeader from '@/components/public-header';
import { type BusinessUnit, type CommunityClub } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
    businessUnits?: BusinessUnit[];
    communityClubs?: CommunityClub[];
}

export default function PublicLayout({ children, title, description, businessUnits = [], communityClubs = [] }: PublicLayoutProps) {
    const pageTitle = title ? `${title} - CIGI Global` : 'CIGI Global';

    return (
        <>
            <Head title={pageTitle}>{description && <meta name="description" content={description} />}</Head>

            <div className="flex min-h-screen flex-col bg-black">
                <PublicHeader businessUnits={businessUnits} communityClubs={communityClubs} />

                <main className="flex-1 pt-16 md:pt-20">{children}</main>

                <PublicFooter />
            </div>
        </>
    );
}
