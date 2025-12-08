"use client";

import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/types/product.types";

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
        <Card
            className={cn(
                "cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg",
                isOutOfStock
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-[1.02] active:scale-[0.98]"
            )}
            onClick={handleClick}
        >
            <CardContent className="p-4">
                <div className="flex flex-col items-center gap-3">
                    {/* Product Image/Icon */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover rounded-lg"
                            />
                        ) : (
                            <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="w-full text-center">
                        <p className="text-sm font-medium text-foreground line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                        </p>
                        <p className="mt-1 text-lg font-bold text-primary">
                            {formatCurrency(product.salePrice)}
                        </p>
                        {isOutOfStock && (
                            <p className="mt-1 text-xs text-destructive font-medium">
                                Sin stock
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
