import { Injectable } from "@nestjs/common";
import { TenantPrismaService } from "../../shared/tenant";

@Injectable()
export class ReportsService {
    constructor(private prisma: TenantPrismaService) { }

    async getSalesReport(startDate: Date, endDate: Date) {
        const sales = await this.prisma.sale.findMany({
            where: { createdAt: { gte: startDate, lte: endDate }, status: "COMPLETED" },
            include: { items: true },
        });

        const total = sales.reduce((sum, sale) => sum + sale.total.toNumber(), 0);
        const count = sales.length;

        return {
            startDate,
            endDate,
            totalSales: total,
            totalOrders: count,
            averageTicket: count > 0 ? total / count : 0,
            sales,
        };
    }

    async getInventoryReport() {
        const products = await this.prisma.product.findMany({
            where: { status: "ACTIVE" },
            orderBy: { stock: "asc" },
        });

        const totalValue = products.reduce(
            (sum, p) => sum + p.costPrice.toNumber() * p.stock,
            0
        );
        const lowStock = products.filter((p) => p.stock < p.minStock);
        const outOfStock = products.filter((p) => p.stock === 0);

        return {
            totalProducts: products.length,
            totalValue,
            lowStockCount: lowStock.length,
            outOfStockCount: outOfStock.length,
            lowStockProducts: lowStock.slice(0, 10),
            products,
        };
    }

    async getTopProducts(startDate: Date, endDate: Date, limit = 10) {
        // Note: SaleItem groupBy through tenant-filtered sales
        const sales = await this.prisma.sale.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: "COMPLETED"
            },
            include: { items: true },
        });

        // Aggregate items manually for tenant safety
        const itemsMap = new Map<string, {
            productId: string;
            name: string;
            sku: string;
            quantity: number;
            total: number
        }>();

        for (const sale of sales) {
            for (const item of sale.items) {
                const existing = itemsMap.get(item.productId) || {
                    productId: item.productId,
                    name: item.productName,
                    sku: item.productSku,
                    quantity: 0,
                    total: 0,
                };
                existing.quantity += item.quantity;
                existing.total += item.total.toNumber();
                itemsMap.set(item.productId, existing);
            }
        }

        return Array.from(itemsMap.values())
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, limit)
            .map((item) => ({
                productId: item.productId,
                name: item.name,
                sku: item.sku,
                quantitySold: item.quantity,
                totalRevenue: item.total,
            }));
    }
}

