# Proposal — Sección "Consolas icónicas de la historia"

> **Change ID:** `consoles`
> **Iteración:** iter-10
> **Estado:** activa
> **Áreas afectadas:** nueva área `consoles`.

## Objetivo

Añadir una sección `/consoles` al portal IRON DECK que documente las 10 consolas más icónicas de la historia del videojuego (1983-2006), siguiendo el patrón establecido en `albums` (iter-3..6) y `games` (iter-7): catálogo + ficha de detalle con datos verificables.

## Motivación

- **Coherencia narrativa del portal**: ya tenemos discos heavy metal y juegos Amstrad CPC. Las consolas icónicas son el siguiente eslabón cultural-retro lógico.
- **Banco de pruebas serio** de las lecciones acumuladas: G/W/T + RFC 2119 (DEC-002), reglas del flujo ADLC consolidadas en CLAUDE.md (DEC-004), tres subagentes obligatorios incluido qa (DEC-005), Docker (DEC-005).
- **Probar el flujo end-to-end con todas las correcciones procedimentales** aplicadas desde el principio.

## Alcance

**Incluye:**

- Tipo `Console` en `apps/api/src/types/console.ts`.
- Dataset estático con 10 consolas en `apps/api/src/data/consoles.ts`.
- Endpoints `GET /consoles(?q=, ?manufacturer=, ?generation=)` y `GET /consoles/:id` en `apps/api/src/routes/consoles.ts`.
- Tests vitest dinámicos sobre el dataset.
- 10 portadas en `apps/web/public/covers/consoles/<slug>.jpg` desde Wikipedia.
- Tipos mirror + cliente HTTP en `apps/web/lib/console-types.ts` y `apps/web/lib/consoles-api.ts` (reusando `resolveApiBase()` para SSR + CSR).
- Página `/consoles` (listado con buscador + filtros por generación) en `apps/web/app/consoles/page.tsx` con layout dedicado (`IronDeckHeader` global).
- Ficha `/consoles/[id]` (server component) con datos + iconic games + media + portada.
- `not-found.tsx` específico.
- Entrada "Consolas" en `iron-deck-header.tsx` entre "Games" y "About".
- Tests E2E en `apps/web/e2e/consoles.spec.ts` ejecutados contra Docker (lección iter-9).

**Fuera de alcance:**

- Críticas multi-sección de cada consola (no es necesario para este alcance — el detalle de la ficha es suficiente).
- Citas de prensa con URL verificable por consola (para mantener foco; puede ser iter-11).
- Filtro por año (la generación ya cubre la dimensión temporal).
- Imágenes de juegos iconic — solo se listan los nombres.

## Decisiones técnicas (sin pausar para preguntar)

1. **10 consolas curadas por consenso retro**:
   - NES (Nintendo, 1983, 3ª gen)
   - Sega Mega Drive / Genesis (Sega, 1988, 4ª gen)
   - Game Boy (Nintendo, 1989, 4ª gen handheld)
   - SNES / Super Famicom (Nintendo, 1990, 4ª gen)
   - PlayStation (Sony, 1994, 5ª gen)
   - Nintendo 64 (Nintendo, 1996, 5ª gen)
   - Dreamcast (Sega, 1998, 6ª gen)
   - PlayStation 2 (Sony, 2000, 6ª gen)
   - Xbox (Microsoft, 2001, 6ª gen)
   - Wii (Nintendo, 2006, 7ª gen)
2. **Datos por consola**: id (slug), name, manufacturer, year, generation (number), description (≥200 chars), unitsSoldM (millones), iconicGames (3-5 títulos), media (cartucho/CD/DVD/disco propietario), coverUrl.
3. **G/W/T + RFC 2119** para los 10 REQ-CONSOLES-*.
4. **Patrón establecido**: clonar estructura de `apps/api/src/data/games.ts` y `apps/web/app/games/`.

## Rollback

`git revert` del commit final. Sin migrations, sin estado persistente.

## Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Datos de ventas no verificables (cifras variables según fuente) | BAJO | Citar Wikipedia con margen, no inventar; redondear a millones. |
| Portadas Wikipedia con licencia editorial | BAJO | Mismo patrón resuelto en iter-8 vía `/about` con créditos. La pageinfo de cada Wikipedia incluye créditos. |
| Olvidar layout con header global | BAJO | Lección iter-7.1: layout dedicado obligatorio para secciones fuera de `(main)`. |
| Bug SSR/CSR como iter-9 | MEDIO | `consoles-api.ts` usa `resolveApiBase()` desde el inicio. Tests Playwright se ejecutan contra Docker. |

## Criterio de éxito

`docker compose up -d` + navegar a `http://localhost:3000/consoles` muestra 10 cards. Click en cualquiera abre la ficha sin errores en consola. Filtro por generación reduce el listado. Tests E2E verdes contra Docker.
