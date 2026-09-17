"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PerfumeForm } from "./perfume-form";
import { ConfirmDialog } from "./confirm-dialog";
import {
  crearPerfume,
  editarPerfume,
  desactivarPerfume,
  reactivarPerfume,
} from "@/app/protected/perfumes/actions";
import type { Perfume, PerfumeFormData, FiltroEstado } from "@/lib/types/perfume";
import {
  Plus,
  Search,
  SprayCan,
  Edit2,
  PowerOff,
  RefreshCw,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(n);
}

function generoLabel(g: string): string {
  const map: Record<string, string> = {
    hombre: "Hombre",
    mujer: "Mujer",
    unisex: "Unisex",
  };
  return map[g] ?? g;
}

function genderBadgeClass(g: string): string {
  const map: Record<string, string> = {
    hombre: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    mujer:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
    unisex:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  };
  return map[g] ?? "bg-muted text-muted-foreground";
}

// ─── Modal Wrapper ────────────────────────────────────────────────────────────

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="modal-title"
            className="text-base font-semibold text-foreground"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastMsg {
  id: number;
  text: string;
  type: "success" | "error";
}

function Toast({ msg, onDismiss }: { msg: ToastMsg; onDismiss: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg",
        msg.type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/60 dark:text-emerald-300"
          : "border-destructive/30 bg-destructive/10 text-destructive"
      )}
    >
      <span className="flex-1">{msg.text}</span>
      <button
        onClick={onDismiss}
        className="shrink-0 opacity-70 hover:opacity-100"
        aria-label="Descartar"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Filtro Badge ─────────────────────────────────────────────────────────────

const FILTROS: { value: FiltroEstado; label: string }[] = [
  { value: "activos", label: "Activos" },
  { value: "inactivos", label: "Inactivos" },
  { value: "todos", label: "Todos" },
];

// ─── Card Mobile ──────────────────────────────────────────────────────────────

