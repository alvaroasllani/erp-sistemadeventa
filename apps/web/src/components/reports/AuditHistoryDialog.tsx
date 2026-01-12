"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History, Trash2, Loader2, RefreshCw } from "lucide-react";
import { financeApi, DeletedTransaction } from "@/lib/api-client";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AuditHistoryDialog() {
    const [open, setOpen] = useState(false);
    const [deletedRecords, setDeletedRecords] = useState<DeletedTransaction[]>([]);
    const [loading, setLoading] = useState(false);

    const loadDeleted = async () => {
        setLoading(true);
        try {
            const data = await financeApi.getDeletedTransactions();
            setDeletedRecords(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            loadDeleted();
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50">
                    <Trash2 className="mr-2 size-4" />
                    Historial
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between pb-2">
                    <DialogTitle className="flex items-center text-base">
                        <History className="mr-2 size-4 text-muted-foreground" />
                        Eliminaciones
                    </DialogTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={loadDeleted} disabled={loading}>
                        <RefreshCw className={cn("size-4", loading && "animate-spin")} />
                    </Button>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : deletedRecords.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No hay registros eliminados.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {deletedRecords.map((record) => (
                                <div
                                    key={record.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs shrink-0">
                                                {record.type}
                                            </Badge>
                                            <span className="text-sm font-medium truncate">
                                                {record.description}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(record.deletedAt).toLocaleString("es-BO", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </p>
                                    </div>
                                    <span className="text-sm font-mono font-semibold text-red-600 dark:text-red-400 ml-3">
                                        {formatCurrency(Number(record.amount))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}


