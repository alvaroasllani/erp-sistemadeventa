"use client";

import { ShoppingCart, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { formatCurrency } from "@/lib/utils";

interface MobileCartBarProps {
    onOpenCart: () => void;
}

export function MobileCartBar({ onOpenCart }: MobileCartBarProps) {
    const { getItemCount, getTotal } = useCartStore();
    const itemCount = getItemCount();
    const total = getTotal();

    if (itemCount === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div className="bg-background border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.15)] p-3 safe-area-inset-bottom">
                <Button
                    onClick={onOpenCart}
                    className="w-full h-14 text-base font-semibold shadow-lg shadow-primary/20 rounded-xl flex items-center justify-between px-5"
                    size="lg"
                >
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-2 -right-2 bg-background text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        </div>
                        <span>Ver Pedido</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{formatCurrency(total)}</span>
                        <ChevronUp className="h-5 w-5" />
                    </div>
                </Button>
            </div>
        </div>
    );
}
