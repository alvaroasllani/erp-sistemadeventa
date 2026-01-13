"use client";

import { SlidersHorizontal, Pencil, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import type { Product } from "@/lib/api-client";

interface ProductTableProps {
    products: Product[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onEdit?: (product: Product) => void;
    onDelete?: (product: Product) => void;
    onAdjustStock?: (product: Product) => void;
}

function StockBadge({ stock, minStock = 10 }: { stock: number; minStock?: number }) {
    if (stock === 0) {
        return (
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-600">
                Sin stock
            </Badge>
        );
    }

    if (stock < minStock) {
        return (
            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-600">
                {stock} uds (Bajo)
            </Badge>
        );
    }

    return (
        <span className="text-sm text-muted-foreground tabular-nums font-medium">
            {stock} uds
        </span>
    );
}

export function ProductTable({
    products,
    currentPage,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
    onAdjustStock,
}: ProductTableProps) {
    return (
        <div className="space-y-4">
            {/* Overflow wrapper for mobile horizontal scroll */}
            <div className="rounded-md border border-border bg-card shadow-sm overflow-x-auto">
                <Table className="min-w-[600px] md:min-w-0">
                    <TableHeader className="bg-muted/50">
                        <TableRow className="border-b border-border hover:bg-transparent">
                            <TableHead className="w-[300px] text-xs font-medium uppercase tracking-wider text-muted-foreground pl-6 py-4">
                                Producto
                            </TableHead>
                            <TableHead className="hidden md:table-cell text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Categoría
                            </TableHead>
                            <TableHead className="hidden md:table-cell text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                P. Costo
                            </TableHead>
                            <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                P. Venta
                            </TableHead>
                            <TableHead className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Stock
                            </TableHead>
                            <TableHead className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground w-[100px]">
                                Stock
                            </TableHead>
                            <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                    No se encontraron productos
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow
                                    key={product.id}
                                    className="border-b border-border hover:bg-muted/50 transition-colors group"
                                >
                                    <TableCell className="pl-6 py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium text-sm text-foreground leading-tight">
                                                {product.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-mono">
                                                {product.sku}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell py-3">
                                        <Badge variant="secondary" className="font-normal text-muted-foreground bg-muted hover:bg-muted">
                                            {product.category?.name || "General"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-right tabular-nums py-3 text-sm text-muted-foreground">
                                        {formatCurrency(product.costPrice ?? 0)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums font-medium py-3 text-sm text-foreground">
                                        {formatCurrency(product.salePrice)}
                                    </TableCell>
                                    <TableCell className="text-center py-3">
                                        <StockBadge stock={product.stock} minStock={product.minStock} />
                                    </TableCell>
                                    <TableCell className="text-center py-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onAdjustStock?.(product)}
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/5"
                                        >
                                            <SlidersHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                    <TableCell className="py-3 pr-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit?.(product)}
                                                className="h-10 w-10 md:h-8 md:w-8 p-0 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                                title="Editar"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete?.(product)}
                                                className="h-10 w-10 md:h-8 md:w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 w-24"
                    >
                        Anterior
                    </Button>
                    <div className="flex items-center justify-center text-sm font-medium text-muted-foreground min-w-[100px]">
                        Página {currentPage} de {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-24"
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    );
}

