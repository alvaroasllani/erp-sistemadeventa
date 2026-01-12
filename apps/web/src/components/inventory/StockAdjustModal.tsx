"use client";

import { useState } from "react";
import { Loader2, Plus, Minus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { productsApi, Product } from "@/lib/api-client";

interface StockAdjustModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
    onSuccess: () => void;
}

export function StockAdjustModal({ open, onOpenChange, product, onSuccess }: StockAdjustModalProps) {
    const [adjustment, setAdjustment] = useState<string>("0");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const adjustmentValue = parseInt(adjustment, 10) || 0;
    const newStock = product ? product.stock + adjustmentValue : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product || adjustmentValue === 0) return;

        setIsLoading(true);
        setError(null);

        try {
            await productsApi.update(product.id, {
                stock: newStock,
            });
            onSuccess();
            onOpenChange(false);
            setAdjustment("0");
        } catch (err: any) {
            console.error("Error adjusting stock:", err);
            setError(err.message || "Error al ajustar el stock");
        } finally {
            setIsLoading(false);
        }
    };

    const quickAdjust = (amount: number) => {
        setAdjustment(String(adjustmentValue + amount));
    };

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ajustar Stock</DialogTitle>
                    <DialogDescription>
                        {product.name} (SKU: {product.sku})
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Stock actual</span>
                        <span className="text-2xl font-bold">{product.stock}</span>
                    </div>

                    <div className="space-y-2">
                        <Label>Ajuste (positivo para agregar, negativo para quitar)</Label>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => quickAdjust(-10)}
                                disabled={newStock < 0 && adjustmentValue - 10 < -product.stock}
                            >
                                -10
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => quickAdjust(-1)}
                                disabled={newStock <= 0 && adjustmentValue - 1 < -product.stock}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                                type="number"
                                value={adjustment}
                                onChange={(e) => setAdjustment(e.target.value)}
                                className="text-center text-lg font-semibold"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => quickAdjust(1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => quickAdjust(10)}
                            >
                                +10
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                        <span className="text-primary font-medium">Nuevo stock</span>
                        <span className={`text-2xl font-bold ${newStock < 0 ? "text-destructive" : "text-primary"}`}>
                            {Math.max(0, newStock)}
                        </span>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || adjustmentValue === 0 || newStock < 0}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Aplicar Ajuste"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
