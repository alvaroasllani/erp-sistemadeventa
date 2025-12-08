"use client";

import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type KPIVariant = "default" | "success" | "warning" | "danger";

interface KPICardProps {
    title: string;
    value: string;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon: LucideIcon;
    variant?: KPIVariant;
    className?: string;
}

const variantStyles: Record<KPIVariant, string> = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
    danger: "bg-red-100 text-red-600",
};

const changeStyles = {
    positive: "bg-green-100 text-green-700",
    negative: "bg-red-100 text-red-700",
    neutral: "bg-muted text-muted-foreground",
};

export function KPICard({
    title,
    value,
    change,
    changeType = "neutral",
    icon: Icon,
    variant = "default",
    className,
}: KPICardProps) {
    return (
        <Card className={cn("hover:shadow-md transition-shadow duration-200", className)}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className={cn(
                            "text-2xl font-bold tracking-tight",
                            variant === "danger" && "text-red-600"
                        )}>
                            {value}
                        </p>
                        {change && (
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "mt-1 w-fit font-medium text-xs",
                                    changeStyles[changeType]
                                )}
                            >
                                {change}
                            </Badge>
                        )}
                    </div>
                    <div
                        className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-lg",
                            variantStyles[variant]
                        )}
                    >
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
