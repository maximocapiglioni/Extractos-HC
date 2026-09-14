"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-config";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userEmail?: string;
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ userEmail, onNavigate, className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/auth/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col justify-between border-r border-border/70 bg-card/60 backdrop-blur p-4",
        className,
      )}
    >
      {/* Brand Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <span className="text-sm font-bold tracking-tight">EH</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground">
              Extractos-HC
            </span>
            <span className="text-xs text-muted-foreground">
              Perfumes de equivalencia
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Módulos
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (!item.isAvailable) {
              return (
                <div
                  key={item.title}
                  aria-disabled="true"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/60 cursor-not-allowed select-none"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                    <span>{item.title}</span>
                  </div>
                  <span className="rounded bg-muted/70 px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground/70">
                    Próx.
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => {
                  if (onNavigate) onNavigate();
                }}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  <span>{item.title}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Session & Actions */}
      <div className="flex flex-col gap-3 border-t border-border/70 pt-4">
        {/* User preview */}
        <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-2.5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <span className="block truncate text-xs font-medium text-foreground">
                {userEmail || "Usuario"}
              </span>
            </div>
          </div>
          <ThemeSwitcher />
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full justify-start gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>{isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}</span>
        </Button>
      </div>
    </aside>
  );
}
