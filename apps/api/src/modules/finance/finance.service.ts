import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma/prisma.service";

@Injectable()
export class FinanceService {
    constructor(private prisma: PrismaService) { }

    async getTransactions(params?: { skip?: number; take?: number; type?: string }) {
        const { skip = 0, take = 20, type } = params || {};

        const where = type ? { type: type as "SALE" | "EXPENSE" | "REFUND" } : {};

        const [transactions, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
            }),
            this.prisma.transaction.count({ where }),
        ]);

        return {
            data: transactions,
            meta: { total, page: Math.floor(skip / take) + 1, limit: take, totalPages: Math.ceil(total / take) },
        };
    }

    async getDashboardStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const [todaySales, todayExpenses, lowStock, weekStats] = await Promise.all([
            this.prisma.transaction.aggregate({
                where: { type: "SALE", createdAt: { gte: today } },
                _sum: { amount: true },
            }),
            this.prisma.transaction.aggregate({
                where: { type: "EXPENSE", createdAt: { gte: today } },
                _sum: { amount: true },
            }),
            this.prisma.product.count({
                where: { stock: { lt: 5 }, status: "ACTIVE" },
            }),
            this.prisma.sale.aggregate({
                where: { createdAt: { gte: weekAgo } },
                _sum: { total: true },
                _count: true,
            }),
        ]);

        const salesTotal = todaySales._sum.amount?.toNumber() || 0;
        const expensesTotal = todayExpenses._sum.amount?.toNumber() || 0;

        return {
            todaySales: salesTotal,
            todayOrders: await this.prisma.sale.count({ where: { createdAt: { gte: today } } }),
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
                this.prisma.transaction.aggregate({
                    where: { type: "SALE", createdAt: { gte: date, lt: nextDate } },
                    _sum: { amount: true },
                }),
                this.prisma.transaction.aggregate({
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
