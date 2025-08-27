import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface FormSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    loadingText?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
}

export function FormSubmitButton({
    children,
    loadingText = 'Memproses...',
    variant = 'default',
    size = 'default',
    className = '',
    ...props
}: FormSubmitButtonProps) {
    // Inertia useForm exposes `processing` boolean
    const { processing } = useForm();
    // useToast exposes `loading` which returns a toast id, and `dismiss`
    const { loading: showLoadingToast, dismiss } = useToast();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (props.onClick) {
            props.onClick(e);
        }

        // Show loading toast for long operations
        if (!processing) {
            const toastId = showLoadingToast('Memproses permintaan...');

            // Auto dismiss after 10 seconds if still loading
            setTimeout(() => {
                dismiss(toastId);
            }, 10000);
        }
    };

    return (
        <Button
            type="submit"
            variant={variant}
            size={size}
            className={className}
            disabled={processing}
            onClick={handleClick}
            {...props}
        >
            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {processing ? loadingText : children}
        </Button>
    );
}
