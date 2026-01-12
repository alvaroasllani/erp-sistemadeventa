"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "./ProductCard";
import { productsApi, categoriesApi, Product, Category } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ProductGridProps {
    className?: string;
}

export function ProductGrid({ className }: ProductGridProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                productsApi.getAll({
                    limit: 100, // Fetch more for client-side filtering if needed, or update API to filter
                    search: search || undefined,
                    categoryId: selectedCategory !== "all" ? selectedCategory : undefined
                }),
                categoriesApi.getAll()
            ]);

            setProducts(productsRes.data);
            setCategories(categoriesRes);
        } catch (error) {
            console.error("Error loading POS data:", error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [search, selectedCategory]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            loadData();
        }, 300);
        return () => clearTimeout(timer);
    }, [loadData]);

    // Map to ProductCard format
    const productItems = products.map(p => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        category: p.category?.name || "Sin categoría",
        salePrice: Number(p.salePrice),
        stock: p.stock,
        image: p.image || undefined,
        description: p.description || undefined,
        status: p.status as any
    }));

    return (
        <div className={cn("flex flex-col gap-4 h-full", className)}>
            {/* Header: Search & Categories */}
            <div className="flex flex-col gap-3 shrink-0">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="pos-search"
                        type="search"
                        placeholder="Buscar productos... (F2)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-11 pl-9 text-base bg-background border-border rounded-xl shadow-sm focus-visible:ring-primary/20"
                    />
                </div>

                {/* Categories Tabs */}
                <ScrollArea className="w-full whitespace-nowrap pb-1">
                    <div className="flex w-max space-x-2 p-1">
                        <Badge
                            variant={selectedCategory === "all" ? "default" : "outline"}
                            className={cn(
                                "cursor-pointer px-4 py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors rounded-full",
                                selectedCategory === "all" ? "shadow-md" : "bg-card hover:bg-muted border-border"
                            )}
                            onClick={() => setSelectedCategory("all")}
                        >
                            Todos
                        </Badge>
                        {categories.map((cat) => (
                            <Badge
                                key={cat.id}
                                variant={selectedCategory === cat.id ? "default" : "outline"}
                                className={cn(
                                    "cursor-pointer px-4 py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors rounded-full flex gap-2 items-center",
                                    selectedCategory === cat.id ? "shadow-md" : "bg-card hover:bg-muted border-border"
                                )}
                                onClick={() => setSelectedCategory(cat.id)}
                                style={selectedCategory !== cat.id ? { borderColor: `${cat.color}40` } : { backgroundColor: cat.color }}
                            >
                                {selectedCategory !== cat.id && (
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                )}
                                {cat.name}
                            </Badge>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="h-2" />
                </ScrollArea>
            </div>

            {/* Products Grid - Scrollable Area */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {productItems.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-muted-foreground gap-2">
                                <Package className="h-12 w-12 opacity-20" />
                                <p>No se encontraron productos</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-20">
                                {productItems.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

