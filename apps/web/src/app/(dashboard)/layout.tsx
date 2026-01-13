"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Check auth on mount
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isCheckingAuth && !isAuthenticated) {
            router.push("/login");
        }
    }, [isCheckingAuth, isAuthenticated, router]);

    // Show loading while checking auth
    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Cargando...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden md:block">
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
            </div>

            {/* Mobile Sidebar - Sheet drawer */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-72">
                    <Sidebar
                        isCollapsed={false}
                        onCollapse={() => { }}
                        isMobile
                        onMobileClose={() => setIsMobileMenuOpen(false)}
                    />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div
                className={cn(
                    "flex min-h-screen flex-col transition-all duration-300",
                    // Only add left margin on desktop
                    "md:ml-60",
                    isSidebarCollapsed && "md:ml-16"
                )}
            >
                {/* Header - Sticky on mobile */}
                <Header
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                    isSidebarCollapsed={isSidebarCollapsed}
                />

                {/* Page Content - Reduced padding on mobile */}
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
