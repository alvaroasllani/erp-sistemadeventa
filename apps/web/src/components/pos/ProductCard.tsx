"use client";

import { formatCurrency, cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/types/product.types";

interface ProductCardProps {
    product: Product;
}

// Color palette for product initials fallback
const categoryColors: Record<string, string> = {
    "Herramientas": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    "Pinturas": "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    "Electricidad": "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    "Plomería": "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300",
    "Seguridad": "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    "Ferretería General": "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
};

function getProductInitials(name: string): string {
    return name
        .split(" ")
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join("");
}

function getCategoryColor(category: string): string {
    return categoryColors[category] || "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300";
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
                "relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 cursor-pointer group",
                isOutOfStock
                    ? "opacity-50 grayscale cursor-not-allowed"
                    : "hover:-translate-y-1 hover:shadow-md hover:border-primary"
            )}
            onClick={handleClick}
        >
            <div className="p-4">
                <div className="flex flex-col items-center gap-3">
                    {/* Product Image/Initials Fallback */}
                    <div className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-xl",
                        product.image ? "bg-muted" : getCategoryColor(product.category)
                    )}>
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover rounded-xl"
                            />
                        ) : (
                            <span className="text-xl font-bold">
                                {getProductInitials(product.name)}
                            </span>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="w-full text-center">
                        <p className="text-sm font-semibold text-foreground leading-tight line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                        </p>

                        {isOutOfStock ? (
                            <span className="inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs font-bold bg-destructive/10 text-destructive">
                                AGOTADO
                            </span>
                        ) : (
                            <p className="mt-1 text-lg font-bold text-primary">
                                {formatCurrency(product.salePrice)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
