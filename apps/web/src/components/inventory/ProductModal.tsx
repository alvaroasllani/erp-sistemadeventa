"use client";

import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productsApi, Product, CreateProductData } from "@/lib/api-client";

interface ProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product | null; // null = create new, Product = edit
    onSuccess: () => void;
}

const defaultFormData = {
    sku: "",
    name: "",
    description: "",
    costPrice: "",
    salePrice: "",
    stock: "",
    minStock: "10",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "DISCONTINUED",
};

export function ProductModal({ open, onOpenChange, product, onSuccess }: ProductModalProps) {
    const [formData, setFormData] = useState(defaultFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!product;

    useEffect(() => {
        if (product) {
            setFormData({
                sku: product.sku,
                name: product.name,
                description: product.description || "",
                costPrice: String(product.costPrice),
                salePrice: String(product.salePrice),
                stock: String(product.stock),
                minStock: String(product.minStock),
                status: product.status as "ACTIVE" | "INACTIVE" | "DISCONTINUED",
            });
        } else {
            setFormData(defaultFormData);
        }
        setError(null);
    }, [product, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const data: CreateProductData = {
                sku: formData.sku,
                name: formData.name,
                description: formData.description || undefined,
                costPrice: parseFloat(formData.costPrice),
                salePrice: parseFloat(formData.salePrice),
                stock: parseInt(formData.stock, 10),
                minStock: parseInt(formData.minStock, 10) || 10,
                status: formData.status,
            };

            if (isEditing && product) {
                await productsApi.update(product.id, data);
            } else {
                await productsApi.create(data);
            }

            onSuccess();
            onOpenChange(false);
        } catch (err: any) {
            console.error("Error saving product:", err);
            setError(err.message || "Error al guardar el producto");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Modifica los datos del producto" : "Ingresa los datos del nuevo producto"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="sku">Código SKU *</Label>
                            <Input
                                id="sku"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                placeholder="FER-001"
                                required
                                disabled={isEditing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Estado</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Activo</SelectItem>
                                    <SelectItem value="INACTIVE">Inactivo</SelectItem>
                                    <SelectItem value="DISCONTINUED">Descontinuado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del producto *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Martillo de acero 500g"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descripción opcional del producto..."
                            rows={2}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="costPrice">Precio de costo *</Label>
                            <Input
                                id="costPrice"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.costPrice}
                                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salePrice">Precio de venta *</Label>
                            <Input
                                id="salePrice"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.salePrice}
                                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock actual *</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                placeholder="0"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minStock">Stock mínimo</Label>
                            <Input
                                id="minStock"
                                type="number"
                                min="0"
                                value={formData.minStock}
                                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                                placeholder="10"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : isEditing ? (
                                "Guardar Cambios"
                            ) : (
                                "Crear Producto"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
