"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "@/components/inventory/ProductFilters";
import { ProductTable } from "@/components/inventory/ProductTable";
import { mockProducts } from "@/lib/mock-data";
import type { ProductFilters as ProductFiltersType } from "@/types/product.types";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export default function InventarioPage() {
    const [filters, setFilters] = useState<ProductFiltersType>({
        search: "",
        category: "all",
        stockStatus: "all",
    });
    const [currentPage, setCurrentPage] = useState(1);

    // Filter products
    const filteredProducts = useMemo(() => {
        return mockProducts.filter((product) => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch =
                    product.name.toLowerCase().includes(searchLower) ||
                    product.sku.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Category filter
            if (filters.category !== "all" && product.category !== filters.category) {
                return false;
            }

            // Stock filter
            if (filters.stockStatus === "low" && product.stock >= 5) {
                return false;
            }
            if (filters.stockStatus === "out" && product.stock > 0) {
                return false;
            }

            return true;
        });
    }, [filters]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    // Reset page when filters change
    const handleFiltersChange = (newFilters: ProductFiltersType) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

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
                Mostrando {paginatedProducts.length} de {filteredProducts.length} productos
            </p>

            {/* Table */}
            <ProductTable
                products={paginatedProducts}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
