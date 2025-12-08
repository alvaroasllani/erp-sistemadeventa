import type { Product } from "./product.types";

// Cart Item
export interface CartItem {
    product: Product;
    quantity: number;
}

// Sale Transaction
export interface Sale {
    id: string;
    items: SaleItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: PaymentMethod;
    status: SaleStatus;
    customerId?: string;
    createdAt: Date;
}

export interface SaleItem {
    productId: string;
    productName: string;
    productSku: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export type PaymentMethod = "cash" | "card" | "qr";

export type SaleStatus = "completed" | "pending" | "cancelled";

// Transaction (for dashboard)
export interface Transaction {
    id: string;
    type: TransactionType;
    description: string;
    amount: number;
    method?: PaymentMethod;
    timestamp: Date;
}

export type TransactionType = "sale" | "expense" | "refund";

// Dashboard Stats
export interface DashboardStats {
    todaySales: number;
    todayOrders: number;
    lowStockProducts: number;
    netProfit: number;
    salesGrowth: number;
    ordersGrowth: number;
    profitGrowth: number;
}

export interface SalesChartData {
    day: string;
    sales: number;
    expenses: number;
}
