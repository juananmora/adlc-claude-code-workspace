import { CREDITS } from "@/lib/credits";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About — IRON DECK",
  description:
    "Acerca de IRON DECK, demo educativa del ciclo ADLC: créditos de portadas, stack técnico y agradecimientos.",
};

/**
 * Página /about — créditos del proyecto.
 *
 * Resuelve la deuda SEC-07-01 (iter-7) dando atribución pública a las
 * 32 portadas del catálogo. Hereda el header global IRON DECK del
 * RootLayout, no requiere layout propio.
 */
export default function AboutPage() {
  const albumCredits = CREDITS.filter((c) => c.kind === "album");
  const gameCredits = CREDITS.filter((c) => c.kind === "game");

  return (
    <article className="container py-12 md:py-16">
      {/* Hero */}
      <header className="border-b border-stone-800 pb-8">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.4em] text-[var(--metal-blood)]">
          About IRON DECK
        </p>
        <h1 className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-tight text-stone-100 [text-shadow:0_0_30px_rgba(192,0,0,0.2)] md:text-6xl">
          About IRON DECK
        </h1>
        <p className="mt-6 max-w-3xl text-base text-stone-300/90 [font-family:Inter,system-ui,sans-serif]">
          Demo educativa del ciclo de desarrollo ADLC (Agentic Development
          Lifecycle / Spec-Driven Development). Catálogo de discos heavy
          metal, clásicos de Amstrad CPC y productos de electrónica como
          banco de pruebas del flujo agéntico con Claude Code.
        </p>
      </header>

      {/* Sobre este proyecto */}
      <section
        aria-labelledby="about-project-title"
        className="mt-12"
      >
        <h2
          id="about-project-title"
          className="border-b border-stone-800 pb-3 text-sm font-bold uppercase tracking-[0.32em] text-[var(--metal-bone)]"
        >
          Sobre este proyecto
        </h2>
        <div className="mt-6 space-y-4 max-w-3xl text-base text-stone-300/90 [font-family:Inter,system-ui,sans-serif]">
          <p>
            IRON DECK es una <strong>plantilla viva</strong> que demuestra
            cómo construir software guiado por especificaciones verificables,
            con subagentes especializados (backend, frontend, qa, security,
            reviewer) y gates obligatorios antes de cada cierre. Cada
            iteración pasa por las 12 fases ADLC definidas en{" "}
            <code className="text-[var(--metal-bone)]">CLAUDE.md</code>.
          </p>
          <p>
            El proyecto no es una tienda real ni pretende competir con
            servicios comerciales. Las portadas de discos y carátulas de
            juegos se muestran bajo <strong>fair use editorial</strong>{" "}
            con atribución explícita a sus publishers originales (ver
            sección de créditos abajo).
          </p>
          <p>
            El código vive en{" "}
            <a
              href="https://github.com/juananmora/adlc-claude-code-workspace"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--metal-bone)] underline-offset-4 hover:text-[var(--metal-blood)] hover:underline"
            >
              github.com/juananmora/adlc-claude-code-workspace
            </a>
            .
          </p>
        </div>
      </section>

      {/* Créditos */}
      <section
        aria-labelledby="credits-title"
        className="mt-12"
      >
        <h2
          id="credits-title"
          className="border-b border-stone-800 pb-3 text-sm font-bold uppercase tracking-[0.32em] text-[var(--metal-bone)]"
        >
          Créditos de portadas
        </h2>
        <p className="mt-6 max-w-3xl text-sm text-stone-400 [font-family:Inter,system-ui,sans-serif]">
          Las {CREDITS.length} portadas del catálogo provienen de Wikipedia
          bajo fair use editorial. Cada entrada incluye autor original,
          publisher, año y enlace a la fuente.
        </p>

        {/* Sub-sección álbumes */}
        <h3 className="mt-8 text-xs font-bold uppercase tracking-[0.28em] text-stone-400">
          Discos ({albumCredits.length})
        </h3>
        <div
          data-testid="about-credits-table"
          className="mt-4 grid gap-3"
        >
          {albumCredits.map((credit) => (
            <CreditCard key={`album-${credit.id}`} credit={credit} />
          ))}
        </div>

        {/* Sub-sección juegos */}
        <h3 className="mt-10 text-xs font-bold uppercase tracking-[0.28em] text-stone-400">
          Games Amstrad CPC ({gameCredits.length})
        </h3>
        <div className="mt-4 grid gap-3">
          {gameCredits.map((credit) => (
            <CreditCard key={`game-${credit.id}`} credit={credit} />
          ))}
        </div>
      </section>

      {/* Stack */}
      <section
        aria-labelledby="stack-title"
        className="mt-12"
      >
        <h2
          id="stack-title"
          className="border-b border-stone-800 pb-3 text-sm font-bold uppercase tracking-[0.32em] text-[var(--metal-bone)]"
        >
          Stack
        </h2>
        <ul className="mt-6 max-w-3xl space-y-2 text-base text-stone-300/90 [font-family:Inter,system-ui,sans-serif]">
          <li>
            <strong className="text-[var(--metal-bone)]">Next.js 15</strong>{" "}
            + <strong className="text-[var(--metal-bone)]">React 19</strong>{" "}
            con App Router y server components.
          </li>
          <li>
            <strong className="text-[var(--metal-bone)]">Tailwind CSS 3.4</strong>{" "}
            con paleta metalera custom (CSS vars `--metal-*`).
          </li>
          <li>
            <strong className="text-[var(--metal-bone)]">Fastify 5</strong>{" "}
            como API backend con schemas JSON Schema para validación de input.
          </li>
          <li>
            <strong className="text-[var(--metal-bone)]">
              TypeScript 5.6
            </strong>{" "}
            estricto en ambas apps.
          </li>
          <li>
            <strong className="text-[var(--metal-bone)]">Vitest 4</strong>{" "}
            para el backend (233/233 tests verde a fecha de iter-7).
          </li>
          <li>
            <strong className="text-[var(--metal-bone)]">
              Playwright 1.60
            </strong>{" "}
            para E2E del frontend (38/38 verde con `--workers=1`).
          </li>
          <li>
            <strong className="text-[var(--metal-bone)]">
              Chrome DevTools MCP
            </strong>{" "}
            para smoke tests reales en navegador desde Claude Code.
          </li>
        </ul>
      </section>

      {/* Agradecimientos */}
      <section
        aria-labelledby="thanks-title"
        className="mt-12"
      >
        <h2
          id="thanks-title"
          className="border-b border-stone-800 pb-3 text-sm font-bold uppercase tracking-[0.32em] text-[var(--metal-bone)]"
        >
          Agradecimientos
        </h2>
        <div className="mt-6 space-y-4 max-w-3xl text-base text-stone-300/90 [font-family:Inter,system-ui,sans-serif]">
          <p>
            La estructura{" "}
            <code className="text-[var(--metal-bone)]">openspec/</code> con
            specs vivos por área y propuestas de cambio en{" "}
            <code className="text-[var(--metal-bone)]">changes/</code> está
            inspirada en{" "}
            <a
              href="https://github.com/Gentleman-Programming/gentle-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--metal-bone)] underline-offset-4 hover:text-[var(--metal-blood)] hover:underline"
            >
              gentle-ai (Gentleman-Programming)
            </a>
            , adaptada al modelo agéntico de Claude Code con subagentes y
            skills.
          </p>
          <p>
            Las portadas son cortesía de{" "}
            <a
              href="https://en.wikipedia.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--metal-bone)] underline-offset-4 hover:text-[var(--metal-blood)] hover:underline"
            >
              Wikipedia
            </a>{" "}
            y sus contribuyentes, bajo fair use editorial.
          </p>
        </div>
      </section>
    </article>
  );
}

/**
 * Card individual de crédito. Aislada en una función local para mantener
 * la lectura del componente principal limpia.
 */
function CreditCard({ credit }: { credit: (typeof CREDITS)[number] }) {
  return (
    <article
      data-testid="credit-entry"
      data-id={credit.id}
      data-kind={credit.kind}
      className="border border-stone-800 bg-black/40 px-4 py-3 transition-colors hover:border-stone-600"
    >
      <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold uppercase tracking-[0.18em] text-stone-100">
            {credit.title}
          </h4>
          <p className="mt-1 text-xs text-stone-400 [font-family:Inter,system-ui,sans-serif]">
            <strong className="text-stone-300">{credit.author}</strong>
            {" · "}
            {credit.publisher}
            {" · "}
            <span className="font-mono">{credit.year}</span>
          </p>
          {credit.note && (
            <p className="mt-2 text-[0.7rem] italic text-stone-500 [font-family:Inter,system-ui,sans-serif]">
              {credit.note}
            </p>
          )}
        </div>
        <a
          href={credit.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-stone-300 underline-offset-4 hover:text-[var(--metal-blood)] hover:underline"
        >
          Fuente &rarr;
        </a>
      </div>
    </article>
  );
}
