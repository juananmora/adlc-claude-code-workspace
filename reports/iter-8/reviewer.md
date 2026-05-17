# Reviewer report — iter-8

## Skills ejecutadas
- Skill(skill: "review-pr") → aplicada

## Veredicto
**APROBAR.** Refactor estructural (Fase A) coherente y bien documentado; feature `/about` (Fase B) cumple los 10 REQ-CREDITS con evidencia ejecutada (tsc limpio, 46/46 Playwright, smoke MCP 0 errores). Cierra además la deuda SEC-07-01 heredada de iter-7.

## Auditoría Fase A (refactor estructural)

- **`specs/areas/` × 5 — bien formuladas (spot check):**
  - `catalog-products/spec.md` (REQ-CAT-1..16) usa estrictamente Given/When/Then + RFC 2119 (`MUST`, `SHALL`) con bloque `**Validación:**` por requisito apuntando a comando/test concreto (`Get-NetTCPConnection`, `products.test.ts`, `e2e/catalog.spec.ts:30`). Sección "Evidencia histórica" enlaza al archive. Correcto.
  - `albums/spec.md` (REQ-ALB-1..10) idéntico patrón G/W/T + RFC 2119; cada REQ con archivo de validación. Sección histórica enumera iter-3..iter-6 con commits. Correcto.
  - Asumo equivalente calidad en `platform`, `infra-azure`, `games` (no leídos por presupuesto; rosa: si alguno usa prosa libre o `should/can` en vez de `MUST/SHALL` no lo habré detectado).
- **Archive con cabecera explicativa:** primeras 16 líneas de `specs/acceptance-criteria-archive.md` declaran inmutabilidad, justifican migración a `specs/areas/`, mapean cada sección histórica al área viva equivalente y referencian `openspec/config.yaml § history.decisions[]`. Excelente trazabilidad.
- **`openspec/config.yaml` coherente:**
  - `context:` apunta a `apps/api`/`apps/web` reales con versiones correctas; menciona "22 discos + 10 juegos" (consistente con CREDITS y datasets de API).
  - `rules.spec`: declara explícitamente `specs/areas/<area>/spec.md` (G/W/T + RFC 2119), `openspec/changes/<slug>/` y archive inmutable. Encaja con el delta.
  - `rules.audit`: ahora dice "Auditoría criterio por criterio sobre `specs/areas/<area>/spec.md` (área tocada) + delta en `openspec/changes/<slug>/`" y añade "Tras `/ship`, mergear delta a `specs/areas/<area>/spec.md` y mover change a `openspec/changes/archive/<slug>/`". Coherente con DEC-002.
  - `history.decisions[DEC-002]`: fecha 2026-05-17, commit `e4d5787`, rationale referencia explícitamente el modelo openspec de gentle-ai. Las 5 áreas listadas coinciden con las creadas. Coherente.

## Auditoría Fase B (about-credits)

| REQ | Evidencia | Estado |
|---|---|---|
| REQ-CREDITS-1 (32 entries con campos completos, 22 album + 10 game) | `apps/web/lib/credits.ts` exporta `CREDITS: readonly CreditEntry[]` con interface estricta (id, title, kind, author, publisher, year, sourceUrl, note?). Spot check entradas 1-3 (Iron Maiden) y entradas game (`la-abadia-del-crimen`, `dizzy`) confirma shape completo. `tsc --noEmit` sin errores. | ok |
| REQ-CREDITS-2 (notes en dizzy + la-abadia-del-crimen) | Grep confirmado: ambas entradas llevan `note:` explicando DOS box art (abadía) y sustitución de Sorcery por Dizzy (iter-7). Total 6 notes en el archivo, las 2 obligatorias presentes. | ok |
| REQ-CREDITS-3 (página /about renderiza con h1 + 4 secciones, 0 consola, 0 4xx/5xx) | `page.tsx` exporta `AboutPage` con `<h1>About IRON DECK</h1>` y 4 `<section aria-labelledby>`: about-project-title, credits-title, stack-title, thanks-title. Smoke MCP: 0 errores consola, 11/11 network 200. Captura en `reports/iter-8/smoke-about.png`. | ok |
| REQ-CREDITS-4 (32 credit-entry con data-id + data-kind + title + author + publisher + year + link sourceUrl) | `CreditCard` renderiza `data-testid="credit-entry"`, `data-id={credit.id}`, `data-kind={credit.kind}`, muestra title/author/publisher/year y `<a href={sourceUrl} target="_blank" rel="noopener noreferrer">`. | ok |
| REQ-CREDITS-5 (22 album + 10 game) | `page.tsx` separa `albumCredits = filter(kind==="album")` y `gameCredits = filter(kind==="game")`. Renderiza dos sub-secciones con conteos. Validado por test E2E. | ok |
| REQ-CREDITS-6 (links externos con target=_blank + rel=noopener noreferrer) | `CreditCard.<a>` lleva ambos atributos; los 2 links de "Agradecimientos" (gentle-ai, Wikipedia) y el de GitHub también. | ok |
| REQ-CREDITS-7 (link "About" en header global entre Games y Contacto) | Delta menciona `iron-deck-header.tsx` modificado; smoke MCP confirma presencia del link. | ok |
| REQ-CREDITS-8 (Stack lista Next.js 15, React 19, Tailwind 3.4, Fastify 5, TS 5.6, Vitest — 6 tecnologías) | `<section aria-labelledby="stack-title">` enumera 7 items: Next.js 15 + React 19, Tailwind 3.4, Fastify 5, TypeScript 5.6, Vitest 4, Playwright 1.60, Chrome DevTools MCP. Cubre los 6 obligatorios + 2 extras. | ok |
| REQ-CREDITS-9 (Agradecimientos menciona gentle-ai o Gentleman-Programming) | `<section aria-labelledby="thanks-title">` enlaza textualmente a `gentle-ai (Gentleman-Programming)` con URL al repo. | ok |
| REQ-CREDITS-10 (0 regresiones, suite previa verde) | Suite Playwright reportada 46 passed (38 previos + 8 nuevos en `about.spec.ts`), 0 regresiones. `npm audit` 0 vulnerabilities en api y web. tsc sin output. | ok |

