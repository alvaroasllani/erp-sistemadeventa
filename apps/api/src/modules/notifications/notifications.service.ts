import { Injectable } from "@nestjs/common";
import { TenantPrismaService } from "../../shared/tenant";

export interface Notification {
    id: string;
    type: "warning" | "info" | "success";
    title: string;
    message: string;
    time: string;
    icon: "AlertTriangle" | "Package" | "Trash2" | "DollarSign";
}

@Injectable()
export class NotificationsService {
    constructor(private readonly tenantPrisma: TenantPrismaService) { }

    async getNotifications(): Promise<Notification[]> {
        const notifications: Notification[] = [];

        // Get all active products to check stock levels
        const allProducts = await this.tenantPrisma.product.findMany({
            where: { status: "ACTIVE" },
            select: { id: true, name: true, stock: true, minStock: true }
        });

        const lowStock = allProducts.filter(p => p.stock <= p.minStock);

        if (lowStock.length > 0) {
            notifications.push({
                id: "low-stock",
                type: "warning",
                title: "Stock bajo",
                message: `${lowStock.length} producto${lowStock.length > 1 ? "s" : ""} con stock bajo`,
                time: "Ahora",
                icon: "AlertTriangle",
            });
        }

        // Check for out of stock products
        const outOfStock = allProducts.filter(p => p.stock === 0);
        if (outOfStock.length > 0) {
            notifications.push({
                id: "out-of-stock",
                type: "warning",
                title: "Sin stock",
                message: outOfStock.length === 1
                    ? `${outOfStock[0].name} agotado`
                    : `${outOfStock.length} productos agotados`,
                time: "Ahora",
                icon: "AlertTriangle",
            });
        }

        // 2. Recent Sales (last 5)
        const recentSales = await this.tenantPrisma.sale.findMany({
            where: { status: "COMPLETED" },
            orderBy: { createdAt: "desc" },
            take: 3,
        });

        for (const sale of recentSales) {
            const timeDiff = this.getRelativeTime(sale.createdAt);
            notifications.push({
                id: `sale-${sale.id}`,
                type: "success",
                title: "Venta completada",
                message: `Venta #${sale.id.slice(-6).toUpperCase()} - Bs ${sale.total.toFixed(2)}`,
                time: timeDiff,
                icon: "DollarSign",
            });
        }

        // 3. Recent Deletions (last 3)
        const recentDeletions = await this.tenantPrisma.deletedTransaction.findMany({
            orderBy: { deletedAt: "desc" },
            take: 2,
        });

        for (const deletion of recentDeletions) {
            const timeDiff = this.getRelativeTime(deletion.deletedAt);
            notifications.push({
                id: `deletion-${deletion.id}`,
                type: "info",
                title: "Registro eliminado",
                message: `${deletion.type}: ${deletion.description}`,
                time: timeDiff,
                icon: "Trash2",
            });
        }

        return notifications;
    }

    private getRelativeTime(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Ahora";
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        return `Hace ${diffDays}d`;
    }
}
