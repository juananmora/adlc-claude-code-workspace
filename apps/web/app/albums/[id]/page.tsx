import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchAlbumById } from "@/lib/albums-api";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface AlbumPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const album = await fetchAlbumById(id);
    if (!album) return { title: "Disco no encontrado" };
    return {
      title: `${album.title} — ${album.band}`,
      description: album.description,
    };
  } catch {
    return { title: "Disco" };
  }
}

/**
 * Ficha de álbum re-estilizada al tema metalero oscuro:
 * - Portada grande con sombra dura roja en hover.
 * - h1 en mayúsculas brutalistas, banda en rojo sangre.
 * - Tracklist con números grandes a la izquierda, separadores finos
 *   y hover de texto rojo.
 * - Mantiene la estructura semántica que los tests E2E esperan:
 *   `<h1>` con el título exacto, `<section>` con heading "Tracklist"
 *   y un `<ol>` dentro con todos los temas como `<li>`.
 */
export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params;
  const album = await fetchAlbumById(id);
  if (!album) {
    notFound();
  }

  return (
    <article className="container py-12 md:py-16">
      <div className="mt-2 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="group relative overflow-hidden border border-stone-800 bg-black transition-[box-shadow,border-color] duration-300 hover:border-[var(--metal-blood)] hover:shadow-[0_0_0_1px_rgba(192,0,0,0.4),0_40px_80px_-30px_rgba(192,0,0,0.55)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={album.coverUrl}
            alt={`Portada de ${album.title} — ${album.band}`}
            className="h-full w-full object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.02] group-hover:contrast-110"
          />
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.36em] text-[var(--metal-blood)]">
            {album.band}
          </p>

          <h1 className="text-balance text-4xl font-black uppercase leading-[0.95] tracking-tight text-stone-100 [text-shadow:0_0_30px_rgba(192,0,0,0.2)] md:text-5xl lg:text-6xl">
            {album.title}
          </h1>

          <span
            aria-hidden="true"
            className="block h-[2px] w-24 bg-[var(--metal-blood)]"
          />

          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.28em] text-stone-400">
            <span className="border border-stone-700 bg-black/60 px-2.5 py-1 font-bold text-stone-200">
              {album.genre}
            </span>
            <span>{album.year}</span>
          </div>

          <p className="text-base normal-case tracking-normal text-stone-300/90 [font-family:Inter,system-ui,sans-serif]">
            {album.description}
          </p>

          <section aria-labelledby="tracklist-title" className="mt-4">
            <h2
              id="tracklist-title"
              className="border-b border-stone-800 pb-3 text-sm font-bold uppercase tracking-[0.32em] text-[var(--metal-bone)]"
            >
              Tracklist
            </h2>
            <ol className="mt-2 divide-y divide-stone-800/80">
              {album.tracks.map((track, idx) => (
                <li
                  key={`${idx}-${track}`}
                  className="group flex items-center gap-5 py-3 text-sm uppercase tracking-[0.18em] text-stone-200 transition-colors hover:text-[var(--metal-blood)]"
                >
                  <span className="w-9 text-right text-2xl font-black leading-none text-stone-600 transition-colors group-hover:text-[var(--metal-blood)]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-bold">{track}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-4">
            <Link
              href="/albums"
              className="inline-flex items-center gap-2 border border-stone-700 px-5 py-3 text-xs font-bold uppercase tracking-[0.28em] text-stone-200 transition-all hover:border-[var(--metal-blood)] hover:bg-[var(--metal-blood)]/10 hover:text-[var(--metal-blood)]"
            >
              <span aria-hidden="true">&larr;</span>
              Volver al catálogo de discos
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
