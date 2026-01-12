// Product Types
export interface Product {
    id: string;
    sku: string;
    name: string;
    description?: string;
    category: ProductCategory | string; // Allow dynamic categories from API
    costPrice?: number;
    salePrice: number;
    stock: number;
    minStock?: number;
    status?: ProductStatus;
    image?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export type ProductStatus = "active" | "inactive" | "ACTIVE" | "INACTIVE" | "DISCONTINUED";

export type ProductCategory =
    | "Herramientas"
    | "Pinturas"
    | "Plomería"
    | "Electricidad"
    | "Ferretería General"
    | "Construcción"
    | "Jardinería"
    | "Seguridad"
    | string; // Allow dynamic categories

export interface ProductFilters {
    search: string;
    category: ProductCategory | "all";
    stockStatus: "all" | "low" | "out";
}

