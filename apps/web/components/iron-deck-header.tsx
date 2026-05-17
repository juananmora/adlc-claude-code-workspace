import Link from "next/link";
import { Search } from "lucide-react";
import { CartButton } from "@/components/cart-button";

/**
 * Header global IRON DECK.
 *
 * Estética metalera oscura: fondo negro, border-bottom blanco hueso,
 * wordmark a la izquierda en mayúsculas con tracking generoso. La "I"
 * inicial se pinta en rojo sangre como acento puntual.
 *
 * Nav (md+): CATÁLOGO, DISCOS, CONTACTO — mayúsculas, blanco hueso,
 * hover rojo con underline. Iconos de búsqueda y carrito a la derecha
 * (la lógica del carrito vive en `CartButton`, intacta).
 */
export function IronDeckHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--iron-bone)]/15 bg-[#0a0a0a]/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-baseline gap-0 leading-none [font-family:var(--font-metal)]"
          aria-label="Inicio IRON DECK"
        >
          <span className="text-xl font-black uppercase tracking-[0.18em] text-[var(--iron-red)]">
            I
          </span>
          <span className="text-xl font-black uppercase tracking-[0.18em] text-[var(--iron-bone)]">
            RON&nbsp;DECK
          </span>
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.28em] text-[var(--iron-bone)] md:flex"
        >
          <Link
            href="/"
            className="transition-colors hover:text-[var(--iron-red)] hover:underline underline-offset-8 decoration-2"
          >
            Catálogo
          </Link>
          <Link
            href="/albums"
            className="transition-colors hover:text-[var(--iron-red)] hover:underline underline-offset-8 decoration-2"
          >
            Discos
          </Link>
          <Link
            href="/games"
            className="transition-colors hover:text-[var(--iron-red)] hover:underline underline-offset-8 decoration-2"
          >
            Games
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-[var(--iron-red)] hover:underline underline-offset-8 decoration-2"
          >
            About
          </Link>
          <Link
            href="/#contacto"
            className="transition-colors hover:text-[var(--iron-red)] hover:underline underline-offset-8 decoration-2"
          >
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Buscar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-[var(--iron-bone)] transition-colors hover:text-[var(--iron-red)]"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <div id="cart-slot">
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
}
