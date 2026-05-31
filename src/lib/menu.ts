import { products, type Product } from "@/data/products";

const MENU_KEY = "darlas-menu";

export function getLiveMenu(): Product[] {
  if (typeof window === "undefined") return products;
  try {
    const raw = localStorage.getItem(MENU_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : products;
  } catch {
    return products;
  }
}

export function saveLiveMenu(items: Product[]): void {
  try {
    localStorage.setItem(MENU_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function getLiveProduct(id: string): Product | undefined {
  return getLiveMenu().find((p) => p.id === id);
}

export function resetMenu(): void {
  try {
    localStorage.removeItem(MENU_KEY);
  } catch {
    // ignore
  }
}
