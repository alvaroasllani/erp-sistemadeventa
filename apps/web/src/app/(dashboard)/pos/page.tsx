"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { CartSidebar } from "@/components/pos/CartSidebar";
import { MobileCartBar } from "@/components/pos/MobileCartBar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function POSPage() {
    const [isCartOpen, setIsCartOpen] = useState(false);

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
        <>
            <div className="flex -m-4 md:-m-6 h-[calc(100vh-theme(spacing.16))]">
                {/* Products Grid - Full width on mobile, left side on desktop */}
                <div className="flex-1 min-w-0 bg-muted/30 p-3 md:p-6 overflow-hidden">
                    <ProductGrid className="h-full" />
                </div>

                {/* Cart Sidebar - Hidden on mobile, visible on desktop */}
                <div className="hidden md:block w-full max-w-[380px] flex-shrink-0 h-full overflow-hidden border-l bg-background">
                    <CartSidebar />
                </div>
            </div>

            {/* Mobile: Floating Cart Bar */}
            <MobileCartBar onOpenCart={() => setIsCartOpen(true)} />

            {/* Mobile: Cart Sheet (slides from bottom) */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-2xl">
                    <CartSidebar />
                </SheetContent>
            </Sheet>
        </>
    );
}
