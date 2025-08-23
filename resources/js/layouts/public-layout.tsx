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

            <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
                <PublicHeader businessUnits={businessUnits} communityClubs={communityClubs} />

                <main className="flex-1">{children}</main>

                <PublicFooter />
            </div>
        </>
    );
}
