import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchConsole } from "@/lib/consoles-api";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ConsolePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ConsolePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const console = await fetchConsole(id);
    if (!console) return { title: "Consola no encontrada" };
    return {
      title: `${console.name} — ${console.year} (${console.manufacturer})`,
      description: console.description,
    };
  } catch {
    return { title: "Consola" };
  }
}

/**
 * Ficha de videoconsola clásica. Estilo coherente con `/games/[id]`:
 * paleta sangre + bone + stone-800, tipografía monoespaciada en metadatos.
 *
 * Sin bloque de prensa (Console no expone `quotes`): en su lugar muestra la
 * lista de juegos icónicos asociados. La portada se carga con `priority`
 * porque está above the fold.
 */
export default async function ConsolePage({ params }: ConsolePageProps) {
  const { id } = await params;
  const c = await fetchConsole(id);
  if (!c) {
    notFound();
  }

  return (
    <article className="container py-12 md:py-16">
      <nav
        aria-label="Migas"
        className="mb-8 text-[0.7rem] font-bold uppercase tracking-[0.28em] text-stone-500 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]"
      >
        <Link
          href="/consoles"
          className="transition-colors hover:text-[var(--metal-blood)]"
        >
          Consolas
        </Link>
        <span aria-hidden="true" className="mx-2 text-stone-700">
          &rsaquo;
        </span>
        <span className="text-stone-300">{c.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-[1.05fr_1fr] md:gap-14">
        <div className="group relative aspect-square w-full overflow-hidden border-2 border-stone-800 bg-black transition-[box-shadow,border-color] duration-300 hover:border-[var(--metal-blood)] hover:shadow-[0_0_0_1px_rgba(192,0,0,0.4),0_40px_80px_-30px_rgba(192,0,0,0.55)]">
          <Image
            src={c.coverUrl}
            alt={`Portada de ${c.name}`}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.02] group-hover:contrast-110"
          />
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.36em] text-[var(--metal-blood)] [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            {c.manufacturer} &middot; {c.year}
          </p>

          <h1 className="text-balance text-4xl font-black uppercase leading-[0.95] tracking-tight text-stone-100 [text-shadow:0_0_30px_rgba(192,0,0,0.2)] md:text-5xl lg:text-6xl">
            {c.name}
          </h1>

          <span
            aria-hidden="true"
            className="block h-[2px] w-24 bg-[var(--metal-blood)]"
          />

          <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 border border-stone-800 bg-black/40 p-5 text-sm [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            <dt className="font-bold uppercase tracking-[0.24em] text-stone-500">
              Fabricante
            </dt>
            <dd className="text-[var(--metal-bone)]">{c.manufacturer}</dd>

            <dt className="font-bold uppercase tracking-[0.24em] text-stone-500">
              Año
            </dt>
            <dd className="text-[var(--metal-bone)]">{c.year}</dd>

            <dt className="font-bold uppercase tracking-[0.24em] text-stone-500">
              Generación
            </dt>
            <dd className="text-[var(--metal-bone)]">{c.generation}</dd>

            <dt className="font-bold uppercase tracking-[0.24em] text-stone-500">
              Media
            </dt>
            <dd className="text-[var(--metal-bone)]">{c.media}</dd>

            <dt className="font-bold uppercase tracking-[0.24em] text-stone-500">
              Unidades vendidas
            </dt>
            <dd className="text-[var(--metal-bone)]">
              {c.unitsSoldM.toLocaleString("es-ES")}M
            </dd>
          </dl>

          <section aria-labelledby="description-title">
            <h2
              id="description-title"
              className="border-b border-stone-800 pb-3 text-sm font-bold uppercase tracking-[0.32em] text-[var(--metal-bone)]"
            >
              Descripción
            </h2>
            <p className="mt-4 text-base normal-case leading-relaxed tracking-normal text-stone-300/90 [font-family:Inter,system-ui,sans-serif]">
              {c.description}
            </p>
          </section>

          <div className="mt-2">
            <Link
              href="/consoles"
              className="inline-flex items-center gap-2 border border-stone-700 px-5 py-3 text-xs font-bold uppercase tracking-[0.28em] text-stone-200 transition-all hover:border-[var(--metal-blood)] hover:bg-[var(--metal-blood)]/10 hover:text-[var(--metal-blood)]"
            >
              <span aria-hidden="true">&larr;</span>
              Volver al catálogo de consolas
            </Link>
          </div>
        </div>
      </div>

      <section
        aria-labelledby="iconic-games-title"
        className="mt-16 border-t border-stone-800 pt-12 md:mt-20 md:pt-16"
      >
        <header className="flex flex-col gap-3">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-[var(--metal-blood)] [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            La biblioteca
          </p>
          <h2
            id="iconic-games-title"
            className="text-3xl font-black uppercase leading-[0.95] tracking-tight text-stone-100 [text-shadow:0_0_30px_rgba(192,0,0,0.18)] md:text-4xl"
          >
            Juegos icónicos
          </h2>
          <span
            aria-hidden="true"
            className="block h-[2px] w-24 bg-[var(--metal-blood)]"
          />
        </header>

        {c.iconicGames.length === 0 ? (
          <p className="mt-8 text-sm normal-case tracking-normal text-stone-400 [font-family:Inter,system-ui,sans-serif]">
            Sin títulos icónicos registrados.
          </p>
        ) : (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {c.iconicGames.map((title) => (
              <li
                key={title}
                className="flex items-center gap-3 border border-stone-800 bg-black/60 px-4 py-3 text-sm uppercase tracking-[0.18em] text-stone-200 transition-[border-color,color] hover:border-[var(--metal-blood)] hover:text-[var(--metal-bone)] [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 shrink-0 bg-[var(--metal-blood)]"
                />
                <span className="line-clamp-1">{title}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
