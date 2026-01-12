"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, DollarSign, Plus, RefreshCw } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { productsApi, categoriesApi, Product, CreateProductData, Category } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { CategoryManagerDialog } from "./CategoryManagerDialog";

// Zod Schema
const productSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    sku: z.string().min(2, "El SKU es requerido").toUpperCase(),
    categoryId: z.string().min(1, "Selecciona una categoría"),
    status: z.enum(["ACTIVE", "INACTIVE", "DISCONTINUED"]),
    costPrice: z.coerce.number().min(0, "El costo no puede ser negativo"),
    salePrice: z.coerce.number().min(0, "El precio no puede ser negativo"),
    stock: z.coerce.number().int().min(0, "Stock inválido"),
    minStock: z.coerce.number().int().min(0, "Stock mínimo inválido"),
    description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product | null;
    onSuccess: () => void;
}

export function ProductModal({
    open,
    onOpenChange,
    product,
    onSuccess,
}: ProductModalProps) {
    const isEditing = !!product;
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            sku: "",
            categoryId: "",
            status: "ACTIVE",
            costPrice: 0,
            salePrice: 0,
            stock: 0,
            minStock: 10,
            description: "",
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = form;

    const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
            const data = await categoriesApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories", error);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    // Load categories on mount
    useEffect(() => {
        if (open) {
            fetchCategories();
        }
    }, [open]);

    // Reset form when modal opens or product changes
    useEffect(() => {
        if (open) {
            if (product) {
                reset({
                    name: product.name,
                    sku: product.sku,
                    categoryId: product.categoryId || "",
                    status: product.status as any,
                    costPrice: product.costPrice || 0,
                    salePrice: product.salePrice,
                    stock: product.stock,
                    minStock: product.minStock,
                    description: product.description || "",
                });
            } else {
                reset({
                    name: "",
                    sku: "",
                    categoryId: "",
                    status: "ACTIVE",
                    costPrice: 0,
                    salePrice: 0,
                    stock: 0,
                    minStock: 10,
                    description: "",
                });
            }
        }
    }, [open, product, reset]);

    const onSubmit = async (data: ProductFormValues) => {
        try {
            const apiData: CreateProductData = {
                ...data,
                categoryId: data.categoryId, // Ensure correct mapping
            };

            if (isEditing && product) {
                await productsApi.update(product.id, apiData);
            } else {
                await productsApi.create(apiData);
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Error submitting product:", error);
        }
    };

    return (
        <>
            <CategoryManagerDialog
                open={isCategoryManagerOpen}
                onOpenChange={setIsCategoryManagerOpen}
                onSuccess={fetchCategories}
            />

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-2xl gap-0 p-0 overflow-hidden">
                    <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <DialogTitle className="text-lg font-semibold text-slate-900">
                            {isEditing ? "Editar Producto" : "Nuevo Producto"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Actualiza la información del producto en el inventario."
                                : "Completa los detalles para registrar un nuevo item."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="grid gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Nombre del Producto
                                </Label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    className={cn("h-9", errors.name && "border-red-500 focus-visible:ring-red-500")}
                                    placeholder="Ej: Taladro Percutor 500W"
                                />
                                {errors.name && (
                                    <span className="text-xs text-red-500">{errors.name.message}</span>
                                )}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="sku" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    SKU / Código
                                </Label>
                                <Input
                                    id="sku"
                                    {...register("sku")}
                                    className={cn("h-9 font-mono", errors.sku && "border-red-500")}
                                    placeholder="HER-001"
                                    disabled={isEditing}
                                />
                                {errors.sku && <span className="text-xs text-red-500">{errors.sku.message}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="category" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Categoría
                                </Label>
                                <div className="flex gap-2">
                                    <Select
                                        value={watch("categoryId")}
                                        onValueChange={(val) => setValue("categoryId", val)}
                                    >
                                        <SelectTrigger className={cn("h-9 flex-1", errors.categoryId && "border-red-500")}>
                                            <SelectValue placeholder={isLoadingCategories ? "Cargando..." : "Seleccionar..."} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                                        {cat.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="size-9 shrink-0"
                                        onClick={() => setIsCategoryManagerOpen(true)}
                                        title="Gestionar Categorías"
                                    >
                                        <Plus className="size-4" />
                                    </Button>
                                </div>
                                {errors.categoryId && <span className="text-xs text-red-500">{errors.categoryId.message}</span>}
                            </div>
                        </div>

                        {/* Prices Grid */}
                        <div className="grid grid-cols-2 gap-6 pt-2">
                            <div className="space-y-1.5 relative">
                                <Label htmlFor="costPrice" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Costo Unitario
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">Bs</span>
                                    <Input
                                        id="costPrice"
                                        type="number"
                                        step="0.01"
                                        {...register("costPrice")}
                                        className="h-9 pl-8 tabular-nums"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.costPrice && <span className="text-xs text-red-500">{errors.costPrice.message}</span>}
                            </div>

                            <div className="space-y-1.5 relative">
                                <Label htmlFor="salePrice" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Precio de Venta
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">Bs</span>
                                    <Input
                                        id="salePrice"
                                        type="number"
                                        step="0.01"
                                        {...register("salePrice")}
                                        className="h-9 pl-8 tabular-nums font-semibold text-slate-900"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.salePrice && <span className="text-xs text-red-500">{errors.salePrice.message}</span>}
                            </div>
                        </div>

                        {/* Inventory Grid */}
                        <div className="grid grid-cols-2 gap-6 pt-2 pb-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="stock" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Stock Inicial
                                </Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    {...register("stock")}
                                    className="h-9"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="minStock" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Alerta Mínima
                                </Label>
                                <Input
                                    id="minStock"
                                    type="number"
                                    {...register("minStock")}
                                    className="h-9"
                                    placeholder="10"
                                />
                            </div>
                        </div>

                        {/* Description - Optional */}
                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Descripción / Notas
                            </Label>
                            <Textarea
                                id="description"
                                {...register("description")}
                                className="resize-none min-h-[80px] text-sm"
                                placeholder="Detalles adicionales..."
                            />
                        </div>
                    </form>

                    <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                        <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="min-w-[120px]">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? "Guardar Cambios" : "Crear Producto"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
