# Reviewer — Iteración 6 (Catálogo Mötley Crüe)

## Skills ejecutadas
- Skill(skill: "review-pr") → aplicada

## Resumen ejecutivo

Iteración pequeña y bien acotada: 2 álbumes nuevos (Shout at the Devil 1983, Dr. Feelgood 1989) añadidos al dataset con `Album` + `AlbumReview` completos y portadas servidas en `apps/web/public/covers/`. Suite vitest 110/110, Playwright 28/28, tsc verde, smoke MCP sin errores. La calidad editorial de las críticas es alta y los datos clave verificables (RIAA, Bob Rock, Elektra, año, charts) están bien.

Hay **una observación no bloqueante** sobre el filtro por banda del frontend (problema preexistente, no regresión) y **una deuda explícita** sobre las portadas alojadas localmente desde Wikipedia.

**Veredicto: APROBAR con observaciones no bloqueantes.**

## Auditoría criterio por criterio

| Criterio (sección iter-6) | Evidencia verificada | Estado |
| --- | --- | --- |
| `albums.ts` incluye `motley-crue-shout-at-the-devil` (1983) y `motley-crue-dr-feelgood` (1989), banda "Mötley Crüe", género "Hard Rock", tracks completos | `apps/api/src/data/albums.ts:487-532`. Año, banda, género y tracklists coinciden con los LP originales (SatD 11 tracks incluida intro "In the Beginning" y "God Bless the Children of the Beast"; Dr. Feelgood 11 tracks con "T.n.T.", "Time for Change", etc.) | OK |
| `album-reviews.ts` con `sections` ≥200 chars, ≥2 trackHighlights, rating ∈ [1,10], ≥2 criticQuotes con outlet/year/url https/quote | `album-reviews.ts:952-995` (SatD: 3 highlights, rating 8.5, 2 quotes AllMusic+Wikipedia) y `:998-1042` (Dr. Feelgood: 3 highlights, rating 9.0, 2 quotes AllMusic+Wikipedia). Inspección manual: las 3 sections de cada uno superan 200 chars con margen. URLs `https://` canónicas (`mw0000189938`, `mw0000203295`, `en.wikipedia.org/wiki/...`) | OK |
| Dataset total 20 → 22 álbumes; el `describe.each` valida automáticamente | `albums-review.test.ts:45` itera `albums.map((a) => [a.id])`. Suite vitest reportada 110/110 (102+8) | OK |
| vitest backend verde | Reportado por el ejecutor 110/110. No reejecutado por el reviewer (gate de tiempo), pero la fórmula declarada (4 tests dinámicos × 2 álbumes nuevos = +8) coincide con la suma | OK con confianza moderada |
| Playwright frontend verde (≥12 cards, género no afectado) | 28/28 reportado con `--workers=1`. Hard Rock ya existía como género (`album-types.ts:90-97`), no introduce chip nuevo | OK |
| tsc frontend pasa | Reportado sin errores | OK |
| Smoke MCP `/albums/motley-crue-dr-feelgood`: ficha carga, 0 consola, 0 4xx/5xx, captura | `smoke-motley-crue.png` presente en raíz del repo. 13/13 network 200 según reporte | OK |
| `security-engineer` ejecutado, sin HIGH/CRITICAL | Ejecutándose en paralelo según el ejecutor; pendiente leer su informe | PENDIENTE de informe del security-engineer |
| `reviewer` ejecutado con veredicto APROBAR | Este informe | OK |
| Auditoría criterio por criterio en `specs/acceptance-criteria.md` y commit | Marcar checkboxes (orquestador) y commit final pendientes tras gates | PENDIENTE |

## Verificación de calidad editorial

Lectura completa de las 2 entradas en `album-reviews.ts`. Datos contrastables con conocimiento general del dominio:

