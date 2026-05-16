# Security Engineer Report — Iteración 5

## Skills ejecutadas
- Skill(skill: "security-review") → aplicada

## Alcance

Revisión retrospectiva del commit `19cf5a7` (feat: filtro por género con chips en /albums), tomando como baseline el cierre de iter-4 en `286cdbc`.

Archivos del delta auditados:

- `apps/api/src/routes/albums.ts` (schema Fastify, nuevo query `genre`).
- `apps/api/src/data/albums.ts` (`findAlbums({genre})`, constante `GENRES`).
- `apps/api/tests/albums.test.ts` (4 tests nuevos).
- `apps/web/components/album-card.tsx` (`data-genre={album.genre}`).
- `apps/web/components/albums-grid.tsx` (estado `genre`, chips, `aria-pressed`).
- `apps/web/lib/album-types.ts` (`GENRES`, tipo `Genre`).
- `apps/web/lib/albums-api.ts` (`fetchAlbums` propaga `genre`, `buildUrl` excluye `"all"`).
- `apps/web/e2e/albums.spec.ts` (4 tests E2E nuevos).

Adicionalmente se revisó que `apps/api/src/app.ts` y `apps/api/src/config.ts` no hayan sido tocados en este commit (CORS sin cambios).

## Tabla de chequeos

| Chequeo | Resultado | Severidad |
|---|---|---|
| `npm audit --audit-level=high` en `apps/api` | 0 high, 0 critical, 0 moderate, 0 low (173 deps). Igual que baseline iter-4. | Ninguna |
| `npm audit --audit-level=high` en `apps/web` | 0 high, 0 critical, 0 moderate, 0 low (468 deps). Igual que baseline iter-4. | Ninguna |
| Validación de input — schema Fastify | `listQuerySchema` mantiene `additionalProperties: false`. `genre: { type: "string", maxLength: 50 }` se valida server-side; payloads no-string o > 50 chars son rechazados con 400 por Fastify antes de tocar `findAlbums`. | Ninguna |
| Inyección SQL | No aplica: backend es in-memory (`apps/api/src/data/albums.ts`). `findAlbums` compara strings con `===`. No hay SQL, ORM ni driver de BD en el camino del query param. | Ninguna |
| Inyección JS / eval | `findAlbums` solo hace `album.genre !== genre` (igualdad estricta). No hay `eval`, `Function()`, `new Function`, ni templating dinámico sobre el valor. | Ninguna |
| Payloads adversariales razonados — `?genre=<script>alert(1)</script>` | Rechazado por `maxLength: 50` (60 chars). Aunque pasara, sería string opaca contra `album.genre`; nunca coincide, devuelve `[]`. No se refleja en respuesta. | Ninguna |
| Payloads adversariales razonados — `?genre=' OR 1=1 --` | Pasa schema (longitud < 50). Comparado con `===` contra valores fijos de `album.genre`. Nunca coincide, devuelve `[]`. Sin SQL detrás, no escala. | Ninguna |
| Payloads adversariales razonados — `?genre=` (vacío) | El `if (genre && genre !== "all" && album.genre !== genre)` cae por el primer falsy: el filtro no se aplica, equivalente a no enviarlo. Comportamiento esperado. | Ninguna |
| Payloads adversariales razonados — chars unicode / NUL / control | Schema acepta cualquier string ≤ 50; comparación es `===` exacta contra valores estáticos de `GENRES`. No coincide, devuelve `[]`. Sin reflejo. | Ninguna |
| CORS no relajado en iter-5 | `apps/api/src/app.ts` no aparece en `git diff --name-only 286cdbc..19cf5a7`. `config.ts` tampoco. `origin: config.corsOrigin` se mantiene allowlist (sin wildcard, sin reflect). `credentials: false`. | Ninguna |
| Frontend XSS — `dangerouslySetInnerHTML` en archivos modificados | 0 matches en `apps/web/components/album-card.tsx`, `apps/web/components/albums-grid.tsx`. Grep en todo `apps/web` confirma que el repo no usa `dangerouslySetInnerHTML` en ninguna parte. | Ninguna |
| Frontend XSS — interpolación de `album.genre` y del estado `genre` | En `albums-grid.tsx`: `{g}` dentro de `<button>` (chip) y `data-testid={`genre-chip-${g.replace(...).toLowerCase()}`}`. Ambos son escape automático de JSX y string-literal de atributo. En `album-card.tsx`: `data-genre={album.genre}` como atributo, también escapado por React. Sin sinks peligrosos. | Ninguna |
| Frontend XSS — query param `genre` en URL del fetch | `buildUrl` usa `URLSearchParams.set(key, value)`, que aplica encoding correcto. El valor nunca se inyecta en el DOM como HTML. | Ninguna |
| Secretos hardcodeados en archivos modificados | 0 matches case-insensitive de `API_KEY|SECRET|TOKEN|password|BEARER|api_key|secret|bearer` en los 8 archivos del delta. | Ninguna |
| Nuevas dependencias introducidas | `git diff --name-only 286cdbc..19cf5a7` no incluye ningún `package.json` ni `package-lock.json`. Confirmado: cero deps añadidas. | Ninguna |
| `data-genre` como atributo del DOM | Refleja el valor del dataset interno controlado por el repo (uno de los 6 valores fijos de `GENRES`). No es PII ni dato sensible. Mismo patrón que el existente `data-band`. | Ninguna |
| Endpoint `GET /albums` | Read-only, sin auth (el catálogo es público por diseño). Sin cambios en esa decisión en iter-5. | Ninguna |
| Imágenes / Dockerfiles modificados | No hay archivos `Dockerfile*` ni manifests de contenedor en el delta. | No aplica |
| IaC / IAM modificados | No hay IaC en el delta. No aplica a este commit. | No aplica |
| TLS / Backups | Sin cambios en infra en este commit. Hereda postura iter-4. | No aplica |

