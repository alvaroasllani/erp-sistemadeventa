"use client";

import { Download, BarChart3, Package, TrendingUp, ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const reports = [
    {
        id: "sales",
        title: "Reporte de Ventas",
        description: "Análisis detallado de ventas por período, producto y vendedor",
        icon: ShoppingCart,
        iconColor: "text-blue-600 bg-blue-100",
    },
    {
        id: "inventory",
        title: "Reporte de Inventario",
        description: "Estado actual del inventario, movimientos y valorización",
        icon: Package,
        iconColor: "text-purple-600 bg-purple-100",
    },
    {
        id: "top-products",
        title: "Productos Más Vendidos",
        description: "Ranking de productos por cantidad vendida y rentabilidad",
        icon: TrendingUp,
        iconColor: "text-green-600 bg-green-100",
    },
    {
        id: "profit",
        title: "Análisis de Ganancias",
        description: "Márgenes de ganancia, costos y utilidad neta",
        icon: BarChart3,
        iconColor: "text-orange-600 bg-orange-100",
    },
];

export default function ReportesPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Reportes"
                description="Analiza el rendimiento de tu negocio"
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {reports.map((report) => {
                    const Icon = report.icon;
                    return (
                        <Card key={report.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${report.iconColor}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{report.title}</CardTitle>
                                    <CardDescription className="mt-1">
                                        {report.description}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Button className="flex-1">
                                        Generar Reporte
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
