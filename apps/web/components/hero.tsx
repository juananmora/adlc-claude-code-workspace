import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Hero IRON DECK — tema metalero oscuro.
 * Fondo negro, titular brutal, acento rojo sangre.
 *
 * NOTA QA: el titular canónico es "EQUIPOS QUE RINDEN. ENTREGADOS." (en
 * mayúsculas tras el rebrand). Los tests E2E lo asertan case-insensitive.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-stone-800 bg-[#0a0a0a]">
      {/* Imagen de fondo: PCB industrial. Oscurecida con overlay para
          mantener legibilidad del texto sobre ella. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/products/hero-forge.jpg"
          alt=""
          className="h-full w-full object-cover opacity-30 [filter:contrast(1.1)_saturate(0.6)]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-[#0a0a0a]/20" />
      </div>
      <div className="container relative z-10 grid gap-10 py-20 md:grid-cols-[1.2fr_0.8fr] md:py-28">
        <div className="flex flex-col justify-center gap-7">
          <p className="inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-stone-400">
            <span className="text-[var(--iron-red)]" aria-hidden="true">
              {"//"}
            </span>
            Catálogo · IRON DECK
          </p>
          <h1 className="text-balance text-5xl font-black uppercase leading-[1.02] tracking-[0.04em] text-[var(--iron-bone)] [font-family:var(--font-metal)] md:text-6xl lg:text-7xl">
            Equipos que rinden.
            <br />
            <span className="text-[var(--iron-red)] [text-shadow:0_0_30px_rgba(192,0,0,0.35)]">
              Entregados.
            </span>
          </h1>
          <span
            aria-hidden="true"
            className="block h-[2px] w-24 bg-[var(--iron-red)]"
          />
          <p className="max-w-xl text-balance text-base text-stone-300 [font-family:Inter,system-ui,sans-serif] md:text-lg">
            Portátiles, sobremesa, componentes y periféricos forjados para
            quien no se conforma. Sin filler. Sin clichés corporativos.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="#categorias">Ver catálogo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#categorias">Explorar categorías</Link>
            </Button>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="relative hidden items-center justify-center md:flex"
        >
          {/* Detalle decorativo: barras industriales rojas */}
          <div className="flex flex-col gap-2">
            <span className="block h-2 w-48 bg-[var(--iron-red)] opacity-90" />
            <span className="block h-2 w-32 bg-[var(--iron-red)] opacity-60" />
            <span className="block h-2 w-40 bg-[var(--iron-red)] opacity-40" />
            <span className="block h-2 w-24 bg-[var(--iron-red)] opacity-20" />
          </div>
        </div>
      </div>
    </section>
  );
}
