import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container flex items-center justify-center gap-2 py-24 text-xs uppercase tracking-[0.3em] text-stone-400">
      <Loader2 className="h-5 w-5 animate-spin text-[var(--iron-red)]" aria-hidden="true" />
      <span>Cargando catálogo...</span>
    </div>
  );
}
