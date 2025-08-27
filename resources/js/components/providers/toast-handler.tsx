import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function ToastHandler() {
    // Explicitly type the page props so TypeScript knows the flash shape
    const { props } = usePage<{
        success?: string;
        error?: string | { message?: string } | null;
        warning?: string;
        info?: string;
    }>();

    const { success, error, warning, info } = props || {};

    useEffect(() => {
        // Handle success messages
        if (success) {
            toast.success(success);
        }

        // Handle error messages
        if (error) {
            if (typeof error === 'string') {
                toast.error(error);
            } else if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
                toast.error(error.message);
            } else {
                toast.error('Terjadi kesalahan yang tidak diketahui');
            }
        }

        // Handle warning messages
        if (warning) {
            toast.warning(warning);
        }

        // Handle info messages
        if (info) {
            toast.info(info);
        }
    }, [success, error, warning, info]);

    return null; // This component doesn't render anything
}
