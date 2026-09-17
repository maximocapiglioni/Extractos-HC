"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Perfume, PerfumeFormData, FiltroEstado } from "@/lib/types/perfume";

// ─── Listar ───────────────────────────────────────────────────────────────────

export async function getPerfumes(
  filtro: FiltroEstado = "activos"
): Promise<{ data: Perfume[]; error: string | null }> {
  const supabase = await createClient();

  let query = supabase
    .from("perfumes")
    .select("*")
    .order("nombre", { ascending: true });

  if (filtro === "activos") {
    query = query.eq("activo", true);
  } else if (filtro === "inactivos") {
    query = query.eq("activo", false);
  }
  // "todos" no aplica filtro adicional

  const { data, error } = await query;

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (data as Perfume[]) ?? [], error: null };
}

// ─── Crear ────────────────────────────────────────────────────────────────────

export async function crearPerfume(
  formData: PerfumeFormData
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.from("perfumes").insert({
    nombre: formData.nombre.trim(),
    genero: formData.genero,
    presentacion_ml: formData.presentacion_ml,
    precio_compra: formData.precio_compra,
    precio_venta: formData.precio_venta,
    stock_minimo: formData.stock_minimo,
    stock_actual: 0,
    activo: true,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/protected/perfumes");
  return { error: null };
}

// ─── Editar ───────────────────────────────────────────────────────────────────

export async function editarPerfume(
  id: number,
  formData: PerfumeFormData
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("perfumes")
    .update({
      nombre: formData.nombre.trim(),
      genero: formData.genero,
      presentacion_ml: formData.presentacion_ml,
      precio_compra: formData.precio_compra,
      precio_venta: formData.precio_venta,
      stock_minimo: formData.stock_minimo,
      fecha_actualizacion: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/protected/perfumes");
  return { error: null };
}

// ─── Desactivar ───────────────────────────────────────────────────────────────

export async function desactivarPerfume(
  id: number
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("perfumes")
    .update({
      activo: false,
      fecha_actualizacion: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/protected/perfumes");
  return { error: null };
}

// ─── Reactivar ────────────────────────────────────────────────────────────────

export async function reactivarPerfume(
  id: number
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("perfumes")
    .update({
      activo: true,
      fecha_actualizacion: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/protected/perfumes");
  return { error: null };
}
