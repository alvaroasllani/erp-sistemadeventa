"use client";

import { Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { mockTransactions } from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime, cn } from "@/lib/utils";

export default function FinanzasPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Finanzas"
                description="Gestiona ingresos y egresos"
                actions={
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Transacción
                    </Button>
                }
            />

            <Tabs defaultValue="transactions" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="transactions">Transacciones</TabsTrigger>
                    <TabsTrigger value="caja">Caja</TabsTrigger>
                    <TabsTrigger value="reportes">Reportes</TabsTrigger>
                </TabsList>

                <TabsContent value="transactions" className="space-y-4">
                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Ingresos (Hoy)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(7845)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Egresos (Hoy)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-red-600">
                                    {formatCurrency(4700)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Balance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-primary">
                                    {formatCurrency(3145)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Transactions Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial de Transacciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Descripción</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead className="text-right">Monto</TableHead>
                                        <TableHead>Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockTransactions.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {tx.type === "sale" ? (
                                                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                                                    )}
                                                    <span className="capitalize">
                                                        {tx.type === "sale" ? "Ingreso" : tx.type === "expense" ? "Egreso" : "Devolución"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {tx.description}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatRelativeTime(tx.timestamp)}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    "text-right font-semibold",
                                                    tx.type === "sale" ? "text-green-600" : "text-red-600"
                                                )}
                                            >
                                                {tx.type === "sale" ? "+" : "-"}
                                                {formatCurrency(tx.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                    Completado
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="caja">
                    <Card>
                        <CardHeader>
                            <CardTitle>Estado de Caja</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Funcionalidad de caja próximamente...
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reportes">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reportes Financieros</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Reportes financieros próximamente...
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
