# Security Gate — iter-7 (Catálogo Games — Amstrad CPC)

## Skills ejecutadas
- Skill(skill: "security-review") → aplicada. Checklist canónico recorrido punto por punto sobre el delta de iter-7. Los chequeos 1 y 10 se toman de la preverificación del orquestador (resultado literal pegado abajo).

## Resumen ejecutivo

Veredicto general: **APROBADO CON OBSERVACIONES**.

Conteo de findings:
- **0 CRITICAL**
- **0 HIGH**
- **1 MEDIUM** (riesgo legal/editorial sobre portadas, no técnico — ya documentado por el orquestador, se reitera como deuda no bloqueante)
- **1 LOW** (oportunidad de mejora: defensa en profundidad sobre headers de seguridad globales — fuera de alcance de iter-7)

El delta de aplicación (rutas, datos, frontend) está limpio: schemas Fastify con `additionalProperties: false`, `maxLength` y `pattern` correctos; sin secretos; sin `dangerouslySetInnerHTML`; sin `http://` en datos servidos; `<img>` con `alt` descriptivo; CORS conservado del fix de iter-6 (sin wildcards); `setErrorHandler` no filtra stacks; el único `<a target="_blank">` lleva `rel="noopener noreferrer"`. Ningún cambio en lockfiles ni dependencias.

El riesgo MEDIUM (portadas con fair use editorial) **no es bloqueante para cierre de iteración** (es deuda legal a confirmar antes de release público), y así estaba ya marcado por el orquestador en el reporte de cierre. Se escala a aprobación humana.

## Findings detallados

| ID | Severidad | Categoría | Descripción | Archivo:línea | Recomendación |
|---|---|---|---|---|---|
| SEC-07-01 | MEDIUM | Licencia / fair use | Las 10 portadas en `apps/web/public/covers/games/` provienen de Wikipedia bajo fair use editorial. Una (`la-abadia-del-crimen.jpg`) es box art de la versión DOS usada como sustituto del CPC inlay; `dizzy.jpg` cubre la sustitución de Sorcery → Dizzy ya documentada. Riesgo legal, no técnico. | `apps/web/public/covers/games/*.jpg` (10 archivos) | Confirmar fair use con stakeholder legal antes de release público. Mitigación: portal educativo/informativo sin venta de los juegos. Riesgo residual: bajo. NO bloqueante para cierre de iteración interna. |
| SEC-07-02 | LOW | Defensa en profundidad | No hay CSP / HSTS / X-Frame-Options configurados a nivel global de la API Fastify ni en el frontend Next. Fuera del alcance de iter-7 (no introducido por el delta), pero conviene listarlo como deuda transversal para una iteración de "hardening" futura. | `apps/api/src/app.ts` (sin `@fastify/helmet`); `apps/web/next.config.*` | Considerar `@fastify/helmet` en backend y `headers()` con CSP/HSTS en `next.config` en una iteración dedicada. No bloqueante. |

## Salida literal de comandos

### CHEQUEO 1 — npm audit (preverificación del orquestador, no re-ejecutado)

```
$ npm audit --audit-level=high  # cwd: apps/api
found 0 vulnerabilities

$ npm audit --audit-level=high  # cwd: apps/web
found 0 vulnerabilities
```

Tomo esta evidencia como válida. No re-ejecuto.

### CHEQUEO 2 — Secretos en código

Comando 1 (regex case-insensitive de patrones de secretos en el delta):
```
$ Grep pattern="(api[_-]?key|token|secret|password|bearer)" -i
  glob={apps/api/src/types/game.ts,apps/api/src/data/games.ts,apps/api/src/routes/games.ts,
        apps/api/src/app.ts,apps/api/tests/games.test.ts,
        apps/web/lib/game-types.ts,apps/web/lib/games-api.ts,apps/web/app/games/**/*.tsx,
        apps/web/components/game*.tsx,apps/web/components/iron-deck-header.tsx,
        apps/web/e2e/games.spec.ts}
No matches found
```

Comando 2 (regex de claves AWS / GitHub PAT / OpenAI / JWT):
```
$ Grep pattern="(AKIA|ghp_|sk-|eyJ[A-Za-z0-9_-]+\.eyJ)"
  glob={apps/api/src/**/*.ts, apps/api/tests/games.test.ts,
        apps/web/lib/game*.ts, apps/web/app/games/**/*.tsx,
        apps/web/components/game*.tsx, apps/web/components/iron-deck-header.tsx,
        apps/web/e2e/games.spec.ts}
No matches found
```

