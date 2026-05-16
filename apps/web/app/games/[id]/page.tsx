import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchGame } from "@/lib/games-api";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const game = await fetchGame(id);
    if (!game) return { title: "Juego no encontrado" };
    return {
      title: `${game.title} — ${game.year} (${game.publisher})`,
      description: game.description,
    };
  } catch {
    return { title: "Juego" };
  }
}

/**
 * Ficha de juego Amstrad CPC. Estilo coherente con `/albums/[id]` en paleta
 * (rojo sangre + bone + stone-800) pero con detalles retro en los metadatos
 * (fuente monoespaciada en <dt>/<dd>).
 *
 * No incluye review larga estilo álbum: el dominio `Game` no tiene
 * `historicalContext`/`sound`/`legacy`/`trackHighlights`/`rating`. Solo
 * descripción + bloque de quotes con `<figure>` / `<blockquote>` / `<cite>`.
 */
export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;
  const game = await fetchGame(id);
  if (!game) {
    notFound();
  }

  return (
    <article className="container py-12 md:py-16">
      <nav
        aria-label="Migas"
        className="mb-8 text-[0.7rem] font-bold uppercase tracking-[0.28em] text-stone-500 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]"
      >
        <Link
          href="/games"
          className="transition-colors hover:text-[var(--metal-blood)]"
        >
          Games
        </Link>
        <span aria-hidden="true" className="mx-2 text-stone-700">
          &rsaquo;
        </span>
        <span className="text-stone-300">{game.title}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-[1.05fr_1fr] md:gap-14">
        <div className="group relative overflow-hidden border-2 border-stone-800 bg-black transition-[box-shadow,border-color] duration-300 hover:border-[var(--metal-blood)] hover:shadow-[0_0_0_1px_rgba(192,0,0,0.4),0_40px_80px_-30px_rgba(192,0,0,0.55)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={game.coverUrl}
            alt={`Portada de ${game.title}`}
            className="h-full w-full object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.02] group-hover:contrast-110"
          />
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.36em] text-[var(--metal-blood)] [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            {game.publisher} &middot; {game.year}
          </p>

          <h1 className="text-balance text-4xl font-black uppercase leading-[0.95] tracking-tight text-stone-100 [text-shadow:0_0_30px_rgba(192,0,0,0.2)] md:text-5xl lg:text-6xl">
            {game.title}
          </h1>

          <span
            aria-hidden="true"
            className="block h-[2px] w-24 bg-[var(--metal-blood)]"
          />

          <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 border border-stone-800 bg-black/40 p-5 text-sm [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            <dt className="font-bold uppercase tracking-[0.24em] text-stone-500">
              Año
            </dt>
            <dd className="text-[var(--metal-bone)]">{game.year}</dd>

            <dt className="font-bold uppercase tracking-[0.24em] text-stone-500">
              Desarrollador
            </dt>
            <dd className="text-[var(--metal-bone)]">{game.developer}</dd>

            <dt className="font-bold uppercase tracking-[0.24em] text-stone-500">
              Editor
            </dt>
            <dd className="text-[var(--metal-bone)]">{game.publisher}</dd>

            <dt className="font-bold uppercase tracking-[0.24em] text-stone-500">
              Género
            </dt>
            <dd className="text-[var(--metal-bone)]">{game.genre}</dd>

            <dt className="font-bold uppercase tracking-[0.24em] text-stone-500">
              Sistema
            </dt>
            <dd className="text-[var(--metal-bone)]">{game.system}</dd>
          </dl>

          <section aria-labelledby="description-title">
            <h2
              id="description-title"
              className="border-b border-stone-800 pb-3 text-sm font-bold uppercase tracking-[0.32em] text-[var(--metal-bone)]"
            >
              Descripción
            </h2>
            <p className="mt-4 text-base normal-case leading-relaxed tracking-normal text-stone-300/90 [font-family:Inter,system-ui,sans-serif]">
              {game.description}
            </p>
          </section>

          <div className="mt-2">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 border border-stone-700 px-5 py-3 text-xs font-bold uppercase tracking-[0.28em] text-stone-200 transition-all hover:border-[var(--metal-blood)] hover:bg-[var(--metal-blood)]/10 hover:text-[var(--metal-blood)]"
            >
              <span aria-hidden="true">&larr;</span>
              Volver al catálogo de games
            </Link>
          </div>
        </div>
      </div>

      <section
        aria-labelledby="press-title"
        className="mt-16 border-t border-stone-800 pt-12 md:mt-20 md:pt-16"
      >
        <header className="flex flex-col gap-3">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-[var(--metal-blood)] [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            La prensa
          </p>
          <h2
            id="press-title"
            className="text-3xl font-black uppercase leading-[0.95] tracking-tight text-stone-100 [text-shadow:0_0_30px_rgba(192,0,0,0.18)] md:text-4xl"
          >
            Prensa de la época
          </h2>
          <span
            aria-hidden="true"
            className="block h-[2px] w-24 bg-[var(--metal-blood)]"
          />
        </header>

        {game.quotes.length === 0 ? (
          <p className="mt-8 text-sm normal-case tracking-normal text-stone-400 [font-family:Inter,system-ui,sans-serif]">
            Sin citas de prensa registradas.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {game.quotes.map((quote, i) => (
              <figure
                key={`${quote.outlet}-${quote.year}-${i}`}
                className="flex h-full flex-col justify-between gap-5 border border-stone-800 bg-black/60 p-6 transition-[border-color,box-shadow] duration-300 hover:border-[var(--metal-blood)] hover:shadow-[0_0_0_1px_rgba(192,0,0,0.3),0_25px_60px_-30px_rgba(192,0,0,0.55)]"
              >
                <blockquote className="relative text-sm normal-case leading-relaxed tracking-normal text-stone-200 [font-family:Inter,system-ui,sans-serif]">
                  <span
                    aria-hidden="true"
                    className="absolute -left-1 -top-3 text-4xl font-black leading-none text-[var(--metal-blood)]/70"
                  >
                    &ldquo;
                  </span>
                  <p className="block pl-5">&laquo;{quote.quote}&raquo;</p>
                </blockquote>
                <figcaption className="flex flex-col gap-2 border-t border-stone-800 pt-4 text-[0.7rem] uppercase tracking-[0.24em] text-stone-400 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
                  <cite className="not-italic text-stone-200">
                    <span className="font-bold">
                      {quote.author ? `${quote.author}, ` : ""}
                      {quote.outlet}
                    </span>
                    , <span className="text-stone-500">{quote.year}</span>
                  </cite>
                  {quote.url && (
                    <a
                      href={quote.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-2 text-[var(--metal-blood)] transition-colors hover:text-[var(--metal-bone)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--metal-blood)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      Fuente
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </article>
  );
}
