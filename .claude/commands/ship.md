---
description: Audita el estado del trabajo segun CLAUDE.md, commitea, pushea y abre PR con tabla de evidencias.
argument-hint: "[titulo-del-pr-opcional]"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Agent, Skill
---

# /ship — cerrar iteracion con auditoria y PR

Encapsula el cierre seguro de una iteracion. Sigue las "Reglas duras antes de declarar trabajo terminado" del `CLAUDE.md` y solo abre PR si todas pasan.

## Argumentos

- `$ARGUMENTS` → titulo del PR (opcional). Si vacio, deduce uno corto de los commits desde `main`.

## Flujo obligatorio

1. **Estado git.**
   - `git status --short` y `git diff --stat` para listar cambios.
   - Si no hay cambios staged ni unstaged y la rama esta al dia con origin, aborta con mensaje claro: nada que enviar.
   - Si estamos en `main`, propon nombre de rama (`feat/<slug>` o `fix/<slug>` segun los cambios) y crea/cambia con `git checkout -b` solo tras confirmar con el usuario.

2. **Auditoria pre-cierre.**

   **2a. Reutilizar reporte del orquestador si existe.**
   - Busca el reporte mas reciente en `reports/iter-*/reviewer.md`:
     ```
     ls -t reports/iter-*/reviewer.md 2>/dev/null | head -1
     ```
   - Si existe, comprueba:
     - **Veredicto APROBAR** explicito en el cuerpo (no CAMBIOS ni RECHAZAR).
     - **Frescura**: mtime del archivo dentro de las ultimas 2 horas **y** sin commits posteriores que toquen `apps/**`, `infra/**` o `specs/**`. Compara con `git log -1 --format=%ct -- apps infra specs` vs `stat` del reporte.
     - Que la rama actual no tenga cambios staged/unstaged respecto a cuando se genero el reporte (`git diff --stat` vacio o solo docs).
   - Si las tres se cumplen → **reusa la tabla** `criterio | evidencia | estado` del reporte para el PR. Salta a paso 3. Anota en el PR: `_Auditoria reusada de reports/iter-N/reviewer.md (orquestador)._`
   - Si alguna falla → invalida y pasa a 2b. Indica al usuario por que no se reuso (vencida, hay commits nuevos, hay cambios sin commitear, veredicto no era APROBAR).

   **2b. Lanzar reviewer fresco.**
   - Invoca `Agent` con `subagent_type=reviewer`. Pasa contexto: ruta del workspace, lista de archivos cambiados, y la consigna de auditar criterio por criterio contra `specs/acceptance-criteria.md` siguiendo `CLAUDE.md`.
   - Pide reporte en formato tabla `criterio | evidencia | estado` + smoke test funcional si hay app ejecutable.
   - **Si el reviewer reporta gaps rojos, NO pushees.** Muestra los gaps al usuario y pregunta si quiere arreglarlos o forzar el ship con justificacion (raro y debe registrarse en el PR).

3. **Verificaciones mecanicas.**
   - `gh auth status` en `github.com` con cuenta `juananmora` activa.
   - Confirma que no hay `.env.local`, `.next/`, `node_modules/`, `test-results/`, `*.tfstate` ni secretos en lo staged. Si los hay, ampliar `.gitignore` antes de seguir.

4. **Commit.**
   - Si hay cambios unstaged relevantes, pregunta antes de hacer `git add` masivo. Prefiere paths explicitos.
   - Mensaje con formato convencional (`feat:`, `fix:`, `chore:`...) y trailer `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
   - Pasa el mensaje por HEREDOC.

5. **Push.**
   - `git push -u origin <rama>` si es rama nueva, `git push` si ya trackea.

6. **PR.**
   - `gh pr create` con:
     - `--title` = `$ARGUMENTS` o titulo deducido (max 70 chars).
     - `--body` con secciones: `## Resumen` (1-3 bullets), `## Cambios` (lista de archivos clave), `## Evidencias` (tabla del reviewer), `## Riesgos`, `## Test plan`.
   - Cuerpo via HEREDOC.

7. **Salida.**
   - Devuelve la URL del PR.
   - Si algo fallo, devuelve el ultimo paso completado y que falta.

## Restricciones

- **No** uses `--no-verify`, `--force`, `--amend` ni desactives hooks.
- **No** mergees el PR ni pidas review automaticamente — eso es decision humana.
- **No** marques checkboxes de `specs/acceptance-criteria.md` que no esten verificados con evidencia concreta.
- Si el usuario te interrumpe en cualquier paso, no continues por inercia.

## Ejemplos

```
/ship
/ship "fix(ci): permitir 127.0.0.1 en CORS"
```
