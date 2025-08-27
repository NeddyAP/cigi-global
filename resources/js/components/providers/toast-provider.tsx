import { Toaster } from 'sonner';

interface ToastProviderProps {
    children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    return (
        <>
            {children}
            <Toaster
                position="top-right"
                richColors
                closeButton
                duration={4000}
                toastOptions={{
                    style: {
                        fontSize: '14px',
                        fontWeight: '500',
                    },
                }}
            />
        </>
    );
}
