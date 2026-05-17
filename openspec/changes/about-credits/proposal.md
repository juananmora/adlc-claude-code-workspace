# Proposal — Página `/about` con créditos del proyecto

> **Change ID:** `about-credits`
> **Iteración asociada:** iter-8
> **Estado:** activa
> **Áreas afectadas:** nueva área `credits`, sin tocar `albums` / `games` / `catalog-products`.

## Objetivo

Añadir una página `/about` accesible desde el header global que documente:

1. Identidad del proyecto (IRON DECK, demo ADLC).
2. **Créditos de las portadas** de los catálogos (resuelve la deuda **SEC-07-01** de iter-7: fair use editorial pendiente de visado legal antes de release público). Cada portada de juego CPC y cada portada de álbum debe quedar con autoría/publisher/fuente explícita.
3. Stack tecnológico y agradecimientos.

## Alcance

**Incluye:**

- Ruta `/about` en `apps/web/app/about/`.
- Dataset `apps/web/lib/credits.ts` con la procedencia de las 32 portadas (22 álbumes + 10 juegos): publisher, año, fuente (Wikipedia URL canónica).
- Sección de stack tecnológico y agradecimientos.
- Entry "About" en el header global (entre "Games" y "Contacto").
- Tests E2E que verifican la presencia de los créditos.
- Smoke MCP en `/about`.

**Fuera de alcance:**

- Sustituir portadas por imágenes con licencia abierta (REC-8 del backlog iter-7, va aparte).
- Implementar visado legal automatizado.
- Página `/legal` o `/privacy` (proyecto demo, no requerido).
- Cambios en el contrato API.

## Motivación

- **Resuelve SEC-07-01 parcialmente** dando trazabilidad pública a las fuentes de las portadas, lo que mitiga el riesgo legal (atribución correcta es parte del fair use).
- **Refuerza la identidad del workspace** como proyecto educativo/ADLC, no comercial.
- **Banco de pruebas del nuevo flujo SDD** con `openspec/changes/` y G/W/T desde cero.

## Rollback

Si la página `/about` rompe el build o introduce regresión:

1. `git revert <commit-iter-8>` restaura el estado pre-iter-8.
2. No hay datos persistentes ni migrations de BD (todo estático).
3. Las portadas no se mueven; siguen en `apps/web/public/covers/`.

## Aprobaciones humanas requeridas

- Decisión sobre **qué publisher se atribuye** a portadas donde Wikipedia ofrece DOS box art en lugar de inlay CPC nativo (caso `la-abadia-del-crimen`). Mi propuesta: atribuir al publisher original del juego (Opera Soft), no al del port de DOS. Documentado en `design.md`.
- Aprobación de cierre (Fase 11 de CLAUDE.md).

## Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Olvidar acreditar una portada | MEDIO | El test E2E exige `>=32` créditos con campos completos. |
| URLs de Wikipedia que cambien | BAJO | Las URLs canónicas de wiki son estables; si una falla, gap rojo documentado. |
| Inflar bundle del frontend | BAJO | Solo datos estáticos en TS, sin imágenes nuevas. |
