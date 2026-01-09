"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
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
            {/* Sidebar */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Main Content */}
            <div
                className={cn(
                    "flex min-h-screen flex-col transition-all duration-300",
                    isSidebarCollapsed ? "ml-16" : "ml-60"
                )}
            >
                {/* Header */}
                <Header
                    onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    isSidebarCollapsed={isSidebarCollapsed}
                />

                {/* Page Content */}
                <main className="flex-1 p-6">{children}</main>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}

