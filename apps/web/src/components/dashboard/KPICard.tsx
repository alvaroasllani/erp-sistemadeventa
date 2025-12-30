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
                "relative p-5 rounded-xl border border-border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200",
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-3">
                    {/* Title - Small and muted */}
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>

                    {/* Value - Large and bold with high contrast */}
                    <p className={cn(
                        "text-3xl font-bold tracking-tight text-foreground",
                        variant === "danger" && "text-destructive"
                    )}>
                        {value}
                    </p>

                    {/* Change Badge or Subtitle */}
                    {(change || subtitle) && (
                        <div className="flex items-center gap-2">
                            {change ? (
                                <span className={cn(
                                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                    changeType === "positive" && "bg-green-500/10 text-green-600 dark:text-green-400",
                                    changeType === "negative" && "bg-red-500/10 text-red-600 dark:text-red-400",
                                    changeType === "neutral" && "bg-muted text-muted-foreground"
                                )}>
                                    {change}
                                </span>
                            ) : subtitle && (
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <SubtitleIcon className="size-3.5" />
                                    <span className="text-sm">{subtitle}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Icon Button */}
                <Button
                    variant="outline"
                    size="icon"
                    className="size-10"
                >
                    <Icon className="size-5 text-muted-foreground" />
                </Button>
            </div>
        </div>
    );
}
