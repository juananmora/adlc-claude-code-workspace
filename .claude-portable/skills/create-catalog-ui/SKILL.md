---
name: create-catalog-ui
description: Implementa el portal IRON DECK en apps/web con Next.js 15 App Router + React 19 + Tailwind + shadcn/ui. Server components para fichas, client components para grids, resolveApiBase() para SSR en Docker, paleta dark sangre+bone+black. Atributos data-* para E2E.
when_to_use: Cuando hay que crear o ampliar una área del catálogo en el portal (listado, ficha, filtros, búsqueda, navegación).
allowed-tools: Read Write Edit MultiEdit Bash Grep Glob
---

# Skill: Create Catalog UI (IRON DECK)

Implementa una área del catálogo siguiendo la línea gráfica IRON DECK (oscura, metalera) y la arquitectura Next.js App Router del repo.

## Stack fijo

- Next.js 15 App Router + React 19 + TypeScript 5.6.
- Tailwind 3.4 + shadcn/ui (`new-york`) + Radix dialog/select/slot + lucide-react.
- Zustand 5 solo para state compartido entre rutas (ej. carrito).
- Sonner para toasts.
- Playwright 1.60 para E2E (los tests los escribe `qa-engineer`; tú expones los `data-testid`).

## Línea gráfica (no negociable)

- Fondo global `#0a0a0a`. Variables: `--iron-red`/`--metal-blood` (rojo sangre), `--iron-bone`/`--metal-bone` (blanco hueso).
- Tipografía: `Inter` (body) + `Cinzel` (display). Etiquetas técnicas en `[font-family:ui-monospace,...]`.
- Cards `border-2 border-stone-800 bg-black`, hover `border-[var(--metal-blood)]` + shadow rojo difuso + `-translate-y-1`.
- Heroes con `uppercase font-black tracking-tight text-shadow rgba(192,0,0,0.25)` + resplandor radial `bg-[radial-gradient(closest-side,rgba(192,0,0,0.25),transparent_70%)] blur-3xl`.
- Scanlines CRT en áreas retro: `[background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.6)_0px,rgba(255,255,255,0.6)_1px,transparent_1px,transparent_3px)] opacity-[0.07]`.
- Separador estándar: `<span aria-hidden className="block h-[2px] w-32 bg-[var(--metal-blood)]" />`.

## Pasos obligatorios

### 1. Mirror del tipo

`apps/web/lib/<area>-types.ts`:

```ts
// Mirror manual de apps/api/src/types/<area>.ts
export interface <Area> {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  // ... mismos campos que la API
}
```

### 2. Cliente HTTP con resolveApiBase

`apps/web/lib/<area>-api.ts`:

```ts
import type { <Area> } from "./<area>-types";
import { resolveApiBase } from "./api";   // <-- imprescindible

function buildUrl(path: string, params?: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v && v !== "all") search.set(k, v);
    }
  }
  const qs = search.toString();
  return `${resolveApiBase()}${path}${qs ? `?${qs}` : ""}`;
}

export async function fetch<Area>s(opts: { q?: string } = {}): Promise<<Area>[]> {
  const res = await fetch(buildUrl("/<area>", { q: opts.q }), { cache: "no-store" });
  if (!res.ok) throw new Error(`Error cargando <area> (${res.status})`);
  return res.json();
}

export async function fetch<Area>(id: string): Promise<<Area> | null> {
  // SIEMPRE encodeURIComponent en path params dinámicos
  const res = await fetch(buildUrl(`/<area>/${encodeURIComponent(id)}`), { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error cargando <area> (${res.status})`);
  return res.json();
}
```

### 3. Layout del área

`apps/web/app/<area>/layout.tsx`:

```tsx
import { IronDeckHeader } from "@/components/iron-deck-header";
import { IronDeckFooter } from "@/components/iron-deck-footer";

export default function <Area>Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IronDeckHeader />
      <main className="flex-1">{children}</main>
      <IronDeckFooter />
    </>
  );
}
```

### 4. Listado (server component)

`apps/web/app/<area>/page.tsx`:

```tsx
import { <Area>sGrid } from "@/components/<area>s-grid";
import { fetch<Area>s } from "@/lib/<area>-api";
import type { <Area> } from "@/lib/<area>-types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "<Area> — IRON DECK",
  description: "...",
};

export default async function <Area>sPage() {
  let initial: <Area>[] = [];
  try { initial = await fetch<Area>s(); } catch { initial = []; }

  return (
    <>
      <section aria-label="Cabecera de <area>" className="relative isolate overflow-hidden border-b border-stone-800/80 bg-[#0a0a0a]">
        {/* Resplandor + scanlines (ver consoles/page.tsx) */}
        <div className="container relative flex flex-col gap-6 py-16 md:py-24 lg:py-28">
          <h1 className="text-balance font-black uppercase leading-[0.9] tracking-tight text-stone-100 [text-shadow:0_0_30px_rgba(192,0,0,0.25)]">
            <span className="block text-6xl md:text-8xl lg:text-[8rem]"><AREA></span>
          </h1>
          <span aria-hidden className="block h-[2px] w-32 bg-[var(--metal-blood)]" />
          {/* Descripción */}
        </div>
      </section>
      <<Area>sGrid initial<Area>s={initial} />
    </>
  );
}
```

### 5. Card

`apps/web/components/<area>-card.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import type { <Area> } from "@/lib/<area>-types";

