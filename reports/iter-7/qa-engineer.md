# QA Engineer — Iteración 7 / T9 (Playwright /games)

## Skills ejecutadas
- Skill(skill: "generate-tests") → aplicada. Derivé los casos desde
  `specs/acceptance-criteria.md` (sección "Catálogo Games — Amstrad
  CPC (iteración 7)") y los contratos DOM descritos por T6-T8. Cobertura
  E2E para listado, buscador, chips de género, limpiar filtros, ficha y
  404. Gaps documentados (sin URLs de prensa en el dataset actual).

## Resumen

Añadido `apps/web/e2e/games.spec.ts` con 10 casos Playwright que cubren
los criterios funcionales E2E del catálogo `/games`. El spec espeja la
estructura de `albums.spec.ts` (describe agrupados, `waitForResponse`
armado antes del `fill()/click()`, `expect.poll` para conteo de DOM),
respeta `workers=1` y no toca config ni otros specs. Sin tests
ejecutados localmente (Bash denegado por sandbox — el orquestador los
lanza).

## Archivos creados

- `apps/web/e2e/games.spec.ts` — único entregable.
- `reports/iter-7/qa-engineer.md` — este reporte.

## Archivos modificados

Ninguno. Frontend, backend, config Playwright y resto de specs no se
han tocado (T9 es solo creación del spec).

## Salida literal de `playwright test e2e/games.spec.ts`

**NO EJECUTADO**. El entorno bloquea `Bash` para ejecuciones distintas
de las predefinidas; intenté `npx playwright test e2e/games.spec.ts
--workers=1` y se rechazó. El orquestador debe lanzarlo. Comando
exacto:

```powershell
cd apps\web
npx playwright test e2e/games.spec.ts --workers=1
```

Expectativa: **10 passed** (1 describe header + navegación, 1 buscador,
3 chips, 1 limpiar, 3 ficha, 1 404).

## Salida literal de la suite completa `playwright test`

**NO EJECUTADO** (misma razón). Comando:

```powershell
cd apps\web
npx playwright test --workers=1
```

Expectativa: 28 previos (albums.spec.ts + cart.spec.ts +
catalog.spec.ts + home.spec.ts + product-detail.spec.ts +
responsive.spec.ts) + 10 nuevos del spec de games ≈ ~38 passed. El
número exacto de los previos lo conoce el orquestador; mi spec no
modifica ninguno.

## Decisiones tomadas

### Estructura `test.describe`

Cinco grupos temáticos para que el output de Playwright sea legible y
que un fallo se aísle al área que cubre:

1. `header y navegación` — link "Games" en el header.
2. `buscador` — debounce + filtrado por título.
3. `chips de género` — selección, toggle off, combinación con buscador.
4. `limpiar filtros` — reset agrupado.
5. `ficha de juego` — estructura DOM (h1, dl, descripción, quotes).
6. `404` — not-found.

### `beforeEach` único

Cada test parte de `/games` con region visible y al menos 10
game-cards. Igual patrón que `albums.spec.ts` (poll del count >= N).
Esto:
- Garantiza que el SSR ha hidratado antes de cualquier interacción.
- Evita races con el primer fetch del client `useEffect` que también
  hace `fetch /games` (sin filtros, mismo resultado, idempotente).

El beforeEach también es el `goto("/games")` que el test del link de
header sobrescribe con su propio `page.goto("/")`. Idéntico patrón al
test "menú 'Discos' del header lleva a /albums" en `albums.spec.ts`.

### Sincronización: `waitForResponse` vs poll de DOM

- **Activación de filtro (click chip o fill search)**: `waitForResponse`
  ARMADO antes de la acción. Filtro por `r.url().includes("/games?")
  && r.url().includes("genre=Aventura"|`q=knight`...)`. Esto resuelve
  el debounce 250ms sin sleep.
- **Desactivación de chip / "Limpiar filtros"**: NO usamos
  `waitForResponse`. Cuando el filtro vuelve a "all", el componente
  excluye `genre=all` de la URL (ver `games-grid.tsx` línea 75 y
  `games-api.ts` buildUrl) — la nueva request es `/games` sin query,
  indistinguible de un re-fetch idempotente. Esperamos por cambio
  visible: `aria-pressed="false"` en el chip + `aria-pressed="true"`
  en "Todos" + poll de `count() === 10`. Mismo razonamiento aplicado
  en `albums.spec.ts` líneas 358-373 y 442-457.

### Conteos exactos en assertions

Después de medir el dataset:
- Total sin filtros: **10** juegos. Usado `.toBe(10)`.
- "Aventura isométrica": **3** juegos. Usado `.toBeGreaterThanOrEqual(2)`
  por defensividad (3 está documentado en el dataset, pero si una
  fixture cambia me da margen sin volver falso).
- "knight": **1** juego (knight-lore). Usado `.toBe(1)` + verificación
  de `data-game-id="knight-lore"`.

### Verificación del `<dl>` con `toHaveCount(5)`

Pedido explícitamente en el contrato: NO acoplar a textos exactos de
`<dt>` ("Año", "Desarrollador", "Editor", "Género", "Sistema"). Esto
es un test de *contrato estructural*, no de copy. Si el orden o el
copy cambia, el test sigue verde mientras los 5 metadatos sigan ahí.

### Verificación de descripción >= 200 chars

Tomado como criterio del PRD (las descripciones deben ser sustantivas,
no placeholders). Las 10 descripciones reales en el dataset cumplen
holgadamente (>= 400 chars cada una verificado en
`apps/api/src/data/games.ts`). Si alguien las acorta por error, el
test cae.

### Verificación condicional de enlaces de prensa

El criterio funcional es "si hay enlace externo, debe ser
`target="_blank"` + `rel="noopener"`. La realidad del dataset es que
ninguna cita actual tiene `quote.url`. El test:
- NO exige `linkCount >= 1` (sería un fail falso por gap de dataset).
- SÍ verifica la condición para cada link si los hay.

Esto convierte el test en un *gate de seguridad latente*: el día que
se añadan URLs, ya hay test ejercitándose sin cambios.

### Casos extra sobre los obligatorios

He mantenido los 10 casos obligatorios sin añadir más; añadir
duplicados (ej. otro género) habría inflado la suite sin reforzar
cobertura. La cobertura de "shoot 'em up", "beat 'em up", etc. queda
implícita por el patrón general del componente, validado ya en el
caso "Aventura isométrica" y por el toggle off (que ejercita ambos
caminos: activate + deactivate).

## Gaps rojos

| Gap | Motivo | Mitigación propuesta |
|---|---|---|
| Tests no ejecutados localmente | Bash bloqueado para `npx playwright test` en mi sandbox | Orquestador ejecuta y pega salida literal en su cierre |
| Dataset sin `quote.url` en ningún juego | Confirmado en `apps/api/src/data/games.ts` (greps de `url:` dentro de `quotes` → 0 matches) | Test 8 verifica la condición pero no exige presencia. Anotar como deuda de contenido para una iteración futura si quieres ejercitar el render de "Fuente →" |
| No hay smoke visual con Chrome DevTools MCP | Fuera del alcance de T9 (solo spec Playwright) | Smoke lo gestiona el orquestador en Fase 9 |
| Sin assertion sobre numérico exacto en "Aventura isométrica" (uso `>=2` en vez de `===3`) | Defensividad ante cambios menores del dataset | Si quieres mayor rigor: cambiar a `.toBe(3)` en el test 3, riesgo aceptable porque la fixture es estable |

## Próximos pasos para el orquestador

1. **Ejecutar `npx playwright test e2e/games.spec.ts --workers=1`** desde
   `apps/web` con API en :4000 y web en :3000. Esperado: 10/10 verde.

2. **Ejecutar `npx playwright test --workers=1`** (suite completa).
   Esperado: 0 regresiones en albums/cart/catalog/home/product-detail/
   responsive + 10 nuevos verdes.

3. Si algún test falla:
   - **404 test**: si el render de not-found no monta `h1` con
     "Juego no encontrado", revisa `apps/web/app/games/[id]/
     not-found.tsx`. Confirmado por lectura del archivo: h1 exacto
     "Juego no encontrado", link "Volver a Games" → "/games". Si
     Next.js sirve el not-found global en lugar del de `[id]`, mira
     que `notFound()` se llame antes del return.
   - **header test**: si el link "Games" no existe en md+, comprueba
     que `apps/web/components/iron-deck-header.tsx` lo expone (lo hace,
     verificado).
   - **search test**: si la URL no contiene `q=knight`, comprobar que
     `games-api.ts` no haya mutado el contrato de query params.

4. Tras suite verde, **NO marcar checkboxes** en
   `specs/acceptance-criteria.md` — eso lo hace el orquestador en
   Fase 8 con la tabla de evidencias.

5. **Reviewer (Fase 10)** debe confirmar que cada caso del spec
   corresponde 1:1 a un criterio de aceptación de T9 y que las
   decisiones de sincronización (waitForResponse vs poll) son
   defendibles.

Reporte en reports/iter-7/qa-engineer.md.
