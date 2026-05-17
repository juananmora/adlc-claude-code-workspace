import { IronDeckHeader } from "@/components/iron-deck-header";
import { IronDeckFooter } from "@/components/iron-deck-footer";

/**
 * Layout para /about con estética metalera + header global.
 *
 * Espeja la convención adoptada en `app/albums/layout.tsx` y
 * `app/games/layout.tsx` (hotfix iter-7.1): el header global IRON DECK
 * (Catálogo / Discos / Games / About / Contacto) aparece en toda
 * sección fuera del grupo (main) para mantener consistencia de
 * navegación.
 */
export default function AboutLayout({
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
