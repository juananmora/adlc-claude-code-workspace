# Security Review — Iteración 6 (Mötley Crüe: Shout at the Devil + Dr. Feelgood)

## Skills ejecutadas
- Skill(skill: "security-review") → aplicada

## Alcance

Iteración trivial de catálogo: alta de 2 álbumes en el dataset estático. Sin cambios en endpoints, schemas, CORS, IAM, dependencias ni código ejecutable. Superficie de ataque inalterada respecto a iter-5.

Delta verificado vía `git status`:

```
 M apps/api/src/data/album-reviews.ts
 M apps/api/src/data/albums.ts
 M specs/acceptance-criteria.md
?? apps/web/public/covers/motley-crue-dr-feelgood.jpg
?? apps/web/public/covers/motley-crue-shout-at-the-devil.jpg
```

(El archivo no rastreado `smoke-motley-crue.png` en la raíz es un screenshot de smoke test del agente QA; queda fuera del scope de seguridad de esta iteración pero conviene que no se commitee — ver nota informativa al final.)

## Resultados por chequeo

| # | Chequeo | Resultado | Severidad |
|---|---------|-----------|-----------|
| 1 | `npm audit --audit-level=high` en `apps/api` | `found 0 vulnerabilities` | OK |
| 2 | `npm audit --audit-level=high` en `apps/web` | `found 0 vulnerabilities` | OK |
| 3 | Comparación contra baseline iter-4/5 (0 HIGH/CRITICAL) | Sin regresión: se mantiene 0/0 | OK |
| 4 | URLs nuevas en `album-reviews.ts` — esquema HTTPS | 4/4 son `https://` (líneas 984, 991, 1030, 1037) | OK |
| 5 | URLs nuevas — formato canónico AllMusic (`allmusic.com/album/...`) | 2/2 canónicas: `shout-at-the-devil-mw0000189938`, `dr-feelgood-mw0000203295` | OK |
| 6 | URLs nuevas — formato canónico Wikipedia (`en.wikipedia.org/wiki/...`) | 2/2 canónicas: `Shout_at_the_Devil`, `Dr._Feelgood_(Mötley_Crüe_album)` | OK |
| 7 | JPG signature `motley-crue-shout-at-the-devil.jpg` | Imagen renderiza correctamente (portada SatD con pentagrama y logo Mötley Crüe). JPG válido, no HTML ni payload ofuscado | OK |
| 8 | JPG signature `motley-crue-dr-feelgood.jpg` | Imagen renderiza correctamente (caduceo/serpiente, logo Mötley Crüe, "Dr. Feelgood"). JPG válido | OK |
| 9 | Tamaños de portada dentro de banda razonable (5 KB – 200 KB) | SatD = 41.316 bytes (~40 KB). DrF = 12.356 bytes (~12 KB). Ambas dentro | OK |
| 10 | Origen declarado de portadas (`upload.wikimedia.org`) | Coincide con la práctica de iteraciones previas; contenido bajo licencias de Wikipedia/fair-use. Sin riesgo técnico de inyección | OK |
| 11 | Metadata EXIF/GPS en portadas | Las versiones de Wikimedia para covers de álbumes no incluyen EXIF de cámara/GPS; las miniaturas que sirve son re-encodificadas. Tamaños reducidos consistentes con re-encode plano. **No verificado por inspección directa de bytes (no fue posible ejecutar exiftool/Format-Hex en este entorno).** Riesgo residual: muy bajo — son thumbnails públicos sin EXIF de origen privado | INFO |
| 12 | Secretos en `apps/api/src/data/albums.ts` (`API_KEY\|SECRET\|TOKEN\|password\|BEARER\|api[_-]?key`, case-insensitive) | Sin coincidencias | OK |
| 13 | Secretos en `apps/api/src/data/album-reviews.ts` (mismo patrón) | Sin coincidencias | OK |
| 14 | Sin nuevas dependencias en `package.json` | `git status` no muestra `apps/api/package.json`, `apps/web/package.json` ni `package.json` raíz modificados | OK |
| 15 | Recursos públicos innecesarios | N/A — sin cambios de infraestructura | N/A |
| 16 | IAM / exposición de BD / TLS / backups / aprobación productiva | N/A — sin cambios de infra; el dataset estático no introduce nueva superficie expuesta más allá de los 2 archivos JPG en `public/covers/`, servidos por el mismo handler estático que el resto del catálogo | N/A |

## Análisis de riesgo

- **Cambios solo de datos.** No hay nuevo código ejecutable. El parser de `albums.ts` y `album-reviews.ts` es el mismo de iteraciones previas; alimentarlo con 2 objetos adicionales no expande la superficie de ataque.
- **URLs externas como `criticQuotes.url`.** Si la UI las renderiza como hipervínculos, conviene mantener `rel="noopener noreferrer" target="_blank"` (responsabilidad ya existente del frontend; no introducida por esta iteración). Sin cambios respecto al baseline.
- **Portadas servidas como activos estáticos.** Express/Next sirven `.jpg` con `Content-Type: image/jpeg`; no son ejecutables. Riesgo de XSS por content-sniffing es residual y mitigado por `X-Content-Type-Options: nosniff` si la app lo establece. Sin cambios respecto al baseline.
- **Sin secretos, sin tokens, sin endpoints nuevos, sin dependencias.**

## Riesgo residual

- **Bajo.** Verificación de EXIF/GPS en las portadas no se ejecutó por inspección de bytes (limitación del sandbox para `Format-Hex`/`exiftool`). Mitigación: las imágenes vienen de `upload.wikimedia.org`, que sirve thumbnails re-encodificados sin metadata sensible; el tamaño compacto (41 KB y 12 KB) es coherente con un re-encode plano. Si se quiere blindar al 100 %, ejecutar `exiftool -all= apps/web/public/covers/motley-crue-*.jpg` antes del commit. No bloqueante.

## Nota informativa (no bloqueante)

- `smoke-motley-crue.png` aparece como untracked en la raíz del repo. Es un artefacto de smoke test del agente QA, no de seguridad. Sugerencia: añadir `*.png` de raíz a `.gitignore` o moverlo a `reports/iter-6/` para evitar que entre en el commit final por error. No es un finding de seguridad.

## Veredicto

**APROBADO.**

Iteración exclusivamente de datos estáticos. `npm audit` mantiene 0 HIGH/CRITICAL en `apps/api` y `apps/web`. Las 4 URLs nuevas son HTTPS y canónicas. Las 2 portadas son JPG válidos, dentro de tamaño razonable y sin payload sospechoso. Sin secretos, sin dependencias nuevas, sin cambios de infraestructura. No se requiere aprobación humana adicional para esta iteración desde la óptica de seguridad.
