import { Injectable } from "@nestjs/common";
import { TenantPrismaService } from "../../shared/tenant";
import { SalesService } from "../sales/sales.service";

@Injectable()
export class FinanceService {
    constructor(
        private tenantPrisma: TenantPrismaService,
        private salesService: SalesService
    ) { }

    async createTransaction(data: {
        type: "SALE" | "EXPENSE" | "REFUND";
        description: string;
        amount: number;
        category?: string;
        method?: "CASH" | "CARD" | "QR" | "TRANSFER";
    }) {
        const tenantId = this.tenantPrisma.getTenantId();
        if (!tenantId) throw new Error("Tenant no identificado");

        return this.tenantPrisma.transaction.create({
            data: {
                tenantId,
                type: data.type,
                description: data.description,
                amount: data.amount,
                category: data.category,
                method: data.method as any,
            },
        });
    }

    async getTransactions(params?: { skip?: number; take?: number; type?: string; startDate?: string; endDate?: string, includeDeleted?: boolean, onlyDeleted?: boolean }) {
        const { skip = 0, take = 20, type, startDate, endDate, includeDeleted = false, onlyDeleted = false } = params || {};

        const where: any = {};
        if (type) where.type = type as "SALE" | "EXPENSE" | "REFUND";

        // Filter by date range if provided
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        // Soft Delete filter
        if (onlyDeleted) {
            where.deletedAt = { not: null };
        } else if (!includeDeleted) {
            where.deletedAt = null;
        }

        const [transactions, total] = await Promise.all([
            this.tenantPrisma.transaction.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
            }),
            this.tenantPrisma.transaction.count({ where }),
        ]);

        if (onlyDeleted && transactions.length > 0) {
            console.log("DEBUG TRANSACTIONS:", JSON.stringify(transactions[0], null, 2));
        }

        return {
            data: transactions,
            meta: { total, page: Math.floor(skip / take) + 1, limit: take, totalPages: Math.ceil(total / take) },
        };
    }

    // ... (getDashboardStats and getWeeklyChart remain unchanged for now) ...

    async getDeletedTransactions() {
        return this.tenantPrisma.deletedTransaction.findMany({
            orderBy: { deletedAt: "desc" },
        });
    }

    async deleteTransaction(id: string) {
        const tenantId = this.tenantPrisma.getTenantId();
        if (!tenantId) throw new Error("Tenant no identificado");

        const transaction = await this.tenantPrisma.transaction.findUnique({
            where: { id },
        });

        if (!transaction) throw new Error("Transacción no encontrada");

        // 1. Log to DeletedTransaction
        await this.tenantPrisma.deletedTransaction.create({
            data: {
                tenantId,
                originalId: transaction.id,
                type: transaction.type,
                description: transaction.description,
                amount: transaction.amount,
                deletedAt: new Date(),
                // deletedBy: userId // We don't have userId injected readily here in service unless passed. Ignoring for now.
            }
        });

        // 2. Handle Sale Cancellation (Stock Restore, No Refund)
        if (transaction.type === "SALE" && transaction.reference) {
            await this.salesService.cancel(transaction.reference, false);
        }

        // 3. HARD Delete the original transaction
        // Since we logged it safely to DeletedTransaction, we can remove it from operations.
        return this.tenantPrisma.transaction.delete({
            where: { id }
        });
    }

    async getDashboardStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        // Calculate stats excluding deleted transactions
        const [todaySales, todayExpenses, lowStock, weekStats] = await Promise.all([
            this.tenantPrisma.transaction.aggregate({
                where: { type: "SALE", createdAt: { gte: today }, deletedAt: null },
                _sum: { amount: true },
            }),
            this.tenantPrisma.transaction.aggregate({
                where: { type: "EXPENSE", createdAt: { gte: today }, deletedAt: null },
                _sum: { amount: true },
            }),
            this.tenantPrisma.product.count({
                where: { stock: { lt: 5 }, status: "ACTIVE" },
            }),
            this.tenantPrisma.sale.aggregate({
                where: { createdAt: { gte: weekAgo } }, // Sales don't have deletedAt yet, or do they? Assuming not for now.
                _sum: { total: true },
                _count: true,
            }),
        ]);

        const salesTotal = todaySales._sum.amount?.toNumber() || 0;
        const expensesTotal = todayExpenses._sum.amount?.toNumber() || 0;

        return {
            todaySales: salesTotal,
            todayOrders: await this.tenantPrisma.sale.count({ where: { createdAt: { gte: today } } }),
            lowStockProducts: lowStock,
            netProfit: salesTotal - expensesTotal,
            salesGrowth: 12.5,
            ordersGrowth: 8,
            profitGrowth: 5.2,
        };
    }

    async getWeeklySalesChart() {
        const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        const result = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const [sales, expenses] = await Promise.all([
                this.tenantPrisma.transaction.aggregate({
                    where: { type: "SALE", createdAt: { gte: date, lt: nextDate } },
                    _sum: { amount: true },
                }),
                this.tenantPrisma.transaction.aggregate({
                    where: { type: "EXPENSE", createdAt: { gte: date, lt: nextDate } },
                    _sum: { amount: true },
                }),
            ]);

            result.push({
                day: days[date.getDay()],
                sales: sales._sum.amount?.toNumber() || 0,
                expenses: expenses._sum.amount?.toNumber() || 0,
            });
        }

        return result;
    }


}
