import { useState, useEffect } from "react";
import { Loader2, Plus, Minus, Calculator } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { productsApi, Product } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface StockAdjustModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
    onSuccess: () => void;
}

export function StockAdjustModal({
    open,
    onOpenChange,
    product,
    onSuccess,
}: StockAdjustModalProps) {
    const [adjustment, setAdjustment] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setAdjustment("");
        }
    }, [open]);

    if (!product) return null;

    const currentStock = product.stock;
    const adjustValue = parseInt(adjustment) || 0;
    const newStock = currentStock + adjustValue;
    const isNegative = adjustValue < 0;
    const isPositive = adjustValue > 0;

    const handleSubmit = async () => {
        if (adjustValue === 0) return;
        setIsLoading(true);
        try {
            await productsApi.update(product.id, {
                stock: newStock,
            });
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Error adjusting stock:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (amount: number) => {
        const current = parseInt(adjustment) || 0;
        setAdjustment(String(current + amount));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                    <DialogTitle className="text-lg font-semibold text-slate-900">
                        Ajustar Stock
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2 mt-1.5">
                        <span className="font-medium text-slate-700">{product.name}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-xs text-slate-500">{product.sku}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-8">
                    {/* Current Stock Display */}
                    <div className="flex flex-col items-center justify-center space-y-1">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Stock Actual
                        </span>
                        <span className="text-4xl font-bold text-slate-900 tracking-tight">
                            {currentStock}
                        </span>
                    </div>

                    {/* Adjustment Input Area */}
                    <div className="space-y-4">
                        <div className="relative flex items-center justify-center">
                            <Input
                                type="number"
                                autoFocus
                                value={adjustment}
                                onChange={(e) => setAdjustment(e.target.value)}
                                placeholder="0"
                                className="h-14 text-center text-3xl font-bold border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 w-48 shadow-sm rounded-xl"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center justify-center gap-2">
                            <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-slate-100 px-3 py-1.5 h-8 text-sm font-medium transition-colors border-slate-200 text-slate-600"
                                onClick={() => handleQuickAction(-10)}
                            >
                                -10
                            </Badge>
                            <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-slate-100 px-3 py-1.5 h-8 text-sm font-medium transition-colors border-slate-200 text-slate-600"
                                onClick={() => handleQuickAction(-1)}
                            >
                                -1
                            </Badge>
                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-slate-100 px-3 py-1.5 h-8 text-sm font-medium transition-colors border-slate-200 text-slate-600"
                                onClick={() => handleQuickAction(1)}
                            >
                                +1
                            </Badge>
                            <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-slate-100 px-3 py-1.5 h-8 text-sm font-medium transition-colors border-slate-200 text-slate-600"
                                onClick={() => handleQuickAction(10)}
                            >
                                +10
                            </Badge>
                        </div>
                    </div>

                    {/* Calculation Preview */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Cálculo:</span>
                            <div className="flex items-center gap-2 font-medium">
                                <span className="text-slate-600">{currentStock}</span>
                                <span className="text-slate-400">
                                    {adjustValue >= 0 ? "+" : ""}
                                </span>
                                <span
                                    className={cn(
                                        "transition-colors",
                                        isPositive && "text-emerald-600",
                                        isNegative && "text-red-600",
                                        !adjustValue && "text-slate-400"
                                    )}
                                >
                                    {adjustValue}
                                </span>
                                <span className="text-slate-400">=</span>
                                <span
                                    className={cn(
                                        "text-lg font-bold transition-colors",
                                        newStock < 0 ? "text-red-600" : "text-slate-900"
                                    )}
                                >
                                    {newStock}
                                </span>
                            </div>
                        </div>
                        {newStock < 0 && (
                            <p className="text-xs text-red-500 mt-2 text-right font-medium">
                                El stock no puede ser negativo
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="text-muted-foreground hover:text-slate-900"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || adjustValue === 0 || newStock < 0}
                        className={cn(
                            "min-w-[120px] shadow-sm",
                            isNegative && "bg-slate-900 hover:bg-slate-800",
                            isPositive && "bg-slate-900 hover:bg-slate-800"
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Calculator className="h-4 w-4 mr-2" />
                        )}
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
