"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "./ProductCard";
import { mockProducts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ProductGridProps {
    className?: string;
}

export function ProductGrid({ className }: ProductGridProps) {
    const [search, setSearch] = useState("");

    const filteredProducts = useMemo(() => {
        if (!search.trim()) return mockProducts;

        const searchLower = search.toLowerCase();
        return mockProducts.filter(
            (product) =>
                product.name.toLowerCase().includes(searchLower) ||
                product.sku.toLowerCase().includes(searchLower)
        );
    }, [search]);

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
                    className="h-12 pl-10 text-base"
                />
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="flex h-48 items-center justify-center text-muted-foreground">
                        No se encontraron productos
                    </div>
                )}
            </div>
        </div>
    );
}
