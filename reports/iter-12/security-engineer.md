# Security engineer — iter-12 (área `tours`)

## Skills ejecutadas
- Skill(skill: "security-review") → aplicada (checklist completo sobre las áreas tocadas: dependencias, secretos, API Fastify, frontend Next, fair use; IaC y `.github/workflows/**` no se relanzaron porque la iter-12 no los modifica, y se confirmó con `git status` que solo cambia `apps/**`, `openspec/**`, `reports/iter-12/**` y skills/agents).

## Resumen ejecutivo

Iteración limpia desde el punto de vista de seguridad. La nueva área `/tours` reproduce exactamente el patrón hardening de `/consoles` (iter-10) y `/games`: schemas Fastify con `additionalProperties:false` + `maxLength` + `pattern` en path param, `encodeURIComponent` en el cliente, `next/image` para los carteles, sin `dangerouslySetInnerHTML` ni `eval`. Sin findings nuevos.

**Conteo: 0 CRITICAL / 0 HIGH / 0 MEDIUM / 2 LOW**

## Tabla de findings

| ID | Severidad | Área | Hallazgo | Evidencia | Recomendación | Estado |
|---|---|---|---|---|---|---|
| SEC-12-L01 | LOW | Frontend / fair-use | Las 10 entradas nuevas de `credits.ts` (kind="tour") apuntan a la página de Wikipedia de la gira o del álbum promocionado, pero los carteles son placeholders generados in-house en iter-12 (no portadas oficiales). El `sourceUrl` por sí solo no aclara que la imagen mostrada NO es la cubierta canónica, sólo el `note` lo dice. Riesgo bajo: un usuario que llegue a `/about` sólo viendo el link podría asumir que la imagen viene de Wikipedia. | `apps/web/lib/credits.ts:345-444` (los 10 entries de tour llevan `note: "Cartel placeholder (iter-12)..."` pero el `sourceUrl` apunta a la página textual de la gira en Wikipedia). | En iter futura: o (a) sustituir placeholders por la cartelería oficial de cada gira y actualizar `sourceUrl`, o (b) cambiar el `sourceUrl` a `""`/`null` cuando sea placeholder propio y dejar sólo `note` como atribución. No bloquea: el `note` ya cumple el espíritu del fair-use al hacer explícita la procedencia. | Deuda documentada. |
| SEC-12-L02 | LOW | API / observabilidad | El handler 404 de `GET /tours/:id` ecoa el `id` validado por regex `^[A-Za-z0-9_.-]+$` en el cuerpo de respuesta (`message: \`Tour '<id>' no encontrado\``). El pattern ya elimina vectores XSS/CRLF clásicos, y el handler responde JSON (no HTML), pero el eco puede facilitar enumeración exhaustiva (no es vulnerabilidad explotable, sí un olor a defensive logging). | `apps/api/src/routes/tours.ts:48-54`. | A coste cero: aceptar como deuda. Si en el futuro se monta rate-limit global (deuda heredada de iter-7+), aplicar a `/tours/:id` igual que al resto. | Aceptado como deuda — mismo patrón que `/albums/:id`, `/games/:id`, `/consoles/:id`. |

## Checks ejecutados — outputs literales

### 1. `npm audit --audit-level=high` (apps/api)
```
found 0 vulnerabilities
---EXIT:0---
```

### 2. `npm audit --audit-level=moderate` (apps/api)
```
found 0 vulnerabilities
```

### 3. `npm audit --audit-level=high` (apps/web)
```
found 0 vulnerabilities
---EXIT:0---
```

### 4. `npm audit --audit-level=moderate` (apps/web)
```
found 0 vulnerabilities
```

### 5. Búsqueda de secretos hardcodeados

`git grep -nE "(AKIA|ASIA|AIza|sk_live|ghp_|gho_|github_pat_|-----BEGIN)" -- apps openspec`
```
(sin matches)
```

`git grep -nE "(password|secret|api_key|token)\s*[:=]\s*['\"][^'\"]{8,}" -- apps/api/src apps/web/lib apps/web/app apps/web/components`
```
(sin matches)
```

### 6. Archivos `.env*` versionados

`git ls-files -- ".env*" "*.envrc"`
```
(sin matches)
```

