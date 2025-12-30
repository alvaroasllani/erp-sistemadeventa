"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSalesChartData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        dataKey: string;
        color: string;
    }>;
    label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
                <p className="font-medium text-popover-foreground mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-muted-foreground">
                            {entry.dataKey === "sales" ? "Ventas" : "Gastos"}:
                        </span>
                        <span className="font-medium text-popover-foreground">{formatCurrency(entry.value)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
}

export function SalesChart() {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Ventas vs Gastos</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Comparativa de los últimos 7 días
                </p>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={mockSalesChartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="0"
                            stroke="hsl(var(--border))"
                            strokeOpacity={0.5}
                            vertical={false}
                        />
                        <XAxis
                            dataKey="day"
                            tick={{ fill: "currentColor", fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            className="text-foreground"
                        />
                        <YAxis
                            tick={{ fill: "currentColor", fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `Bs${(value / 1000).toFixed(0)}k`}
                            className="text-foreground"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            wrapperStyle={{ paddingBottom: 20 }}
                            formatter={(value) => (
                                <span className="text-sm text-muted-foreground">
                                    {value === "sales" ? "Ventas" : "Gastos"}
                                </span>
                            )}
                        />
                        <Bar
                            dataKey="sales"
                            name="sales"
                            fill="hsl(239 84% 67%)"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={32}
                        />
                        <Bar
                            dataKey="expenses"
                            name="expenses"
                            fill="hsl(350 89% 60%)"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
