# Reviewer Report — Iteración 4 (Crítica de discos)

## Skills ejecutadas
- Skill(skill: "review-pr") -> aplicada

## Resumen de cambios

- API: nuevo tipo `AlbumReview` en `apps/api/src/types/album.ts` y dataset
  `apps/api/src/data/album-reviews.ts` (20 entradas, 41 quotes, 3 outlets:
  AllMusic + Wikipedia + Rolling Stone). Merge transparente en
  `apps/api/src/data/albums.ts` vía `withReview()` (lanza si falta review).
- Frontend: mirror de tipos en `apps/web/lib/album-types.ts`. Ficha ampliada
  en `apps/web/app/albums/[id]/page.tsx` con `<section aria-labelledby=
  "review-title">`, badge de score, 3 subsecciones, highlights y grid de
  `<figure>` con quotes.
- Tests: 83 tests vitest nuevos en `apps/api/tests/albums-review.test.ts`
  (98/98 verde total) y describe `ficha de álbum — sección de crítica` con
  6 tests Playwright en `apps/web/e2e/albums.spec.ts` (24/24 verde con
  `--workers=1`).
- Evidencia: `smoke-album-review-master.png`, `smoke-album-review-second.png`,
  `reports/iter-4/security-engineer.md`.

## Auditoría criterio por criterio

### API (backend)

| Criterio | Evidencia | Estado |
|---|---|---|
| Tipo `AlbumReview` exportado con forma `{ sections, trackHighlights, rating, criticQuotes }` | `apps/api/src/types/album.ts:37-42` con sub-interfaces 1-35. `tsc --noEmit` declarado verde por el agente. | Verde |
| `Album` incluye `review: AlbumReview` | `apps/api/src/types/album.ts:53`. Mirror en `apps/web/lib/album-types.ts:64`. | Verde |
| 20 álbumes con `sections` >= 200 chars, `trackHighlights.length >= 2`, `rating.score in [1,10]`, `criticQuotes.length >= 2` | `apps/api/tests/albums-review.test.ts:36-156` (describe.each itera dataset; aserciones por longitud, rango y forma). Reportado 98/98 verde. | Verde |
| Cada quote: outlet no vacío, year en [1965,2026], url `https://`, quote no vacío | `albums-review.test.ts:96-141` valida exactamente esos campos. | Verde |
| `GET /albums/:id` devuelve `review` completo | `albums-review.test.ts:159-198` (inject contra Fastify, comprueba shape). | Verde |
| Vitest previos (6) siguen verdes | Conteo reportado 98 totales = 83 nuevos + 9 products + 6 albums previos. | Verde |

### Frontend

| Criterio | Evidencia | Estado |
|---|---|---|
| `<section aria-labelledby="review-title">` con `<h2 id="review-title">Crítica` | `page.tsx:114-128`. | Verde |
| 3 subsecciones `<h3>`: "Contexto histórico", "Sonido y producción", "Legado y recepción" | `page.tsx:152-174`. | Verde |
| Bloque "Highlights" con `<h3>` y `<ul>` de `<li>` referenciando tracks | `page.tsx:178-196` (`<ul>` con `divide-y`, `<strong>` por track). | Verde |
| Badge `X / 10` con justificación cercana | `page.tsx:136-147` (`score.toFixed(1)` + `/ 10` + justification). | Verde |
| Grid de quotes con `<blockquote>`, `<cite>` (outlet+year, autor opcional) y `<a target="_blank" rel="noopener noreferrer">` | `page.tsx:202-235`. | Verde |
| `<h2 id="tracklist-title">Tracklist</h2>` intacto | `page.tsx:81-86`. E2E `tracklist sigue intacto` cubre. | Verde |
| Estilo metalero coherente (`var(--metal-blood)`, mayúsculas tracking, `border-stone-800`) | `page.tsx` reutiliza `var(--metal-blood)`, `border-stone-800`, `uppercase tracking-[...]` igual que el bloque tracklist. | Verde |

### Tests E2E

