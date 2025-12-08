"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { ProductFilters as ProductFiltersType } from "@/types/product.types";

interface ProductFiltersProps {
    filters: ProductFiltersType;
    onFiltersChange: (filters: ProductFiltersType) => void;
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar por SKU o nombre..."
                    value={filters.search}
                    onChange={(e) =>
                        onFiltersChange({ ...filters, search: e.target.value })
                    }
                    className="pl-9"
                />
            </div>

            {/* Category Filter */}
            <Select
                value={filters.category}
                onValueChange={(value) =>
                    onFiltersChange({
                        ...filters,
                        category: value as ProductFiltersType["category"],
                    })
                }
            >
                <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {PRODUCT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                            {category}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Stock Filter */}
            <Select
                value={filters.stockStatus}
                onValueChange={(value) =>
                    onFiltersChange({
                        ...filters,
                        stockStatus: value as ProductFiltersType["stockStatus"],
                    })
                }
            >
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Todo el stock" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todo el stock</SelectItem>
                    <SelectItem value="low">Stock bajo (&lt;5)</SelectItem>
                    <SelectItem value="out">Sin stock</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
