import { AlbumsGrid } from "@/components/albums-grid";
import { fetchAlbums } from "@/lib/albums-api";
import type { Album } from "@/lib/album-types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Discos que no mueren — Heavy Metal",
  description:
    "Catálogo metalero: Iron Maiden, Judas Priest, Metallica, Led Zeppelin, Black Sabbath, Megadeth y Slayer.",
};

/**
 * Listado de discos. SSR con fallback `[]` si la API no responde:
 * el cliente reintenta desde `AlbumsGrid` en su `useEffect`.
 */
export default async function AlbumsPage() {
  let initialAlbums: Album[] = [];
  try {
    initialAlbums = await fetchAlbums();
  } catch {
    initialAlbums = [];
  }

  return (
    <>
      <section
        aria-label="Cabecera de discos"
        className="relative isolate overflow-hidden border-b border-stone-800/80 bg-[#0a0a0a]"
      >
        {/* Resplandor rojo difuso anclado al lado de Eddie. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-1/2 h-[120%] w-[60%] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(192,0,0,0.35),transparent_70%)] blur-3xl"
        />

        <div className="container relative grid items-center gap-12 py-16 md:grid-cols-2 md:py-24 lg:py-28">
          <div className="relative z-10 flex flex-col gap-6">
            <p className="inline-flex w-fit items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-[var(--metal-bone)]/80">
              <span
                aria-hidden="true"
                className="inline-block h-px w-10 bg-[var(--metal-blood)]"
              />
              Catálogo &middot; Heavy Metal
            </p>

            <h1
              className="text-balance text-5xl font-black uppercase leading-[0.95] tracking-tight text-stone-100 [text-shadow:0_0_30px_rgba(192,0,0,0.25)] md:text-7xl lg:text-[5.5rem]"
            >
              Discos
              <br />
              <span className="text-[var(--metal-blood)]">que no</span>
              <br />
              mueren
            </h1>

            <span
              aria-hidden="true"
              className="block h-[2px] w-32 bg-[var(--metal-blood)]"
            />

            <p className="max-w-xl text-sm uppercase tracking-[0.22em] text-stone-400 md:text-base">
              Iron Maiden &middot; Metallica &middot; Black Sabbath &middot;
              Judas Priest &middot; Megadeth &middot; Slayer &middot; Led
              Zeppelin
            </p>

            <p className="max-w-xl text-base normal-case tracking-normal text-stone-300/90 [font-family:Inter,system-ui,sans-serif]">
              Selección curada de obras esenciales del metal clásico. Filtra
              por banda o busca por título: la lista entera está aquí, a un
              riff de distancia.
            </p>
          </div>

          <div className="relative flex items-center justify-center md:justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/covers/motley-crue-band.jpeg"
              alt="Mötley Crüe — foto promocional"
              className="w-full max-w-[520px] border border-[var(--metal-blood)]/30 object-contain contrast-125 saturate-[0.95] [filter:drop-shadow(0_25px_40px_rgba(0,0,0,0.85))_drop-shadow(0_0_60px_rgba(139,0,0,0.35))]"
            />
          </div>
        </div>
      </section>

      <AlbumsGrid initialAlbums={initialAlbums} />
    </>
  );
}
