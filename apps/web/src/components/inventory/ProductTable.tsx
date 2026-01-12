"use client";

import { Pencil, Trash2, AlertTriangle, Package } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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

function StockDisplay({ stock, minStock = 10 }: { stock: number; minStock?: number }) {
    const isLow = stock < minStock;
    const isOut = stock === 0;

    if (isOut) {
        return (
            <div className="flex items-center justify-center gap-1.5">
                <AlertTriangle className="size-4 text-red-500 dark:text-red-400" />
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Sin stock</span>
            </div>
        );
    }

    if (isLow) {
        return (
            <div className="flex items-center justify-center gap-1.5">
                <AlertTriangle className="size-4 text-amber-500 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">{stock} uds</span>
            </div>
        );
    }

    return (
        <span className="text-sm text-muted-foreground tabular-nums">{stock} uds</span>
    );
}

function StatusBadge({ status }: { status: "active" | "inactive" }) {
    if (status === "active") {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-700 dark:text-green-400 ring-1 ring-green-600/20">
                Activo
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground ring-1 ring-border">
            Inactivo
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
            {/* Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[100px] font-semibold">Código</TableHead>
                            <TableHead className="font-semibold">Producto</TableHead>
                            <TableHead className="font-semibold">Categoría</TableHead>
                            <TableHead className="font-semibold text-right">
                                P. Costo
                            </TableHead>
                            <TableHead className="font-semibold text-right">
                                P. Venta
                            </TableHead>
                            <TableHead className="font-semibold text-center">Stock</TableHead>
                            <TableHead className="font-semibold text-center w-[100px]">Ajustar</TableHead>
                            <TableHead className="font-semibold">Estado</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={9}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No se encontraron productos
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow
                                    key={product.id}
                                    className="transition-colors hover:bg-muted/50"
                                >
                                    <TableCell className="font-mono text-sm text-muted-foreground">
                                        {product.sku}
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium text-foreground">
                                            {product.category?.name || "Sin categoría"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground tabular-nums">
                                        {formatCurrency(product.costPrice ?? 0)}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-foreground tabular-nums">
                                        {formatCurrency(product.salePrice)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <StockDisplay stock={product.stock} minStock={product.minStock} />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                            onClick={() => onAdjustStock?.(product)}
                                        >
                                            <Package className="h-3.5 w-3.5 mr-1" />
                                            Ajustar
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={product.status?.toLowerCase() as "active" | "inactive" ?? "active"} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                onClick={() => onEdit?.(product)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => onDelete?.(product)}
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                className="w-8"
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    );
}

