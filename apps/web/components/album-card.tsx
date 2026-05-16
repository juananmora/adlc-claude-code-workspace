import Link from "next/link";
import type { Album } from "@/lib/album-types";

interface AlbumCardProps {
  album: Album;
}

/**
 * Tarjeta de álbum, estética metalera oscura:
 * - Marco negro con borde fino que sangra al rojo en hover.
 * - La card sube un poco y emite un glow rojo tenue.
 * - Banda en pequeño en rojo sangre, año a la derecha, título en
 *   mayúsculas brutalistas.
 * - Imagen a sangre, sin esquinas redondeadas.
 *
 * Atributos E2E (NO TOCAR):
 * - data-testid="album-card"
 * - data-band="<band>" (filtro exact-match por banda).
 * - data-genre="<genre>" (filtro exact-match por género, iter-5).
 * - El <Link> mantiene `aria-label="Ver detalle de <título>"`,
 *   selector que usan los tests para entrar a la ficha.
 */
export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <article
      data-testid="album-card"
      data-album-id={album.id}
      data-band={album.band}
      data-genre={album.genre}
      className="group relative flex h-full flex-col overflow-hidden border border-stone-800 bg-black transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--metal-blood)] hover:shadow-[0_0_0_1px_rgba(192,0,0,0.4),0_25px_60px_-20px_rgba(192,0,0,0.5)]"
    >
      <Link
        href={`/albums/${album.id}`}
        aria-label={`Ver detalle de ${album.title}`}
        className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--metal-blood)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-stone-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={album.coverUrl}
            alt={`Portada de ${album.title} — ${album.band}`}
            loading="lazy"
            className="h-full w-full object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.04] group-hover:contrast-110"
          />
          {/* Velo oscuro sutil sobre la portada para integrar mejor con
              el fondo negro y reforzar legibilidad de la banda superior. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/30 opacity-90 transition-opacity duration-300 group-hover:opacity-60"
          />
          {/* Banda como cinta superior izquierda. */}
          <span className="absolute left-0 top-0 inline-block bg-[var(--metal-blood)] px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-black">
            {album.band}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 px-4 pb-5 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-base font-bold uppercase leading-tight tracking-wider text-stone-100 transition-colors group-hover:text-[var(--metal-bone)] [text-shadow:0_0_0_transparent] group-hover:[text-shadow:0_0_12px_rgba(192,0,0,0.45)]">
              {album.title}
            </h3>
            <span className="shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
              {album.year}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
