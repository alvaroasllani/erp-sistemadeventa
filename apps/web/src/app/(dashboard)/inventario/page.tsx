"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "@/components/inventory/ProductFilters";
import { ProductTable } from "@/components/inventory/ProductTable";
import { productsApi, Product } from "@/lib/api-client";
import type { ProductFilters as ProductFiltersType } from "@/types/product.types";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export default function InventarioPage() {
    const [filters, setFilters] = useState<ProductFiltersType>({
        search: "",
        category: "all",
        stockStatus: "all",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Load products from API
    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await productsApi.getAll({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                search: filters.search || undefined,
                stockStatus: filters.stockStatus !== "all" ? filters.stockStatus : undefined,
            });
            setProducts(response.data);
            setTotalProducts(response.meta.total);
        } catch (error) {
            console.error("Error loading products:", error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, filters.search, filters.stockStatus]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // Pagination
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

    // Reset page when filters change
    const handleFiltersChange = (newFilters: ProductFiltersType) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    // Map API products to table format
    const tableProducts = products.map(p => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        category: p.category?.name || "Sin categoría",
        costPrice: typeof p.costPrice === 'number' ? p.costPrice : Number(p.costPrice),
        salePrice: typeof p.salePrice === 'number' ? p.salePrice : Number(p.salePrice),
        stock: p.stock,
        minStock: p.minStock,
        status: p.status,
        image: p.image,
    }));

    return (
        <div className="space-y-6">
            <PageHeader
                title="Inventario"
                description="Gestiona tus productos y stock"
                actions={
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Producto
                    </Button>
                }
            />

            {/* Filters */}
            <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} />

            {/* Results count */}
            <p className="text-sm text-muted-foreground">
                {isLoading ? "Cargando..." : `Mostrando ${products.length} de ${totalProducts} productos`}
            </p>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <ProductTable
                    products={tableProducts}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}