Comando 3 (archivos `.env*` añadidos en el delta):
```
$ Glob pattern="apps/**/.env*"
apps\api\.env.example
apps\web\.env.example
apps\web\.env.local

$ git log --oneline --all -- apps/web/.env.local apps/web/.env.example apps/api/.env.example
d1da6fb Initial commit: ADLC Claude Code workspace
```

Los tres archivos `.env*` existen desde el commit inicial — NO son nuevos en iter-7. Confirmado contra la PREVERIFICACIÓN del orquestador: `git diff --name-only HEAD ...` devolvió 0 archivos modificados.

Resultado: **0 secretos hardcodeados en el delta de iter-7. 0 nuevos `.env*` añadidos.**

### CHEQUEO 3 — URLs y enlaces externos

Subcheck 3a — `http://` en dataset servido:
```
$ Grep pattern="http://" path=apps/api/src/data/games.ts
No matches found
```
0 resultados. El criterio HTTPS se cumple **por vacuidad** (el dataset no contiene URLs externas; ninguno de los 10 juegos tiene `quote.url` declarada, según `data/games.ts` líneas 29-247). No es por presencia de https.

Subcheck 3b — `target="_blank"` + `rel="noopener noreferrer"` en ficha:
```
$ Grep pattern='target="_blank"|rel="noopener noreferrer"' path=apps/web/app/games/[id]/page.tsx
188:                      target="_blank"
189:                      rel="noopener noreferrer"
```
1 match de cada, en el mismo `<a>` (líneas 186-194). El render del enlace es **condicional**: envuelto en `{quote.url && (...)}` (línea 185). Como el dataset actual no incluye ninguna `quote.url`, este código está protegido pero **no se ejercita en runtime**. Cuando se añadan URLs en el futuro, ya cumple OWASP A05 (links externos seguros).

### CHEQUEO 4 — Validación de input (Fastify schemas)

`apps/api/src/routes/games.ts`:
- Líneas 4-11: `listQuerySchema` con `type:"object"`, `additionalProperties:false`, `q.maxLength=200`, `genre.maxLength=50`. **OK**.
- Líneas 18-25: `idParamSchema` con `id.minLength=1`, `id.maxLength=128`, `id.pattern="^[A-Za-z0-9_.-]+$"`, `additionalProperties:false`, `required:["id"]`. **OK**.

Comparado con `apps/api/src/routes/albums.ts` (patrón de referencia, líneas 4-26): equivalente. La única diferencia legítima es que albums acepta `band` (maxLength 100) y games no lo necesita. **0 divergencias problemáticas.**

### CHEQUEO 5 — CORS y error handler

`apps/api/src/app.ts`:
- Líneas 21-25: `app.register(cors, { origin: config.corsOrigin.length === 0 ? false : config.corsOrigin, methods: [...], credentials: false })`. **No wildcards `*`**. `credentials:false`. **OK**.
- Línea 33: `await app.register(gamesRoutes);` — única línea añadida en iter-7 (junto con el import en línea 7). Confirmado: ninguna modificación de CORS, sensible, error handler o not-found handler.

`apps/api/src/config.ts`:
- Líneas 34-37: `corsOrigin` por defecto = `"http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001"` — coincide exactamente con el fix de iter-6 (commit `73b5405 fix(e2e): permitir 127.0.0.1 en CORS de la API`). **No se ha relajado**.

Resultado: **0 findings**.

### CHEQUEO 6 — Headers de seguridad y manejo de errores

`apps/api/src/app.ts` líneas 35-45:
```ts
app.setErrorHandler((error: FastifyError, _request, reply) => {
    const statusCode = error.statusCode ?? 500;
    if (statusCode >= 500) {
      app.log.error(error);
    }
    reply.code(statusCode).send({
      statusCode,
      error: error.name || "Error",
      message: error.message || "Error inesperado",
    });
});
```

Solo envía `{ statusCode, error, message }`. **NO se filtra el stack** al cliente (el `error` log con stack queda solo en `app.log.error`, lado servidor). Mismo shape que iter-6. **OK**.

### CHEQUEO 7 — Portadas: licencia y origen