function PerfumeCard({
  perfume,
  onEdit,
  onToggle,
}: {
  perfume: Perfume;
  onEdit: (p: Perfume) => void;
  onToggle: (p: Perfume) => void;
}) {
  const stockBajo = perfume.stock_actual <= perfume.stock_minimo;

  return (
    <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {perfume.nombre}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                genderBadgeClass(perfume.genero)
              )}
            >
              {generoLabel(perfume.genero)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {perfume.presentacion_ml} ml
            </span>
          </div>
        </div>
        {/* Stock badge */}
        <div
          className={cn(
            "flex flex-col items-end shrink-0",
          )}
        >
          <span
            className={cn(
              "text-xs font-bold tabular-nums",
              stockBajo
                ? "text-amber-600 dark:text-amber-400"
                : "text-foreground"
            )}
          >
            {perfume.stock_actual} u.
          </span>
          {stockBajo && (
            <span className="flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-2.5 w-2.5" />
              Stock bajo
            </span>
          )}
        </div>
      </div>

      {/* Precios */}
      <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-muted/40 px-3 py-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Compra
          </p>
          <p className="text-xs font-semibold text-foreground tabular-nums">
            {formatCurrency(perfume.precio_compra)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Venta
          </p>
          <p className="text-xs font-semibold text-foreground tabular-nums">
            {formatCurrency(perfume.precio_venta)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 text-xs h-8"
          onClick={() => onEdit(perfume)}
        >
          <Edit2 className="h-3 w-3" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex-1 gap-1.5 text-xs h-8",
            perfume.activo
              ? "text-muted-foreground hover:text-destructive hover:border-destructive/40"
              : "text-emerald-600 hover:border-emerald-400 dark:text-emerald-400"
          )}
          onClick={() => onToggle(perfume)}
        >
          {perfume.activo ? (
            <>
              <PowerOff className="h-3 w-3" />
              Desactivar
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3" />
              Reactivar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface PerfumesClientProps {
  initialPerfumes: Perfume[];
  initialFiltro: FiltroEstado;
}

export function PerfumesClient({
  initialPerfumes,
  initialFiltro,
}: PerfumesClientProps) {
  const [perfumes, setPerfumes] = React.useState<Perfume[]>(initialPerfumes);
  const [filtro, setFiltro] = React.useState<FiltroEstado>(initialFiltro);
  const [busqueda, setBusqueda] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editingPerfume, setEditingPerfume] = React.useState<Perfume | null>(null);
  const [togglingPerfume, setTogglingPerfume] = React.useState<Perfume | null>(null);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Toasts
  const [toasts, setToasts] = React.useState<ToastMsg[]>([]);
  const toastIdRef = React.useRef(0);

  const addToast = React.useCallback((text: string, type: "success" | "error") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);

  const removeToast = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Reload perfumes after mutations
  const reloadPerfumes = React.useCallback(
    async (f: FiltroEstado) => {
      setIsLoading(true);
      try {
        // Dynamic import to avoid bundling server action on client unnecessarily
        const { getPerfumes } = await import(
          "@/app/protected/perfumes/actions"
        );
        const { data, error } = await getPerfumes(f);
        if (error) {
          addToast("Error al actualizar la lista: " + error, "error");
        } else {
          setPerfumes(data);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [addToast]
  );

  // Filtro change
  const handleFiltroChange = async (f: FiltroEstado) => {
    setFiltro(f);
    setBusqueda("");
    await reloadPerfumes(f);
  };

  // Filtered list
  const filtered = React.useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return perfumes;
    return perfumes.filter((p) =>
      p.nombre.toLowerCase().includes(q)
    );
  }, [perfumes, busqueda]);

  // ── Crear ──
  const handleCreate = async (data: PerfumeFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await crearPerfume(data);
      if (error) {
        addToast("Error al crear el perfume: " + error, "error");
      } else {
        addToast("Perfume creado correctamente.", "success");
        setShowCreateModal(false);
        await reloadPerfumes(filtro);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Editar ──
  const handleEdit = async (data: PerfumeFormData) => {
    if (!editingPerfume) return;
    setIsSubmitting(true);
    try {
      const { error } = await editarPerfume(editingPerfume.id, data);
      if (error) {
        addToast("Error al editar el perfume: " + error, "error");
      } else {
        addToast("Perfume actualizado correctamente.", "success");
        setEditingPerfume(null);
        await reloadPerfumes(filtro);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Toggle (desactivar / reactivar) ──
  const handleToggleConfirm = async () => {
    if (!togglingPerfume) return;
    setIsSubmitting(true);
    try {
      const action = togglingPerfume.activo ? desactivarPerfume : reactivarPerfume;
      const { error } = await action(togglingPerfume.id);
      if (error) {
        addToast("Error: " + error, "error");
      } else {
        const msg = togglingPerfume.activo
          ? "Perfume desactivado."
          : "Perfume reactivado.";
        addToast(msg, "success");
        setTogglingPerfume(null);
        await reloadPerfumes(filtro);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} msg={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal
          title="Agregar perfume"
          onClose={() => setShowCreateModal(false)}
        >
          <PerfumeForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateModal(false)}
            isSubmitting={isSubmitting}
            submitLabel="Agregar"
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editingPerfume && (
        <Modal
          title="Editar perfume"
          onClose={() => setEditingPerfume(null)}
        >
          <PerfumeForm
            initialData={editingPerfume}
            onSubmit={handleEdit}
            onCancel={() => setEditingPerfume(null)}
            isSubmitting={isSubmitting}
            submitLabel="Guardar cambios"
          />
        </Modal>
      )}

      {/* Confirm toggle */}
      {togglingPerfume && (
        <ConfirmDialog
          title={
            togglingPerfume.activo
              ? "¿Desactivar perfume?"
              : "¿Reactivar perfume?"
          }
          description={
            togglingPerfume.activo
              ? `"${togglingPerfume.nombre}" quedará inactivo y no aparecerá en las listas principales.`
              : `"${togglingPerfume.nombre}" volverá a estar activo.`
          }
          confirmLabel={togglingPerfume.activo ? "Desactivar" : "Reactivar"}
          onConfirm={handleToggleConfirm}
          onCancel={() => setTogglingPerfume(null)}
          isLoading={isSubmitting}
          variant={togglingPerfume.activo ? "destructive" : "default"}
        />
      )}

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1 border-b border-border/60 pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Perfumes
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Catálogo de perfumes de equivalencia
            </p>
          </div>
          <Button
            id="btn-agregar-perfume"
            onClick={() => setShowCreateModal(true)}
            className="gap-2 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Agregar perfume
          </Button>
        </div>
      </div>

      {/* ── Toolbar: búsqueda + filtro estado ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="input-buscar-perfume"
            type="search"
            placeholder="Buscar por nombre…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Filtro estado */}
        <div className="flex items-center gap-1 rounded-lg border border-border/70 bg-muted/30 p-1">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFiltroChange(f.value)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                filtro === f.value
                  ? "bg-background text-foreground shadow-sm border border-border/70"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading overlay subtle ── */}
      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          Actualizando…
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/10 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
            <SprayCan className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-foreground">
            {busqueda
              ? "Sin resultados para esa búsqueda"
              : filtro === "activos"
              ? "No hay perfumes activos"
              : filtro === "inactivos"
              ? "No hay perfumes inactivos"
              : "No hay perfumes registrados"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            {busqueda
              ? "Probá con otro término de búsqueda."
              : "Usá el botón «Agregar perfume» para comenzar."}
          </p>
        </div>
      )}

      {/* ── Desktop table ── */}
      {!isLoading && filtered.length > 0 && (
        <>
          {/* Table — visible md+ */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-border/70 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 bg-muted/40">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Género
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Ml
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Compra
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Venta
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((p) => {
                  const stockBajo = p.stock_actual <= p.stock_minimo;
                  return (
                    <tr
                      key={p.id}
                      className="bg-card transition-colors hover:bg-muted/20"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {p.nombre}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-medium",
                            genderBadgeClass(p.genero)
                          )}
                        >
                          {generoLabel(p.genero)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                        {p.presentacion_ml}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                        {formatCurrency(p.precio_compra)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-foreground">
                        {formatCurrency(p.precio_venta)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 tabular-nums font-semibold",
                            stockBajo
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-foreground"
                          )}
                        >
                          {stockBajo && (
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                          )}
                          {p.stock_actual}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => setEditingPerfume(p)}
                            title="Editar"
                            aria-label={`Editar ${p.nombre}`}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-7 w-7",
                              p.activo
                                ? "text-muted-foreground hover:text-destructive"
                                : "text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
                            )}
                            onClick={() => setTogglingPerfume(p)}
                            title={p.activo ? "Desactivar" : "Reactivar"}
                            aria-label={
                              p.activo
                                ? `Desactivar ${p.nombre}`
                                : `Reactivar ${p.nombre}`
                            }
                          >
                            {p.activo ? (
                              <PowerOff className="h-3.5 w-3.5" />
                            ) : (
                              <RefreshCw className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards — visible < md */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((p) => (
              <PerfumeCard
                key={p.id}
                perfume={p}
                onEdit={setEditingPerfume}
                onToggle={setTogglingPerfume}
              />
            ))}
          </div>
        </>
      )}

      {/* Count footer */}
      {!isLoading && filtered.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {filtered.length}{" "}
          {filtered.length === 1 ? "perfume" : "perfumes"}
          {busqueda && " encontrado(s)"}
        </p>
      )}
    </>
  );
}
