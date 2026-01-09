"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "./ProductCard";
import { productsApi, Product } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface ProductGridProps {
    className?: string;
}

export function ProductGrid({ className }: ProductGridProps) {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await productsApi.getAll({
                limit: 100,
                search: search || undefined
            });
            setProducts(response.data);
        } catch (error) {
            console.error("Error loading products:", error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [search]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            loadProducts();
        }, 300);
        return () => clearTimeout(timer);
    }, [loadProducts]);

    // Map to ProductCard format
    const productItems = products.map(p => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        category: p.category?.name || "Sin categoría",
        salePrice: typeof p.salePrice === 'number' ? p.salePrice : Number(p.salePrice),
        stock: p.stock,
        image: p.image,
    }));

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                    id="pos-search"
                    type="search"
                    placeholder="Buscar productos... (F2)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-12 pl-10 text-base bg-background border-border rounded-xl shadow-sm"
                />
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-auto">
                {isLoading ? (
                    <div className="flex h-48 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-4">
                            {productItems.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {productItems.length === 0 && (
                            <div className="flex h-48 items-center justify-center text-muted-foreground">
                                No se encontraron productos
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

