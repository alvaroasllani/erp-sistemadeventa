"use client";

import { useState, useEffect, useCallback } from "react";
import { DateRange } from "react-day-picker";
import {
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    TrendingUp,
    TrendingDown,
    Search,
    Filter,
    Loader2,
    Calendar,
    Trash2
} from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KPICard } from "@/components/dashboard/KPICard";
import { formatCurrency, formatRelativeTime, cn } from "@/lib/utils";
import { financeApi, Transaction } from "@/lib/api-client";
import { TransactionDialog } from "@/components/finance/TransactionDialog";

function TransactionTypeBadge({ type }: { type: string }) {
    switch (type) {
        case "SALE":
            return (
                <Badge variant="outline" className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200">
                    Ingreso
                </Badge>
            );
        case "EXPENSE":
            return (
                <Badge variant="outline" className="bg-red-500/10 text-red-700 hover:bg-red-500/20 border-red-200">
                    Gasto
                </Badge>
            );
        case "REFUND":
            return (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border-amber-200">
                    Devolución
                </Badge>
            );
        default:
            return <Badge variant="outline">{type}</Badge>;
    }
}

export default function FinanzasPage() {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("ALL");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ income: 0, expenses: 0, balance: 0 });

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTab, setDialogTab] = useState<"EXPENSE" | "SALE">("EXPENSE");

    const [date, setDate] = useState<DateRange | undefined>();

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Load Transactions
            const filterType = typeFilter !== "ALL" ? typeFilter : undefined;
            const response = await financeApi.getTransactions({
                page: currentPage,
                limit: 10,
                type: filterType,
                startDate: date?.from?.toISOString(),
                endDate: date?.to?.toISOString()
            });
            setTransactions(response.data);
            setTotalPages(response.meta.totalPages);

            // Load Stats (Mocked or Real)
            // Ideally backend provides this. Using `getDashboardStats` or calculating locally for now.
            const statsRes = await financeApi.getDashboardStats();
            // Note: netProfit is Income - Expenses
            setStats({
                income: statsRes.todaySales, // Simplified mapping
                expenses: statsRes.todaySales - statsRes.netProfit, // Reverse calc if needed or just use netProfit
                balance: statsRes.netProfit
            });

        } catch (error) {
            console.error("Error loading data:", error);
            setTransactions([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, typeFilter, date]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleOpenExpense = () => {
        setDialogTab("EXPENSE");
        setIsDialogOpen(true);
    };

    const handleOpenIncome = () => {
        setDialogTab("SALE");
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Finanzas & Flujo de Caja"
                description="Controla ingresos operativos, gastos y balance general"
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800" onClick={handleOpenExpense}>
                            <TrendingDown className="mr-2 size-4" />
                            Registrar Gasto
                        </Button>
                        <Button onClick={handleOpenIncome}>
                            <Plus className="mr-2 size-4" />
                            Ingreso Capital
                        </Button>
                    </div>
                }
            />

            {/* KPI Cards (Bento Style) */}
            <div className="grid gap-4 md:grid-cols-3">
                <KPICard
                    title="Ingresos (Mes)"
                    value={formatCurrency(stats.income)}
                    icon={TrendingUp}
                    variant="success"
                    subtitle="Ventas POS + Otros Ingresos"
                />
                <KPICard
                    title="Gastos (Mes)"
                    value={formatCurrency(stats.expenses)}
                    icon={TrendingDown}
                    variant="danger"
                    subtitle="Compras + Servicios + Operativo"
                />
                <KPICard
                    title="Balance Neto"
                    value={formatCurrency(stats.balance)}
                    icon={Wallet}
                    variant="default" // Blue/Black
                    subtitle="Disponible en caja"
                />
            </div>

            {/* Main Content */}
            <div className="space-y-4">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar movimiento..."
                                className="pl-9 h-9 bg-background"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full sm:w-[150px] h-9">
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos</SelectItem>
                                <SelectItem value="SALE">Ingresos</SelectItem>
                                <SelectItem value="EXPENSE">Gastos</SelectItem>
                            </SelectContent>
                        </Select>
                        <DatePickerWithRange date={date} setDate={setDate} />
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent bg-muted/40">
                                <TableHead className="w-[100px]">Tipo</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead className="text-right">Monto</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center">
                                        <div className="flex justify-center items-center h-full text-muted-foreground">
                                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                            Cargando datos...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                                        No hay movimientos registrados
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((trx) => (
                                    <TableRow key={trx.id} className="hover:bg-muted/50 group">
                                        <TableCell>
                                            <TransactionTypeBadge type={trx.type} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{trx.description}</span>
                                                <span className="text-xs text-muted-foreground line-clamp-1">{trx.id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {trx.category ? (
                                                <Badge variant="secondary" className="font-normal text-muted-foreground">
                                                    {trx.category}
                                                </Badge>
                                            ) : trx.method ? (
                                                <Badge variant="outline" className="font-normal text-muted-foreground capitalize">
                                                    {trx.method === "CASH" ? "Efectivo" :
                                                        trx.method === "CARD" ? "Tarjeta" :
                                                            trx.method === "QR" ? "QR" : trx.method}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-foreground">
                                                {new Date(trx.createdAt).toLocaleDateString()}
                                                <span className="text-xs text-muted-foreground ml-1">
                                                    ({formatRelativeTime(new Date(trx.createdAt))})
                                                </span>
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className={cn(
                                                "font-semibold tabular-nums",
                                                trx.type === "SALE" ? "text-green-600" : "text-red-600"
                                            )}>
                                                {trx.type === "SALE" ? "+" : "-"}{formatCurrency(Number(trx.amount))}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 md:h-8 md:w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                                onClick={async () => {
                                                    const message = trx.type === "SALE"
                                                        ? "¿Estás seguro de anular esta venta? Se repondrá el stock y se registrará un reembolso."
                                                        : "¿Estás seguro de eliminar este registro permanentemente?";

                                                    if (window.confirm(message)) {
                                                        try {
                                                            await financeApi.delete(trx.id);
                                                            // toast.success("Movimiento eliminado correctamente"); // Need to import toast
                                                            loadData();
                                                        } catch (error) {
                                                            console.error(error);
                                                            alert("Error al eliminar");
                                                        }
                                                    }
                                                }}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <TransactionDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSuccess={loadData}
                defaultTab={dialogTab}
            />
        </div>
    );
}
