## Skills ejecutadas
- Skill(skill: "security-review") → aplicada

## Alcance auditado

Iter-11 — delta estrecho de datos estáticos (catálogos `/albums` y `/games`) + assets binarios (portadas) + ajustes de tipos/tests/PRD. NO se modificó: infra (`infra/**`), workflows (`.github/workflows/**`), `package.json`/lockfiles, Dockerfiles, ni código de servidor Fastify (`app.ts`, `server.ts`, `routes/*`, `config.ts`). Confirmado por enumeración del delta indicado en el briefing — no se reabren controles ya validados en iter-9/10 (CORS, IAM, contenedores, deps).

Foco real de la auditoría: validaciones de contenido (URLs, secretos, XSS) y propiedad de los nuevos assets.

## Findings

| # | Severidad | Área | Hallazgo | Evidencia |
|---|---|---|---|---|
| 1 | OK | URLs en `album-reviews.ts` (Pantera) | Las 5 URLs nuevas en los entries `pantera-cowboys-from-hell` y `pantera-vulgar-display-of-power` son **todas `https://`** (AllMusic, Wikipedia ES/EN, Rolling Stone). No hay `http://` ni protocolos exóticos. | `album-reviews.ts:1076, 1083, 1122, 1129, 1136`. Test estructural `albums-review.test.ts` ya enforza `^https://` (Fase 6 qa). |
| 2 | OK | URLs en `games.ts` (C64) | Los 6 nuevos juegos C64 NO declaran campo `url` en sus `quotes` (igual que el resto del catálogo retro). No hay riesgo de enlace inseguro porque no hay enlace. | Grep `url:` sobre `games.ts` → 0 matches. Grep `http://` → 0 matches. |
| 3 | OK | Secretos hardcodeados | 0 ocurrencias de `password\|secret\|token\|api[_-]?key\|bearer\|AKIA\|ghp_\|sk_` (case-insensitive) en los archivos cambiados (`apps/api/src/data/*`, `apps/web/{e2e,app,lib}/...`). El único match del data dir es `pantera-vulgar-display-of-power` (substring "power", falso positivo). | Grep sobre `apps/api/src/data` y archivos cambiados de `apps/web`. |
| 4 | OK | Path de assets estáticos | Las 8 portadas nuevas (2 Pantera + 6 C64) viven bajo `apps/web/public/covers/` y `apps/web/public/covers/games/`. No escapan del root público. Los `coverUrl` se construyen vía helper `cover(slug)` que retorna literal `/covers/games/${slug}.jpg` — no acepta path traversal. El mapping de albums es un object literal `slug → "/covers/<file>"` (lookup, no concatenación con input externo). | `apps/api/src/data/games.ts:17`, `apps/api/src/data/albums.ts:39-40`, `ls public/covers` confirma ubicación. |
| 5 | LOW (preexistente, no nueva) | Extensión `.jpg` aunque fuente sea PNG | Las nuevas portadas se sirven como `.jpg` aunque algunas fuentes originales sean PNG en Wikipedia. Es **deuda REC-6 preexistente** desde iter-anteriores. No introduce vulnerabilidad (el browser detecta el MIME real; Next sirve binario sin transformar). | Convención previa, ya documentada como deuda. |
| 6 | OK | CORS / cabeceras Fastify | NO se ha tocado `app.ts` ni `config.ts`. Sigue vigente `origin: config.corsOrigin.length === 0 ? false : config.corsOrigin` (deny by default, allowlist explícita en pre/prod). | `apps/api/src/app.ts:22-23` sin cambios en este iter. |
| 7 | OK | Validación de input `band=Pantera` | El handler reutiliza el schema Fastify existente con `maxLength: 50` sobre el query param `band`. No se introduce un endpoint nuevo ni se relajan límites. El filtro es lookup exact-match contra el dataset estático, no se traduce a SQL/regex/eval. | `apps/api/src/routes/*` sin cambios; el dataset `albums.ts` añade `band: "Pantera"` (string literal). |
| 8 | OK | XSS via descripciones / quotes | Todas las descripciones (`description`, `criticQuotes[].quote`, `legacy`, `sound`, etc.) se renderizan como **text nodes** vía interpolación JSX (`{value}`), que React auto-escapa. NO hay `dangerouslySetInnerHTML`, NO hay `innerHTML`, NO hay `eval`/`new Function` en `apps/web`. Aunque un atacante pudiera inyectar markup en estas strings (no aplica: el dataset es estático y commiteado), no sería ejecutable. | Grep `dangerouslySetInnerHTML\|innerHTML\|eval(\|new Function` sobre `apps/web` → 0 matches. `app/albums/[id]/page.tsx:77, 203` y `app/games/[id]/page.tsx:121` usan `{value}`. |
| 9 | OK | Tabnabbing en enlaces externos (Pantera) | Los `<a href={q.url}>` para las quotes de Pantera reciben `target="_blank" rel="noopener noreferrer"` (mismo render compartido con todas las quotes). | `apps/web/app/albums/[id]/page.tsx:227-228`. |
| 10 | OK | Dependencias / imágenes / IaC / TLS / backups / IAM | Fuera de alcance del delta (no se tocó `package.json`, Dockerfiles, `infra/**`, `.github/workflows/**`). Se mantienen los controles validados en iters previos (iter-9 Docker hardening, iter-7 IaC review). | Briefing confirma archivos cambiados; no se vuelven a auditar dominios sin delta. |

