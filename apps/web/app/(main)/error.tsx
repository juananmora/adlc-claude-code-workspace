"use client";

import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-3xl font-black uppercase tracking-[0.18em] text-[var(--iron-bone)] [font-family:var(--font-metal)]">
        Algo ha fallado
      </h1>
      <p className="max-w-md text-sm text-stone-400">
        {error.message || "Error inesperado. Vuelve a intentarlo."}
      </p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
