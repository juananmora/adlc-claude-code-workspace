/**
 * Footer global IRON DECK.
 *
 * Tono ceniza, fondo negro, border-top fino blanco hueso. Wordmark
 * pequeño + línea "DEMO · 2026". Mantiene el aviso "no es una tienda
 * real" sin mencionar la marca anterior.
 */
export function IronDeckFooter() {
  return (
    <footer
      id="contacto"
      className="mt-16 border-t border-[var(--iron-bone)]/15 bg-[#0a0a0a] py-10"
    >
      <div className="container flex flex-col gap-3 text-xs uppercase tracking-[0.28em] text-stone-500 md:flex-row md:items-center md:justify-between">
        <div className="flex items-baseline gap-0 [font-family:var(--font-metal)]">
          <span className="font-black text-[var(--iron-bone)]">
            Master of the Puppets
          </span>
          <span className="ml-4 tracking-[0.32em]">Demo &middot; 2026</span>
        </div>
        <p className="tracking-[0.24em]">
          &copy; {new Date().getFullYear()} Master of the Puppets &mdash; No es una tienda real.
        </p>
      </div>
    </footer>
  );
}
