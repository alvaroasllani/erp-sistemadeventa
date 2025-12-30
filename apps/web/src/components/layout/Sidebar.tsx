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
                isCollapsed ? "w-16" : "w-60"
            )}
        >
            {/* Header with Logo and Avatar */}
            <div className="flex h-16 items-center justify-between p-5 pb-0">
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                        {/* Gradient Logo */}
                        <div className="size-7 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center ring-1 ring-white/40 shadow-lg" />
                        {!isCollapsed && (
                            <>
                                <span className="font-semibold text-foreground">
                                    {COMPANY_INFO.name.split(" ")[0]}
                                </span>
                                <ChevronDown className="size-3 text-muted-foreground" />
                            </>
                        )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <p className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                            Espacios de trabajo
                        </p>
                        <DropdownMenuItem>
                            <div className="size-5 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 mr-2" />
                            {COMPANY_INFO.name}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <div className="size-5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 mr-2" />
                            Sucursal Norte
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            + Crear espacio de trabajo
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {!isCollapsed && (
                    <Avatar className="size-7">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                            {COMPANY_INFO.user.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>

            {/* Search Bar */}
            {!isCollapsed && (
                <div className="px-5 pt-5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar..."
                            className="pl-9 pr-10 h-9 bg-background"
                        />
                    </div>
                </div>
            )}

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 pt-5">
                <nav className="flex flex-col gap-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 h-[38px] relative",
                                    isActive
                                        ? "bg-primary/10 text-primary border-l-4 border-primary -ml-0.5 pl-2.5"
                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                                    isCollapsed && "justify-center px-2"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon className={cn(
                                    "size-5 flex-shrink-0",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )} />
                                {!isCollapsed && (
                                    <span className="flex-1">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            {/* Footer */}
            <div className={cn("p-5", isCollapsed && "p-2")}>
                {!isCollapsed ? (
                    <Link
                        href="#"
                        className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium text-muted-foreground w-full transition-colors"
                    >
                        <ExternalLink className="size-4" />
                        {COMPANY_INFO.name}
                    </Link>
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