```
$ Glob pattern="apps/web/public/covers/games/*"
10 ficheros: head-over-heels.jpg, chase-hq.jpg, knight-lore.jpg, operation-wolf.jpg,
elite.jpg, renegade.jpg, boulder-dash.jpg, r-type.jpg, la-abadia-del-crimen.jpg, dizzy.jpg

$ find ... -printf "%s %p"
117325  boulder-dash.jpg
 43268  chase-hq.jpg
 28636  dizzy.jpg
 16325  elite.jpg
 29825  head-over-heels.jpg
175091  knight-lore.jpg
443096  la-abadia-del-crimen.jpg
173177  operation-wolf.jpg
 26521  r-type.jpg
 44862  renegade.jpg
```

10 ficheros, todos > 0 bytes (mínimo 16.3 KB, máximo 443 KB). **OK técnico**.

**Riesgo legal MEDIUM (SEC-07-01)**: fair use editorial. Ver tabla de findings.

### CHEQUEO 8 — Frontend: XSS, dangerouslySetInnerHTML

```
$ Grep pattern="dangerouslySetInnerHTML"
  glob={apps/web/lib/game*.ts, apps/web/app/games/**/*.tsx,
        apps/web/components/game*.tsx, apps/web/components/iron-deck-header.tsx}
No matches found
```

**0 matches.** Toda la renderización de campos del dataset (`{game.title}`, `{game.description}`, `{quote.quote}`, `{quote.outlet}`, `{quote.author}`, `{game.genre}`, etc.) usa interpolación JSX estándar — React escapa HTML por defecto. Verificado manualmente en `app/games/page.tsx`, `app/games/[id]/page.tsx`, `components/games-grid.tsx`, `components/game-card.tsx`.

### CHEQUEO 9 — Frontend: `<img>` y `alt`

```
$ Grep pattern="<img"
  glob={apps/web/app/games/**/*.tsx, apps/web/components/game*.tsx}
apps\web\components\game-card.tsx:34:          <img
apps\web\app\games\[id]\page.tsx:65:          <img
```

2 `<img>` en total. Inspección manual:
- `game-card.tsx:34-39`: `alt={\`Portada de ${game.title}\`}` — descriptivo y dinámico. **OK**.
- `app/games/[id]/page.tsx:65-69`: `alt={\`Portada de ${game.title}\`}` — descriptivo y dinámico. **OK**.

Ambos `<img>` además llevan `loading="lazy"` (card) y `object-cover` para evitar layout shift. La directiva `eslint-disable-next-line @next/next/no-img-element` es explícita y consciente.

### CHEQUEO 10 — Lockfiles (preverificación del orquestador, no re-ejecutado)

```
$ git diff --name-only HEAD -- apps/api/package-lock.json apps/web/package-lock.json apps/api/package.json apps/web/package.json
(sin output → 0 archivos modificados)
```

Confirmado: ninguna dependencia nueva ni cambio en lockfiles. La superficie de ataque de dependencias **no varía** respecto al estado base auditado en iteraciones anteriores.

## Deudas no bloqueantes

1. **SEC-07-01 — Portadas con fair use editorial**: las 10 portadas son de Wikipedia. Antes de release público requieren visado legal. Mitigación documental: portal educativo/informativo, sin venta de los juegos; sustitución Sorcery → Dizzy y uso de DOS box art para "La Abadía del Crimen" ya documentadas en el reporte de cierre. Riesgo residual: bajo.
2. **SEC-07-02 — Sin headers globales (CSP/HSTS/X-Frame-Options)**: no introducido por iter-7, pero recomendable abordarlo en una iteración futura de hardening (`@fastify/helmet` + `headers()` en `next.config`).
3. **Quotes sin `url` verificada**: los 10 juegos del dataset no incluyen `quote.url`. No es un finding de seguridad (el código que la renderiza ya está protegido con `target/rel` correctos), pero sí explica por qué el chequeo 3b "se cumple por código" pero no se ejercita en runtime.

## Próximos pasos para el orquestador

1. **Aceptar el gate como APROBADO CON OBSERVACIONES**. Ningún finding CRITICAL o HIGH; los 2 findings restantes (MEDIUM legal, LOW hardening) son deudas no bloqueantes ya conocidas.
2. **Confirmar con humano** la postura sobre SEC-07-01 (fair use de portadas) antes de cualquier release público. Para cierre de iteración interna basta con dejar el registro en este reporte.
3. **No requiere nueva intervención del security-engineer en iter-7**: no se detectaron findings que requieran remediación. Puede proceder al reviewer final (Fase 8) sin recircular por seguridad.
4. **Para iter-8 o iter-de-hardening** (opcional, no urgente): crear tarea para `@fastify/helmet` y `next.config headers()` con CSP/HSTS.

Reporte en reports/iter-7/security-engineer.md.
