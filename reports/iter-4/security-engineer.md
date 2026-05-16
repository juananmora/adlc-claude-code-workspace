# Security Engineer Report — Iteración 4

## Skills ejecutadas
- Skill(skill: "security-review") -> aplicada

## Alcance

Cambios revisados en esta iteración:

- `apps/api/src/data/album-reviews.ts` (nuevo, dataset de críticas con URLs externas).
- `apps/api/src/types/album.ts` (tipo `AlbumReview` añadido).
- `apps/web/lib/album-types.ts` (mirror del tipo).
- `apps/web/app/albums/[id]/page.tsx` (renderiza seccion "Voces de la crítica" con `<blockquote>`, `<cite>` y enlaces externos).
- `apps/web/e2e/albums.spec.ts` (test del nuevo bloque).
- `apps/api/tests/albums-review.test.ts` (test del dataset).

`git status --short` confirma que ni `apps/api/package.json` ni `apps/web/package.json` han sido modificados en esta iteración. No se introducen nuevas dependencias.

## Tabla de chequeos

| Chequeo | Resultado | Severidad |
|---|---|---|
| `npm audit --audit-level=high` en `apps/api` | 0 high, 0 critical, 0 moderate, 0 low, 0 info (173 deps) | Ninguna |
| `npm audit --audit-level=high` en `apps/web` | 0 high, 0 critical, 0 moderate, 0 low, 0 info (468 deps) | Ninguna |
| `rel="noopener noreferrer"` en `<a target="_blank">` añadidos | OK: único `target="_blank"` en `apps/web/app/albums/[id]/page.tsx:227` lleva `rel="noopener noreferrer"` en línea 228 | Ninguna |
| URLs `https://` en `apps/api/src/data/album-reviews.ts` | 41 ocurrencias `https://`, 0 ocurrencias `http://` (sin TLS) | Ninguna |
| Secretos hardcodeados (`API_KEY`, `SECRET`, `TOKEN`, `password`, `Bearer`) en archivos modificados | 0 matches en `album-reviews.ts`, `types/album.ts`, `lib/album-types.ts`, `app/albums/[id]/page.tsx` | Ninguna |
| Render seguro (sin `dangerouslySetInnerHTML`) | 0 matches en `app/albums/[id]/page.tsx`. `q.quote`, `q.author`, `q.outlet`, `q.year`, `q.url` y `h.note` se interpolan con `{...}` JSX (escape automático de React). `q.url` se usa como `href`, no como `dangerouslySetInnerHTML`, por lo que el riesgo `javascript:` se mitiga porque el dataset es estático y bajo control del repo | Ninguna |
| Nuevas dependencias introducidas | `apps/api/package.json` y `apps/web/package.json` sin cambios (`git status` limpio) | Ninguna |

## Output literal de `npm audit`

### apps/api

```json
{
  "auditReportVersion": 2,
  "vulnerabilities": {},
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 0,
      "moderate": 0,
      "high": 0,
      "critical": 0,
      "total": 0
    },
    "dependencies": {
      "prod": 68,
      "dev": 106,
      "optional": 59,
      "peer": 0,
      "peerOptional": 0,
      "total": 173
    }
  }
}
```

### apps/web

```json
{
  "auditReportVersion": 2,
  "vulnerabilities": {},
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 0,
      "moderate": 0,
      "high": 0,
      "critical": 0,
      "total": 0
    },
    "dependencies": {
      "prod": 72,
      "dev": 360,
      "optional": 60,
      "peer": 0,
      "peerOptional": 0,
      "total": 468
    }
  }
}
```

Comparación contra baseline (iteración previa cerró con 0 HIGH/CRITICAL): **mantiene baseline**. 0 high / 0 critical en ambos paquetes.

## Evidencia detallada

### `target="_blank"` y `rel`

`apps/web/app/albums/[id]/page.tsx` líneas 225–233:

```tsx
<a
  href={q.url}
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
  Fuente
  <span aria-hidden="true">&rarr;</span>
</a>
```

Único `target="_blank"` añadido en la app; rel correcto. El test e2e (`apps/web/e2e/albums.spec.ts:205`) refuerza la invariante.

### URLs y dominio del dataset

`apps/api/src/data/album-reviews.ts`: 41 URLs todas `https://`. Dominios usados: Wikipedia, AllMusic, Rolling Stone (todos con TLS). No hay protocolos `http://`, `javascript:`, `data:`, ni `file:`.

### Render seguro

El frontend no usa `dangerouslySetInnerHTML` en `app/albums/[id]/page.tsx`. Toda interpolación es vía JSX:

- `{q.quote}` (línea 215) — auto-escapado.
- `{q.author}`, `{q.outlet}`, `{q.year}` (líneas 220–223) — auto-escapado.
- `{h.note}` (línea 191) — auto-escapado.
- `{q.url}` se usa solo como atributo `href`, no como contenido HTML.

Riesgo residual: el dataset es estático y forma parte del repo; cualquier URL maliciosa requeriría compromiso del repo, lo cual ya está cubierto por la revisión de PR. No se sanitizan los hrefs en runtime, pero al ser data interna controlada el riesgo es bajo.

### Secretos

Grep case-insensitive sobre los 4 archivos modificados/nuevos relevantes (`album-reviews.ts`, `types/album.ts`, `lib/album-types.ts`, `app/albums/[id]/page.tsx`) con patrones `API_KEY|SECRET|TOKEN|password|BEARER|Bearer`: **0 coincidencias**.

### Dependencias

`git status` confirma que `apps/api/package.json` y `apps/web/package.json` no aparecen como modificados. No hay nuevas dependencias introducidas en esta iteración.

## Mitigaciones / riesgo residual

- **URLs externas en `<a href>`**: el dataset es estático y bajo control del repo. Riesgo residual bajo. Recomendación (no bloqueante): si en el futuro el dataset se carga desde una fuente externa, añadir una guard que verifique que `q.url` empieza por `https://` antes de renderizar.
- **Auditoría npm**: ambas baselines a 0/0/0/0/0. Recomendable mantener la suite de `npm audit` en CI y bloquear PRs que introduzcan HIGH/CRITICAL.

## Veredicto final

**APROBADO**

- 0 findings CRITICAL.
- 0 findings HIGH.
- 0 findings MODERATE/LOW/INFO.
- Todos los chequeos del gate de seguridad pasan.
- No hay nuevas dependencias.
- No hay secretos.
- No hay XSS via `dangerouslySetInnerHTML`.
- Todos los `target="_blank"` llevan `rel="noopener noreferrer"`.
- Todas las URLs externas usan TLS (`https://`).

No se requiere aprobación humana adicional; no hay excepciones que escalar.
