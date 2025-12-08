"use client";

import { ArrowDownRight, ArrowUpRight, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockTransactions } from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime, cn } from "@/lib/utils";
import type { Transaction } from "@/types/sale.types";

const transactionIcons = {
    sale: ArrowUpRight,
    expense: ArrowDownRight,
    refund: RotateCcw,
};

const transactionStyles = {
    sale: {
        bg: "bg-green-100",
        icon: "text-green-600",
        amount: "text-green-600",
        prefix: "+",
    },
    expense: {
        bg: "bg-red-100",
        icon: "text-red-600",
        amount: "text-red-600",
        prefix: "-",
    },
    refund: {
        bg: "bg-yellow-100",
        icon: "text-yellow-600",
        amount: "text-yellow-600",
        prefix: "-",
    },
};

function TransactionItem({ transaction }: { transaction: Transaction }) {
    const Icon = transactionIcons[transaction.type];
    const styles = transactionStyles[transaction.type];

    return (
        <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full",
                        styles.bg
                    )}
                >
                    <Icon className={cn("h-4 w-4", styles.icon)} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                        {transaction.description}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(transaction.timestamp)}
                    </span>
                </div>
            </div>
            <span className={cn("text-sm font-semibold", styles.amount)}>
                {styles.prefix}{formatCurrency(transaction.amount)}
            </span>
        </div>
    );
}

export function RecentTransactions() {
    const recentTransactions = mockTransactions.slice(0, 6);

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
                <ScrollArea className="flex-1 -mx-2 px-2">
                    <div className="space-y-0">
                        {recentTransactions.map((transaction) => (
                            <TransactionItem key={transaction.id} transaction={transaction} />
                        ))}
                    </div>
                </ScrollArea>
                <Button variant="outline" className="w-full mt-4">
                    Ver todas las transacciones
                </Button>
            </CardContent>
        </Card>
    );
}
