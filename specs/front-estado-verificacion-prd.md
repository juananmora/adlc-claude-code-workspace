# PRD: Verificación del estado del front (`apps/web`)

> **Tipo**: propuesta de cambio (diagnóstico, sin cambios de código)
> **Iteración**: iter-14
> **Intent**: «Test 14-11»
> **Fecha**: 2026-11-14
> **Estado**: borrador

Slug: front-estado-verificacion

## 1. Objetivo

Comprobar y documentar, con evidencia reproducible, si el front `apps/web` (Next.js 15 + React 19) se puede levantar y si sus tests unitarios pueden ejecutarse. Hoy `apps/web` no tiene runner unitario, así que el resultado esperado es el diagnóstico de esa ausencia más la ejecución de la suite disponible (E2E). El resultado es un diagnóstico, no una corrección.

Fuentes: `[[adlc-solicitud]]` (hallazgos de inspección del repo: `apps/web/package.json` sin script de tests unitarios, solo `test:e2e` con Playwright). Esta versión actualiza el PRD de iter-13 para el intent «Test 14-11»; el alcance no cambia.

## 2. Alcance

- Arranque del front en modo desarrollo (`npm run dev`) y en modo producción (`npm run build` + `npm start`).
- Lint con `npm run lint` (`next lint`) como verificación previa al build. Es una verificación estática, no un test unitario.
- Comprobación de que el puerto 3000 responde y de que `/` carga sin errores de consola.
- Inventario de tests: qué runner existe, qué tests hay, cuáles son unitarios y cuáles E2E. Resultado esperado: no hay tests unitarios.
- Ejecución de la suite disponible (`npm run test:e2e`) y registro de resultados (pasados/fallados/omitidos).
- Documentar el resultado en un reporte de diagnóstico.

## 3. Fuera de alcance

- Añadir un runner de tests unitarios (Vitest/Jest) o escribir tests nuevos. Decisión de alcance para una iteración posterior.
- Corregir bugs del front encontrados durante la verificación.
- Modificar `apps/api`, Docker, infraestructura o despliegues.
- Corregir la referencia a `claude-catalog-viewer/` de `CLAUDE.md` (queda como gap, ver §12).

## 4. Usuarios o actores

- Mantenedor del repositorio que necesita saber en qué estado está el front.
- Agentes ejecutores posteriores (`frontend-engineer`, `qa-engineer`) que leerán este PRD.

## 5. Requisitos funcionales

- **RF-01**: El front SHALL poder arrancar en desarrollo con `npm run dev` desde `apps/web/` y responder HTTP 200 en `http://localhost:3000/`.
- **RF-02**: El front SHALL poder compilarse con `npm run build` sin errores.
- **RF-03**: El front SHALL poder arrancarse en producción con `npm start` tras el build y responder HTTP 200 en `/`.
- **RF-04**: El inventario de tests de `apps/web` MUST quedar documentado indicando si existe runner unitario y, si no existe, que así consta.
- **RF-05**: La suite E2E (`npm run test:e2e`) MUST ejecutarse y su resultado (pasados/fallados/omitidos) MUST quedar registrado.
- **RF-06**: `npm run lint` (`next lint`) en `apps/web/` MUST ejecutarse y su resultado (exit code y número de avisos/errores) MUST quedar registrado, como verificación previa al build.

## 6. Requisitos no funcionales

- **RNF-01**: Cada comando MUST ejecutarse con la versión de Node.js del `Dockerfile` de `apps/web` o una compatible con Next 15 (>= 18.18), y el reporte MUST indicar la versión usada.
- **RNF-02**: Las evidencias MUST ser reproducibles: comando exacto, código de salida y fragmento de salida relevante.
- **RNF-03**: Ningún secreto ni variable de entorno sensible MUST aparecer en el reporte.
- **RNF-04**: La consola del navegador en `/` SHOULD quedar sin errores; si hay errores, MUST documentarse uno a uno como hallazgo.

## 7. Arquitectura esperada

No hay cambios de arquitectura. Puntos implicados:

```
apps/web/
├─ package.json        # scripts dev/build/start/lint/test:e2e
├─ playwright.config.ts
├─ e2e/*.spec.ts       # suite E2E existente (10 ficheros)
└─ app/, components/, lib/
```

## 8. Criterios de aceptación (Given/When/Then + RFC 2119)

- [ ] Given `apps/web` con dependencias instaladas, when se ejecuta `npm run dev`, then el servidor MUST escuchar en el puerto 3000 y `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` MUST devolver `200`.
  - Validación: comando `npm run dev` en `apps/web/` + `curl` (evidencia en el reporte).
- [ ] Given `apps/web`, when se ejecuta `npm run build`, then el comando MUST terminar con código de salida `0`.
  - Validación: comando `npm run build` en `apps/web/`, exit code.
- [ ] Given el build correcto, when se ejecuta `npm start`, then `/` MUST devolver HTTP `200`.
  - Validación: comando `npm start` + `curl` sobre `:3000`.
- [ ] Given `apps/web` con dependencias instaladas, when se ejecuta `npm run lint`, then el resultado (exit code y avisos/errores) MUST quedar registrado en el reporte.
  - Validación: `cd apps/web && npm run lint; echo $?` y el resumen de `next lint`.
