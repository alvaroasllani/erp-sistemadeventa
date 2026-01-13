"use client";

import { useState } from "react";
import {
    Trash2,
    Minus,
    Plus,
    Banknote,
    CreditCard,
    QrCode,
    X,
    ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/stores/cartStore";
import { formatCurrency, cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types/sale.types";
import { PaymentModal } from "./PaymentModal";

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

export function CartSidebar() {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const {
        items,
        paymentMethod,
        setPaymentMethod,
        updateQuantity,
        removeItem,
        clearCart,
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
                {/* 1. Header del Ticket */}
                <div className="flex items-center justify-between p-4 pb-2 shrink-0">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-foreground">Ticket Actual</h2>
                        <span className="text-xs font-medium px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                            {itemCount}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={clearCart}
                        disabled={items.length === 0}
                    >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Limpiar
                    </Button>
                </div>
                <Separator className="shrink-0" />

                {/* 2. Lista de Productos (ScrollArea) */}
                <div className="flex-1 overflow-hidden">
                    {items.length > 0 ? (
                        <ScrollArea className="h-full px-4">
                            <div className="flex flex-col gap-1 py-2">
                                {items.map((item) => {
                                    const lineTotal = item.product.salePrice * item.quantity;

                                    return (
                                        <div
                                            key={item.product.id}
                                            className="group flex items-center justify-between py-3 border-b border-border/40 last:border-0 hover:bg-accent/50 -mx-2 px-2 rounded-md transition-colors"
                                        >
                                            {/* Izquierda (Info) */}
                                            <div className="flex-1 min-w-0 pr-3">
                                                <p className="font-medium text-sm text-foreground line-clamp-1 leading-tight">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {formatCurrency(item.product.salePrice)}
                                                </p>
                                            </div>

                                            {/* Derecha (Controles & Precio) */}
                                            <div className="flex items-center gap-3 shrink-0">
                                                {/* Stepper Compacto */}
                                                <div className="flex items-center bg-muted/80 rounded-md border border-border shadow-sm h-7">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-none rounded-l-md hover:bg-background disabled:opacity-50"
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <div className="w-8 text-center text-sm font-semibold tabular-nums">
                                                        {item.quantity}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-none rounded-r-md hover:bg-background"
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>

                                                {/* Precio Final */}
                                                <div className="w-[70px] text-right font-bold text-sm tabular-nums">
                                                    {formatCurrency(lineTotal)}
                                                </div>

                                                {/* Botón Eliminar - Siempre visible */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => removeItem(item.product.id)}
                                                    tabIndex={-1}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground px-5 opacity-60">
                            <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center">
                                <ShoppingCart className="h-9 w-9 opacity-40" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="font-medium text-foreground text-base">Carrito vacío</p>
                                <p className="text-sm">Agrega productos para comenzar</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Footer de Pago (Fixed Bottom) */}
                <div className="p-4 bg-background border-t border-border space-y-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">

                    {/* Resumen */}
                    <div className="space-y-1.5 px-1">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Subtotal</span>
                            <span className="tabular-nums">{formatCurrency(subtotal)}</span>
                        </div>
                        {/* Se puede agregar descuento aquí si la store lo soporta */}
                        <div className="flex justify-between items-end pt-1">
                            <span className="text-base font-bold text-foreground">Total</span>
                            <span className="text-2xl font-bold text-primary tabular-nums leading-none">
                                {formatCurrency(total)}
                            </span>
                        </div>
                    </div>

                    {/* Selector de Método de Pago */}
                    <div className="grid grid-cols-3 gap-2">
                        {paymentOptions.map((option) => (
                            <button
                                key={option.method}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium transition-all duration-200",
                                    paymentMethod === option.method
                                        ? "bg-primary text-primary-foreground border-primary shadow-md ring-1 ring-primary ring-offset-1"
                                        : "bg-card text-muted-foreground border-border hover:bg-muted hover:border-primary/50"
                                )}
                                onClick={() => setPaymentMethod(option.method)}
                            >
                                {option.icon}
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Botón de Acción */}
                    <Button
                        data-checkout-btn
                        className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.99] transition-all"
                        size="lg"
                        disabled={items.length === 0}
                        onClick={handleCheckout}
                    >
                        Cobrar
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
