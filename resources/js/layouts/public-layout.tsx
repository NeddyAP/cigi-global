import PublicFooter from '@/components/public-footer';
import PublicHeader from '@/components/public-header';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export default function PublicLayout({ children, title, description }: PublicLayoutProps) {
    const pageTitle = title ? `${title} - CIGI Global` : 'CIGI Global';

    return (
        <>
            <Head title={pageTitle}>{description && <meta name="description" content={description} />}</Head>

            <div className="flex min-h-screen flex-col bg-black">
                <PublicHeader />

                <main className="flex-1 pt-16 md:pt-20">{children}</main>

                <PublicFooter />
            </div>
        </>
    );
}
