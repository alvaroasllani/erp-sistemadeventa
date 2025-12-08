// Product Types
export * from "./product.types";

// Sale Types
export * from "./sale.types";

// User Types
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UserRole = "admin" | "manager" | "cashier";

// Auth Types
export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

// Company Settings
export interface CompanySettings {
    id: string;
    name: string;
    rnc?: string;
    address?: string;
    phone?: string;
    email?: string;
    logo?: string;
    taxRate: number;
    currency: string;
}

// API Response Types
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ApiError {
    statusCode: number;
    message: string;
    error?: string;
}
