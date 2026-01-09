/**
 * API Client for Nexus ERP
 * Handles all HTTP requests to the backend with authentication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Token storage
let accessToken: string | null = typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null;

export function setAccessToken(token: string | null) {
    accessToken = token;
    if (typeof window !== "undefined") {
        if (token) {
            localStorage.setItem("accessToken", token);
        } else {
            localStorage.removeItem("accessToken");
        }
    }
}

export function getAccessToken(): string | null {
    return accessToken;
}

// API Error class
export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: unknown
    ) {
        super(message);
        this.name = "ApiError";
    }
}

// Generic fetch wrapper with auth
async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (accessToken) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
            response.status,
            errorData.message || "Error en la solicitud",
            errorData
        );
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
}

// ==================== AUTH API ====================
export const authApi = {
    login: async (email: string, password: string) => {
        const data = await fetchApi<{
            user: { id: string; email: string; name: string; role: string; tenantId: string };
            tenant: { id: string; name: string; slug: string; plan: string } | null;
            accessToken: string;
        }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        setAccessToken(data.accessToken);
        return data;
    },

    logout: () => {
        setAccessToken(null);
    },

    getProfile: () =>
        fetchApi<{
            id: string;
            email: string;
            name: string;
            role: string;
            avatar: string | null;
            tenantId: string;
            tenant: { id: string; name: string; slug: string; plan: string };
        }>("/auth/profile"),
};

// ==================== PRODUCTS API ====================
export const productsApi = {
    getAll: (params?: { page?: number; limit?: number; search?: string; categoryId?: string; stockStatus?: string }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set("page", String(params.page));
        if (params?.limit) searchParams.set("limit", String(params.limit));
        if (params?.search) searchParams.set("search", params.search);
        if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
        if (params?.stockStatus) searchParams.set("stockStatus", params.stockStatus);

        const query = searchParams.toString();
        return fetchApi<{
            data: Product[];
            meta: { total: number; page: number; limit: number; totalPages: number };
        }>(`/products${query ? `?${query}` : ""}`);
    },

    getOne: (id: string) => fetchApi<Product>(`/products/${id}`),

    create: (data: CreateProductData) =>
        fetchApi<Product>("/products", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<CreateProductData>) =>
        fetchApi<Product>(`/products/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/products/${id}`, { method: "DELETE" }),

    getLowStock: () => fetchApi<Product[]>("/products/low-stock"),
};

// ==================== SALES API ====================
export const salesApi = {
    create: (data: CreateSaleData) =>
        fetchApi<Sale>("/sales", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    getAll: (params?: { page?: number; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set("page", String(params.page));
        if (params?.limit) searchParams.set("limit", String(params.limit));

        const query = searchParams.toString();
        return fetchApi<{
            data: Sale[];
            meta: { total: number; page: number; limit: number; totalPages: number };
        }>(`/sales${query ? `?${query}` : ""}`);
    },

    getOne: (id: string) => fetchApi<Sale>(`/sales/${id}`),

    getTodayStats: () => fetchApi<{ todaySales: number; todayOrders: number }>("/sales/today-stats"),
};

// ==================== FINANCE API ====================
export const financeApi = {
    getTransactions: (params?: { page?: number; limit?: number; type?: string }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set("page", String(params.page));
        if (params?.limit) searchParams.set("limit", String(params.limit));
        if (params?.type) searchParams.set("type", params.type);

        const query = searchParams.toString();
        return fetchApi<{
            data: Transaction[];
            meta: { total: number; page: number; limit: number; totalPages: number };
        }>(`/finance/transactions${query ? `?${query}` : ""}`);
    },

    getDashboardStats: () =>
        fetchApi<{
            todaySales: number;
            todayOrders: number;
            lowStockProducts: number;
            netProfit: number;
            salesGrowth: number;
            ordersGrowth: number;
            profitGrowth: number;
        }>("/finance/dashboard"),

    getWeeklyChart: () =>
        fetchApi<{ day: string; sales: number; expenses: number }[]>("/finance/chart"),
};

// ==================== SETTINGS API ====================
export const settingsApi = {
    getCompany: () =>
        fetchApi<CompanySettings>("/settings/company"),

    updateCompany: (data: Partial<CompanySettings>) =>
        fetchApi<CompanySettings>("/settings/company", {
            method: "PATCH",
            body: JSON.stringify(data),
        }),
};

// ==================== TYPES ====================
export interface Product {
    id: string;
    sku: string;
    name: string;
    description: string | null;
    categoryId: string | null;
    category: { id: string; name: string; color: string } | null;
    costPrice: number;
    salePrice: number;
    stock: number;
    minStock: number;
    status: "ACTIVE" | "INACTIVE" | "DISCONTINUED";
    image: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductData {
    sku: string;
    name: string;
    description?: string;
    categoryId?: string;
    costPrice: number;
    salePrice: number;
    stock: number;
    minStock?: number;
    status?: "ACTIVE" | "INACTIVE" | "DISCONTINUED";
    image?: string;
}

export interface Sale {
    id: string;
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: "CASH" | "CARD" | "QR";
    status: "PENDING" | "COMPLETED" | "CANCELLED";
    items: SaleItem[];
    createdAt: string;
}

export interface SaleItem {
    id: string;
    productId: string;
    productName: string;
    productSku: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface CreateSaleData {
    items: { productId: string; quantity: number }[];
    paymentMethod: string;
    customerId?: string;
}

export interface Transaction {
    id: string;
    type: "SALE" | "EXPENSE" | "REFUND";
    description: string;
    amount: number;
    method: "CASH" | "CARD" | "QR" | "TRANSFER";
    reference: string | null;
    createdAt: string;
}

export interface CompanySettings {
    id: string;
    name: string | null;
    rnc: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo: string | null;
    taxRate: number;
    currency: string;
}
