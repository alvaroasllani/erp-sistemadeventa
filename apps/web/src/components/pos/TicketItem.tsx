"use client";

import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import type { CartItem as CartItemType } from "@/types/sale.types";

interface TicketItemProps {
    item: CartItemType;
}

export function TicketItem({ item }: TicketItemProps) {
    const { updateQuantity, removeItem } = useCartStore();
    const lineTotal = item.product.salePrice * item.quantity;

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1) {
            updateQuantity(item.product.id, newQuantity);
        }
    };

    return (
        <div className="flex items-center gap-2 py-2 border-b border-border last:border-0">
            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                    {item.product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                    {formatCurrency(item.product.salePrice)} c/u
                </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                >
                    <Minus className="h-3 w-3" />
                </Button>
                <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="h-7 w-12 text-center p-0 text-sm"
                />
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>

            {/* Line Total */}
            <div className="w-20 text-right">
                <p className="text-sm font-semibold">{formatCurrency(lineTotal)}</p>
            </div>

            {/* Remove Button */}
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => removeItem(item.product.id)}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}