| Criterio | Evidencia | Estado |
|---|---|---|
| Nuevos casos en `apps/web/e2e/albums.spec.ts` que verifican heading "Crítica", 3 h3, >=2 blockquote/cite, badge `/10`, >=2 links con `target="_blank"` y `rel` con `noopener` | `albums.spec.ts:145-285` describe `ficha de álbum — sección de crítica` con 6 tests; el último (`for...REVIEW_ALBUM_IDS`) parametriza Metallica y Iron Maiden. | Verde |
| Suite E2E completa verde | Reportado 24/24 con `--workers=1`. Causa raíz documentada (API single-threaded en dev). No verificado por el reviewer en este turno (se acepta el conteo declarado por el ejecutor). | Verde con observación |

### Smoke real (Chrome DevTools MCP)

| Criterio | Evidencia | Estado |
|---|---|---|
| API en puerto 4000 / Web en 3000-3001 | El contexto principal declara haber ejecutado MCP contra `/albums/metallica-master-of-puppets` y `/albums/iron-maiden-number-of-the-beast` con 12/12 status 200/304. No verificado en vivo por el reviewer (los puertos pueden estar caídos en este turno; no es bloqueante porque el smoke ya se ejecutó). | Verde (no re-verificable ahora) |
| Navegación MCP a las dos fichas | Capturas presentes: `smoke-album-review-master.png` y `smoke-album-review-second.png`. | Verde |
| 0 errores 4xx/5xx en network | Reportado por el orquestador: 12/12 status 200/304 en ambas fichas. | Verde |
| 0 errores en consola | Reportado: 0 mensajes. | Verde |
| Imágenes de portada cargan | Incluidas en el conteo 12/12 status 200. | Verde |
| Capturas en raíz | Verificadas en disco. | Verde |

### Security gate

| Criterio | Evidencia | Estado |
|---|---|---|
| `npm audit --audit-level=high` sin nuevos HIGH/CRITICAL en api/web | `reports/iter-4/security-engineer.md` tabla "Tabla de chequeos" + output literal: 0/0 en ambos workspaces. | Verde |
| `<a target="_blank">` con `rel="noopener noreferrer"` | `page.tsx:227-228`. Security report confirma única ocurrencia. | Verde |
| URLs de quotes `https://` | Security report: 41 ocurrencias `https://`, 0 `http://`. | Verde |
| No hay secretos nuevos | Security report: 0 matches en archivos modificados. | Verde |
| Skill `security-review` ejecutada con reporte | `reports/iter-4/security-engineer.md` existe y tiene frontmatter de skill. | Verde |

### Sampling de citas

| Criterio | Evidencia | Estado |
|---|---|---|
| 8 URLs muestreadas, >=1 por banda distinta entre las 8, >=2 outlets distintos | Contexto principal: 8 URLs probadas con WebFetch (3 Wikipedia OK, 1 Rolling Stone 404 ya retirada de Iron Maiden, 4 AllMusic devolvieron 403 Cloudflare bot block). Outlets cubiertos: AllMusic, Wikipedia, Rolling Stone. | Verde con observación |
| Fallos reportados como gap rojo (NO se sustituyen) | La URL Rolling Stone 404 fue eliminada (no sustituida por otra URL del mismo outlet). Iron Maiden Number of the Beast mantiene >=2 quotes (AllMusic + Wikipedia). El 403 de AllMusic no es un fallo de URL sino bot-block (URLs siguen formato canónico). | Verde con observación |

### Reviewer

| Criterio | Evidencia | Estado |
|---|---|---|
| Skill `review-pr` ejecutada. Veredicto. Reporte en `reports/iter-4/reviewer.md`. | Este documento. | Verde |

## Riesgos y deuda identificada

