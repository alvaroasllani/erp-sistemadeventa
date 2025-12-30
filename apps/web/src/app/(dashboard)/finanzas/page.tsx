"use client";

import { useState } from "react";
import {
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    TrendingUp,
    TrendingDown,
    Search,
    Filter
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { KPICard } from "@/components/dashboard/KPICard";
import { formatCurrency, formatRelativeTime, cn } from "@/lib/utils";

// Mock Data
const FINANCE_STATS = [
    {
        title: "Ingresos (Hoy)",
        value: formatCurrency(7845),
        change: "+12.5%",
        changeType: "positive" as const,
        icon: TrendingUp,
        variant: "default" as const,
    },
    {
        title: "Egresos (Hoy)",
        value: formatCurrency(4700),
        change: "+5.2%",
        changeType: "negative" as const,
        icon: TrendingDown,
        variant: "danger" as const, // Custom styling logic handled below if needed, or KPICard supports it? KPICard supports variant.
    },
    {
        title: "Balance Total",
        value: formatCurrency(31450),
        subtitle: "En todas las cuentas",
        icon: Wallet,
        variant: "default" as const,
    },
];

const TRANSACTIONS = [
    { id: "TRX-9821", type: "income", description: "Venta #1234 - Cliente General", amount: 1250, date: new Date(Date.now() - 1000 * 60 * 9), status: "completed", method: "Efectivo" },
    { id: "TRX-9820", type: "expense", description: "Compra proveedor - Pinturas", amount: 3500, date: new Date(Date.now() - 1000 * 60 * 29), status: "completed", method: "Transferencia" },
    { id: "TRX-9819", type: "income", description: "Venta #1233 - Juan Pérez", amount: 489, date: new Date(Date.now() - 1000 * 60 * 49), status: "completed", method: "QR" },
    { id: "TRX-9818", type: "income", description: "Venta #1232 - María Lopez", amount: 2150, date: new Date(Date.now() - 1000 * 60 * 60 * 2), status: "completed", method: "Tarjeta" },
    { id: "TRX-9817", type: "expense", description: "Pago servicios - Electricidad", amount: 1200, date: new Date(Date.now() - 1000 * 60 * 60 * 3), status: "completed", method: "Transferencia" },
    { id: "TRX-9816", type: "income", description: "Venta #1231 - Cliente General", amount: 756, date: new Date(Date.now() - 1000 * 60 * 60 * 5), status: "completed", method: "Efectivo" },
    { id: "TRX-9815", type: "refund", description: "Devolución #REF-012 - Pintura mal estado", amount: 189, date: new Date(Date.now() - 1000 * 60 * 60 * 6), status: "completed", method: "Efectivo" },
    { id: "TRX-9814", type: "income", description: "Venta #1230 - Constructora A1", amount: 3200, date: new Date(Date.now() - 1000 * 60 * 60 * 8), status: "completed", method: "Transferencia" },
];

function TransactionTypeBadge({ type }: { type: string }) {
    switch (type) {
        case "income":
            return (
                <div className="flex items-center gap-2">
                    <div className="flex p-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                        <ArrowUpRight className="size-3.5" />
                    </div>
                    <span className="font-medium text-foreground">Ingreso</span>
                </div>
            );
        case "expense":
            return (
                <div className="flex items-center gap-2">
                    <div className="flex p-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                        <ArrowDownRight className="size-3.5" />
                    </div>
                    <span className="font-medium text-foreground">Egreso</span>
                </div>
            );
        case "refund":
            return (
                <div className="flex items-center gap-2">
                    <div className="flex p-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <ArrowDownRight className="size-3.5" />
                    </div>
                    <span className="font-medium text-foreground">Devolución</span>
                </div>
            );
        default:
            return <span>{type}</span>;
    }
}

export default function FinanzasPage() {
    const [search, setSearch] = useState("");

    return (
        <div className="space-y-6">
            <PageHeader
                title="Finanzas"
                description="Gestiona ingresos, egresos y flujo de caja"
                actions={
                    <Button className="shadow-sm">
                        <Plus className="mr-2 size-4" />
                        Nueva Transacción
                    </Button>
                }
            />

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {FINANCE_STATS.map((stat, i) => (
                    <KPICard
                        key={i}
                        title={stat.title}
                        value={stat.value}
                        change={stat.change}
                        changeType={stat.changeType}
                        subtitle={stat.subtitle}
                        icon={stat.icon}
                        variant={stat.variant}
                    />
                ))}
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="transactions" className="space-y-4">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-muted/50 p-1">
                        <TabsTrigger value="transactions" className="rounded-sm">Transacciones</TabsTrigger>
                        <TabsTrigger value="cashflow" className="rounded-sm">Caja Chica</TabsTrigger>
                        <TabsTrigger value="reports" className="rounded-sm">Reportes</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar transacción..."
                                className="pl-9 h-9 bg-background"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-9">
                            <Filter className="mr-2 size-4" />
                            Filtros
                        </Button>
                    </div>
                </div>

                <TabsContent value="transactions" className="space-y-4">
                    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[140px] font-semibold">Tipo</TableHead>
                                    <TableHead className="font-semibold">Descripción</TableHead>
                                    <TableHead className="font-semibold">Método</TableHead>
                                    <TableHead className="font-semibold">Fecha</TableHead>
                                    <TableHead className="text-right font-semibold">Monto</TableHead>
                                    <TableHead className="text-right font-semibold">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {TRANSACTIONS.map((trx) => (
                                    <TableRow key={trx.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                                        <TableCell>
                                            <TransactionTypeBadge type={trx.type} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{trx.description}</span>
                                                <span className="text-xs text-muted-foreground">{trx.id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-foreground">{trx.method}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">{formatRelativeTime(trx.date)}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className={cn(
                                                "font-semibold tabular-nums",
                                                trx.type === "income" && "text-green-600 dark:text-green-400",
                                                (trx.type === "expense" || trx.type === "refund") && "text-red-600 dark:text-red-400"
                                            )}>
                                                {trx.type === "income" ? "+" : "-"}{formatCurrency(trx.amount)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900">
                                                Completado
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination placeholder */}
                    <div className="flex items-center justify-end space-x-2 py-2">
                        <Button variant="outline" size="sm" disabled>Anterior</Button>
                        <Button variant="outline" size="sm">Siguiente</Button>
                    </div>
                </TabsContent>

                <TabsContent value="cashflow">
                    <Card className="h-96 flex items-center justify-center border-dashed">
                        <div className="text-center text-muted-foreground">
                            <Wallet className="mx-auto size-12 opacity-50 mb-3" />
                            <p>Gestión de Caja Chica en desarrollo</p>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="reports">
                    <Card className="h-96 flex items-center justify-center border-dashed">
                        <div className="text-center text-muted-foreground">
                            <TrendingUp className="mx-auto size-12 opacity-50 mb-3" />
                            <p>Reportes Financieros en desarrollo</p>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
