# Delta — `catalog-viewer`: renombrar IRON DECK a Master of the Puppets

> Propuesta de change del slug `master-of-the-puppets-rename` (PRD: `specs/master-of-the-puppets-rename-prd.md`, referenciado en el artefacto `adlc-prd`).
> Estado: **pendiente de aprobación humana en el gate G2** (PRD + criterios).

Formato: `Given <contexto>, when <acción>, then <resultado>.` Nivel RFC 2119 (MUST/SHALL, SHOULD, MAY). Cada criterio indica el requisito del PRD que verifica (`RF-NN` / `RNF-NN`) y su `Validación:`.

## ADDED Requirements

### AC-01 — Título de la home (RF-01)

- Given la aplicación `apps/web` servida en modo producción, when se solicita `/`, then el `<title>` MUST ser exactamente `Master of the Puppets — Catálogo`.
  - Validación: `apps/web/app/layout.tsx:25` y `apps/web/e2e/home.spec.ts` (aserción de título).

### AC-02 — Descripción meta sin la marca antigua (RF-01)

- Given la home `/`, when se lee `<meta name="description">`, then el contenido MUST NOT contener la cadena `IRON DECK` y MUST empezar por `Master of the Puppets:`.
  - Validación: `apps/web/app/layout.tsx:27` + `grep -rn "IRON DECK" apps/web/app/layout.tsx` devuelve 0 líneas.

### AC-03 — Wordmark del header (RF-02)

- Given cualquier página con el header global montado, when se renderiza el logo, then el texto visible MUST leerse `Master of the Puppets` y el `aria-label` del enlace MUST ser `Inicio Master of the Puppets`.
  - Validación: `apps/web/components/iron-deck-header.tsx` (el wordmark está partido en dos `<span>` `I` + `RON&nbsp;DECK`; debe sustituirse por el nuevo texto completo) y `apps/web/e2e/responsive.spec.ts:13` actualizado a `getByLabel("Inicio Master of the Puppets")`.

### AC-04 — Footer (RF-03)

- Given cualquier página con el footer global, when se lee el texto de copyright, then MUST leerse `© <año actual> Master of the Puppets — No es una tienda real.`
  - Validación: `apps/web/components/iron-deck-footer.tsx:23`.

### AC-05 — Etiqueta del hero (RF-04)

- Given la home con el hero visible, when se lee la etiqueta superior, then MUST leerse `Catálogo · Master of the Puppets`.
  - Validación: `apps/web/components/hero.tsx:34`.

### AC-06 — Página About (RF-05)

- Given la página `/about`, when se renderiza, then el `<h1>` MUST ser `About Master of the Puppets` y MUST NOT contener `IRON DECK` en ningún texto visible.
  - Validación: `apps/web/app/about/page.tsx:28,31` y `apps/web/e2e/about.spec.ts:25` (regex `/About Master of the Puppets/i`).

### AC-07 — Títulos de sección y ficha (RF-06)

- Given las rutas `/albums`, `/consoles`, `/games`, `/tours` y `/products/<id>`, when se lee el `<title>` de cada una, then MUST terminar en `| Master of the Puppets` (secciones) o `— Master of the Puppets` (ficha de producto) y MUST NOT contener `IRON DECK`.
  - Validación: `apps/web/app/consoles/layout.tsx:5`, `apps/web/app/tours/layout.tsx:5`, `apps/web/app/(main)/products/[id]/page.tsx:24`, y el título de `/albums` y `/games` en sus layouts. Comprobación: `curl -s <url> | grep -o "<title>[^<]*</title>"`.

### AC-08 — Cero apariciones de la marca antigua en texto visible (RF-07)

- Given el código de la aplicación, when se busca la cadena `IRON DECK` en texto visible, then el resultado MUST ser 0 coincidencias en `apps/web/app` y `apps/web/components` salvo comentarios de código internos que el reviewer acepte explícitamente.
  - Validación: `grep -rn "IRON DECK" apps/web/app apps/web/components --include=*.tsx | grep -v "^\s*//\|\*"` devuelve 0 líneas de texto visible.

### AC-09 — Sin errores de consola (RNF-01)

- Given las páginas `/`, `/about`, `/albums`, `/consoles`, `/games`, `/tours` y una ficha de producto, when se cargan en el navegador con Chrome DevTools MCP, then la consola MUST NOT mostrar errores ni warnings nuevos respecto al baseline previo al cambio.
  - Validación: smoke MCP con `list_console_messages` por ruta; captura adjunta en `reports/iter-13/`.

### AC-10 — Suites de test sin regresiones (RNF-02)

- Given el repositorio al cierre de la iteración, when se ejecutan las suites existentes, then la suite Vitest de `apps/api` y la suite Playwright de `apps/web` MUST pasar y el número de tests MUST ser igual o mayor que el baseline previo.
  - Validación: `npm test` en `apps/api` y `npx playwright test` en `apps/web`.

### AC-11 — Build y tipado (RNF-03)

- Given el código modificado, when se ejecutan la compilación y el chequeo de tipos, then ambos MUST terminar con código 0.
  - Validación: `npm run build` y `npx tsc --noEmit` en `apps/web`.

### AC-12 — Sin dependencias nuevas (RNF-04)

- Given el cambio, when se compara `package.json` y los lockfiles con la rama base, then MUST NOT haber dependencias añadidas o eliminadas.
  - Validación: `git diff <base> -- apps/web/package.json apps/web/package-lock.json` sin cambios en `dependencies` ni `devDependencies`.

### AC-13 — Identificadores internos fuera de alcance (RNF-05)

- Given el cambio, when se revisan nombres de componentes y ficheros, then `IronDeckHeader`, `iron-deck-header.tsx`, `iron-deck-footer.tsx` y `IRON_DECK` MAY permanecer sin renombrar, y SHOULD quedar documentados como deuda técnica en el reporte final.
  - Validación: inspección del reporte de cierre (`reports/iter-13/`).

### AC-14 — Aprobación de la marca (riesgo legal)

- Given el nuevo nombre "Master of the Puppets" (título de un álbum de Metallica), when se prepara el despliegue, then el despliegue MUST NOT ejecutarse sin aprobación humana explícita de la marca.
  - Validación: decisión registrada en el gate G2 y en el reporte de cierre. No automatizable.

## Trazabilidad RF/RNF → AC

| Requisito PRD | Criterio |
|---|---|
| RF-01 | AC-01, AC-02 |
| RF-02 | AC-03 |
| RF-03 | AC-04 |
| RF-04 | AC-05 |
| RF-05 | AC-06 |
| RF-06 | AC-07 |
| RF-07 | AC-08 |
| RNF-01 | AC-09 |
| RNF-02 | AC-10 |
| RNF-03 | AC-11 |
| RNF-04 | AC-12 |
| RNF-05 | AC-13 |
| (riesgo PRD) | AC-14 |
