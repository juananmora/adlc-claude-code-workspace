import { ToursGrid } from "@/components/tours-grid";
import { fetchTours } from "@/lib/tours-api";
import type { Tour } from "@/lib/tour-types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tours — 1980 a 2010",
  description:
    "10 giras históricas del metal clásico (1980-2010): de la World Slavery Tour de Iron Maiden a la gira mundial de Slipknot por Iowa.",
};

/**
 * Listado de giras históricas. SSR con fallback `[]` si la API no responde:
 * el cliente reintenta desde `ToursGrid` en su `useEffect`.
 *
 * Estética metalera coherente con `/consoles`, `/games` y `/albums`: paleta
 * sangre + bone sobre fondo negro, scanlines sutiles en el hero, tipografía
 * monoespaciada para subtítulos.
 */
export default async function ToursPage() {
  let initialTours: Tour[] = [];
  try {
    initialTours = await fetchTours();
  } catch {
    initialTours = [];
  }

  return (
    <>
      <section
        aria-label="Cabecera de tours icónicos"
        className="relative isolate overflow-hidden border-b border-stone-800/80 bg-[#0a0a0a]"
      >
        {/* Resplandor rojo difuso al fondo. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-1/2 h-[120%] w-[60%] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(192,0,0,0.25),transparent_70%)] blur-3xl"
        />
        {/* Scanlines sutiles tipo CRT. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.6)_0px,rgba(255,255,255,0.6)_1px,transparent_1px,transparent_3px)]"
        />

        <div className="container relative flex flex-col gap-6 py-16 md:py-24 lg:py-28">
          <p className="inline-flex w-fit items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-[var(--metal-bone)]/80 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            <span
              aria-hidden="true"
              className="inline-block h-px w-10 bg-[var(--metal-blood)]"
            />
            Catálogo &middot; Giras
          </p>

          <h1 className="text-balance font-black uppercase leading-[0.9] tracking-tight text-stone-100 [text-shadow:0_0_30px_rgba(192,0,0,0.25)]">
            <span className="block text-6xl md:text-8xl lg:text-[8rem]">
              TOURS
            </span>
            <span className="mt-3 block text-2xl text-[var(--metal-blood)] md:text-4xl lg:text-5xl [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
              1980 — 2010
            </span>
          </h1>

          <span
            aria-hidden="true"
            className="block h-[2px] w-32 bg-[var(--metal-blood)]"
          />

          <p className="max-w-xl text-sm uppercase tracking-[0.22em] text-stone-400 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace] md:text-base">
            10 giras que pisaron estadios &middot; 1980-2010
          </p>

          <p className="max-w-2xl text-base normal-case tracking-normal text-stone-300/90 [font-family:Inter,system-ui,sans-serif]">
            De la World Slavery Tour que llevó a Iron Maiden detrás del telón
            de acero a la gira de Slipknot por Iowa que cerró el nu metal,
            pasando por Damaged Justice, Use Your Illusion y los grandes
            festivales itinerantes. Filtra por década o busca por nombre.
          </p>
        </div>
      </section>

      <ToursGrid initialTours={initialTours} />
    </>
  );
}
