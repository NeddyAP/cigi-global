import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    itemName?: string;
    isLoading?: boolean;
}

export default function DeleteConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Konfirmasi Hapus',
    description,
    confirmText = 'Hapus',
    cancelText = 'Batal',
    itemName,
    isLoading = false,
}: DeleteConfirmationDialogProps) {
    const defaultDescription = itemName
        ? `Apakah Anda yakin ingin menghapus "${itemName}"? Tindakan ini tidak dapat dibatalkan.`
        : 'Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.';

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-red-600" />
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>{description || defaultDescription}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline" onClick={onClose} disabled={isLoading}>
                            {cancelText}
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Menghapus...
                                </div>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {confirmText}
                                </>
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
