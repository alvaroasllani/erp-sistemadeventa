"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hexagon, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, COMPANY_INFO } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
    isCollapsed?: boolean;
    onCollapse?: () => void;
}

export function Sidebar({ isCollapsed = false, onCollapse }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-background transition-all duration-300",
                isCollapsed ? "w-16" : "w-60"
            )}
        >
            {/* Logo Section */}
            <div className="flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                        <Hexagon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-semibold text-foreground">Nexus</span>
                            <span className="text-xs text-muted-foreground">ERP System</span>
                        </div>
                    )}
                </Link>
                {!isCollapsed && onCollapse && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={onCollapse}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <Separator />

            {/* Navigation */}
            <ScrollArea className="flex-1 py-4">
                <nav className="flex flex-col gap-1 px-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                                    isActive
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                    isCollapsed && "justify-center px-2"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            <Separator />

            {/* Footer - Company Info */}
            <div className={cn("p-4", isCollapsed && "p-2")}>
                {!isCollapsed ? (
                    <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm font-medium text-foreground truncate">
                            {COMPANY_INFO.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{COMPANY_INFO.plan}</p>
                    </div>
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted mx-auto">
                        <span className="text-xs font-semibold text-muted-foreground">
                            {COMPANY_INFO.name.charAt(0)}
                        </span>
                    </div>
                )}
            </div>
        </aside>
    );
}
