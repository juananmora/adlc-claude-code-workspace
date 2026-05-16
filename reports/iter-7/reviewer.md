# Reviewer — Iteración 7 (Catálogo Games — Amstrad CPC)

## Skills ejecutadas
- Skill(skill: "review-pr") → aplicada. Checklist canónico aplicado punto por punto (resumen, relación con spec, criterios cumplidos, criterios pendientes, evidencia de tests, findings de seguridad, riesgos, recomendación). No se aprueba sin evidencia; se señalan dudas concretas; no se ocultan riesgos.

## Veredicto

**APROBAR CON OBSERVACIONES NO BLOQUEANTES.**

Razón concisa: la iteración 7 entrega un delta coherente, sin regresiones, con suite de tests completa verde (vitest 233/233, Playwright 38/38), `tsc --noEmit` verde en backend y frontend, audit limpio en ambos paquetes y smoke MCP con 0 errores 4xx/5xx + 0 errores de consola sobre 4 URLs. Los gaps existentes (citas sin `url`; portadas con fair use editorial; 5 PNG renombrados a `.jpg`; sustitución Sorcery → Dizzy; deuda transversal de `buildUrl` duplicado y de hardening de cabeceras CSP/HSTS) están **declarados** en los reportes y en `specs/acceptance-criteria.md`, son **no bloqueantes para cierre interno** y se trasladan como deuda a iteraciones posteriores o a aprobación humana antes de release público.

Mi discrepancia con el orquestador es mínima: dos criterios que él marca [ ] están justificados, pero hay matices en R3 (código muerto), R4 (decisión de paráfrasis) y R5 (fair use) que merecen quedar como recomendaciones para la sesión humana — no impiden aprobar el cierre operativo.

## Resumen de cambios

Iter-7 añade un catálogo `/games` paralelo a `/albums` con 10 clásicos de Amstrad CPC: backend Fastify con tipos `Game`/`GameQuote`/`GameGenre`, dataset estático curado, endpoints `GET /games(?q,&genre=)` y `GET /games/:id` con 404 tipado; frontend Next 15 con listado (buscador debounced + chips de género + grid responsive), ficha de detalle con metadatos en `<dl>` y bloque de citas con `<figure>/<blockquote>/<cite>`, `not-found.tsx` específico y un link `Games` añadido al header global. Suite Playwright nueva (10 casos) y suite vitest dinámica (123 tests sobre el dataset). Cero modificaciones sobre catálogos previos (`/albums`, `/products`) ni dependencias nuevas.

## Relación con la spec

Camino RF a RF contra `specs/games-amstrad-cpc-prd.md`:

