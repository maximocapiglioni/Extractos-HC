import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  tone?: "default" | "warning" | "success" | "primary";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  badge,
  tone = "default",
}: StatCardProps) {
  const toneStyles = {
    default: "text-muted-foreground bg-muted/60 border-border/50",
    warning: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40",
    success: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40",
    primary: "text-primary bg-primary/10 border-primary/20",
  };

  return (
    <Card className="overflow-hidden border border-border/70 shadow-sm transition-all hover:shadow-md hover:border-border">
      <CardContent className="p-3.5 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          <div className={cn("flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border", toneStyles[tone])}>
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        </div>

        <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            {value}
          </div>
          {badge && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-secondary-foreground">
              {badge}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-muted-foreground line-clamp-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
