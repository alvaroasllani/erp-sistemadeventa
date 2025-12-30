"use client";

import { useEffect } from "react";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { SalesTicket } from "@/components/pos/SalesTicket";

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
        <div className="flex -m-6" style={{ height: 'calc(100vh - 4rem)' }}>
            {/* Products Grid - Left side with slate background */}
            <div className="flex-1 min-w-0 bg-muted/50 p-6 overflow-hidden">
                <ProductGrid className="h-full" />
            </div>

            {/* Sales Ticket - Right side fixed height */}
            <div className="w-full max-w-md flex-shrink-0 h-full overflow-hidden">
                <SalesTicket />
            </div>
        </div>
    );
}