`.env.local` existe en `apps/web/` pero está cubierto por `.gitignore` (`.env.local` en la línea correspondiente). `git check-ignore apps/web/.env.local` lo confirma. Su contenido es `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` — no credencial. `.env.example` en `apps/api/` y `apps/web/` sólo declara `PORT`, `CORS_ORIGIN` y `NEXT_PUBLIC_API_BASE_URL` con valores de dev — no son secretos.

### 7. XSS / patrones peligrosos en frontend

`git grep -nE "dangerouslySetInnerHTML|\beval\(|new Function\(" -- apps/web`
```
(sin matches)
```

Confirmado: ni en los componentes nuevos (`tour-card.tsx`, `tours-grid.tsx`, `app/tours/page.tsx`, `app/tours/[id]/page.tsx`, `app/tours/[id]/not-found.tsx`, `app/tours/layout.tsx`) ni en el resto del frontend hay `dangerouslySetInnerHTML`, `eval()` ni `new Function()`. Todo el render pasa por interpolación segura de JSX y `next/image`.

### 8. `target="_blank"` sin `rel`

`git grep -n 'target="_blank"' -- apps/web` — todas las apariciones llevan `rel="noopener noreferrer"` en la línea siguiente:

```
apps/web/app/about/page.tsx:72  →  rel="noopener noreferrer" (line 73)
apps/web/app/about/page.tsx:194 →  rel="noopener noreferrer" (line 195)
apps/web/app/about/page.tsx:207 →  rel="noopener noreferrer" (line 208)
apps/web/app/about/page.tsx:253 →  rel="noopener noreferrer" (line 254)
apps/web/app/albums/[id]/page.tsx:227 →  rel="noopener noreferrer" (line 228)
apps/web/app/games/[id]/page.tsx:188  →  rel="noopener noreferrer" (line 189)
```

`tour-card.tsx`, `tours-grid.tsx`, `app/tours/page.tsx` y `app/tours/[id]/page.tsx` NO introducen ningún `<a target="_blank">` nuevo: los enlaces a fuente externa no estaban en el alcance del spec de tours (no existe campo `url`/`source` en `Tour` interface). Sin riesgo de tabnabbing.

### 9. Validación de input en `routes/tours.ts`

Inspección de `apps/api/src/routes/tours.ts`:

- `listQuerySchema`:
  - `additionalProperties: false` (rechaza extras).
  - `q`: `type:"string"`, `maxLength: 200`. OK.
  - `decade`: `type:"string"`, `maxLength: 4`. OK.
  - `band`: `type:"string"`, `maxLength: 80`. OK.
- `idParamSchema`:
  - `additionalProperties: false`.
  - `id`: `type:"string"`, `minLength: 1`, `maxLength: 128`, `pattern: "^[A-Za-z0-9_.-]+$"`. OK — bloquea path traversal (`../`), control chars y la práctica totalidad de payloads XSS reflejados.
- 404 handler local: shape `{ statusCode, error, message }` sin stack trace. OK.
- Handler 500 global en `app.ts:39-49` también devuelve shape `{ statusCode, error, message }` sin stack. OK.
- `setNotFoundHandler` global en `app.ts:51-57` confirma shape canónico para rutas inexistentes.

### 10. `tours-api.ts` (frontend HTTP client) y `tour-card.tsx`

- `apps/web/lib/tours-api.ts:58`: `\`/tours/\${encodeURIComponent(id)}\`` → OK.
- `apps/web/lib/tours-api.ts:2,24`: usa `resolveApiBase()` de `lib/api.ts` (no hardcodea URL). OK — defensa del bug DEC-005 (SSR Docker) cubierta.
- `apps/web/components/tour-card.tsx:36`: `\`/tours/\${encodeURIComponent(t.id)}\`` → OK aun cuando `t.id` ya cumple la regex en el dataset (defensa en profundidad).
- `tours-grid.tsx:59-63`: enviá `q`, `decade` por la API que ya valida en backend. Trim + normalización defensiva (`String(decade)`) y `AbortController`. OK.

### 11. SSR Docker (defensa DEC-005)

