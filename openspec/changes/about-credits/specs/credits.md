# Delta — `credits` (nueva área)

> Esta es una **propuesta de change**. Tras `/ship` y merge, los `## ADDED Requirements` se mueven a `specs/areas/credits/spec.md` (nuevo) y este archivo queda como histórico bajo `openspec/changes/archive/about-credits/specs/credits.md`.

## Auditoría iter-8 (cierre)

| REQ | Evidencia | Estado |
|---|---|---|
| REQ-CREDITS-1 | `apps/web/lib/credits.ts` con 32 entries, shape estricto. tsc verde. | ✅ |
| REQ-CREDITS-2 | `credits.ts:265,278` (dizzy + la-abadia) llevan campo `note` con razón documentada. | ✅ |
| REQ-CREDITS-3 | `/about` HTTP 200 con 4 sections aria-labelledby. Smoke MCP `reports/iter-8/smoke-about.png`. 11/11 network 200. 0 errores consola. | ✅ |
| REQ-CREDITS-4 | `CreditCard` renderiza data-testid + data-id + data-kind + autor/publisher/año + link Fuente con noopener noreferrer. | ✅ |
| REQ-CREDITS-5 | 22 album-entries + 10 game-entries verificado en `about.spec.ts` (test `distribución 22 + 10 exacta`). | ✅ |
| REQ-CREDITS-6 | `e2e/about.spec.ts` test #4 verifica los 32+ enlaces externos. | ✅ |
| REQ-CREDITS-7 | Link "About" en `iron-deck-header.tsx:55-60`. E2E #1 lo verifica desde "/" → "/about". | ✅ |
| REQ-CREDITS-8 | `<section aria-labelledby="stack-title">` con 7 tecnologías (las 6 obligatorias + Playwright + Chrome DevTools MCP). E2E #6 lo verifica. | ✅ |
| REQ-CREDITS-9 | `<section aria-labelledby="thanks-title">` enlaza a gentle-ai. E2E #7 lo verifica. | ✅ |
| REQ-CREDITS-10 | Playwright 46/46 (38 previos + 8 nuevos). 0 regresiones. | ✅ |

**10/10 verde**. security-engineer APROBADO (0/0/0/0). reviewer APROBAR (con 5 recomendaciones, 1 bloqueante resuelta).

## ADDED Requirements

### REQ-CREDITS-1: Dataset de créditos completo

Given los catálogos de álbumes (22 entradas) y juegos (10 entradas),
when un consumidor importa `CREDITS` desde `apps/web/lib/credits.ts`,
then la constante MUST contener exactamente **32 entradas**, cada una con:

- `id` no vacío y único dentro de su `kind`,
- `title` no vacío,
- `kind` ∈ `{"album", "game"}`,
- `author` no vacío,
- `publisher` no vacío,
- `year` integer en `[1965, 2026]`,
- `sourceUrl` que matchea `^https://`,
- `note` opcional (string si presente, no vacío).

Y la distribución MUST ser:
- 22 entradas con `kind="album"`,
- 10 entradas con `kind="game"`.

**Validación:** test unitario opcional + asserts en `e2e/about.spec.ts`.

### REQ-CREDITS-2: Sustituciones documentadas

Given las dos sustituciones de portadas conocidas (DEC-001 hotfix iter-6:
DOS box art para `la-abadia-del-crimen`; iter-7: Dizzy reemplaza
Sorcery con portada canónica de Codemasters),
when se inspeccionan las entradas correspondientes,
then ambas SHALL tener el campo `note` rellenado con una explicación
breve de la sustitución.

**Validación:** inspección manual + (opcional) asserción en test.

### REQ-CREDITS-3: Página /about renderiza

Given el navegador en `http://localhost:3000`,
when el usuario navega a `/about`,
then la página MUST renderizar HTTP 200 con:

- `<h1>` que contenga "IRON DECK" y "About" (o equivalente),
- al menos 4 `<section>` o `<h2>` representando: "Sobre este proyecto",
  "Créditos", "Stack", "Agradecimientos",
- 0 errores de consola del navegador,
- 0 requests 4xx/5xx en network (excluyendo `favicon.ico`).

**Validación:** smoke MCP + `e2e/about.spec.ts`.

### REQ-CREDITS-4: Créditos visibles en grid o tabla

Given la página `/about` cargada,
when el usuario llega a la sección "Créditos",
then SHALL ver **exactamente 32 elementos** con
`data-testid="credit-entry"`, cada uno con atributos:

- `data-id` no vacío (id del recurso),
- `data-kind` ∈ `{"album", "game"}`.

Y cada `credit-entry` MUST mostrar:
- `title`,
- `author` (band o developer),
- `publisher`,
- `year`,
- enlace a `sourceUrl` con `target="_blank"` y `rel="noopener noreferrer"`.

**Validación:** `e2e/about.spec.ts`.

### REQ-CREDITS-5: Distribución por kind

Given la sección "Créditos" cargada,
when se cuentan los `credit-entry` por `data-kind`,
then SHALL haber **exactamente 22** con `data-kind="album"` y **exactamente 10**
con `data-kind="game"`.

**Validación:** `e2e/about.spec.ts`.

### REQ-CREDITS-6: Enlaces externos seguros

Given un `credit-entry` con `sourceUrl` declarada,
when el frontend lo renderiza,
then el `<a>` MUST tener `target="_blank"` y `rel="noopener noreferrer"`.
No es opcional: la regla aplica a las 32 entradas porque todas tienen
`sourceUrl` (RFC 2119 MUST).

**Validación:** `e2e/about.spec.ts`.

### REQ-CREDITS-7: Entry "About" en el header

Given cualquier página del sitio (`/`, `/albums`, `/games`, `/cart`, `/about`),
when se renderiza el header global,
then SHALL contener un `<a href="/about">About</a>` con texto visible
"About", ubicado entre "Games" y "Contacto" en el orden.

**Validación:** `e2e/about.spec.ts` (test del link en el header) + smoke MCP.

### REQ-CREDITS-8: Stack documentado

Given la sección "Stack" en `/about`,
when un humano la lee,
then SHALL listar al menos las siguientes 6 tecnologías clave:
Next.js 15, React 19, Tailwind 3.4, Fastify 5, TypeScript 5.6, Vitest.

**Validación:** `e2e/about.spec.ts` busca los textos en la sección con
`<h2>` "Stack".

### REQ-CREDITS-9: Reconocimiento del modelo openspec

Given la sección "Agradecimientos",
when un humano la lee,
then SHALL mencionar a "gentle-ai" o "Gentleman-Programming" como
inspiración del modelo openspec (atribución correcta a la fuente del
patrón arquitectónico).

**Validación:** `e2e/about.spec.ts` busca el texto.

### REQ-CREDITS-10: Sin regresiones

Given los catálogos `/albums` y `/games` operativos,
when se entrega el change `about-credits`,
then los tests E2E previos (38/38 a fecha de iter-7) SHALL seguir verdes.
Backend vitest (233/233) SHALL seguir verde. tsc en ambos paquetes SHALL pasar.

**Validación:** ejecución completa de la suite tras implementación.

## Notas

- Esta área `credits` es nueva. Tras merge, `specs/areas/credits/spec.md`
  se creará con los `## ADDED Requirements` migrados.
- Si en iter-9+ se sustituyen portadas o se añaden recursos al catálogo,
  los `CREDITS` deben actualizarse en paralelo (cualquier divergencia
  hará fallar REQ-CREDITS-1).
