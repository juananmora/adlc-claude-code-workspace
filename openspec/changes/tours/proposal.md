# Proposal — iter-12: nueva área `/tours` (giras históricas del metal)

> **Iteración**: iter-12
> **Fecha**: 2026-05-28
> **Estado**: borrador
> **Tipo**: change (propuesta activa) → al cerrar mueve a `specs/areas/tours/spec.md`

## Objetivo

Añadir al portal IRON DECK una nueva sección **`/tours`** con 10 giras históricas del metal clásico (1980-2010). Cada tour expone su banda principal, año, número de fechas, países visitados, álbum promocionado, descripción larga y portada/cartel.

## Por qué

- Cierra el cuadrante editorial del portal: discos (`/albums`), bandas implícitas, juegos (`/games`), consolas (`/consoles`), créditos (`/about`). Las **giras** son el storytelling natural que une banda + disco + año.
- Sirve como validación end-to-end del harness reescrito (agentes + skills) en una iteración real, con superficie suficiente para ejercitar backend + frontend + qa + security + reviewer.

## Alcance

- Backend `apps/api` — nueva área `tours` con dataset estático de 10 entradas, endpoints `GET /tours` (con filtros opcionales `q`, `decade`, `band`) y `GET /tours/:id` (404 con shape de error).
- Frontend `apps/web` — listado `/tours` + ficha `/tours/[id]` + not-found, con buscador y chips por década. Link "Tours" en el header IRON DECK entre "Consolas" y "About".
- Tests Vitest (apps/api) y Playwright (apps/web/e2e/tours.spec.ts), con `--workers=1` y validación contra Docker.
- Créditos en `apps/web/lib/credits.ts` y entrada en `/about` para las 10 portadas.

## Fuera de alcance

- Compra de entradas (no es una tienda real).
- Fechas exactas / venues / set lists (sin valor para el catálogo editorial; podría llegar en una iter futura).
- Imágenes nuevas a alta resolución — usamos cartelería de cada tour bajo fair use editorial, igual que albums/games/consoles.
- Búsqueda full-text (la búsqueda `q` mantiene la convención: substring case-insensitive sobre `name`).

## Usuarios / actores

Visitante anónimo del portal IRON DECK. Sin admin, sin login.

## Riesgos

| Riesgo | Mitigación | Propietario |
|---|---|---|
| Confusión visual con `/albums` (mismas bandas) | Cabecera con etiqueta "Catálogo · Giras" y chips de década, distintos a chips de género | frontend-engineer |
| Fair use de cartelería | Cada portada con entrada en `credits.ts` (autor, publisher, año, URL Wikipedia) | security-engineer (gate) |
| Filtros mal alineados entre API y UI | Tests vitest para cada filtro + e2e que valida `aria-pressed` y conteos | qa-engineer |
| Bug SSR Docker repetido en `/tours/[id]` | Usar `resolveApiBase()` desde el primer minuto (post-DEC-005) | frontend-engineer |

## Puntos de aprobación humana

- Aprobación final del cierre (Fase 11).
- Validación legal del fair use editorial de cartelería antes de un eventual release público (heredado de SEC-07-01).

## Trazabilidad

- Extiende el patrón de `openspec/changes/consoles/` (DEC-006) — misma estructura, mismo nivel de gates.
- Aplica las lecciones de DEC-005 (qa obligatorio en TODA iter, Playwright contra Docker, `resolveApiBase()`).
