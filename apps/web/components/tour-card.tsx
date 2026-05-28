import Link from "next/link";
import Image from "next/image";
import type { Tour } from "@/lib/tour-types";

interface TourCardProps {
  tour: Tour;
}

/**
 * Tarjeta de gira histórica. Espeja `console-card.tsx`: `border-2` para
 * evocar el cartel pegado en pared, cinta superior izquierda con badge de
 * década en formato corto ("80s", "90s", "00s"), hover en rojo sangre.
 *
 * Atributos E2E:
 *  - data-testid="tour-card"
 *  - data-tour-id="<id>"
 *  - data-decade="<n>"
 *  - El <Link> mantiene `aria-label="Ver detalle de <name>"`.
 *
 * Para los carteles se usa `next/image` ya que las imágenes están en
 * `public/covers/tours/` y queremos optimización de Next. El contenedor
 * recorta en `aspect-square` con `object-cover`.
 */
export function TourCard({ tour: t }: TourCardProps) {
  // "80s" / "90s" / "00s" derivado de la década (1980 → "80s", 2000 → "00s").
  const decadeShort = `${String(t.decade).slice(2)}s`;

  return (
    <article
      data-testid="tour-card"
      data-tour-id={t.id}
      data-decade={t.decade}
      className="group relative flex h-full flex-col overflow-hidden border-2 border-stone-800 bg-black transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--metal-blood)] hover:shadow-[0_0_0_1px_rgba(192,0,0,0.4),0_25px_60px_-20px_rgba(192,0,0,0.5)]"
    >
      <Link
        href={`/tours/${encodeURIComponent(t.id)}`}
        aria-label={`Ver detalle de ${t.name}`}
        className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--metal-blood)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-stone-900">
          <Image
            src={t.coverUrl}
            alt={`Cartel de ${t.name}`}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.04] group-hover:contrast-110"
          />
          {/* Velo oscuro sutil sobre la portada para integrar con el fondo. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/30 opacity-90 transition-opacity duration-300 group-hover:opacity-60"
          />
          {/* Cinta de década en esquina superior izquierda. */}
          <span className="absolute left-0 top-0 inline-block bg-[var(--metal-blood)] px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-black">
            {decadeShort}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 px-4 pb-5 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-base font-bold uppercase leading-tight tracking-wider text-stone-100 transition-colors group-hover:text-[var(--metal-bone)] [text-shadow:0_0_0_transparent] group-hover:[text-shadow:0_0_12px_rgba(192,0,0,0.45)]">
              {t.name}
            </h3>
            <span className="shrink-0 text-xs font-bold uppercase tracking-[0.22em] text-stone-500 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
              {t.year}
            </span>
          </div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] text-stone-400 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            {t.band}
          </p>
        </div>
      </Link>
    </article>
  );
}
