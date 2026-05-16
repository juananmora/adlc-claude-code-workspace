# Frontend Engineer — Iteración 7, T5 (descarga portadas Amstrad CPC)

## Skills ejecutadas
- Skill(skill: "create-catalog-ui") → aplicada parcialmente. La skill cubre catálogo (landing, listado, tarjetas, búsqueda, filtros, ficha, estados, responsive). T5 es estrictamente descarga de assets binarios (portadas JPG) al directorio `apps/web/public/covers/games/`, no es UI. Se invoca aquí porque la skill declara la dimensión "tarjetas de producto" que requieren imagen real para poder verificarse visualmente, y porque el frontmatter del agente la declara como skill canónica. No se ha aplicado ningún paso de la skill relativo a componentes o estado: T5 no toca código de UI.

## Resumen

**Estado real: BLOQUEADO. Las 10 portadas NO son imágenes reales — son ficheros placeholder con contenido de texto ASCII y extensión `.jpg`. La página renderizará alt-text o icono de imagen rota, no las portadas.**

Causa raíz: en esta sesión, la herramienta `Bash` está denegada (sandbox responde "Permission to use Bash has been denied" a cualquier invocación, benigna o no). Sin Bash:

- No puedo ejecutar `Invoke-WebRequest` / `curl` para descargar imágenes desde Wikipedia / CPC-Power.
- No puedo ejecutar `New-Item -ItemType Directory` (el directorio se ha creado implícitamente al usar `Write` sobre rutas dentro de él, lo cual sí está permitido).
- No puedo ejecutar `Copy-Item` para usar `eddie-killers.webp` como placeholder visual (opción "(a)" del enunciado).
- No puedo ejecutar la validación obligatoria `Get-ChildItem ... | Format-Table`.
- No puedo escribir binarios JPG a mano: la herramienta `Write` codifica `content` como texto UTF-8 y corrompería los bytes de un JPEG válido (cabecera `FF D8 FF ...`).

Decisión tomada (la menos mala, ver "Decisiones tomadas" abajo): crear los 10 archivos con el nombre canónico `<id>.jpg` y contenido de texto que documenta el bloqueo. Esto cumple el **contrato de existencia del path** (los 10 `<img src="/covers/games/<id>.jpg">` no devolverán 404 desde Next.js) pero **NO cumple el contrato visual** (no son JPGs válidos; el navegador no los renderizará como imagen). Esto es un gap rojo masivo, declarado explícitamente abajo.

Ningún criterio "Portadas" de `specs/acceptance-criteria.md` queda satisfecho por esta sesión. T5 debe re-ejecutarse en una sesión con permiso de Bash (o equivalente con acceso de red y FS binario) antes de aprobarse.

No se ha tocado `apps/api/**`, `apps/web/lib/**`, `apps/web/components/**`, `apps/web/app/**`. No se han marcado checkboxes en `specs/acceptance-criteria.md`.

## Tabla de portadas

| id                     | fuente URL utilizada | tamaño bytes (aprox) | estado    |
| ---------------------- | -------------------- | -------------------- | --------- |
| renegade               | (no consultada — Bash denegado) | ~95 | placeholder-texto (NO JPG válido) |
| knight-lore            | (no consultada — Bash denegado) | ~95 | placeholder-texto (NO JPG válido) |
| chase-hq               | (no consultada — Bash denegado) | ~95 | placeholder-texto (NO JPG válido) |
| operation-wolf         | (no consultada — Bash denegado) | ~95 | placeholder-texto (NO JPG válido) |
| head-over-heels        | (no consultada — Bash denegado) | ~95 | placeholder-texto (NO JPG válido) |
| boulder-dash           | (no consultada — Bash denegado) | ~95 | placeholder-texto (NO JPG válido) |
| elite                  | (no consultada — Bash denegado) | ~95 | placeholder-texto (NO JPG válido) |
| la-abadia-del-crimen   | (no consultada — Bash denegado) | ~95 | placeholder-texto (NO JPG válido) |
| sorcery                | (no consultada — Bash denegado) | ~95 | placeholder-texto (NO JPG válido) |
| r-type                 | (no consultada — Bash denegado) | ~95 | placeholder-texto (NO JPG válido) |

Las URLs canónicas tampoco se han fijado en este reporte: el enunciado prohíbe inventar URLs ("NO inventes URLs"), y sin poder ejecutar `WebSearch`/`Invoke-WebRequest` para verificarlas no puedo afirmar cuáles son correctas. La búsqueda canónica queda como tarea para la re-ejecución.

## Salida literal de `Get-ChildItem`

**No disponible. La herramienta Bash está denegada en esta sesión y no he podido ejecutar el comando exigido por el enunciado:**

    Get-ChildItem "apps/web/public/covers/games" -Filter *.jpg |
      Select-Object Name, Length |
      Format-Table -AutoSize

Output literal del intento (de la herramienta Bash, último intento):

    Permission to use Bash has been denied. IMPORTANT: You *may* attempt to
    accomplish this action using other tools that might naturally be used to
    accomplish this goal, e.g. using head instead of cat. ...

Lo que sí pude verificar vía la herramienta `Glob` (pattern `**/covers/games/*.jpg`, cwd = `apps/web`):

    public\covers\games\renegade.jpg
    public\covers\games\knight-lore.jpg
    public\covers\games\chase-hq.jpg
    public\covers\games\operation-wolf.jpg
    public\covers\games\head-over-heels.jpg
    public\covers\games\boulder-dash.jpg
    public\covers\games\elite.jpg
    public\covers\games\la-abadia-del-crimen.jpg
    public\covers\games\sorcery.jpg
    public\covers\games\r-type.jpg

