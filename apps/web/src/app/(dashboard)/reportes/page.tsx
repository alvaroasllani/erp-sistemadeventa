"use client";

import { FileText, ShoppingCart, Package, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";

const INSIGHTS = [
    {
        id: "sales",
        title: "Ventas Mensuales",
        value: 45200,
        trend: "+12.5%",
        trendUp: true,
        icon: ShoppingCart,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        btnColor: "text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50",
    },
    {
        id: "inventory",
        title: "Valor del Inventario",
        value: 128450,
        trend: "+5.2%",
        trendUp: true,
        icon: Package,
        color: "text-sky-600 dark:text-sky-400",
        bg: "bg-sky-50 dark:bg-sky-900/20",
        btnColor: "text-sky-600 dark:text-sky-400 bg-sky-50 hover:bg-sky-100 dark:bg-sky-900/30 dark:hover:bg-sky-900/50",
    },
    {
        id: "top-products",
        title: "Productos Vendidos",
        value: 1240, // Unidades
        isCurrency: false,
        trend: "-2.1%",
        trendUp: false,
        icon: TrendingUp,
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-900/20",
        btnColor: "text-green-600 dark:text-green-400 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50",
    },
    {
        id: "profit",
        title: "Utilidad Neta",
        value: 15800,
        trend: "+8.4%",
        trendUp: true,
        icon: BarChart3,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-900/20",
        btnColor: "text-orange-600 dark:text-orange-400 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/30 dark:hover:bg-orange-900/50",
    },
];

import { AuditHistoryDialog } from "@/components/reports/AuditHistoryDialog";

export default function ReportesPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Reportes"
                description="Insights y métricas clave de tu negocio"
                actions={<AuditHistoryDialog />}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {INSIGHTS.map((insight) => {
                    return (
                        <div
                            key={insight.id}
                            className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md h-full"
                        >
                            {/* Zone 1: Insight */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {insight.title}
                                    </p>
                                    <span className={cn(
                                        "inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full",
                                        insight.trendUp
                                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                                    )}>
                                        {insight.trendUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                                        {insight.trend}
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-2xl font-bold text-foreground tracking-tight">
                                        {insight.isCurrency !== false
                                            ? formatCurrency(insight.value)
                                            : insight.value.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Zone 2: Action */}
                            <div className="mt-auto pt-2">
                                <Button
                                    className={cn(
                                        "w-full h-10 font-medium rounded-lg shadow-none border-0",
                                        insight.btnColor
                                    )}
                                    variant="ghost"
                                >
                                    <FileText className="mr-2 size-4" />
                                    Generar Reporte
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Visual placeholder for report list if needed later */}
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground border-dashed">
                <p className="text-sm">Historial de reportes generados recientemente aparecerá aquí.</p>
            </div>
        </div>
    );
}
