"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Tag, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categoriesApi, Category } from "@/lib/api-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categorySchema = z.object({
    name: z.string().min(2, "El nombre es muy corto"),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color inválido"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryManagerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const PRESET_COLORS = [
    "#6366f1", // Indigo
    "#ef4444", // Red
    "#f59e0b", // Amber
    "#10b981", // Emerald
    "#3b82f6", // Blue
    "#ec4899", // Pink
    "#8b5cf6", // Violet
    "#64748b", // Slate
];

export function CategoryManagerDialog({
    open,
    onOpenChange,
    onSuccess,
}: CategoryManagerDialogProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            color: PRESET_COLORS[0],
        },
    });

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const data = await categoriesApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Error loading categories:", error);
            toast.error("No se pudieron cargar las categorías");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchCategories();
            form.reset();
        }
    }, [open]);

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setIsCreating(true);
            await categoriesApi.create(data);
            toast.success("Categoría creada");
            form.reset({ name: "", color: PRESET_COLORS[0] });
            await fetchCategories();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || "Error al crear categoría");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string, productCount: number = 0) => {
        if (productCount > 0) {
            toast.error("No puedes eliminar categorías con productos asociados");
            return;
        }

        try {
            await categoriesApi.delete(id);
            toast.success("Categoría eliminada");
            await fetchCategories();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || "Error al eliminar");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-slate-50/50">
                    <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                        <Tag className="size-5 text-indigo-500" />
                        Gestionar Categorías
                    </DialogTitle>
                    <DialogDescription>
                        Crea y administra las categorías para tus productos
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 space-y-6">
                    {/* Create New Form */}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="space-y-3">
                            <Label className="text-xs font-semibold text-slate-500 uppercase">Nueva Categoría</Label>
                            <div className="flex gap-2">
                                <div className="flex-1 space-y-1">
                                    <Input
                                        placeholder="Nombre (ej. Ferretería)"
                                        {...form.register("name")}
                                        className="h-9 bg-white"
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex gap-1 p-1 bg-white border rounded-md">
                                        {PRESET_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => form.setValue("color", color)}
                                                className={cn(
                                                    "size-7 rounded-sm transition-all hover:scale-110",
                                                    form.watch("color") === color ? "ring-2 ring-offset-1 ring-slate-900 shadow-sm" : "opacity-70 hover:opacity-100"
                                                )}
                                                style={{ backgroundColor: color }}
                                            />
                                        )).slice(0, 4)} {/* Show first 4, maybe more in popover if needed */}
                                    </div>
                                </div>
                            </div>
                            <Button size="sm" type="submit" disabled={isCreating} className="w-full">
                                {isCreating ? <Loader2 className="size-4 animate-spin mr-2" /> : <Plus className="size-4 mr-2" />}
                                Crear Categoría
                            </Button>
                        </div>
                    </form>

                    {/* List */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase">Existentes ({categories.length})</Label>
                        <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {isLoading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="size-6 animate-spin text-slate-300" />
                                </div>
                            ) : categories.length === 0 ? (
                                <div className="text-center py-6 text-slate-400 text-sm italic">
                                    No hay categorías registradas
                                </div>
                            ) : (
                                categories.map((cat) => (
                                    <div key={cat.id} className="group flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="size-3 rounded-full"
                                                style={{ backgroundColor: cat.color }}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                                                <span className="text-[10px] text-slate-400">
                                                    {cat._count?.products || 0} productos
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                            onClick={() => handleDelete(cat.id, cat._count?.products)}
                                            title={cat._count?.products ? "No se puede eliminar (tiene productos)" : "Eliminar"}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
