"use client";

import { type LucideIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type KPIVariant = "default" | "success" | "warning" | "danger";

interface KPICardProps {
    title: string;
    value: string;
    subtitle?: string;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon: LucideIcon;
    subtitleIcon?: LucideIcon;
    variant?: KPIVariant;
    className?: string;
}

export function KPICard({
    title,
    value,
    subtitle,
    change,
    changeType = "neutral",
    icon: Icon,
    subtitleIcon: SubtitleIcon = FileText,
    variant = "default",
    className,
}: KPICardProps) {
    return (
        <div
            className={cn(
                "relative p-6 rounded-xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-300 group",
                className
            )}
        >
            <div className="flex items-start justify-between mb-4">
                {/* Icon Container with specific styling */}
                <div className={cn(
                    "size-12 rounded-full flex items-center justify-center transition-colors",
                    variant === "default" && "bg-primary/10 text-primary group-hover:bg-primary/15",
                    variant === "success" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/15",
                    variant === "warning" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500/15",
                    variant === "danger" && "bg-red-500/10 text-red-600 dark:text-red-400 group-hover:bg-red-500/15",
                )}>
                    <Icon className="size-6" />
                </div>

                {/* Change Pill Badge */}
                {change && (
                    <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        changeType === "positive" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
                        changeType === "negative" && "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
                        changeType === "neutral" && "bg-muted text-muted-foreground border-border"
                    )}>
                        {changeType === "positive" && "↑ "}
                        {changeType === "negative" && "↓ "}
                        {change}
                    </span>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground/80">
                    {title}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    {value}
                </h3>
            </div>

            {subtitle && (
                <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                    <SubtitleIcon className="size-3.5" />
                    <span>{subtitle}</span>
                </div>
            )}
        </div>
    );
}
