// Product Types
export interface Product {
    id: string;
    sku: string;
    name: string;
    description?: string;
    category: ProductCategory;
    costPrice: number;
    salePrice: number;
    stock: number;
    minStock: number;
    status: ProductStatus;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ProductStatus = "active" | "inactive";

export type ProductCategory =
    | "Herramientas"
    | "Pinturas"
    | "Plomería"
    | "Electricidad"
    | "Ferretería General"
    | "Construcción"
    | "Jardinería"
    | "Seguridad";

export interface ProductFilters {
    search: string;
    category: ProductCategory | "all";
    stockStatus: "all" | "low" | "out";
}

// Create/Update DTOs
export interface CreateProductDto {
    sku: string;
    name: string;
    description?: string;
    category: ProductCategory;
    costPrice: number;
    salePrice: number;
    stock: number;
    minStock: number;
    status?: ProductStatus;
    image?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> { }
