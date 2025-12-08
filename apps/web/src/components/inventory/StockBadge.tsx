import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StockBadgeProps {
    stock: number;
    minStock?: number;
    className?: string;
}

export function StockBadge({ stock, minStock = 5, className }: StockBadgeProps) {
    const getStockStatus = () => {
        if (stock === 0) {
            return {
                label: "Sin stock",
                className: "bg-red-100 text-red-700 hover:bg-red-100",
            };
        }
        if (stock < minStock) {
            return {
                label: `${stock} uds`,
                className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
            };
        }
        if (stock <= minStock * 2) {
            return {
                label: `${stock} uds`,
                className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
            };
        }
        return {
            label: `${stock} uds`,
            className: "bg-green-100 text-green-700 hover:bg-green-100",
        };
    };

    const status = getStockStatus();

    return (
        <Badge
            variant="secondary"
            className={cn(status.className, className)}
        >
            {status.label}
        </Badge>
    );
}