## Checklist canónico (skill `security-review`)

| Ítem skill | Estado | Comentario |
|---|---|---|
| Secretos en código | OK | Finding #3. |
| Variables sensibles en logs | OK | No se añadieron logs en este iter. |
| IAM excesivo | N/A | Sin cambios en IaC. |
| Recursos públicos innecesarios | N/A | Sin cambios de exposición. |
| Base de datos expuesta | N/A | El proyecto sirve datasets estáticos en memoria; no hay BD. |
| Dependencias vulnerables | N/A | Sin cambios en `package.json`/lockfiles. Última `npm audit` válida en iter-9. |
| Imágenes vulnerables | N/A | Sin cambios en Dockerfiles. |
| Falta de TLS | OK | Todas las URLs externas nuevas son `https://`. |
| Falta de backups | N/A | Datasets estáticos versionados en git. |
| Falta de aprobación productiva | N/A | Este iter no toca pipelines de despliegue. |

## Origen de los assets (propiedad intelectual)

Las portadas se descargaron de `upload.wikimedia.org` (Wikipedia). Las portadas de álbumes y videojuegos suelen estar bajo **fair use** en Wikipedia (cover art identificativo). Para un uso comercial real haría falta licencia explícita o reemplazo por arte propio. Como el repo está marcado como demo educativa y no productiva, queda registrado aquí como **riesgo legal residual LOW**: si en algún momento se publica `/albums` o `/games` con tráfico abierto y monetización, hay que revisar derechos. Recomendación: añadir a `specs/iter-11-prd.md` o al README una nota de "covers used for identification, fair use, demo only". No bloquea esta iteración.

## Veredicto

**PASA.**

- 0 findings CRITICAL.
- 0 findings HIGH.
- 1 finding LOW preexistente (REC-6, extensión `.jpg`/PNG) — no nuevo en este iter.
- 1 riesgo legal residual LOW (fair use de portadas) — recomendación opcional, no bloqueante.

El delta es estrecho y consiste mayoritariamente en datos estáticos auditados visualmente. Los controles existentes (CORS deny-by-default, validación de schema Fastify, escape automático de React, helper de paths sin traversal) cubren las nuevas filas del dataset sin cambios. Puede continuar a Fase 8 (auditoría de criterios) y Fase 10 (reviewer).

## Recomendaciones (no bloqueantes)

1. Añadir nota de fair use sobre las portadas en `README.md` o en `specs/iter-11-prd.md`.
2. Cuando se reemplace REC-6, normalizar extensión real (`.jpg` vs `.png` vs `.webp`) en el helper `cover()` y en el mapping de albums.
3. (Ya en deuda) considerar firmar/hashear las portadas en CI para detectar swaps no autorizados — útil cuando crezca el catálogo.