export function <Area>Card({ <area>: x }: { <area>: <Area> }) {
  return (
    <article
      data-testid="<area>-card"
      data-<area>-id={x.id}
      className="group relative flex h-full flex-col overflow-hidden border-2 border-stone-800 bg-black transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--metal-blood)] hover:shadow-[0_0_0_1px_rgba(192,0,0,0.4),0_25px_60px_-20px_rgba(192,0,0,0.5)]"
    >
      <Link
        href={`/<area>/${encodeURIComponent(x.id)}`}
        aria-label={`Ver detalle de ${x.name}`}
        className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--metal-blood)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-stone-900">
          <Image
            src={x.coverUrl}
            alt={`Portada de ${x.name}`}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.04] group-hover:contrast-110"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 px-4 pb-5 pt-4">
          <h3 className="line-clamp-2 text-base font-bold uppercase leading-tight tracking-wider text-stone-100 transition-colors group-hover:text-[var(--metal-bone)]">
            {x.name}
          </h3>
        </div>
      </Link>
    </article>
  );
}
```

### 6. Grid (client component con buscador y filtros)

`apps/web/components/<area>s-grid.tsx`:

```tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { fetch<Area>s } from "@/lib/<area>-api";
import { <Area>Card } from "./<area>-card";
import type { <Area> } from "@/lib/<area>-types";

export function <Area>sGrid({ initial<Area>s }: { initial<Area>s: <Area>[] }) {
  const [items, setItems] = useState<<Area>[]>(initial<Area>s);
  const [q, setQ] = useState("");

  // debounce 250ms — el qa-engineer cuenta con esta cifra
  useEffect(() => {
    const id = setTimeout(async () => {
      try { setItems(await fetch<Area>s({ q })); } catch { /* fallback */ }
    }, 250);
    return () => clearTimeout(id);
  }, [q]);

  return (
    <section aria-label="Catálogo de <area>" className="container py-12">
      <div className="mb-8 flex flex-col gap-4">
        <input
          data-testid="<area>-search-input"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar..."
          aria-label="Buscar en el catálogo"
          className="w-full max-w-md border-2 border-stone-800 bg-black px-4 py-3 text-sm uppercase tracking-widest text-stone-100 placeholder:text-stone-600 focus:border-[var(--metal-blood)] focus:outline-none"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((x) => <<Area>Card key={x.id} <area>={x} />)}
      </div>
    </section>
  );
}
```

### 7. Ficha (server component)

`apps/web/app/<area>/[id]/page.tsx` — server component que hace fetch, llama `notFound()` si null, expone `<dl>` con `<dt>` por cada metadato. Ver `apps/web/app/consoles/[id]/page.tsx` como referencia canónica.

### 8. Not found

`apps/web/app/<area>/[id]/not-found.tsx`:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-24 text-center">
      <h1 className="text-4xl font-black uppercase tracking-tight text-stone-100">
        <Area> no encontrada
      </h1>
      <p className="mt-4 text-stone-400">El elemento que buscas no existe en el catálogo.</p>
      <Link
        href="/<area>"
        className="mt-8 inline-block border border-stone-700 px-6 py-3 text-xs font-bold uppercase tracking-[0.28em] text-stone-200 transition-colors hover:border-[var(--metal-blood)] hover:text-[var(--metal-blood)]"
      >
        Volver a <Area>
      </Link>
    </div>
  );
}
```

### 9. Link en el header

Añade a `apps/web/components/iron-deck-header.tsx`:

```tsx
<Link href="/<area>" className="transition-colors hover:text-[var(--iron-red)] hover:underline underline-offset-8 decoration-2">
  <Area>
</Link>
```

### 10. Validación

```powershell
cd apps/web
npx tsc --noEmit -p tsconfig.json
npm run lint
npm run build           # debe pasar; comprueba el bundle no estalla
```

## Anti-patrones (rechazo automático)

| Anti-patrón | Por qué falla |
|---|---|
| Usar `process.env.NEXT_PUBLIC_API_BASE_URL` directo en server component | Rompe SSR en Docker: `localhost` dentro del contenedor apunta al propio contenedor, no a la API. Usa `resolveApiBase()`. |
| `<a href={x.id}>` sin `encodeURIComponent` | XSS / URL malformada. Siempre `encodeURIComponent`. |
| Card sin `data-testid` / `data-<area>-id` | Imposibilita Playwright. |
| Imagen `<img>` en vez de `next/image` | Pierde optimización, no aplica `sizes`/`priority`. |
| Pintar fuera de la paleta (verde fluor, azul Bootstrap...) | Rompe IRON DECK. |
| Estado global en Context cuando podría ser Zustand | Zustand es el patrón del repo (ver `lib/cart-store.ts`). |
| Olvidar `aria-label` o `aria-pressed` en chips | Rompe E2E y accesibilidad. |
