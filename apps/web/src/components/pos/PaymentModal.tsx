"use client";

import { useState } from "react";
import { Check, Printer, Banknote } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cartStore";
import { formatCurrency } from "@/lib/utils";

interface PaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PaymentModal({ open, onOpenChange }: PaymentModalProps) {
    const { paymentMethod, getTotal, clearCart } = useCartStore();
    const total = getTotal();
    const [amountReceived, setAmountReceived] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const receivedNum = parseFloat(amountReceived) || 0;
    const change = receivedNum - total;

    const handlePayment = async () => {
        setIsProcessing(true);
        // Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsProcessing(false);
        setIsCompleted(true);
    };

    const handleClose = () => {
        if (isCompleted) {
            clearCart();
        }
        setIsCompleted(false);
        setAmountReceived("");
        onOpenChange(false);
    };

    const handlePrint = () => {
        // In a real app, this would trigger receipt printing
        console.log("Printing receipt...");
        handleClose();
    };

    const quickAmounts = [500, 1000, 2000, 5000];

    if (isCompleted) {
        return (
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md">
                    <div className="flex flex-col items-center gap-4 py-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <Check className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-semibold">¡Venta Completada!</h2>
                            <p className="mt-1 text-muted-foreground">
                                Total: {formatCurrency(total)}
                            </p>
                            {paymentMethod === "cash" && change > 0 && (
                                <p className="mt-2 text-lg font-bold text-primary">
                                    Cambio: {formatCurrency(change)}
                                </p>
                            )}
                        </div>
                        <div className="flex w-full gap-2 mt-4">
                            <Button variant="outline" className="flex-1" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" />
                                Imprimir
                            </Button>
                            <Button className="flex-1" onClick={handleClose}>
                                Nueva Venta
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Procesar Pago</DialogTitle>
                    <DialogDescription>
                        {paymentMethod === "cash" && "Ingresa el monto recibido"}
                        {paymentMethod === "card" && "Confirma el pago con tarjeta"}
                        {paymentMethod === "qr" && "Escanea el código QR para pagar"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Total */}
                    <div className="rounded-lg bg-muted p-4 text-center">
                        <p className="text-sm text-muted-foreground">Total a pagar</p>
                        <p className="text-3xl font-bold text-primary">
                            {formatCurrency(total)}
                        </p>
                    </div>

                    {/* Cash Payment */}
                    {paymentMethod === "cash" && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Monto recibido</label>
                                <div className="relative">
                                    <Banknote className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={amountReceived}
                                        onChange={(e) => setAmountReceived(e.target.value)}
                                        className="h-12 pl-10 text-xl font-semibold"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Quick Amounts */}
                            <div className="grid grid-cols-4 gap-2">
                                {quickAmounts.map((amount) => (
                                    <Button
                                        key={amount}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAmountReceived(amount.toString())}
                                    >
                                        ${amount}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setAmountReceived(Math.ceil(total).toString())}
                            >
                                Monto exacto: {formatCurrency(total)}
                            </Button>

                            {receivedNum > 0 && (
                                <>
                                    <Separator />
                                    <div className="flex justify-between text-lg">
                                        <span>Cambio</span>
                                        <span
                                            className={change >= 0 ? "text-green-600 font-bold" : "text-destructive"}
                                        >
                                            {formatCurrency(Math.max(0, change))}
                                        </span>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Card Payment */}
                    {paymentMethod === "card" && (
                        <div className="text-center text-muted-foreground py-4">
                            <p>Inserta o acerca la tarjeta al terminal</p>
                        </div>
                    )}

                    {/* QR Payment */}
                    {paymentMethod === "qr" && (
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="h-48 w-48 bg-muted rounded-lg flex items-center justify-center">
                                <span className="text-muted-foreground">Código QR</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Escanea con tu aplicación bancaria
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={handlePayment}
                        disabled={paymentMethod === "cash" && receivedNum < total}
                    >
                        {isProcessing ? "Procesando..." : "Confirmar Pago"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
