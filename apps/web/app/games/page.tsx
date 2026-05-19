import { GamesGrid } from "@/components/games-grid";
import { fetchGames } from "@/lib/games-api";
import type { Game } from "@/lib/game-types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Games — Retro 8-bit (Amstrad CPC & Commodore 64)",
  description:
    "16 clásicos icónicos retro 8-bit (1984-1990): Amstrad CPC y Commodore 64. Aventura isométrica, arcade, shoot 'em up, lucha, aventuras gráficas y más.",
};

/**
 * Listado de juegos clásicos de Amstrad CPC. SSR con fallback `[]` si la
 * API no responde: el cliente reintenta desde `GamesGrid` en su `useEffect`.
 *
 * Estética retro/8-bit: tipografía monoespaciada para subtítulos, scanlines
 * sutiles en el hero, paleta metalera mantenida (`var(--metal-blood)`,
 * `var(--metal-bone)`, `border-stone-800`) para no romper con el resto del
 * site.
 */
export default async function GamesPage() {
  let initialGames: Game[] = [];
  try {
    initialGames = await fetchGames();
  } catch {
    initialGames = [];
  }

  return (
    <>
      <section
        aria-label="Cabecera de games retro 8-bit (Amstrad CPC y Commodore 64)"
        className="relative isolate overflow-hidden border-b border-stone-800/80 bg-[#0a0a0a]"
      >
        {/* Resplandor rojo difuso al fondo. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-1/2 h-[120%] w-[60%] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(192,0,0,0.25),transparent_70%)] blur-3xl"
        />
        {/* Scanlines sutiles tipo CRT, opacidad baja para no entorpecer la lectura. */}
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
            Catálogo &middot; 8-bit
          </p>

          <h1 className="text-balance font-black uppercase leading-[0.9] tracking-tight text-stone-100 [text-shadow:0_0_30px_rgba(192,0,0,0.25)]">
            <span className="block text-6xl md:text-8xl lg:text-[8rem]">
              GAMES
            </span>
            <span className="mt-3 block text-2xl text-[var(--metal-blood)] md:text-4xl lg:text-5xl [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
              AMSTRAD CPC &amp; COMMODORE 64
            </span>
          </h1>

          <span
            aria-hidden="true"
            className="block h-[2px] w-32 bg-[var(--metal-blood)]"
          />

          <p className="max-w-xl text-sm uppercase tracking-[0.22em] text-stone-400 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace] md:text-base">
            16 clásicos retro 8-bit &middot; 1984-1995
          </p>

          <p className="max-w-2xl text-base normal-case tracking-normal text-stone-300/90 [font-family:Inter,system-ui,sans-serif]">
            Selección curada de joyas del 8-bit europeo: aventura isométrica
            Ultimate, arcade conversions de Ocean e Imagine, Opera Soft made
            in Spain en CPC más superventas de Commodore 64 como The Last
            Ninja, IK+, Maniac Mansion, Wizball o Turrican. Filtra por género
            o busca por título.
          </p>
        </div>
      </section>

      <GamesGrid initialGames={initialGames} />
    </>
  );
}