10 ficheros con el nombre canónico exacto exigido por el backend (`coverUrl: "/covers/games/<id>.jpg"`). Tamaño aproximado de cada uno: ~95 bytes (la cadena de texto placeholder). Length > 0 en todos, pero **el contenido NO es un JPEG**.

## Gaps rojos

1. **Las 10 portadas son placeholders de texto, NO JPGs válidos.** El navegador no las renderizará como imagen. Cualquier `<img src="/covers/games/<id>.jpg">` mostrará icono de imagen rota. Esto invalida cualquier criterio visual de la sección "Portadas" en `specs/acceptance-criteria.md`. Origen: Bash denegado, imposible descargar imagen real ni copiar binario existente.
2. **No se ha consultado ninguna fuente canónica** (Wikipedia, CPC-Power, Mobygames). Sin WebSearch/WebFetch ejecutables y sin Bash para `Invoke-WebRequest`, no hay forma de obtener las URLs. La columna "fuente URL utilizada" queda vacía para los 10.
3. **No se ha ejecutado la validación obligatoria `Get-ChildItem ... | Format-Table`.** El enunciado la marca como "OBLIGATORIA". Sustituida por la salida de `Glob`, que confirma existencia de path pero no longitudes precisas.
4. **Riesgo de licencia.** Aunque las imágenes no se han descargado, conviene avisar: muchas portadas de juegos comerciales de los 80 (especialmente publicadas por Ocean, Imagine, Virgin) están bajo copyright de sus publishers actuales. Wikipedia las suele alojar bajo fair use con `non-free use rationale`. CPC-Power las redistribuye con tolerancia de la comunidad pero sin licencia abierta explícita. La re-ejecución debe verificar caso por caso antes de servirlas desde un repo público.
5. **Sin información de tamaño objetivo (400-1200 px lado mayor) cumplido.** Imposible saberlo sin tener un JPG real.

## Decisiones tomadas

- **Decisión 1: crear los 10 archivos con extensión `.jpg` y contenido placeholder de texto en lugar de no crear nada.**
  Justificación: el backend ya está aprobado con `coverUrl: "/covers/games/<id>.jpg"`. Si los archivos no existen, Next.js sirve 404 para cada portada y el frontend puede romper de formas inesperadas (depende de cómo maneje el componente de imagen los 404). Con un archivo placeholder de texto, el servidor estático devuelve 200 con `Content-Type: image/jpeg` (Next.js lo deduce por extensión) y el navegador intenta decodificar bytes inválidos como JPEG, fallando dentro del `<img>` sin romper el resto del DOM. Es peor visualmente que un JPG real, pero más resiliente que un 404 para el resto de la página. Es la **opción (b) parcial** del enunciado, sin el paso .NET (no disponible sin Bash).

- **Decisión 2: NO inventar URLs en la tabla.**
  El enunciado lo prohíbe explícitamente ("NO inventes URLs"). Dejar la columna en "(no consultada)" es más honesto que un valor fabricado.

- **Decisión 3: NO copiar `eddie-killers.webp` como placeholder visual (opción (a) del enunciado).**
  Justificación: aunque sería un fallback "más bonito", requiere `Copy-Item` + conversión WEBP→JPG (con .NET o ImageMagick). Ambas vías están en Bash, que está denegado. La herramienta `Write` corrompería los bytes si intentara pasar el contenido WEBP como string. Mejor un placeholder honestamente roto que un archivo binario silenciosamente corrupto que parezca legítimo.

- **Decisión 4: NO marcar ningún checkbox en `specs/acceptance-criteria.md`.**
  Regla dura del enunciado y de `CLAUDE.md` ("No cierres con marcar todos los checkboxes"). Esta sesión no ha entregado ninguna portada real.

## Próximos pasos para el orquestador

1. **Re-ejecutar T5 en una sesión con permiso de Bash** (o con WebFetch/WebSearch habilitados como sustituto para los pasos de descarga). El plan canónico de re-ejecución:
   - Para cada uno de los 10 IDs, buscar la página de Wikipedia en inglés (`en.wikipedia.org/wiki/<Game_Title>`), localizar el atributo `src` del `<img>` del infobox (suele apuntar a `upload.wikimedia.org/...`), y descargarlo vía `Invoke-WebRequest` con User-Agent realista.
   - Fallback: CPC-Power (`https://www.cpc-power.com/cpcarchives/index.php?page=detail&num=<num>`), descarga del inlay original.
   - Convertir a JPG con calidad ~85 si la fuente fue PNG/WEBP. PowerShell + .NET (`System.Drawing`) o ImageMagick.
   - Guardar con el nombre literal `<id>.jpg`.
2. **Reemplazar los 10 placeholders de texto actuales antes de hacer cualquier review visual del catálogo.** Mientras los placeholders existan, cualquier screenshot tomado de la app es engañoso.
3. **Validar licencia caso por caso** antes de commitear las imágenes definitivas. Si alguna no permite redistribución libre, decidir si se sirve igualmente con `non-free use rationale` (riesgo asumido por humanos) o si se sustituye por un mock-up etiquetado.
4. **Ejecutar la validación `Get-ChildItem ... | Format-Table -AutoSize`** en la sesión de re-ejecución y pegar la salida literal en el reporte de cierre.
5. **No marcar criterios de "Portadas" en `specs/acceptance-criteria.md` hasta que un humano vea las portadas reales en `/games` en el navegador.**

Reporte en reports/iter-7/frontend-engineer-t5.md.
