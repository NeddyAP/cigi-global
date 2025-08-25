import AppLayout from '@/layouts/app-layout';
import { type ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return <AppLayout>{children}</AppLayout>;
}
