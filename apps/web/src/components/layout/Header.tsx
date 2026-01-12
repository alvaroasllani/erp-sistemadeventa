"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Menu, LogOut, Settings, User, LayoutDashboard, Moon, Sun, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

interface HeaderProps {
    onMenuClick?: () => void;
    isSidebarCollapsed?: boolean;
}

// Sample notifications - in real app, fetch from API
const notifications = [
    { id: 1, type: "warning", title: "Stock bajo", message: "5 productos con stock bajo", time: "Hace 5 min", icon: AlertTriangle },
    { id: 2, type: "info", title: "Nueva venta", message: "Venta #1234 completada", time: "Hace 15 min", icon: Package },
    { id: 3, type: "warning", title: "Producto agotado", message: "Martillo 500g sin stock", time: "Hace 1 hora", icon: AlertTriangle },
];

export function Header({ onMenuClick, isSidebarCollapsed = false }: HeaderProps) {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [isDark, setIsDark] = useState(false);
    const [notificationCount, setNotificationCount] = useState(notifications.length);

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

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const handleNavigateToProfile = () => {
        router.push("/perfil");
    };

    const handleNavigateToSettings = () => {
        router.push("/configuracion");
    };

    const handleMarkNotificationsRead = () => {
        setNotificationCount(0);
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
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative size-9">
                        <Bell className="size-5 text-muted-foreground" />
                        {notificationCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center"
                            >
                                {notificationCount}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                    <div className="flex items-center justify-between border-b border-border p-3">
                        <h3 className="font-semibold">Notificaciones</h3>
                        {notificationCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7"
                                onClick={handleMarkNotificationsRead}
                            >
                                Marcar leídas
                            </Button>
                        )}
                    </div>
                    <ScrollArea className="max-h-[300px]">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                                No hay notificaciones
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                    >
                                        <div className={cn(
                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                            notification.type === "warning" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-blue-100 dark:bg-blue-900/30"
                                        )}>
                                            <notification.icon className={cn(
                                                "size-4",
                                                notification.type === "warning" ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"
                                            )} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">{notification.title}</p>
                                            <p className="text-xs text-muted-foreground">{notification.message}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </PopoverContent>
            </Popover>

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
                    <DropdownMenuItem onClick={handleNavigateToProfile}>
                        <User className="mr-2 size-4" />
                        <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleNavigateToSettings}>
                        <Settings className="mr-2 size-4" />
                        <span>Configuración</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 size-4" />
                        <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

