"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { financeApi } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

interface DashboardStats {
    todaySales: number;
    todayOrders: number;
    lowStockProducts: number;
    netProfit: number;
    salesGrowth: number;
    ordersGrowth: number;
    profitGrowth: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await financeApi.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Error loading dashboard stats:", error);
                // Fallback to zeros on error
                setStats({
                    todaySales: 0,
                    todayOrders: 0,
                    lowStockProducts: 0,
                    netProfit: 0,
                    salesGrowth: 0,
                    ordersGrowth: 0,
                    profitGrowth: 0,
                });
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    if (isLoading || !stats) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="Resumen general de tu negocio"
            />

            {/* KPI Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Ventas Totales (Hoy)"
                    value={formatCurrency(stats.todaySales)}
                    change={`+${stats.salesGrowth}% vs ayer`}
                    changeType="positive"
                    icon={DollarSign}
                    variant="default"
                />
                <KPICard
                    title="Pedidos"
                    value={stats.todayOrders.toString()}
                    change={`+${stats.ordersGrowth} desde ayer`}
                    changeType="positive"
                    icon={ShoppingBag}
                    variant="default"
                />
                <KPICard
                    title="Productos Bajos en Stock"
                    value={stats.lowStockProducts.toString()}
                    change="Requieren atención"
                    changeType="negative"
                    icon={AlertTriangle}
                    variant="danger"
                />
                <KPICard
                    title="Ganancia Neta"
                    value={formatCurrency(stats.netProfit)}
                    change={`+${stats.profitGrowth}% esta semana`}
                    changeType="positive"
                    icon={TrendingUp}
                    variant="success"
                />
            </div>

            {/* Charts and Transactions */}
            <div className="grid gap-6 lg:grid-cols-3">
                <SalesChart />
                <RecentTransactions />
            </div>
        </div>
    );
}