| RF | Estado | Evidencia |
|---|---|---|
| RF-B1 `GET /games` con `?q=`/`?genre=`, `maxLength` 200/50, `additionalProperties:false`, regex id | **OK** | `apps/api/src/routes/games.ts:4-25` + tests `games.test.ts:42-95` (filtros, combinables, 400 por overlong) |
| RF-B2 `GET /games/:id` 200/404 | **OK** | `routes/games.ts:41-55` + test `games.test.ts:99-122` |
| RF-B3 10 juegos exactos | **OK con sustitución documentada** | `data/games.ts:17-248` (10 entradas). Sorcery → Dizzy documentado en backend-engineer.md (gap rojo) y en `acceptance-criteria.md`. Decisión defendible: WebFetch no localizó portada canónica de Sorcery Virgin Games 1984; Dizzy es CPC nativo, Codemasters, 1987, igual de icónico, con portada verificable. Cumple la cláusula del PRD §5 RF-B3 "puede ajustarse 1-2 con justificación documentada en el commit" |
| RF-B4 metadatos completos + descripción ≥200 chars + `coverUrl` con prefijo | **OK** | Suite dinámica `describe.each(GAMES)` con 11 `it` × 10 = 110 tests verdes. `coverUrl` con prefijo `/covers/games/` (test `games.test.ts:158-161`) |
| RF-B5 quote con outlet/year/quote no vacíos; url https si presente | **OK con vacuidad** | Test `games.test.ts:169-191` verde. 13 quotes totales, 0 con `url` → criterio se cumple pero **el `<a target=_blank rel=noopener>` no se ejercita en runtime hoy** |
| RF-B6 `GAME_GENRES` ordenado alfabéticamente | **OK** | `data/games.ts:254-256` + tests `games.test.ts:198-214` (3 tests) |
| RF-F1 `/games` lista 10 en grid responsive | **OK** | `app/games/page.tsx` + `components/games-grid.tsx:230-235` + E2E `header y navegación` |
| RF-F2 buscador con debounce 250ms | **OK** | `games-grid.tsx:67-90` (`setTimeout(...,250)` + AbortController) + E2E `buscador` |
| RF-F3 chips con `role=group`, `aria-label`, `aria-pressed`, `data-testid` | **OK** | `games-grid.tsx:166-194` + E2E 3 tests de chips |
| RF-F4 "Limpiar filtros" | **OK** | `games-grid.tsx:153-162, 95-98` + E2E `limpiar filtros` |
| RF-F5 card con portada/título/año/badge género + hover | **OK** | `components/game-card.tsx:20-63` |
| RF-F6 ficha con portada grande, H1, metadatos, descripción, quotes con `<figure>/<blockquote>/<cite>` y `<a target=_blank rel=noopener>` condicional | **OK estructural; código de enlace seguro no ejercitado** | `app/games/[id]/page.tsx:62-200` + smoke captures |
| RF-F7 `not-found.tsx` con link de vuelta | **OK** | `app/games/[id]/not-found.tsx:3-29` + E2E `404` |
| RF-F8 entrada "Games" en header | **OK** | `components/iron-deck-header.tsx:49-54` |
| RF-E1 paleta metalera coherente | **OK** | Verificado en código y en `smoke-games-list.png` |
| RF-E2 detalles retro (border-2, monospace, scanlines) | **OK** | Verificado en código y captures |
| RF-E3 hero "GAMES — AMSTRAD CPC 464/6128" | **OK** | `page.tsx:56-63` + `smoke-games-list.png` |

**Scope creep**: ninguno apreciable. El delta está acotado al alcance del PRD.

**Scope drop**: el RF-B5 sobre `quote.url` se cumple "por vacuidad" (ningún juego tiene `url` declarada). No es drop estricto (el PRD §10 R2 ya prevé que las URLs faltantes se documenten como gap rojo), pero merece quedar como recomendación para una iteración futura de muestreo en archive.org.

## Criterios cumplidos

Los siguientes [x] de `specs/acceptance-criteria.md` (sección iter-7) los **valido con mi propia verificación** sobre código + reportes + outputs literales:

- **Backend tipos y dataset (4/4)**: tipos exportados (`types/game.ts:11,38`), `GAMES`+`GAME_GENRES` (`data/games.ts:17,254`), schema verificable con regex y descripción ≥200 chars (suite dinámica 123/123), quotes con `outlet`/`year`/`quote` no vacíos (tests pasados).
- **Backend rutas (9/9)**: 10 entradas, filtros `?q=` / `?genre=` / combinables, `maxLength` correcto (test 400 verde), 404 con shape `{statusCode,error,message}`, rutas registradas en `app.ts:7,33`, suite backend 233/233 verde en 2.16s.
- **Frontend tipos y cliente (2/2)**: mirror `game-types.ts` con `GAME_GENRES as const` literal + `GameGenre` derivado; `games-api.ts` con `buildUrl` normalizando `genre="all"` y `q.trim()`, 404 → null. Duplicación de `buildUrl` aceptada como deuda preexistente: el orquestador y T4 lo declaran honestamente y consolidarlo arriesgaría regresiones en `/albums` y `/products`.
- **Frontend páginas (7/7)**: page.tsx server component con fallback `[]`, hero correcto, GamesGrid con buscador + chips + clear filters, GameCard con `border-2` + cinta de género, ficha con `<dl>` × 5 metadatos + descripción + quotes seguras, not-found, entrada "Games" en header. Verificado por inspección + capturas smoke.
- **Frontend estilo (2/2)**: paleta y detalles retro confirmados en código y en `smoke-games-list.png`/`smoke-game-detail.png`/`smoke-game-detail-2.png`.
- **Portadas (1/2)**: 10 archivos > 0 bytes existen, son imágenes reales (verificado con `file`: 5 JPG + 5 PNG renombrados a `.jpg`, mime sniffing del navegador absorbe la discrepancia). Validado además visualmente con smoke captures.
- **Tests E2E (2/2)**: spec con 10 casos (`games.spec.ts:34-349`), suite Playwright completa 38/38 en 1.8m con `--workers=1`, 0 regresiones sobre los 28 previos.
- **Smoke real (6/6)**: API:4000 vivo, web:3000 vivo, 4 URLs navegadas (lista, knight-lore, la-abadia-del-crimen, unknown-id-xxx), 43/43 network OK, 0 errores consola, 3 capturas en `reports/iter-7/` (no en raíz, deuda histórica resuelta).
- **Security gate (5/5)**: `npm audit` = 0 vulnerabilities en ambos paquetes, render condicional `<a target=_blank rel=noopener>` (`page.tsx:185-189`), 0 `http://` en dataset, 0 secretos en el delta, security-engineer aprueba con observaciones.

