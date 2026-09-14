"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface DashboardShellProps {
  children: React.ReactNode;
  userEmail?: string;
}

export function DashboardShell({ children, userEmail }: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  // Close mobile nav on escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when mobile drawer is open
  React.useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:shrink-0 md:flex-col md:fixed md:inset-y-0 z-30">
        <Sidebar userEmail={userEmail} />
      </div>

      {/* Mobile Backdrop & Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative flex w-72 max-w-[85vw] flex-1 flex-col bg-card shadow-2xl transition-transform">
            <div className="absolute right-3 top-3 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Sidebar
              userEmail={userEmail}
              onNavigate={() => setMobileNavOpen(false)}
              className="w-full border-r-0"
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64 min-w-0">
        {/* Mobile Header Bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur md:hidden">
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-border/60"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-[10px] font-bold tracking-tight">EH</span>
              </div>
              <span className="text-sm font-bold tracking-tight text-foreground">
                Extractos-HC
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeSwitcher />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
