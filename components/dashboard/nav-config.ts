import {
  LayoutDashboard,
  SprayCan,
  Boxes,
  ShoppingBag,
  Receipt,
  Clock,
  Truck,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  isAvailable?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Inicio",
    href: "/protected",
    icon: LayoutDashboard,
    isAvailable: true,
  },
  {
    title: "Perfumes",
    href: "/protected/perfumes",
    icon: SprayCan,
    isAvailable: false,
  },
  {
    title: "Stock",
    href: "/protected/stock",
    icon: Boxes,
    isAvailable: false,
  },
  {
    title: "Ventas",
    href: "/protected/ventas",
    icon: ShoppingBag,
    isAvailable: false,
  },
  {
    title: "Deudas",
    href: "/protected/deudas",
    icon: Receipt,
    isAvailable: false,
  },
  {
    title: "Encargos",
    href: "/protected/encargos",
    icon: Clock,
    isAvailable: false,
  },
  {
    title: "Pedidos al proveedor",
    href: "/protected/pedidos",
    icon: Truck,
    isAvailable: false,
  },
  {
    title: "Reportes",
    href: "/protected/reportes",
    icon: BarChart3,
    isAvailable: false,
  },
];
