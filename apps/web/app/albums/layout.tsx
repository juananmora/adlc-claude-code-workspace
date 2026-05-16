import { IronDeckHeader } from "@/components/iron-deck-header";
import { IronDeckFooter } from "@/components/iron-deck-footer";

/**
 * Layout para `/albums/*` con estética metalera oscura + header global.
 *
 * Decisiones:
 * - Usa el `IronDeckHeader` global (Catálogo / Discos / Games / Contacto)
 *   en lugar del mini-header "Volver al catálogo" que vivía aquí antes.
 *   Esto da consistencia de navegación con la home y con `/games`. El
 *   logo IRON DECK del header global enlaza a `/`, así que la función
 *   de "volver" queda cubierta sin duplicar UI.
 * - Variables `--metal-*` se re-declaran inline para mantener
 *   compatibilidad si el árbol se carga fuera del root (no rompe nada).
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

      <div className="relative z-10 flex flex-1 flex-col">
        <IronDeckHeader />
        <main className="flex-1">{children}</main>
        <IronDeckFooter />
      </div>
    </div>
  );
}
