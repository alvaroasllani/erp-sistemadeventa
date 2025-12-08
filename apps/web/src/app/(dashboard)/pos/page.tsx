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
        <div className="flex h-[calc(100vh-7rem)] gap-6">
            {/* Products Grid - Left side */}
            <div className="flex-1 min-w-0">
                <ProductGrid className="h-full" />
            </div>

            {/* Sales Ticket - Right side */}
            <div className="w-full max-w-md flex-shrink-0">
                <SalesTicket />
            </div>
        </div>
    );
}