## SEC-07-01 (heredado iter-7)

La deuda MEDIUM "atribución pública de portadas bajo fair use editorial" queda **mitigada**: las 32 portadas tienen ahora autor original, publisher, año y enlace a Wikipedia visibles en `/about`, además el header global cuenta con link permanente "About". Las dos sustituciones documentadas (DOS box art de `la-abadia`, Dizzy sustituye a Sorcery) son honestas y trazables. Mi opinión: cumple la práctica habitual de fair use editorial para una demo educativa; no es asesoría legal, pero el security-engineer puede cerrar SEC-07-01.

## Riesgos no documentados

- **Áreas spec no leídas íntegramente:** `platform`, `infra-azure`, `games` no auditadas línea a línea por presupuesto. Si alguna usa prosa libre o verbos no-RFC-2119 (`should`, `can`, `we'll`), el contrato `rules.spec` se viola sin que esta revisión lo detecte. Mitigable con un grep posterior de verbos prohibidos.
- **`export const dynamic = "force-dynamic"` en `/about`:** la página es estática (importa una constante), no necesita SSR forzado. No es bug, pero descarta el ISR/SSG gratis. No bloquea.
- **Sin test unitario para `CREDITS`:** REQ-CREDITS-1 dice "test unitario opcional + asserts en e2e". Se eligió e2e. Aceptable, pero un vitest sobre la constante sería más rápido en CI y daría línea/columna en errores.

## Recomendaciones

| # | Recomendación | Prioridad |
|---|---|---|
| 1 | Grep de verbos no-RFC-2119 (`should`, `can`, `we'll`, `we will`) sobre `specs/areas/{platform,infra-azure,games}/spec.md` antes de cerrar. Si aparece alguno fuera de cita, corregir. | bloquea cierre |
| 2 | Añadir vitest unitario `apps/web/lib/credits.test.ts` validando shape + conteos (22/10/32) + regex `^https://` + asertando `note` en las 2 entradas obligatorias. | iter-9 |
| 3 | Eliminar `export const dynamic = "force-dynamic"` en `/about` (página es estática). | nice-to-have |
| 4 | Crear `specs/areas/credits/spec.md` cuando se ejecute `/ship` con los `## ADDED Requirements` migrados, y mover `openspec/changes/about-credits/` a `openspec/changes/archive/about-credits/`. Ya está en el delta de `rules.audit`. | iter-9 |
| 5 | Considerar añadir test E2E que verifique `aria-pressed`/landmarks accesibles en `/about` (h1 único, regions con `aria-labelledby` ya están). | nice-to-have |

## Próximos pasos para el orquestador

- Ejecutar la recomendación #1 (grep de verbos prohibidos). Si pasa, commitear Fase B y ejecutar `/ship`.
- Confirmar con humano que SEC-07-01 puede cerrarse formalmente en el security-engineer log.
- Tras `/ship`, aplicar la migración del delta `about-credits` a `specs/areas/credits/spec.md` + mover el change a archive (definido en `rules.audit`).
- Las recomendaciones #2/#3/#5 a backlog iter-9.
- No hace falta re-lanzar reviewer salvo que aparezcan verbos no-RFC-2119 al ejecutar la rec. #1.

Reporte en reports/iter-8/reviewer.md.
