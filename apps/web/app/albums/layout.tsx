import Link from "next/link";

/**
 * Layout exclusivo para `/albums/*` con estética metalera oscura.
 *
 * Decisiones:
 * - La fuente Cinzel se carga UNA sola vez en el RootLayout
 *   (`app/layout.tsx`) y se expone como `--font-metal` para todo el
 *   árbol. Aquí simplemente la consumimos vía `[font-family:var(--font-metal)]`
 *   — no se duplica el import.
 * - Este sub-layout sigue siendo independiente del header global IRON
 *   DECK: aquí mostramos un mini-header propio con "Volver al catálogo"
 *   porque `/albums` se concibe como una sección lateral con tono
 *   diferente al catálogo principal.
 * - Fondo negro profundo `#0a0a0a`, texto blanco hueso. Variables
 *   `--metal-*` ya están globalmente definidas en `globals.css`; las
 *   re-declaramos aquí inline para mantener compatibilidad si alguien
 *   carga el árbol fuera del root (no rompe nada).
 */
export default function AlbumsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-stone-100 [font-family:var(--font-metal)] flex flex-col"
      style={
        {
          ["--metal-bg" as string]: "#0a0a0a",
          ["--metal-bg-soft" as string]: "#141414",
          ["--metal-blood" as string]: "#c00",
          ["--metal-blood-dark" as string]: "#8b0000",
          ["--metal-bone" as string]: "#f5e8d0",
          ["--metal-ash" as string]: "#7a7a7a",
        } as React.CSSProperties
      }
    >
      {/* Grain sutil sobre fondo negro: capa fija de baja opacidad
          generada con un SVG inline (sin assets nuevos). */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      <header className="relative z-10 border-b border-stone-800/80 bg-black/50 backdrop-blur-sm">
        <div className="container flex h-14 items-center">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--metal-bone)] transition-colors hover:text-[var(--metal-blood)]"
            aria-label="Volver al catálogo principal"
          >
            &larr; Volver al catálogo
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1">{children}</main>

      <footer className="relative z-10 mt-16 border-t border-stone-800/80 bg-black/50 py-6">
        <p className="text-center text-[0.65rem] uppercase tracking-[0.32em] text-stone-500">
          Demo Metal &middot; 2026
        </p>
      </footer>
    </div>
  );
}
