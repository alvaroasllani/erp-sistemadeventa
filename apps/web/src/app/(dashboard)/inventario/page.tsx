"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "@/components/inventory/ProductFilters";
import { ProductTable } from "@/components/inventory/ProductTable";
import { ProductModal } from "@/components/inventory/ProductModal";
import { StockAdjustModal } from "@/components/inventory/StockAdjustModal";
import { DeleteProductDialog } from "@/components/inventory/DeleteProductDialog";
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

    // Modal states
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    // CRUD handlers
    const handleCreateProduct = () => {
        setSelectedProduct(null);
        setIsProductModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const handleDeleteProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedProduct) return;
        setIsDeleting(true);
        try {
            await productsApi.delete(selectedProduct.id);
            loadProducts();
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error("Error deleting product:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAdjustStock = (product: Product) => {
        setSelectedProduct(product);
        setIsStockModalOpen(true);
    };

    const handleProductSuccess = () => {
        loadProducts();
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Inventario"
                description="Gestiona tus productos y stock"
                actions={
                    <Button onClick={handleCreateProduct}>
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
                    products={products}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onAdjustStock={handleAdjustStock}
                />
            )}

            {/* Product Create/Edit Modal */}
            <ProductModal
                open={isProductModalOpen}
                onOpenChange={setIsProductModalOpen}
                product={selectedProduct}
                onSuccess={handleProductSuccess}
            />

            {/* Stock Adjust Modal */}
            <StockAdjustModal
                open={isStockModalOpen}
                onOpenChange={setIsStockModalOpen}
                product={selectedProduct}
                onSuccess={handleProductSuccess}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteProductDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                product={selectedProduct}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}


