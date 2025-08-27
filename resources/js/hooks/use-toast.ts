import { toast } from 'sonner';

export const useToast = () => {
    const showSuccess = (message: string, options?: Parameters<typeof toast.success>[1]) => {
        toast.success(message, options);
    };

    const showError = (message: string, options?: Parameters<typeof toast.error>[1]) => {
        toast.error(message, options);
    };

    const showWarning = (message: string, options?: Parameters<typeof toast.warning>[1]) => {
        toast.warning(message, options);
    };

    const showInfo = (message: string, options?: Parameters<typeof toast.info>[1]) => {
        toast.info(message, options);
    };

    const showLoading = (message: string, options?: Parameters<typeof toast.loading>[1]) => {
        return toast.loading(message, options);
    };

    const dismiss = (toastId?: string | number) => {
        toast.dismiss(toastId);
    };

    const dismissAll = () => {
        toast.dismiss();
    };

    return {
        success: showSuccess,
        error: showError,
        warning: showWarning,
        info: showInfo,
        loading: showLoading,
        dismiss,
        dismissAll,
    };
};
