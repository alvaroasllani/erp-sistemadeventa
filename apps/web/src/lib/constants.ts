import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    DollarSign,
    BarChart3,
    Settings,
    type LucideIcon,
} from "lucide-react";
import type { ProductCategory } from "@/types/product.types";

// Navigation Items
export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
    {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        label: "Inventario",
        href: "/inventario",
        icon: Package,
    },
    {
        label: "Punto de Venta",
        href: "/pos",
        icon: ShoppingCart,
    },
    {
        label: "Finanzas",
        href: "/finanzas",
        icon: DollarSign,
    },
    {
        label: "Reportes",
        href: "/reportes",
        icon: BarChart3,
    },
    {
        label: "Configuración",
        href: "/configuracion",
        icon: Settings,
    },
];

// Product Categories
export const PRODUCT_CATEGORIES: ProductCategory[] = [
    "Herramientas",
    "Pinturas",
    "Plomería",
    "Electricidad",
    "Ferretería General",
    "Construcción",
    "Jardinería",
    "Seguridad",
];

// Category Colors (for badges)
export const CATEGORY_COLORS: Record<ProductCategory, string> = {
    Herramientas: "bg-blue-100 text-blue-700",
    Pinturas: "bg-purple-100 text-purple-700",
    Plomería: "bg-cyan-100 text-cyan-700",
    Electricidad: "bg-yellow-100 text-yellow-700",
    "Ferretería General": "bg-slate-100 text-slate-700",
    Construcción: "bg-orange-100 text-orange-700",
    Jardinería: "bg-green-100 text-green-700",
    Seguridad: "bg-red-100 text-red-700",
};

// Tax Rate
export const TAX_RATE = 0.18; // 18% ITBIS (Dominican Republic)

// Company Info (Mock)
export const COMPANY_INFO = {
    name: "Ferretería Express",
    plan: "Plan Pro",
    user: {
        name: "Juan Díaz",
        email: "juan@ferreteria.com",
        role: "Administrador",
        avatar: null,
    },
};

// Pagination
export const ITEMS_PER_PAGE = 10;
