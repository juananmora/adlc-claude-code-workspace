import Link from "next/link";

export default function TourNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center gap-5 py-32 text-center">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-[var(--metal-blood)] [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
        Error &middot; 404
      </p>
      <h1 className="text-4xl font-black uppercase tracking-tight text-stone-100 md:text-5xl">
        Tour no encontrado
      </h1>
      <span
        aria-hidden="true"
        className="block h-[2px] w-24 bg-[var(--metal-blood)]"
      />
      <p className="max-w-md text-stone-400 [font-family:Inter,system-ui,sans-serif]">
        Es posible que la gira haya sido retirada del catálogo o que la URL
        no sea correcta.
      </p>
      <Link
        href="/tours"
        className="mt-2 inline-flex items-center gap-2 border border-stone-700 px-5 py-3 text-xs font-bold uppercase tracking-[0.28em] text-stone-200 transition-all hover:border-[var(--metal-blood)] hover:bg-[var(--metal-blood)]/10 hover:text-[var(--metal-blood)]"
      >
        <span aria-hidden="true">&larr;</span>
        Volver a Tours
      </Link>
    </div>
  );
}