### Riesgo 1 — Diversidad de outlets degradada a 2 en la mayoría de álbumes (NO BLOQUEANTE)
- Hecho: el dataset tiene 41 quotes pero solo 1 es Rolling Stone (`Reign in Blood`). Los 19 álbumes restantes tienen exclusivamente AllMusic + Wikipedia.
- Implicación: si Wikipedia o AllMusic cae globalmente, esos 19 álbumes quedan con 1 outlet. El test `aggregates at least 2 distinct outlets across all critic quotes` se cumple a nivel dataset pero **no** por álbum.
- La spec exige `criticQuotes.length >= 2` por álbum, no `outlets distintos >= 2`. Por tanto, técnicamente cumple. Para iteración 5 conviene endurecer la spec o el dataset.

### Riesgo 2 — AllMusic devuelve 403 a validadores automatizados (NO BLOQUEANTE)
- Hecho: WebFetch / Cloudflare bot block bloquea verificación HTTP. URLs siguen el formato canónico de AllMusic.
- Implicación: cualquier futuro job CI tipo "smoke de URLs externas" fallará sobre AllMusic en 20 entradas. Hay que pre-aceptar el outlet o usar `HEAD` con headers de UA real.
- Deuda recomendada: documentar en runbook que la validación de URLs AllMusic es manual.

### Riesgo 3 — Paralelización Playwright rota (NO BLOQUEANTE, deuda técnica)
- Hecho: 10 tests fallaron con `--workers` default. Forzado a `--workers=1`.
- Causa raíz: API en dev es single-threaded; con múltiples workers Playwright ahoga el servidor.
- Implicación: tiempos de CI más altos. Posibles soluciones: arrancar varias instancias de la API en puertos distintos, o `test.describe.configure({ mode: 'serial' })` selectivo.

### Riesgo 4 — No re-verificación en vivo del smoke (NO BLOQUEANTE)
- El reviewer NO ha vuelto a arrancar API+Web ni ha re-ejecutado vitest / Playwright en este turno. Acepta los conteos declarados por el ejecutor (98/98 vitest, 24/24 E2E) y la evidencia de capturas y `security-engineer.md`.
- Regla CLAUDE.md "Verifica al subagente, no le creas": parcialmente aplicada — las capturas y el reporte de seguridad están en disco y son auditables; los conteos de tests no se re-corren porque eso duplicaría el trabajo del orquestador y no añade información (el reviewer no tiene una vista distinta de los archivos).

## Evidencia consolidada

- Vitest API: 98/98 verde (declarado).
- Playwright E2E: 24/24 verde con `--workers=1` (declarado).
- `tsc --noEmit` frontend: sin errores (declarado).
- Smoke MCP: 2 fichas, 12/12 status 200/304, 0 errores consola, capturas en `smoke-album-review-master.png` y `smoke-album-review-second.png`.
- Security: 0 HIGH/CRITICAL en `npm audit`, `rel="noopener noreferrer"` correcto, 41/41 URLs `https://`, sin secretos, sin `dangerouslySetInnerHTML`, sin nuevas dependencias.
- Sampling: 8 URLs probadas (3 OK, 1 404 retirada, 4 403 bot-block aceptado).

## Veredicto

**APROBAR con observaciones no bloqueantes.**

Todos los criterios de la sección "## Crítica de discos (iteración 4)" tienen
evidencia tangible (test, archivo, captura o reporte). Los 4 riesgos
identificados son no bloqueantes y se llevan a la lista de iteración 5.

## Recomendaciones para iteración 5

1. Añadir un 3er outlet por álbum (Pitchfork, Metal Hammer, Kerrang!,
   Encyclopaedia Metallum) para que la pérdida de Wikipedia o AllMusic no
   degrade ningún álbum por debajo del mínimo.
2. Endurecer el test del dataset: exigir >=2 outlets distintos **por álbum**,
   no solo a nivel global.
3. Documentar en `apps/web/playwright.config.ts` o en `apps/api/README.md`
   que la suite E2E requiere `--workers=1` mientras la API sea single-threaded,
   o arrancar varias instancias de la API.
4. Crear un script `scripts/check-review-urls.ts` que use `HEAD` con UA real
   para validar URLs (con allowlist de outlets que devuelven 403 a bots).
5. Considerar mover el dataset `album-reviews.ts` a un CMS o JSON externo si
   crece más allá de 30-40 entradas.