## Razonamiento extendido sobre el query `genre`

1. **Capa schema (Fastify)**: `additionalProperties: false` impide colarse con propiedades fuera de `{q, band, genre}`. `type: "string"` rechaza arrays, objetos y números. `maxLength: 50` acota el ataque de payload grande (los valores válidos máximos como `"Progressive Metal"` o `"Symphonic Metal"` rondan 17 chars, así que 50 deja margen sin abrir DoS).

2. **Capa de filtrado (`findAlbums`)**: La condición es `if (genre && genre !== "all" && album.genre !== genre) return false`. Estricta igualdad contra valores del dataset estático. No hay regex construida con input, no hay `String.raw`, no hay `eval`, no hay propiedad dinámica accedida con bracket notation sobre el input.

3. **No-sanitización adicional** — análisis: aunque el dato no se sanitiza más allá del schema, **no es necesario** porque:
   - No se concatena en SQL/HQL/NoSQL (no hay BD).
   - No se interpola en HTML (la respuesta es JSON, el front renderiza solo `album.genre` del dataset propio, no el input crudo).
   - No se usa como key para acceso dinámico a objetos (potencial prototype pollution): el código compara con `===` campo a campo.
   - No se usa en `child_process`, `fs`, ni network egress.

4. **Riesgo residual aceptado**: cero. La superficie de ataque del nuevo parámetro está acotada por el schema y el patrón de comparación exacta. Si en el futuro `findAlbums` migrase a una BD real, habría que reevaluar (parametrizar queries), pero eso queda fuera del scope de esta revisión.

## Output literal de `npm audit`

### apps/api

```json
{
  "auditReportVersion": 2,
  "vulnerabilities": {},
  "metadata": {
    "vulnerabilities": { "info": 0, "low": 0, "moderate": 0, "high": 0, "critical": 0, "total": 0 },
    "dependencies": { "prod": 68, "dev": 106, "optional": 59, "peer": 0, "peerOptional": 0, "total": 173 }
  }
}
```

### apps/web

```json
{
  "auditReportVersion": 2,
  "vulnerabilities": {},
  "metadata": {
    "vulnerabilities": { "info": 0, "low": 0, "moderate": 0, "high": 0, "critical": 0, "total": 0 },
    "dependencies": { "prod": 72, "dev": 360, "optional": 60, "peer": 0, "peerOptional": 0, "total": 468 }
  }
}
```

## Findings

Ninguno. No se detectan vulnerabilidades CRITICAL, HIGH, MEDIUM ni LOW asociadas al delta de iter-5.

## Mitigaciones aplicables / recomendaciones de seguimiento (no bloqueantes)

- Considerar restringir `genre` a un `enum` en el schema Fastify (los 6 valores de `GENRES`) en una iteración futura. Es defense-in-depth: hoy `maxLength: 50` + comparación exacta ya hace que cualquier valor inválido devuelva `[]` sin daño, pero un enum daría 400 explícito y haría el contrato auto-documentado. Riesgo residual sin esta mejora: nulo a corto plazo.
- Mantener la práctica de no añadir `dangerouslySetInnerHTML` en componentes nuevos. El repo está limpio hoy; conviene preservarlo.

## Veredicto

**APROBADO.**

Motivo: el delta de iter-5 no introduce dependencias nuevas (audit sigue en 0 HIGH/0 CRITICAL en ambos apps), el nuevo query `genre` está validado por schema Fastify con `additionalProperties: false` y `maxLength: 50`, se compara con igualdad estricta contra un dataset estático en memoria (sin SQL, sin eval, sin sinks de DOM), CORS no se ha relajado (`apps/api/src/app.ts` no está en el diff), no hay secretos hardcodeados en los archivos modificados, y el frontend no usa `dangerouslySetInnerHTML` en ninguna parte. El nuevo `data-genre` solo refleja valores controlados del catálogo. El cierre retrospectivo del gate de seguridad de iter-5 es válido.
