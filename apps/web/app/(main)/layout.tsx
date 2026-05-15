import { IronDeckHeader } from "@/components/iron-deck-header";
import { IronDeckFooter } from "@/components/iron-deck-footer";

/**
 * Layout para las rutas principales IRON DECK (home, /cart, /products/[id]).
 *
 * Monta el header IRON DECK (sticky, fondo negro, wordmark + nav) y
 * el footer. Aplica el tipografía display (`--font-metal`) al árbol
 * para que titulares y CTAs hereden la fuente metalera. Texto largo
 * que prefiera Inter usa `[font-family:Inter,...]` en su componente.
 *
 * La sección `/albums` vive fuera de este grupo (`app/albums/`) y
 * mantiene su propio layout sin tocar.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-[var(--iron-bone)]">
      {/* Grain sutil global como en /albums, anclado fijo, no captura clicks. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.05] mix-blend-overlay"
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
