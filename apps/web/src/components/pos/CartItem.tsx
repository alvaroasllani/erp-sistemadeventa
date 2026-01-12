"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import type { CartItem as CartItemType } from "@/types/sale.types";

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCartStore();
    const lineTotal = item.product.salePrice * item.quantity;

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1) {
            updateQuantity(item.product.id, newQuantity);
        }
    };

    return (
        <div className="group flex items-start gap-3 py-3 border-b border-border/50 last:border-0 hover:bg-slate-50/50 transition-colors px-1">
            {/* Quantity Stepper */}
            <div className="flex flex-col items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 rounded-full border-slate-200"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                >
                    <Plus className="h-3 w-3" />
                </Button>
                <div className="h-7 w-8 flex items-center justify-center font-bold text-sm bg-white border border-slate-200 rounded-md shadow-sm">
                    {item.quantity}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 rounded-full border-slate-200"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={item.quantity <= 1}
                >
                    <Minus className="h-3 w-3" />
                </Button>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-1 pt-1">
                <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-medium text-foreground leading-tight line-clamp-2">
                        {item.product.name}
                    </p>
                    <p className="text-sm font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(lineTotal)}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        {formatCurrency(item.product.salePrice)} un.
                    </p>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeItem(item.product.id)}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
