import { Hero } from "@/components/hero";
import { CatalogGrid } from "@/components/catalog-grid";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let initialProducts: Product[] = [];
  try {
    initialProducts = await fetchProducts();
  } catch {
    // Si el backend no está disponible en SSR, el cliente reintentará
    // automáticamente desde CatalogGrid (useEffect).
    initialProducts = [];
  }
  return (
    <>
      <Hero />
      <CatalogGrid initialProducts={initialProducts} />
    </>
  );
}
