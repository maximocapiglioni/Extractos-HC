import { getPerfumes } from "./actions";
import { PerfumesClient } from "@/components/perfumes/perfumes-client";
import type { FiltroEstado } from "@/lib/types/perfume";

interface PerfumesPageProps {
  searchParams: Promise<{ estado?: string }>;
}

export default async function PerfumesPage({ searchParams }: PerfumesPageProps) {
  // Resolve searchParams
  const params = await searchParams;
  const rawEstado = params?.estado;
  const filtroValido: FiltroEstado[] = ["activos", "inactivos", "todos"];
  const filtroInicial: FiltroEstado =
    filtroValido.includes(rawEstado as FiltroEstado)
      ? (rawEstado as FiltroEstado)
      : "activos";

  // Fetch initial data server-side
  const { data: perfumes, error } = await getPerfumes(filtroInicial);

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Error al cargar los perfumes: {error}
        </div>
      )}
      <PerfumesClient
        initialPerfumes={perfumes}
        initialFiltro={filtroInicial}
      />
    </div>
  );
}

