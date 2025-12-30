"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Menu, LogOut, Settings, User, LayoutDashboard, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

interface HeaderProps {
    onMenuClick?: () => void;
    isSidebarCollapsed?: boolean;
}

export function Header({ onMenuClick, isSidebarCollapsed = false }: HeaderProps) {
    const { user } = useAuthStore();
    const [isDark, setIsDark] = useState(false);

    // Theme toggle effect
    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        document.documentElement.classList.toggle("dark", newIsDark);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header
            className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background px-4 sm:px-6"
        >
            {/* Mobile Menu */}
            <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 lg:hidden"
                onClick={onMenuClick}
            >
                <Menu className="size-5" />
            </Button>

            {/* Page Title */}
            <LayoutDashboard className="size-6" />
            <h1 className="font-medium text-base">Dashboard</h1>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Theme Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={toggleTheme}
            >
                {isDark ? (
                    <Sun className="size-5" />
                ) : (
                    <Moon className="size-5" />
                )}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative size-9">
                <Bell className="size-5 text-muted-foreground" />
                <Badge
                    variant="destructive"
                    className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center"
                >
                    3
                </Badge>
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative h-9 gap-2 px-2 hover:bg-accent"
                    >
                        <Avatar className="size-7">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {user ? getInitials(user.name) : "U"}
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden text-sm font-medium md:inline-block">
                            {user?.name || "Usuario"}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user?.role}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <User className="mr-2 size-4" />
                        <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 size-4" />
                        <span>Configuración</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <LogOut className="mr-2 size-4" />
                        <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
