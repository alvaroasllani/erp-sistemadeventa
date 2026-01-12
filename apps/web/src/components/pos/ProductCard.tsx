"use client";

import { Package } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/types/product.types";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const isOutOfStock = product.stock === 0;

    const handleClick = () => {
        if (!isOutOfStock) {
            addItem(product);
        }
    };

    return (
        <div
            className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-card p-3 transition-all duration-200 cursor-pointer h-[120px]", // Fixed height for consistency
                isOutOfStock
                    ? "opacity-60 grayscale cursor-not-allowed bg-muted/50"
                    : "hover:shadow-md hover:border-primary/50 active:scale-95 hover:bg-muted/20"
            )}
            onClick={handleClick}
        >
            {/* Stock Status Overlay */}
            {isOutOfStock && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                    <Badge variant="destructive" className="font-bold shadow-sm">AGOTADO</Badge>
                </div>
            )}

            {/* Header: Name */}
            <div className="flex-1 min-h-0">
                <h3 className="text-sm font-medium leading-tight text-foreground line-clamp-2 pr-1" title={product.name}>
                    {product.name}
                </h3>
            </div>

            {/* Body: Icon/Image (Optional, subtle if no image) */}
            <div className="flex-1 flex items-center justify-center py-1">
                {product.image ? (
                    <img src={product.image} alt="" className="h-10 w-10 object-contain mix-blend-multiply dark:mix-blend-normal" />
                ) : (
                    <div className="p-2 rounded-full bg-muted/30 text-muted-foreground/40 group-hover:text-primary/40 group-hover:bg-primary/5 transition-colors">
                        <Package size={20} strokeWidth={1.5} />
                    </div>
                )}
            </div>

            {/* Footer: Price */}
            <div className="mt-auto pt-1 flex items-end justify-between border-t border-border/30">
                <div className="text-xs text-muted-foreground font-mono">
                    {product.sku}
                </div>
                <div className="text-base font-bold text-primary tracking-tight">
                    {formatCurrency(product.salePrice)}
                </div>
            </div>
        </div>
    );
}