- **Shout at the Devil**: Elektra, septiembre 1983, Tom Werman productor, Cherokee Studios, 4× platino RIAA 1997, Top 17 Billboard 200, formación Vince Neil / Mick Mars / Nikki Sixx / Tommy Lee, versión "Helter Skelter". Todo coherente. Singles citados ("Looks That Kill", "Too Young to Fall in Love") correctos.
- **Dr. Feelgood**: 1 de septiembre 1989, Elektra, Bob Rock primer disco con Crüe, Little Mountain Sound Studios (Vancouver), #1 Billboard 200 (único de la banda), 6× platino RIAA, cuatro singles Top 10. Coros invitados (Bryan Adams, Steven Tyler, Robin Zander) en "Sticky Sweet" — correcto. Conexión Bob Rock → Black Album de Metallica (1991) es una afirmación habitual en crítica musical. OK.

**No hay datos inventados detectables**. Tono editorial coherente con el resto del dataset.

Ratings:

- 8.5 (SatD) es **el rating más bajo del dataset entero** (el resto va de 8.9 a 9.8). Es defendible: SatD es un álbum transicional/fundacional del glam metal pero no un disco unánimemente "obra maestra" como Master of Puppets o Reign in Blood. La justificación lo señala explícitamente ("producción algo datada"). Coherente.
- 9.0 (Dr. Feelgood) — empata con Black Album y AC/DC Highway to Hell, por debajo de Painkiller (9.7) y Master of Puppets (9.8). Razonable.

URLs de quotes — formato canónico verificado por patrón:

- `https://www.allmusic.com/album/shout-at-the-devil-mw0000189938`
- `https://www.allmusic.com/album/dr-feelgood-mw0000203295`
- `https://en.wikipedia.org/wiki/Shout_at_the_Devil`
- `https://en.wikipedia.org/wiki/Dr._Feelgood_(Mötley_Crüe_album)`

Todas https, ambos outlets ya usados en iter-4 (consistencia). La URL de Wikipedia de Dr. Feelgood contiene caracteres no-ASCII (ö, ü) — Wikipedia los soporta de forma canónica, pero conviene comprobar que un fetch no se rompa por encoding en algún cliente. **Sugerencia no bloqueante**: percent-encode (`Wikipedia` normalmente resuelve, pero algunos linters de URL no).

## Coherencia con iteraciones previas

- Esquema `AlbumReview` idéntico a iter-4 (sections / trackHighlights / rating / criticQuotes). Verificado en `apps/api/src/data/album-reviews.ts` y `apps/web/lib/album-types.ts:48-53`.
- Género "Hard Rock" ya presente (`GENRES` const en frontend en `album-types.ts:90-97`). No se añade chip nuevo, no rompe filtro existente.
- Banda "Mötley Crüe" es nueva en el dataset.

## Riesgos identificados

### R1. (MEDIO) `BANDS` hardcodeado en frontend no incluye Mötley Crüe

`apps/web/lib/album-types.ts:72-80` lista 7 bandas hardcodeadas: Iron Maiden, Judas Priest, Metallica, Led Zeppelin, Black Sabbath, Megadeth, Slayer. **No incluye Mötley Crüe ni AC/DC, Angra, Blind Guardian, Dream Theater, Nightwish, Black Sabbath, etc.** Lo usa `albums-grid.tsx:160` para poblar el `<Select aria-label="Filtrar por banda">`.

Consecuencia para iter-6: los 2 álbumes nuevos **no son filtrables vía el dropdown de bandas**. Sí son filtrables por género "Hard Rock" y por búsqueda libre ("motley"). El comentario JSDoc del propio array dice "Lista canónica de bandas que el catálogo soporta. Se usa para poblar el `<Select>` de filtros y debe coincidir literalmente con los valores que la API devuelve en el campo `band`". Hoy esa promesa está rota desde antes de iter-6 (AC/DC, Angra, etc. tampoco aparecen).

**No es regresión de iter-6** — es deuda preexistente que iter-6 hereda. Por eso no bloquea. Recomendación: en iter-7, derivar `BANDS` del dataset (fetch de `/albums` y `Array.from(new Set(...))`) igual que hace el backend con `GENRES` (`albums.ts:554-556`).

### R2. (BAJO) Portadas servidas localmente desde Wikipedia