## Criterios pendientes o débiles

Los siguientes [ ] o [x] requieren matiz:

- **[ ] Smoke MCP de las 10 portadas devuelven 200/304** (criterio explícito `apps/web/public/covers/games/`): el orquestador marca `urlCount` global 43/43 OK sobre 3 URLs pero **no** se ha hecho un check de las 10 portadas individuales en una sola carga (la captura `smoke-games-list.png` muestra las 10 visualmente, lo cual es indicador fuerte). Acepto como cumplido **por evidencia visual** + por el 21/21 status 200 que sí cubre la página de listado completa. Bajaría el matiz a no bloqueante: si esta evidencia no satisface al humano en Fase 11, basta un `curl -I` adicional por portada.
- **[ ] Skill `review-pr` ejecutada / Veredicto APROBAR / reporte en `reports/iter-7/reviewer.md`**: este reporte cierra ese criterio. Pendiente queda solo la confirmación final del orquestador al marcarlo.
- **[ ] Auditoría criterio por criterio + tabla `criterio | evidencia | estado`**: tarea del orquestador en Fase 12.
- **[ ] `/ship` por humano**: fuera de mi mandato. No se invoca desde el agente.

Áreas donde la evidencia se sostiene pero conviene reforzar (no bloqueante):

- **R3 / código muerto — `<a>` de "Fuente"**: el render condicional `{quote.url && (...)}` (`page.tsx:185-195`) está correcto y bien securizado, pero **ningún quote tiene `url`** en el dataset, así que en runtime hoy no se ejercita. El test E2E (`games.spec.ts:293-302`) lo trata como "gate latente" — defendible. Yo no exigiría remediar en esta iteración; sí lo dejo como recomendación: añadir al menos 1-2 URLs verificables en archive.org/IA antes de cualquier release público para no quedar con código sin cobertura real.
- **R4 / quotes son paráfrasis de tono**: el orquestador documenta que las 13 citas son paráfrasis ceñidas al tono de los outlets reales (Amstrad Action, Crash, MicroHobby, CVG, Your Sinclair) en años plausibles, no transcripciones literales. **No exigiría transcripción verificada** para cierre interno (es coherente con el patrón seguido en `albums-reviews.ts` desde iter-4 y con la realidad de la prensa CPC parcialmente digitalizada). Sí señalo a sesión humana que esta decisión debe quedar **explícita en el commit** si el catálogo sale a producción pública, para que no se interprete como citación literal sin URL.
- **R4 / Sorcery → Dizzy**: la sustitución está justificada (portada canónica de Sorcery Virgin Games 1984 no localizable, el "Sorcery" que devuelve Wikipedia es Sony PS3 2012). Dizzy es CPC nativo, Codemasters, mismo periodo, igual de icónico. PRD §5 RF-B3 permite ajustar 1-2 con justificación documentada. **Acepto**.
- **R5 / portadas**: 5 son PNG con extensión `.jpg`. Es técnicamente correcto (mime sniffing) y está documentado. La box art de DOS para `la-abadia-del-crimen` y los flyers arcade para 4 portadas también están documentados. Aceptable para cierre interno; si el portal sale a público, conviene renombrar a la extensión real y/o sustituir flyers por inlays CPC específicos.

