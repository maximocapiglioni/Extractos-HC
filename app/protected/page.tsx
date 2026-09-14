import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import {
  ShoppingBag,
  SprayCan,
  AlertTriangle,
  Receipt,
  Clock,
  PlusCircle,
  Search,
  ArrowRight,
  Package,
} from "lucide-react";

async function AuthCheck() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return null;
}

export default function ProtectedPage() {
  return (
    <div className="flex flex-col gap-8">
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>

      {/* Header section */}
      <div className="flex flex-col gap-1 border-b border-border/60 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Extractos-HC
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Panel de gestión
        </p>
      </div>

      {/* 5 Summary Stat Cards */}
      <section aria-label="Resumen operativo">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            title="Ventas de hoy"
            value="$0"
            icon={ShoppingBag}
            tone="success"
            description="Total vendido hoy"
          />
          <StatCard
            title="Perfumes en stock"
            value="0"
            icon={SprayCan}
            tone="primary"
            description="Unidades disponibles"
          />
          <StatCard
            title="Stock bajo"
            value="0"
            icon={AlertTriangle}
            tone="warning"
            description="Requieren reposición"
          />
          <StatCard
            title="Deudas pendientes"
            value="$0"
            icon={Receipt}
            tone="default"
            description="Cobros por realizar"
          />
          <StatCard
            title="Encargos pendientes"
            value="0"
            icon={Clock}
            tone="default"
            description="Encargos por entregar"
          />
        </div>
      </section>

      {/* Operative Quick Actions & Status Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <Card className="border border-border/70 shadow-sm lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Acciones frecuentes
            </CardTitle>
            <CardDescription className="text-xs">
              Accesos directos para la operativa diaria
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            <Button
              variant="outline"
              disabled
              className="w-full justify-between font-normal text-sm h-10 border-border/70 opacity-60 cursor-not-allowed select-none"
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="h-4 w-4 text-muted-foreground" />
                <span>Nueva venta</span>
              </div>
              <span className="rounded bg-muted/80 px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                Próx.
              </span>
            </Button>

            <Button
              variant="outline"
              disabled
              className="w-full justify-between font-normal text-sm h-10 border-border/70 opacity-60 cursor-not-allowed select-none"
            >
              <div className="flex items-center gap-2.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span>Buscar perfume</span>
              </div>
              <span className="rounded bg-muted/80 px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                Próx.
              </span>
            </Button>

            <Button
              variant="outline"
              disabled
              className="w-full justify-between font-normal text-sm h-10 border-border/70 opacity-60 cursor-not-allowed select-none"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Registrar encargo</span>
              </div>
              <span className="rounded bg-muted/80 px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                Próx.
              </span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent activity placeholder */}
        <Card className="border border-border/70 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Actividad del día
            </CardTitle>
            <CardDescription className="text-xs">
              Registro cronológico de movimientos y ventas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-[160px] flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/20 p-6 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                <Package className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No hay movimientos registrados hoy
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                A medida que registres ventas, encargos o ingresos de stock, podrás hacerles seguimiento desde este panel.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
