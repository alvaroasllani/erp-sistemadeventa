"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Search, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, COMPANY_INFO } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
    isCollapsed?: boolean;
    onCollapse?: () => void;
}

export function Sidebar({ isCollapsed = false, onCollapse }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header with minimal Logo */}
            <div className="flex h-14 items-center gap-2 px-6 border-b border-border/40">
                <div className="size-6 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm ring-1 ring-white/20">
                    {COMPANY_INFO.name.charAt(0)}
                </div>
                {!isCollapsed && (
                    <span className="font-semibold text-lg tracking-tight text-foreground/90">
                        {COMPANY_INFO.name.split(" ")[0]}
                    </span>
                )}
            </div>

            {/* Search Bar - Integrated */}
            {!isCollapsed && (
                <div className="px-4 py-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70 group-hover:text-primary/80 transition-colors" />
                        <Input
                            placeholder="Buscar..."
                            className="pl-9 pr-12 h-10 bg-muted/50 border-transparent hover:bg-muted/80 focus:bg-background focus:border-input focus:ring-1 focus:ring-primary/20 transition-all rounded-lg text-sm"
                        />
                    </div>
                </div>
            )}

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-2">
                <nav className="flex flex-col gap-1.5">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                                    isCollapsed && "justify-center px-2 py-2.5"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon className={cn(
                                    "size-4.5 flex-shrink-0 transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground/80"
                                )} />
                                {!isCollapsed && (
                                    <span className="flex-1">{item.label}</span>
                                )}

                                {isActive && !isCollapsed && (
                                    <div className="w-1 h-4 rounded-full bg-primary absolute left-0 top-1/2 -translate-y-1/2 -ml-3 opacity-0" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t border-border/40">
                {!isCollapsed ? (
                    <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-card border border-border/50 shadow-sm cursor-pointer hover:bg-accent/30 transition-colors">
                        <Avatar className="size-8 rounded-lg border border-border/50">
                            <AvatarFallback className="bg-primary/5 text-primary rounded-lg text-xs font-bold">
                                {COMPANY_INFO.user.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {COMPANY_INFO.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {COMPANY_INFO.user.role}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <Avatar className="size-8 rounded-lg">
                            <AvatarFallback className="bg-muted text-muted-foreground rounded-lg text-xs">
                                {COMPANY_INFO.user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                )}
            </div>
        </aside>
    );
}