## Evidencia de tests

Acepto los siguientes outputs literales (pegados por el humano que opera el harness) como evidencia robusta:

- `cd apps/api && npx tsc --noEmit` → sin output. **Verde.**
- `cd apps/api && npm test` → `Test Files 4 passed (4)`, `Tests 233 passed (233)`, 2.16s. Reparto: 10 albums + 91 albums-review + 9 products + 123 games. **Verde.**
- `cd apps/web && npx tsc --noEmit -p tsconfig.json` → sin output. **Verde.**
- `cd apps/web && npx playwright test e2e/games.spec.ts --workers=1` → 10 passed (29.5s). **Verde.**
- `cd apps/web && npx playwright test --workers=1` → 38 passed (1.8m), 28 previos + 10 nuevos, 0 regresiones. **Verde.**
- `Get-NetTCPConnection -State Listen -LocalPort 4000,3000` → ambos `Listen` (PIDs 35120 / 29160). **API y web vivos.**
- `Invoke-RestMethod http://localhost:4000/games` → 10 entries. **OK.**
- `Invoke-RestMethod http://localhost:4000/games/knight-lore` → `knight-lore / Knight Lore`. **OK.**
- `Invoke-WebRequest http://localhost:4000/games/missing-id-xxx -SkipHttpErrorCheck` → 404. **OK.**
- Smoke captures (`smoke-games-list.png`, `smoke-game-detail.png`, `smoke-game-detail-2.png`) verificadas visualmente por mí con `Read` multimodal: las 10 portadas correctas, hero retro coherente, estructura DOM coincidente con T6-T8, scanlines discretas sin entorpecer lectura.
- `npm audit --audit-level=high` en api y web → `found 0 vulnerabilities`. **OK.**

**No identifico evidencia inflada ni invenciones.** El delta es coherente con todos los outputs reportados.

## Findings de seguridad

Resumo el reporte de `security-engineer` (`reports/iter-7/security-engineer.md`) con mi propia evaluación:

| ID | Sev. | Categoría | Mi opinión |
|---|---|---|---|
| SEC-07-01 | MEDIUM | Fair use editorial de portadas | **De acuerdo**: es riesgo legal no técnico. No bloquea cierre interno. Antes de release público requiere visado legal y/o sustitución por inlays oficiales con licencia. Que conste explícitamente en sesión humana. |
| SEC-07-02 | LOW | Sin headers globales CSP/HSTS/X-Frame-Options | **De acuerdo**: no es regresión introducida por iter-7. Es deuda transversal preexistente. Recomendable abordarla en una iteración dedicada de hardening (`@fastify/helmet` + `next.config.headers()`). No bloquea iter-7. |

El gate de seguridad **lo confirmo como APROBADO CON OBSERVACIONES**. No detecto findings adicionales que el security-engineer haya pasado por alto. Chequeos 1-10 (audit, secretos, https, schemas, CORS, error handler, portadas, XSS, alt, lockfiles) están exhaustivos y trazables a comandos. No reabro el gate.

## Riesgos

No bloqueantes (todos ya documentados y/o ya escalados):

- **RV-1** Riesgo legal/editorial de las 10 portadas (Wikipedia/CPC-Power, fair use). Mitigación: portal informativo, no venta de juegos. **Escalado** a aprobación humana antes de cualquier release público.
- **RV-2** 5 portadas son PNG renombrados a `.jpg`. Riesgo mínimo (mime sniffing absorbe), pero si una herramienta automatizada (CDN, optimizador) confía en la extensión podría fallar. Recomendación: en iter-8, renombrar a la extensión real o re-codificar a JPG.
- **RV-3** 13 quotes sin `url`. El render del enlace es seguro pero no se ejercita en runtime. Recomendación: muestreo en archive.org para al menos 1-2 citas en una iteración futura.
- **RV-4** `buildUrl` duplicado entre `albums-api.ts`, `games-api.ts` y `api.ts`. Deuda preexistente; consolidar en una iteración dedicada de tooling para no arriesgar regresiones en catálogos cerrados.
- **RV-5** Suite Playwright requiere `--workers=1` por API single-threaded en dev. Deuda heredada de iter-4. No bloqueante.

