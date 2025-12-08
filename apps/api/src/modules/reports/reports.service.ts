import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma/prisma.service";

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

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
        const items = await this.prisma.saleItem.groupBy({
            by: ["productId", "productName", "productSku"],
            where: {
                sale: { createdAt: { gte: startDate, lte: endDate }, status: "COMPLETED" },
            },
            _sum: { quantity: true, total: true },
            orderBy: { _sum: { quantity: "desc" } },
            take: limit,
        });

        return items.map((item) => ({
            productId: item.productId,
            name: item.productName,
            sku: item.productSku,
            quantitySold: item._sum.quantity || 0,
            totalRevenue: item._sum.total?.toNumber() || 0,
        }));
    }
}