`tours-api.ts` importa y usa `resolveApiBase()` (línea 2 + línea 24). En `apps/web/lib/api.ts:18-25` la función detecta `typeof window === "undefined"` y prefiere `API_BASE_URL_INTERNAL` en SSR — comportamiento idéntico al patrón consoles/games/albums. Si se despliega vía `docker compose`, el server component de `/tours` y `/tours/[id]` usará `http://api:4000` (DNS interno). OK.

### 12. CORS

`apps/api/src/app.ts:23-27`:
```ts
await app.register(cors, {
  origin: config.corsOrigin.length === 0 ? false : config.corsOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: false,
});
```
- `origin` se lee de `config.corsOrigin` (env `CORS_ORIGIN`, default `http://localhost:3000` en `.env.example`).
- `credentials: false`, no se exponen cookies.
- No se usa `*`. OK — sin cambio respecto a iter-11.

### 13. Fair use / `credits.ts`

Inspección de `apps/web/lib/credits.ts:345-444`: las 10 entradas nuevas (`kind: "tour"`) contienen los 4 campos requeridos por la skill (`author`, `publisher`, `year`, `sourceUrl`) más `note` aclarando la naturaleza placeholder del cartel. La estructura es coherente con las 32 entradas previas (22 álbumes + 10 juegos).

| Entrada | author | publisher | year | sourceUrl | note |
|---|---|---|---|---|---|
| world-slavery-tour | Iron Maiden | EMI / Sanctuary | 1984 | wikipedia.org/World_Slavery_Tour | placeholder |
| monsters-of-rock-86 | Van Halen / Scorpions / Ozzy | Monsters of Rock | 1986 | wikipedia.org/Monsters_of_Rock | placeholder |
| damaged-justice-tour | Metallica | Elektra | 1988 | wikipedia.org/Damaged_Justice_Tour | placeholder |
| clash-of-the-titans | Slayer / Megadeth / Anthrax | Clash of the Titans | 1990 | wikipedia.org | placeholder |
| cowboys-from-hell-tour | Pantera | Atco | 1990 | wikipedia.org/Cowboys_from_Hell | placeholder |
| use-your-illusion-tour | Guns N' Roses | Geffen | 1991 | wikipedia.org/Use_Your_Illusion_Tour | placeholder |
| black-album-tour | Metallica | Elektra | 1991 | wikipedia.org/Wherever_I_May_Roam_Tour | placeholder |
| ozzfest-1996 | Ozzy Osbourne | Ozzfest | 1996 | wikipedia.org/Ozzfest | placeholder |
| iowa-world-tour | Slipknot | Roadrunner | 2001 | wikipedia.org/Iowa_(album) | placeholder |
| judas-priest-redeemer | Judas Priest | Epic | 2008 | wikipedia.org/Nostradamus | placeholder |

10 archivos placeholder confirmados en `apps/web/public/covers/tours/` (`*.jpg`). Ver SEC-12-L01 para deuda menor sobre la semántica del `sourceUrl` cuando la imagen es placeholder propio.

## Findings heredados vivos del iter-10 / iter-11

Revisado `reports/iter-11/security-engineer.md`: cierre con `0 CRITICAL / 0 HIGH`. No hay deuda HIGH/CRITICAL viva arrastrada. Las deudas LOW/MEDIUM previas (rate-limit global, observability) siguen abiertas como deuda conocida del proyecto y no son introducidas ni agravadas por iter-12.

## Veredicto final

**APROBADO**

- 0 findings CRITICAL.
- 0 findings HIGH.
- 0 findings MEDIUM.
- 2 findings LOW documentados como deuda no bloqueante (SEC-12-L01 atribución placeholder, SEC-12-L02 echo de id en 404 — patrón heredado).
- Sin secretos en código, sin vulnerabilidades en deps, sin XSS sinks introducidos, sin CORS abierto, schemas con `pattern` + `maxLength` + `additionalProperties:false`, `encodeURIComponent` en path params dinámicos, `target="_blank"` con `rel="noopener noreferrer"` en todas las apariciones del frontend, SSR Docker resuelto vía `resolveApiBase()`.

La iter-12 puede continuar a la Fase 8 (auditoría cruzada) y Fase 10 (reviewer).