Bloqueantes: **ninguno**.

## Recomendaciones

| ID | Prioridad | Acción | Owner sugerido |
|---|---|---|---|
| REC-1 | bloquea cierre | Marcar el [ ] del reviewer en `acceptance-criteria.md` con la línea "Reporte en reports/iter-7/reviewer.md, veredicto APROBAR con observaciones" tras leer este reporte | orquestador |
| REC-2 | bloquea cierre | Producir la tabla `criterio \| evidencia \| estado` para la auditoría final (Fase 12) y pegarla en el reporte de cierre del orquestador | orquestador |
| REC-3 | bloquea cierre | Escalar SEC-07-01 (fair use de portadas) al humano en Fase 11 con redacción explícita: "interno OK; público requiere visado legal" | orquestador → humano |
| REC-4 | iter-8 / hardening | `@fastify/helmet` + `headers()` con CSP/HSTS en `next.config` (SEC-07-02). Iteración dedicada. | security-engineer + backend/frontend |
| REC-5 | iter-8 | Muestreo en archive.org de 2-3 URLs https para citas (`Amstrad Action`, `Crash`, `MicroHobby`) y añadirlas a `data/games.ts`. Ejercita el render del enlace seguro y refuerza la trazabilidad. | backend-engineer |
| REC-6 | iter-8 / cleanup | Renombrar a extensión real los 5 portadas PNG actualmente con `.jpg` (`chase-hq`, `la-abadia-del-crimen`, `operation-wolf`, `renegade` y, según `file`, una de las que figura como PNG). Alternativa: re-codificar a JPG | frontend-engineer |
| REC-7 | nice-to-have | Consolidar `buildUrl` en un único helper `lib/api.ts` reutilizado por `albums-api.ts`, `games-api.ts` y `api.ts`. Acompañado de tests para evitar regresión | frontend-engineer |
| REC-8 | nice-to-have | Sustituir las 4 portadas de flyers arcade por inlays CPC específicos cuando estén localizables (visado fair use sigue siendo el bloqueo real) | frontend-engineer |
| REC-9 | nice-to-have | Añadir un test smoke que verifique `HEAD /covers/games/<slug>.jpg` por las 10 portadas, para no depender de inspección visual de captures | qa-engineer |

## Próximos pasos para el orquestador

1. **Pegar este veredicto en el reporte de cierre** de Fase 11 (sin reformularlo: usa el bloque "Veredicto" + "Riesgos" + "Recomendaciones" tal cual). El humano debe ver claramente "APROBAR con observaciones" + lista de gaps escalados.
2. **Marcar los 2 últimos [ ] de la sección iter-7** en `acceptance-criteria.md`:
   - "Skill `review-pr` ejecutada. Veredicto APROBAR. Reporte en `reports/iter-7/reviewer.md`." → marcar con esta evidencia literal.
   - "Auditoría criterio por criterio en este archivo" → marcar cuando produzcas la tabla `criterio | evidencia | estado` mencionada en REC-2.
   - "Reporte final con tabla" → marcar al pegar la tabla.
   - "Usuario invoca `/ship`" → NO marcar; lo hace el humano.
3. **Antes de invocar `/ship`**, asegurarse de que el humano ha leído y aprobado SEC-07-01 (fair use de portadas). Esa decisión es el último gate humano antes del commit + PR.
4. **Crear tareas en backlog** para REC-4 (iteración de hardening), REC-5 (URLs de citas), REC-6 (mime extensions), REC-7 (consolidar buildUrl), REC-8 (inlays CPC), REC-9 (smoke de portadas). No abrirlas en esta iteración.
5. **No reabrir agentes** sobre iter-7. El delta está cerrado para aprobación humana.

Reporte en reports/iter-7/reviewer.md.
