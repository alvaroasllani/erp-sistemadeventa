"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { financeApi } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2, TrendingDown, TrendingUp } from "lucide-react";

interface TransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    defaultTab?: "EXPENSE" | "SALE"; // SALE logic repurposed for Income here slightly, or use generic INCOME
}

const EXPENSE_CATEGORIES = [
    "Servicios Básicos",
    "Alquiler",
    "Proveedores",
    "Mantenimiento",
    "Publicidad",
    "Sueldos",
    "Impuestos",
    "Transporte",
    "Varios"
];

const INCOME_CATEGORIES = [
    "Aporte de Capital",
    "Préstamo",
    "Devolución Proveedor",
    "Alquiler (Subarriendo)",
    "Otros Ingresos"
];

export function TransactionDialog({ open, onOpenChange, onSuccess, defaultTab = "EXPENSE" }: TransactionDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"EXPENSE" | "SALE">(defaultTab);

    // Form State
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    // Sync activeTab with defaultTab when dialog opens
    useEffect(() => {
        if (open) {
            setActiveTab(defaultTab);
            // Reset form when opening
            setAmount("");
            setDescription("");
            setCategory("");
            setDate(new Date().toISOString().split("T")[0]);
        }
    }, [open, defaultTab]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !category) {
            toast.error("Completa todos los campos obligatorios");
            return;
        }

        setIsLoading(true);
        try {
            // "SALE" in backend means Sales, but for Finance interface we might use "SALE" type for generic income 
            // OR strictly speaking we should have added "INCOME" to backend enum. 
            // Existing types: SALE, EXPENSE, REFUND.
            // If I use "SALE", it shows as green. If I use "REFUND", it shows as red/amber.
            // The user requested "Ingreso Capital".
            // If the backend only supports SALE, EXPENSE, REFUND, I should mask "Ingreso Capital" as "SALE" 
            // with a specific category, or perhaps "REFUND" if appropriate (unlikely).
            // Let's use "SALE" for positive entries for now, distinguishing by category.

            await financeApi.create({
                type: activeTab,
                amount: parseFloat(amount),
                description,
                category,
                method: "CASH", // Defaulting to Cash for manual entries
            });

            toast.success("Transacción registrada correctamente");
            onSuccess();
            onOpenChange(false);

            // Reset form
            setAmount("");
            setDescription("");
            setCategory("");
            setDate(new Date().toISOString().split("T")[0]);
        } catch (error) {
            console.error(error);
            toast.error("Error al registrar transacción");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Registrar Movimiento</DialogTitle>
                    <DialogDescription>
                        Registra gastos operativos o ingresos de capital manualmente.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="EXPENSE" className="data-[state=active]:bg-red-50 dark:data-[state=active]:bg-red-950/30 data-[state=active]:text-red-600">
                            <TrendingDown className="mr-2 h-4 w-4" />
                            Gasto
                        </TabsTrigger>
                        <TabsTrigger value="SALE" className="data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-950/30 data-[state=active]:text-green-600">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Ingreso
                        </TabsTrigger>
                    </TabsList>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label>Monto</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Bs</span>
                                <Input
                                    className="pl-8 text-lg font-semibold tabular-nums"
                                    placeholder="0.00"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Categoría</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(activeTab === "EXPENSE" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Descripción</Label>
                            <Input
                                placeholder={activeTab === "EXPENSE" ? "Ej: Pago de luz Agosto" : "Ej: Aporte inicial"}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className={activeTab === "EXPENSE" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Registrar {activeTab === "EXPENSE" ? "Gasto" : "Ingreso"}
                            </Button>
                        </div>
                    </form>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