- [ ] Given `apps/web/package.json`, when se busca un script de tests unitarios (`test`, `test:unit`), then el resultado MUST quedar documentado (existe o no existe) con la línea del fichero como evidencia.
  - Validación: inspección de `apps/web/package.json` (líneas de `scripts`).
- [ ] Given la suite E2E de `apps/web/e2e/`, when se ejecuta `npm run test:e2e`, then el número de tests pasados, fallados y omitidos MUST quedar registrado.
  - Validación: salida de `npx playwright test` (resumen final).
- [ ] Given `/` cargado en un navegador, when se leen los mensajes de consola, then SHOULD no haber errores; cada error MUST quedar listado como hallazgo.
  - Validación: Chrome DevTools MCP o `playwright-browser_console_messages`.
- [ ] Given el reporte de diagnóstico, when se revisa, then MUST contener la versión de Node usada y los comandos exactos ejecutados.
  - Validación: inspección de `reports/iter-14/frontend-engineer.md`.

## 9. Riesgos y supuestos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Playwright necesita navegadores instalados (`npx playwright install`) | Los E2E no arrancan | Instalar solo los necesarios; documentar el paso |
| `npm install` en el mount pequeño (1 GB) | Fallo por espacio | Instalar una vez; limpiar `.next/` y artefactos tras el diagnóstico |
| `CLAUDE.md` referencia `claude-catalog-viewer/`, que no existe | Confusión sobre el front real | Documentar como gap; no modificar en esta iteración |
| No existe runner unitario | "Test unitario" no es ejecutable | Reportar ausencia con evidencia; la creación es decisión aparte |

**Supuestos**:
- "front" = `apps/web/`.
- "tests unitarios" = no existen en `apps/web`. La ejecución de la suite disponible es `test:e2e`, y lint y build son verificaciones estáticas y de compilación, no tests unitarios. Esta interpretación se reporta explícitamente en el diagnóstico.

## 10. Puntos de aprobación humana

- Decidir si se añade un runner unitario (Vitest/Jest) a `apps/web`.
- Decidir si se corrige la referencia a `claude-catalog-viewer/` en `CLAUDE.md`.
- Cualquier hallazgo de seguridad CRITICAL/HIGH abierto al cierre.

## 11. Trazabilidad

- Solicitud: `[[adlc-solicitud]]` (intent «Test 14-11»).
- Specs relacionadas: `specs/areas/catalog-products/spec.md` (cobertura de frontend iter-1/iter-2), `specs/001-startup-verification/spec.md` (patrón de verificación de arranque para `apps/api`).
- Iteración anterior de esta misma verificación: iter-13 (`reports/iter-13/`).

## 12. Gaps conocidos

- `CLAUDE.md` y la carpeta `claude-catalog-viewer/` no coinciden con el repositorio actual.
- No hay área `catalog-viewer` en `specs/areas/`; el front está cubierto por `catalog-products`.

```yaml
requirements:
  - id: RF-01
    title: Arranque en desarrollo
    category: functional
    priority: must-have
    description: El front arranca con npm run dev y responde 200 en localhost:3000.
    acceptance_criteria:
      - npm run dev escucha en 3000
      - curl a / devuelve 200
  - id: RF-02
    title: Build de producción
    category: functional
    priority: must-have
    description: npm run build termina sin errores.
    acceptance_criteria:
      - exit code 0
  - id: RF-03
    title: Arranque en producción
    category: functional
    priority: must-have
    description: npm start sirve el build y responde 200 en /.
    acceptance_criteria:
      - curl a / devuelve 200 tras npm start
  - id: RF-04
    title: Inventario de tests unitarios
    category: functional
    priority: must-have
    description: Se documenta si apps/web tiene runner unitario y qué tests existen.
    acceptance_criteria:
      - Resultado documentado con línea de package.json como evidencia
  - id: RF-05
    title: Ejecución de la suite E2E
    category: functional
    priority: must-have
    description: npm run test:e2e se ejecuta y se registra pasados/fallados/omitidos.
    acceptance_criteria:
      - Resumen de Playwright registrado en el reporte
  - id: RF-06
    title: Lint previo al build
    category: functional
    priority: must-have
    description: npm run lint se ejecuta en apps/web y su resultado queda registrado.
    acceptance_criteria:
      - Exit code y resumen de next lint registrados
  - id: RNF-01
    title: Versión de Node documentada
    category: non-functional
    priority: must-have
    description: Los comandos se ejecutan con Node compatible con Next 15 y la versión se registra.
    acceptance_criteria:
      - Versión de Node presente en el reporte
  - id: RNF-02
    title: Evidencias reproducibles
    category: non-functional
    priority: must-have
    description: Cada resultado incluye comando exacto, exit code y salida relevante.
    acceptance_criteria:
      - Comandos y exit codes documentados
  - id: RNF-03
    title: Sin secretos en el reporte
    category: constraint
    priority: must-have
    description: No se publican secretos ni variables sensibles.
    acceptance_criteria:
      - Revisión del reporte sin valores de secretos
  - id: RNF-04
    title: Consola sin errores
    category: non-functional
    priority: should-have
    description: La consola del navegador en / no muestra errores; cada error se documenta.
    acceptance_criteria:
      - Lista de errores de consola registrada
```
