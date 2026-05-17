import { ConsolesGrid } from "@/components/consoles-grid";
import { fetchConsoles } from "@/lib/consoles-api";
import type { Console } from "@/lib/console-types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Consolas — Generaciones 3 a 7",
  description:
    "10 videoconsolas icónicas (1983-2006): de la NES a la Wii, pasando por Mega Drive, PlayStation, N64, Dreamcast, PS2 y Xbox.",
};

/**
 * Listado de videoconsolas históricas. SSR con fallback `[]` si la API no
 * responde: el cliente reintenta desde `ConsolesGrid` en su `useEffect`.
 *
 * Estética metalera coherente con `/games` y `/albums`: paleta sangre + bone
 * sobre fondo negro, scanlines sutiles en el hero, tipografía monoespaciada
 * para subtítulos.
 */
export default async function ConsolesPage() {
  let initialConsoles: Console[] = [];
  try {
    initialConsoles = await fetchConsoles();
  } catch {
    initialConsoles = [];
  }

  return (
    <>
      <section
        aria-label="Cabecera de consolas icónicas"
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
            Catálogo &middot; Hardware
          </p>

          <h1 className="text-balance font-black uppercase leading-[0.9] tracking-tight text-stone-100 [text-shadow:0_0_30px_rgba(192,0,0,0.25)]">
            <span className="block text-6xl md:text-8xl lg:text-[8rem]">
              CONSOLAS
            </span>
            <span className="mt-3 block text-2xl text-[var(--metal-blood)] md:text-4xl lg:text-5xl [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
              GENERACIONES 3 — 7
            </span>
          </h1>

          <span
            aria-hidden="true"
            className="block h-[2px] w-32 bg-[var(--metal-blood)]"
          />

          <p className="max-w-xl text-sm uppercase tracking-[0.22em] text-stone-400 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace] md:text-base">
            10 máquinas que escribieron la historia &middot; 1983-2006
          </p>

          <p className="max-w-2xl text-base normal-case tracking-normal text-stone-300/90 [font-family:Inter,system-ui,sans-serif]">
            De la NES que rescató el videojuego del crack del 83 a la Wii que
            popularizó el control por movimiento, pasando por Mega Drive,
            PlayStation, Nintendo 64, Dreamcast, PS2 y Xbox. Filtra por
            generación o busca por nombre.
          </p>
        </div>
      </section>

      <ConsolesGrid initialConsoles={initialConsoles} />
    </>
  );
}
