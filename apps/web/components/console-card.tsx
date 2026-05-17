import Link from "next/link";
import Image from "next/image";
import type { Console } from "@/lib/console-types";

interface ConsoleCardProps {
  console: Console;
}

/**
 * Tarjeta de videoconsola clásica. Espeja `game-card.tsx`: `border-2` para
 * evocar el pixelado, cinta superior izquierda con badge de generación,
 * hover en rojo sangre.
 *
 * Atributos E2E:
 *  - data-testid="console-card"
 *  - data-console-id="<id>"
 *  - data-generation="<n>"
 *  - El <Link> mantiene `aria-label="Ver detalle de <name>"`.
 *
 * Para las portadas se usa `next/image` ya que las imágenes están en
 * `public/covers/consoles/` y queremos optimización de Next. Las dimensiones
 * intrínsecas (640x640) son aproximadas: el contenedor recorta en
 * `aspect-square` con `object-cover`.
 */
export function ConsoleCard({ console: c }: ConsoleCardProps) {
  return (
    <article
      data-testid="console-card"
      data-console-id={c.id}
      data-generation={c.generation}
      className="group relative flex h-full flex-col overflow-hidden border-2 border-stone-800 bg-black transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--metal-blood)] hover:shadow-[0_0_0_1px_rgba(192,0,0,0.4),0_25px_60px_-20px_rgba(192,0,0,0.5)]"
    >
      <Link
        href={`/consoles/${c.id}`}
        aria-label={`Ver detalle de ${c.name}`}
        className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--metal-blood)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-stone-900">
          <Image
            src={c.coverUrl}
            alt={`Portada de ${c.name}`}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.04] group-hover:contrast-110"
          />
          {/* Velo oscuro sutil sobre la portada para integrar con el fondo. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/30 opacity-90 transition-opacity duration-300 group-hover:opacity-60"
          />
          {/* Cinta de generación en esquina superior izquierda. */}
          <span className="absolute left-0 top-0 inline-block bg-[var(--metal-blood)] px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-black">
            Gen {c.generation}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 px-4 pb-5 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-base font-bold uppercase leading-tight tracking-wider text-stone-100 transition-colors group-hover:text-[var(--metal-bone)] [text-shadow:0_0_0_transparent] group-hover:[text-shadow:0_0_12px_rgba(192,0,0,0.45)]">
              {c.name}
            </h3>
            <span className="shrink-0 text-xs font-bold uppercase tracking-[0.22em] text-stone-500 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
              {c.year}
            </span>
          </div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] text-stone-400 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            {c.manufacturer}
          </p>
        </div>
      </Link>
    </article>
  );
}
