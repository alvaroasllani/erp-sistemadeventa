"use client";

import { useState } from "react";
import { ShoppingCart, Banknote, CreditCard, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        getTax,
        getTotal,
        getItemCount,
    } = useCartStore();

    const subtotal = getSubtotal();
    const tax = getTax();
    const total = getTotal();
    const itemCount = getItemCount();

    const handleCheckout = () => {
        if (items.length > 0) {
            setIsPaymentModalOpen(true);
        }
    };

    return (
        <>
            <Card className="flex h-full flex-col">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                        <span>Ticket de Venta</span>
                        <span className="text-sm font-normal text-muted-foreground">
                            {itemCount} {itemCount === 1 ? "producto" : "productos"}
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col p-4 pt-0">
                    {/* Items List */}
                    {items.length > 0 ? (
                        <ScrollArea className="flex-1 -mx-2 px-2">
                            <div className="space-y-0">
                                {items.map((item) => (
                                    <TicketItem key={item.product.id} item={item} />
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
                            <ShoppingCart className="h-12 w-12 opacity-50" />
                            <div className="text-center">
                                <p className="font-medium">Carrito vacío</p>
                                <p className="text-sm">Selecciona productos para agregar</p>
                            </div>
                        </div>
                    )}

                    <Separator className="my-4" />

                    {/* Totals */}
                    <div className="space-y-2 bg-muted rounded-lg p-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">ITBIS (18%)</span>
                            <span>{formatCurrency(tax)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                            <span>TOTAL</span>
                            <span className="text-primary">{formatCurrency(total)}</span>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="mt-4 grid grid-cols-3 gap-2">
                        {paymentOptions.map((option) => (
                            <Button
                                key={option.method}
                                variant={paymentMethod === option.method ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                    "flex flex-col gap-1 h-auto py-2 transition-all",
                                    paymentMethod === option.method && "ring-2 ring-primary ring-offset-2"
                                )}
                                onClick={() => setPaymentMethod(option.method)}
                            >
                                {option.icon}
                                <span className="text-xs">{option.label}</span>
                            </Button>
                        ))}
                    </div>

                    {/* Checkout Button */}
                    <Button
                        className="mt-4 h-14 text-lg font-semibold"
                        size="lg"
                        disabled={items.length === 0}
                        onClick={handleCheckout}
                    >
                        <CreditCard className="mr-2 h-5 w-5" />
                        Cobrar (F10)
                        {items.length > 0 && (
                            <span className="ml-2">{formatCurrency(total)}</span>
                        )}
                    </Button>
                </CardContent>
            </Card>

            <PaymentModal
                open={isPaymentModalOpen}
                onOpenChange={setIsPaymentModalOpen}
            />
        </>
    );
}
