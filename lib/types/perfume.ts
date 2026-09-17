export type Genero = "hombre" | "mujer" | "unisex";

export type FiltroEstado = "activos" | "inactivos" | "todos";

export interface Perfume {
  id: number;
  nombre: string;
  genero: Genero;
  presentacion_ml: number;
  precio_compra: number;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  activo: boolean;
  fecha_creacion: string | null;
  fecha_actualizacion: string | null;
}

export interface PerfumeFormData {
  nombre: string;
  genero: Genero;
  presentacion_ml: number;
  precio_compra: number;
  precio_venta: number;
  stock_minimo: number;
}
