"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, RotateCcw, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { financeApi, Transaction } from "@/lib/api-client";
import { formatCurrency, formatRelativeTime, cn } from "@/lib/utils";

const transactionIcons = {
    SALE: ArrowUpRight,
    EXPENSE: ArrowDownRight,
    REFUND: RotateCcw,
};

const transactionStyles = {
    SALE: {
        bg: "bg-green-500/10",
        icon: "text-green-600 dark:text-green-400",
        amount: "text-green-600 dark:text-green-400",
        prefix: "+",
    },
    EXPENSE: {
        bg: "bg-red-500/10",
        icon: "text-red-600 dark:text-red-400",
        amount: "text-red-600 dark:text-red-400",
        prefix: "-",
    },
    REFUND: {
        bg: "bg-amber-500/10",
        icon: "text-amber-600 dark:text-amber-400",
        amount: "text-amber-600 dark:text-amber-400",
        prefix: "-",
    },
};

function TransactionItem({ transaction }: { transaction: Transaction }) {
    const Icon = transactionIcons[transaction.type] || ArrowUpRight;
    const styles = transactionStyles[transaction.type] || transactionStyles.SALE;

    return (
        <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full",
                        styles.bg
                    )}
                >
                    <Icon className={cn("h-4 w-4", styles.icon)} strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                        {transaction.description}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(new Date(transaction.createdAt))}
                    </span>
                </div>
            </div>
            <span className={cn(
                "text-sm font-semibold tabular-nums text-right",
                styles.amount
            )}>
                {styles.prefix}{formatCurrency(typeof transaction.amount === 'number' ? transaction.amount : Number(transaction.amount))}
            </span>
        </div>
    );
}

export function RecentTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const response = await financeApi.getTransactions({ limit: 6 });
                setTransactions(response.data);
            } catch (error) {
                console.error("Error loading transactions:", error);
                setTransactions([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadTransactions();
    }, []);

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                    Transacciones Recientes
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Últimos movimientos del día
                </p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center py-8 text-muted-foreground text-sm">
                        No hay transacciones aún
                    </div>
                ) : (
                    <ScrollArea className="flex-1 -mx-2 px-2">
                        <div className="space-y-0">
                            {transactions.map((transaction) => (
                                <TransactionItem key={transaction.id} transaction={transaction} />
                            ))}
                        </div>
                    </ScrollArea>
                )}
                <Link
                    href="/finanzas"
                    className="flex items-center justify-center gap-1.5 mt-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
                >
                    Ver todo
                    <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </CardContent>
        </Card>
    );
}

