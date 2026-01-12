"use client";

import { useState, useEffect } from "react";
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
import { financeApi } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ChartData {
    day: string;
    sales: number;
    expenses: number;
}

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

// Default empty data for when there's no sales
const emptyChartData: ChartData[] = [
    { day: "Lun", sales: 0, expenses: 0 },
    { day: "Mar", sales: 0, expenses: 0 },
    { day: "Mié", sales: 0, expenses: 0 },
    { day: "Jue", sales: 0, expenses: 0 },
    { day: "Vie", sales: 0, expenses: 0 },
    { day: "Sáb", sales: 0, expenses: 0 },
    { day: "Dom", sales: 0, expenses: 0 },
];

export function SalesChart() {
    const [chartData, setChartData] = useState<ChartData[]>(emptyChartData);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadChartData = async () => {
            try {
                const data = await financeApi.getWeeklyChart();
                if (data && data.length > 0) {
                    setChartData(data);
                }
            } catch (error) {
                console.error("Error loading chart data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadChartData();
    }, []);

    return (
        <Card className="col-span-1 lg:col-span-8 rounded-xl border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold tracking-tight">Ventas vs Gastos</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Resumen financiero de la última semana
                    </p>
                </div>
                {/* Optional: Add a subtle badge or filter here if needed */}
                <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                        <div className="size-2 rounded-full bg-[hsl(239,84%,67%)]" />
                        <span>Ventas</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                        <div className="size-2 rounded-full bg-[hsl(350,89%,60%)]" />
                        <span>Gastos</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-0 pb-2">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                            barGap={2}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(var(--border))"
                                strokeOpacity={0.4}
                                vertical={false}
                                horizontal={true}
                            />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                tick={{ fill: "hsl(var(--foreground))", fontSize: 12, opacity: 0.7 }}
                                dy={5}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                tick={{ fill: "hsl(var(--foreground))", fontSize: 11, opacity: 0.7 }}
                                dx={-5}
                            />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                                content={<CustomTooltip />}
                            />
                            {/* Legend removed in favor of custom header legend for cleaner look */}

                            <Bar
                                dataKey="sales"
                                name="sales"
                                fill="hsl(239 84% 67%)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                            />
                            <Bar
                                dataKey="expenses"
                                name="expenses"
                                fill="hsl(350 89% 60%)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

