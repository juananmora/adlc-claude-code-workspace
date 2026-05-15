import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="container flex flex-col items-center gap-4 py-24 text-center" data-testid="product-not-found">
      <h1 className="text-4xl font-black uppercase tracking-[0.08em] text-[var(--iron-bone)] [font-family:var(--font-metal)]">
        Producto no encontrado
      </h1>
      <p className="max-w-md text-sm uppercase tracking-[0.18em] text-stone-400">
        El producto que buscas no existe o ya no está disponible.
      </p>
      <Link
        href="/"
        className="mt-2 border border-[var(--iron-bone)] px-6 py-3 text-xs font-bold uppercase tracking-[0.28em] text-[var(--iron-bone)] transition-colors hover:bg-[var(--iron-red)] hover:border-[var(--iron-red)] hover:text-stone-100"
      >
        Volver al catálogo
      </Link>
    </main>
  );
}
