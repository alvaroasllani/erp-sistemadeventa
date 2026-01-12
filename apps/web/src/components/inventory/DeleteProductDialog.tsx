"use client";

import { Loader2, AlertTriangle } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Product } from "@/lib/api-client";

interface DeleteProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
    onConfirm: () => void;
    isLoading?: boolean;
}

export function DeleteProductDialog({
    open,
    onOpenChange,
    product,
    onConfirm,
    isLoading = false,
}: DeleteProductDialogProps) {
    if (!product) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        ¿Eliminar producto?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción eliminará permanentemente el producto{" "}
                        <strong>"{product.name}"</strong> (SKU: {product.sku}).
                        <br /><br />
                        Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Eliminando...
                            </>
                        ) : (
                            "Eliminar"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
