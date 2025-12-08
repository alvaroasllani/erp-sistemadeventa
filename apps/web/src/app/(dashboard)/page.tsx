"use client";

import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { mockDashboardStats } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
    const stats = mockDashboardStats;

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
