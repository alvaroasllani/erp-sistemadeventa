"use client";

import { useEffect, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/stores/cartStore";
import { formatCurrency, cn } from "@/lib/utils";
import { Banknote, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { salesApi } from "@/lib/api-client";
import { toast } from "sonner";

interface PaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PaymentModal({ open, onOpenChange }: PaymentModalProps) {
    const { items, getTotal, clearCart, paymentMethod } = useCartStore();
    const [amountReceived, setAmountReceived] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const total = getTotal();

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setAmountReceived("");
            setIsProcessing(false);
        }
    }, [open]);

    // Handle initial focus
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                const input = document.getElementById("amount-received-input");
                input?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const receivedValue = parseFloat(amountReceived) || 0;
    const change = receivedValue - total;
    const isSufficient = receivedValue >= total;
    const remaining = total - receivedValue;

    const handleQuickCash = (amount: number) => {
        setAmountReceived(amount.toString());
        document.getElementById("amount-received-input")?.focus();
    };

    const handleClear = () => {
        setAmountReceived("");
        document.getElementById("amount-received-input")?.focus();
    };

    const handleAddBill = (bill: number) => {
        const currentCheck = parseFloat(amountReceived) || 0;
        const newValue = currentCheck + bill;
        // Fix floating point issues (e.g. 0.1 + 0.2 = 0.300000004)
        setAmountReceived(newValue.toFixed(2).replace(/\.00$/, ""));
        document.getElementById("amount-received-input")?.focus();
    };

    const handleConfirm = async () => {
        if (!isSufficient) return;

        setIsProcessing(true);
        try {
            // Prepare payload
            const saleData = {
                items: items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                })),
                paymentMethod: paymentMethod, // Backend expects lowercase "cash" | "card" | "qr"
                customerId: undefined
            };

            // Call API
            await salesApi.create(saleData);

            // Success feedback
            toast.success("Venta registrada correctamente");

            clearCart();
            onOpenChange(false);
        } catch (error) {
            console.error("Payment failed", error);
            toast.error("Error al procesar la venta");
        } finally {
            setIsProcessing(false);
        }
    };

    // Keyboard handling for Enter
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && isSufficient) {
            e.preventDefault();
            handleConfirm();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden bg-background border-border shadow-2xl">
                {/* 1. Header & Total */}
                <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6 bg-muted/30">
                    <DialogTitle className="text-lg font-medium text-muted-foreground mb-4">
                        Confirmar Pago
                    </DialogTitle>
                    <div className="text-4xl sm:text-5xl font-black text-foreground tracking-tight tabular-nums">
                        {formatCurrency(total)}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mt-2">
                        Total de la orden
                    </p>
                </div>

                <div className="px-6 py-6 space-y-8">
                    {/* 2. Input de "Monto Recibido" */}
                    <div className="space-y-6">
                        <div className="relative flex items-center justify-center">
                            <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-medium text-muted-foreground/50">
                                Bs
                            </span>
                            <Input
                                id="amount-received-input"
                                type="number"
                                inputMode="decimal"
                                placeholder="0.00"
                                className={cn(
                                    "h-20 text-center text-4xl font-bold bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-16",
                                    "placeholder:text-muted-foreground/20",
                                    isSufficient ? "text-foreground" : "text-amber-600 dark:text-amber-500"
                                )}
                                value={amountReceived}
                                onChange={(e) => setAmountReceived(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                            {/* Underline */}
                            <div className={cn(
                                "absolute bottom-2 left-10 right-10 h-0.5 rounded-full transition-colors duration-300",
                                isSufficient ? "bg-primary/20" : "bg-amber-500/30"
                            )} />
                        </div>

                        {/* 3. Feedback de "Cambio" */}
                        <div className="flex justify-center">
                            {amountReceived === "" ? (
                                <div className="h-10" />
                            ) : !isSufficient ? (
                                <div className="animate-in fade-in slide-in-from-top-2 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-500 font-medium">
                                    <span className="text-sm">Faltan</span>
                                    <span className="text-lg font-bold tabular-nums">
                                        {formatCurrency(remaining)}
                                    </span>
                                </div>
                            ) : (
                                <div className="animate-in zoom-in-50 duration-300 flex flex-col items-center">
                                    <span className="text-sm font-medium text-muted-foreground mb-1">Cambio a devolver</span>
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
                                        <span className="text-3xl font-black tabular-nums tracking-tight">
                                            {formatCurrency(change)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 4. Botones de "Efectivo Rápido" */}
                    {/* 4. Selector de Billetes (Acumulativo) */}
                    {/* 4. Selector de Efectivo (Acumulativo) */}
                    <div className="flex flex-col gap-3">
                        {/* Botón Exacto */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 h-11 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-lg mb-1"
                                onClick={() => handleQuickCash(total)}
                            >
                                Exacto {formatCurrency(total)}
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-11 w-11 shrink-0 border-destructive/20 hover:bg-destructive/10 text-destructive"
                                title="Limpiar monto"
                                onClick={handleClear}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" /><path d="M22 21H7" /><path d="m5 11 9 9" /></svg>
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {/* Monedas */}
                            <div>
                                <p className="text-xs text-muted-foreground font-medium mb-1.5 ml-1">Monedas</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {[0.50, 1, 2, 5].map((coin) => (
                                        <Button
                                            key={coin}
                                            variant="outline"
                                            className="h-12 flex flex-col items-center justify-center gap-0 border-border/60 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 active:scale-95 transition-all"
                                            onClick={() => handleAddBill(coin)}
                                        >
                                            <span className="text-lg font-bold text-foreground tabular-nums leading-none">
                                                {coin < 1 ? "50c" : coin}
                                            </span>
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Billetes */}
                            <div>
                                <p className="text-xs text-muted-foreground font-medium mb-1.5 ml-1">Billetes</p>
                                <div className="grid grid-cols-5 gap-2">
                                    {[10, 20, 50, 100, 200].map((bill) => (
                                        <Button
                                            key={bill}
                                            variant="outline"
                                            className="h-14 flex flex-col items-center justify-center gap-0 border-border/60 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 active:scale-95 transition-all"
                                            onClick={() => handleAddBill(bill)}
                                        >
                                            <span className="text-xs text-muted-foreground font-medium">Bs</span>
                                            <span className="text-lg font-bold text-foreground tabular-nums leading-none">
                                                {bill}
                                            </span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Footer */}
                <div className="p-4 bg-muted/30 border-t border-border flex gap-3">
                    <Button
                        variant="ghost"
                        size="lg"
                        className="flex-1 text-muted-foreground hover:text-foreground h-12"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        size="lg"
                        className="flex-[2] h-12 text-lg font-bold shadow-lg shadow-primary/20"
                        disabled={!isSufficient || isProcessing}
                        onClick={handleConfirm}
                    >
                        {isProcessing ? "Procesando..." : (
                            <>
                                Finalizar Venta
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
