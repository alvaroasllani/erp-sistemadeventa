"use client";

import { useState } from "react";
import { ShoppingCart, Banknote, CreditCard, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TicketItem } from "./TicketItem";
import { PaymentModal } from "./PaymentModal";
import { useCartStore } from "@/stores/cartStore";
import { formatCurrency, cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types/sale.types";

interface PaymentOption {
    method: PaymentMethod;
    label: string;
    icon: React.ReactNode;
}

const paymentOptions: PaymentOption[] = [
    { method: "cash", label: "Efectivo", icon: <Banknote className="h-4 w-4" /> },
    { method: "card", label: "Tarjeta", icon: <CreditCard className="h-4 w-4" /> },
    { method: "qr", label: "QR", icon: <QrCode className="h-4 w-4" /> },
];

export function SalesTicket() {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const {
        items,
        paymentMethod,
        setPaymentMethod,
        getSubtotal,
        getTotal,
        getItemCount,
    } = useCartStore();

    const subtotal = getSubtotal();
    const total = getTotal();
    const itemCount = getItemCount();

    const handleCheckout = () => {
        if (items.length > 0) {
            setIsPaymentModalOpen(true);
        }
    };

    return (
        <>
            <div className="flex h-full flex-col bg-card border-l border-border shadow-xl">
                {/* Header */}
                <div className="p-5 pb-3 border-b border-border">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Ticket de Venta</h2>
                        <span className="text-sm font-medium text-primary">
                            {itemCount} {itemCount === 1 ? "producto" : "productos"}
                        </span>
                    </div>
                </div>

                {/* Items List - Scrolleable */}
                <div className="flex-1 overflow-hidden">
                    {items.length > 0 ? (
                        <ScrollArea className="h-full px-5 py-3">
                            <div className="space-y-0">
                                {items.map((item) => (
                                    <TicketItem key={item.product.id} item={item} />
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground px-5">
                            <ShoppingCart className="h-16 w-16 opacity-30" />
                            <div className="text-center">
                                <p className="font-medium text-foreground">Carrito vacío</p>
                                <p className="text-sm">Selecciona productos para agregar</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed Bottom Section */}
                <div className="p-5 pt-3 border-t border-border space-y-4">
                    {/* Totals */}
                    <div className="space-y-2 bg-muted/50 rounded-xl p-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="tabular-nums">{formatCurrency(subtotal)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-xl font-bold">
                            <span>TOTAL</span>
                            <span className="text-primary tabular-nums">{formatCurrency(total)}</span>
                        </div>
                    </div>

                    {/* Payment Methods - Segmented Control */}
                    <div className="bg-muted p-1 rounded-lg flex gap-1">
                        {paymentOptions.map((option) => (
                            <button
                                key={option.method}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all",
                                    paymentMethod === option.method
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                onClick={() => setPaymentMethod(option.method)}
                            >
                                {option.icon}
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Checkout Button - Massive */}
                    <Button
                        data-checkout-btn
                        className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow"
                        size="lg"
                        disabled={items.length === 0}
                        onClick={handleCheckout}
                    >
                        <CreditCard className="mr-2 h-5 w-5" />
                        Cobrar (F10)
                        {items.length > 0 && (
                            <span className="ml-2 tabular-nums">{formatCurrency(total)}</span>
                        )}
                    </Button>
                </div>
            </div>

            <PaymentModal
                open={isPaymentModalOpen}
                onOpenChange={setIsPaymentModalOpen}
            />
        </>
    );
}
