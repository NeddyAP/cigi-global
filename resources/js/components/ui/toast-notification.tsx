import { CheckCircle, Info, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ToastNotificationProps {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

export const showToastNotification = ({ type, title, message, duration = 4000 }: ToastNotificationProps) => {
    const iconMap = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const toastOptions = {
        duration,
        icon: iconMap[type],
        style: {
            background: 'white',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
        },
    };

    switch (type) {
        case 'success':
            toast.success(title, {
                ...toastOptions,
                description: message,
            });
            break;
        case 'error':
            toast.error(title, {
                ...toastOptions,
                description: message,
            });
            break;
        case 'warning':
            toast.warning(title, {
                ...toastOptions,
                description: message,
            });
            break;
        case 'info':
            toast.info(title, {
                ...toastOptions,
                description: message,
            });
            break;
    }
};

// Export individual functions for easier use
export const showSuccessToast = (title: string, message?: string, duration?: number) => {
    showToastNotification({ type: 'success', title, message, duration });
};

export const showErrorToast = (title: string, message?: string, duration?: number) => {
    showToastNotification({ type: 'error', title, message, duration });
};

export const showWarningToast = (title: string, message?: string, duration?: number) => {
    showToastNotification({ type: 'warning', title, message, duration });
};

export const showInfoToast = (title: string, message?: string, duration?: number) => {
    showToastNotification({ type: 'info', title, message, duration });
};
