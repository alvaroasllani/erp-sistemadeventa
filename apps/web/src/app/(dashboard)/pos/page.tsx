"use client";

import { useEffect } from "react";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { CartSidebar } from "@/components/pos/CartSidebar";

export default function POSPage() {
    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // F2 - Focus search
            if (e.key === "F2") {
                e.preventDefault();
                const searchInput = document.getElementById("pos-search");
                searchInput?.focus();
            }

            // F10 - Checkout
            if (e.key === "F10") {
                e.preventDefault();
                // Trigger checkout button click
                const checkoutBtn = document.querySelector('[data-checkout-btn]') as HTMLButtonElement;
                checkoutBtn?.click();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="flex -m-6 h-[calc(100vh-theme(spacing.16))]">
            {/* Products Grid - Left side with slate background */}
            <div className="flex-1 min-w-0 bg-muted/30 p-4 sm:p-6 overflow-hidden">
                <ProductGrid className="h-full" />
            </div>

            {/* Cart Sidebar - Right side fixed width */}
            <div className="w-full max-w-[380px] flex-shrink-0 h-full overflow-hidden border-l bg-background">
                <CartSidebar />
            </div>
        </div>
    );
}
