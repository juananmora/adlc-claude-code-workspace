import { IronDeckHeader } from "@/components/iron-deck-header";
import { IronDeckFooter } from "@/components/iron-deck-footer";

export const metadata = {
  title: "Tours | MASTER OF THE PUPPETS",
};

/**
 * Layout para `/tours/*` con estética metalera oscura + header global.
 *
 * Espeja el patrón de `app/consoles/layout.tsx`: el header global IRON DECK
 * aparece en esta sección para mantener consistencia de navegación. Las
 * variables `--metal-*` se re-declaran inline para conservar compatibilidad
 * si el árbol se carga fuera del root.
 */
export default function ToursLayout({
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
      {/* Grain sutil sobre fondo negro, mismo SVG inline que consoles/games/albums. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <IronDeckHeader />
        <main className="flex-1">{children}</main>
        <IronDeckFooter />
      </div>
    </div>
  );
}
