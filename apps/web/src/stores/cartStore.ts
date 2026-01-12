import { create } from "zustand";
import type { Product } from "@/types/product.types";
import type { CartItem, PaymentMethod } from "@/types/sale.types";
import { TAX_RATE } from "@/lib/constants";

interface CartState {
    items: CartItem[];
    paymentMethod: PaymentMethod;

    // Actions
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    setPaymentMethod: (method: PaymentMethod) => void;
    clearCart: () => void;

    // Computed values (as functions)
    getSubtotal: () => number;
    getTax: () => number;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    paymentMethod: "cash",

    addItem: (product: Product) => {
        set((state) => {
            const existingItem = state.items.find((item) => item.product.id === product.id);

            if (existingItem) {
                // Increment quantity if product already in cart
                return {
                    items: state.items.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }

            // Add new item to cart
            return {
                items: [...state.items, { product, quantity: 1 }],
            };
        });
    },

    removeItem: (productId: string) => {
        set((state) => ({
            items: state.items.filter((item) => item.product.id !== productId),
        }));
    },

    updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }

        set((state) => ({
            items: state.items.map((item) =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            ),
        }));
    },

    setPaymentMethod: (method: PaymentMethod) => {
        set({ paymentMethod: method });
    },

    clearCart: () => {
        set({ items: [], paymentMethod: "cash" });
    },

    getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
    },

    getTax: () => {
        return get().getSubtotal() * TAX_RATE;
    },

    getTotal: () => {
        // No IVA/tax applied - total equals subtotal
        return get().getSubtotal();
    },

    getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
    },
}));
