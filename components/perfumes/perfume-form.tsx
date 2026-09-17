"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Genero, Perfume, PerfumeFormData } from "@/lib/types/perfume";

interface PerfumeFormProps {
  initialData?: Perfume;
  onSubmit: (data: PerfumeFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

const GENERO_OPTIONS: { value: Genero; label: string }[] = [
  { value: "hombre", label: "Hombre" },
  { value: "mujer", label: "Mujer" },
  { value: "unisex", label: "Unisex" },
];

const EMPTY_FORM: PerfumeFormData = {
  nombre: "",
  genero: "unisex",
  presentacion_ml: 0,
  precio_compra: 0,
  precio_venta: 0,
  stock_minimo: 0,
};

function toFormData(p: Perfume): PerfumeFormData {
  return {
    nombre: p.nombre,
    genero: p.genero as Genero,
    presentacion_ml: p.presentacion_ml,
    precio_compra: p.precio_compra,
    precio_venta: p.precio_venta,
    stock_minimo: p.stock_minimo,
  };
}

function validateForm(data: PerfumeFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.nombre.trim()) {
    errors.nombre = "El nombre no puede estar vacío.";
  }
  if (data.presentacion_ml <= 0) {
    errors.presentacion_ml = "La presentación debe ser mayor a 0 ml.";
  }
  if (data.precio_compra < 0) {
    errors.precio_compra = "El precio de compra no puede ser negativo.";
  }
  if (data.precio_venta < 0) {
    errors.precio_venta = "El precio de venta no puede ser negativo.";
  }
  if (data.stock_minimo < 0) {
    errors.stock_minimo = "El stock mínimo no puede ser negativo.";
  }

  return errors;
}

export function PerfumeForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: PerfumeFormProps) {
  const [form, setForm] = React.useState<PerfumeFormData>(
    initialData ? toFormData(initialData) : EMPTY_FORM
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await onSubmit(form);
  };

  const fieldClass =
    "flex flex-col gap-1.5";
  const errorClass =
    "text-xs text-destructive font-medium";
  const inputClass =
    "h-9 text-sm";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Nombre */}
      <div className={fieldClass}>
        <Label htmlFor="nombre" className="text-sm font-medium">
          Nombre <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Ej. Aventus, 212 Men…"
          className={inputClass}
          disabled={isSubmitting}
          autoFocus
        />
        {errors.nombre && <p className={errorClass}>{errors.nombre}</p>}
      </div>

      {/* Género */}
      <div className={fieldClass}>
        <Label htmlFor="genero" className="text-sm font-medium">
          Género <span className="text-destructive">*</span>
        </Label>
        <select
          id="genero"
          name="genero"
          value={form.genero}
          onChange={handleChange}
          disabled={isSubmitting}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {GENERO_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Presentación */}
      <div className={fieldClass}>
        <Label htmlFor="presentacion_ml" className="text-sm font-medium">
          Presentación (ml) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="presentacion_ml"
          name="presentacion_ml"
          type="number"
          min={1}
          step={1}
          value={form.presentacion_ml || ""}
          onChange={handleChange}
          placeholder="100"
          className={inputClass}
          disabled={isSubmitting}
        />
        {errors.presentacion_ml && (
          <p className={errorClass}>{errors.presentacion_ml}</p>
        )}
      </div>

      {/* Precios */}
      <div className="grid grid-cols-2 gap-3">
        <div className={fieldClass}>
          <Label htmlFor="precio_compra" className="text-sm font-medium">
            Precio de compra <span className="text-destructive">*</span>
          </Label>
          <Input
            id="precio_compra"
            name="precio_compra"
            type="number"
            min={0}
            step={0.01}
            value={form.precio_compra || ""}
            onChange={handleChange}
            placeholder="0.00"
            className={inputClass}
            disabled={isSubmitting}
          />
          {errors.precio_compra && (
            <p className={errorClass}>{errors.precio_compra}</p>
          )}
        </div>
        <div className={fieldClass}>
          <Label htmlFor="precio_venta" className="text-sm font-medium">
            Precio de venta <span className="text-destructive">*</span>
          </Label>
          <Input
            id="precio_venta"
            name="precio_venta"
            type="number"
            min={0}
            step={0.01}
            value={form.precio_venta || ""}
            onChange={handleChange}
            placeholder="0.00"
            className={inputClass}
            disabled={isSubmitting}
          />
          {errors.precio_venta && (
            <p className={errorClass}>{errors.precio_venta}</p>
          )}
        </div>
      </div>

      {/* Stock mínimo */}
      <div className={fieldClass}>
        <Label htmlFor="stock_minimo" className="text-sm font-medium">
          Stock mínimo
        </Label>
        <Input
          id="stock_minimo"
          name="stock_minimo"
          type="number"
          min={0}
          step={1}
          value={form.stock_minimo || ""}
          onChange={handleChange}
          placeholder="0"
          className={inputClass}
          disabled={isSubmitting}
        />
        {errors.stock_minimo && (
          <p className={errorClass}>{errors.stock_minimo}</p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Guardando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
