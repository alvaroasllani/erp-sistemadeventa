"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProductTable } from "@/components/inventory/ProductTable";
import { ProductModal } from "@/components/inventory/ProductModal";
import { StockAdjustModal } from "@/components/inventory/StockAdjustModal";
import { DeleteProductDialog } from "@/components/inventory/DeleteProductDialog";
import { productsApi, categoriesApi, Product, Category } from "@/lib/api-client"; // Import categoriesApi and Category type
import type { ProductFilters as ProductFiltersType } from "@/types/product.types";
import { ITEMS_PER_PAGE } from "@/lib/constants"; // Remove PRODUCT_CATEGORIES

export default function InventarioPage() {
    const [filters, setFilters] = useState<ProductFiltersType>({
        search: "",
        category: "all",
        stockStatus: "all",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]); // State for categories
    const [totalProducts, setTotalProducts] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Modal states
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Load initial data (products + categories)
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                productsApi.getAll({
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                    search: filters.search || undefined,
                    stockStatus: filters.stockStatus !== "all" ? filters.stockStatus : undefined,
                    categoryId: filters.category !== "all" ? filters.category : undefined, // Filter by category ID
                }),
                categoriesApi.getAll(),
            ]);

            setProducts(productsRes.data);
            setTotalProducts(productsRes.meta.total);
            setCategories(categoriesRes);
        } catch (error) {
            console.error("Error loading data:", error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, filters.search, filters.stockStatus, filters.category]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Pagination
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

    // Reset page when filters change
    const handleFiltersChange = (newFilters: ProductFiltersType) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    // CRUD handlers... (unchanged)
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
            loadData(); // Reload data
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
        loadData(); // Reload data
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Inventario"
                    description="Gestiona tu catálogo de productos"
                    className="mb-2"
                />

                {/* Enterprise Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-2">
                    {/* Left: Search */}
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar producto por nombre o código..."
                            value={filters.search}
                            onChange={(e) => handleFiltersChange({ ...filters, search: e.target.value })}
                            className="pl-9 h-10 w-full bg-background transition-all focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {/* Right: Filters & Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
                        <Select
                            value={filters.category}
                            onValueChange={(value) => handleFiltersChange({ ...filters, category: value as string })}
                        >
                            <SelectTrigger className="w-full sm:w-[180px] h-10 bg-background">
                                <SelectValue placeholder="Categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full" style={{ backgroundColor: category.color }} />
                                            {category.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.stockStatus}
                            onValueChange={(value) => handleFiltersChange({ ...filters, stockStatus: value as ProductFiltersType["stockStatus"] })}
                        >
                            <SelectTrigger className="w-full sm:w-[160px] h-10 bg-background">
                                <SelectValue placeholder="Estado de Stock" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="low">Stock Bajo</SelectItem>
                                <SelectItem value="out">Sin Stock</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button onClick={handleCreateProduct} className="w-full sm:w-auto h-10 font-medium">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Producto
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64 border rounded-md bg-muted/50">
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