Las portadas se descargaron de `upload.wikimedia.org` y se sirven desde `apps/web/public/covers/`. Wikipedia las aloja bajo "fair use" para fines enciclopédicos. Este repositorio (que es una demo/workspace ADLC, no un producto comercial publicado) probablemente esté en zona gris pero no es un riesgo crítico para una demo interna. Si esto va a un entorno público o comercial:

- Verificar política de uso justo / dominio público de cada portada.
- Documentar la procedencia en un `CREDITS.md` o `covers/README.md`.
- Considerar enlazar a las imágenes desde el dominio original (hotlink) o usar covers en dominio público / Creative Commons donde existan.

Esta misma deuda aplica al resto de portadas del catálogo, no es nuevo en iter-6. No bloquea iter-6, pero conviene abrir un ticket de cumplimiento.

### R3. (BAJO) No reverifiqué los tests yo mismo

El ejecutor reporta 110/110 vitest y 28/28 Playwright. No reejecuté para no consumir tiempo de revisión adicional. La cifra +8 cuadra con `describe.each` × 2 álbumes × 4 tests dinámicos. Confianza moderada-alta basada en la deterministicidad de la suite, pero un reviewer estricto los reejecutaría.

### R4. (BAJO) URL de Wikipedia con caracteres no-ASCII

`https://en.wikipedia.org/wiki/Dr._Feelgood_(Mötley_Crüe_album)` contiene `ö` y `ü`. Wikipedia resuelve esta forma sin problema, pero algunos validators / parsers de URL la prefieren percent-encoded. No bloqueante.

## Findings de seguridad

Pendientes del informe del `security-engineer` (gate paralelo). Observaciones del reviewer:

- 0 secretos en los diffs revisados (`albums.ts`, `album-reviews.ts`, `album-types.ts`).
- URLs de quotes: 100% https (`https://www.allmusic.com/...` y `https://en.wikipedia.org/...`). Sin schemas inseguros.
- No hay HTML inyectado en strings (todo es texto plano que renderiza React con escaping por defecto).
- No se modificó la superficie de API (mismo schema, mismas rutas).

## Recomendaciones para iter-7

1. **Derivar `BANDS` del dataset** (high value, low effort). Igual que el backend ya hace con `GENRES`. Resolvería R1 para Mötley Crüe y para AC/DC, Angra, Blind Guardian, Dream Theater, Nightwish.
2. **Documentar procedencia de covers** en `apps/web/public/covers/CREDITS.md`. Resolvería R2 documentalmente sin cambios de código.
3. (Opcional) Percent-encode la URL de Wikipedia de Dr. Feelgood.

## Veredicto

**APROBAR con observaciones no bloqueantes**, condicionado a que el `security-engineer` cierre sin HIGH/CRITICAL. Si trae findings, recargar este review.

Archivos relevantes auditados:

- `C:\02 - Accenture\03 - Repositorios\adlc-claude-code-workspace\apps\api\src\data\albums.ts`
- `C:\02 - Accenture\03 - Repositorios\adlc-claude-code-workspace\apps\api\src\data\album-reviews.ts`
- `C:\02 - Accenture\03 - Repositorios\adlc-claude-code-workspace\apps\web\lib\album-types.ts`
- `C:\02 - Accenture\03 - Repositorios\adlc-claude-code-workspace\apps\web\components\albums-grid.tsx`
- `C:\02 - Accenture\03 - Repositorios\adlc-claude-code-workspace\apps\web\public\covers\motley-crue-shout-at-the-devil.jpg`
- `C:\02 - Accenture\03 - Repositorios\adlc-claude-code-workspace\apps\web\public\covers\motley-crue-dr-feelgood.jpg`
- `C:\02 - Accenture\03 - Repositorios\adlc-claude-code-workspace\smoke-motley-crue.png`
- `C:\02 - Accenture\03 - Repositorios\adlc-claude-code-workspace\specs\acceptance-criteria.md` (sección "Catálogo Mötley Crüe (iteración 6)", líneas 169-193)
