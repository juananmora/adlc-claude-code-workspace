# Instrucciones del proyecto

Este repositorio define un workspace Claude Code para un ciclo de vida ADLC.

## Principios

- Trabaja siempre contra una especificación explícita.
- No generes infraestructura productiva sin aprobación humana.
- No guardes secretos en código.
- Prefiere Pull Requests, planes y evidencias de validación antes que cambios directos.
- Cualquier despliegue a producción requiere revisión humana.
- Si una skill o agente necesario no existe, propón su creación, pero no asumas que está aprobado.

## Flujo esperado

1. Entender la solicitud.
2. Crear o completar PRD/spec.
3. Seleccionar agentes y skills.
4. Crear plan de ejecución.
5. Ejecutar cambios en ramas o PRs.
6. Validar con tests, linters y escáneres.
7. Solicitar aprobación humana en puntos críticos.
8. Desplegar solo si los gates pasan.
9. Monitorizar y convertir feedback en nueva iteración.

## Reglas duras antes de declarar trabajo terminado

Estas reglas son **obligatorias** y aplican a cualquier agente que cierre una iteración (orquestador, reviewer o ejecutor final):

1. **Auditoría criterio por criterio.** Antes de decir "completo", recorre `specs/acceptance-criteria.md` checkbox por checkbox. Para cada uno: anota qué archivo/test/comando lo valida y si lo has ejecutado. Si no, déjalo rojo con motivo. Reporte final debe incluir una tabla `criterio | evidencia | estado`.

2. **Smoke test funcional obligatorio si hay app ejecutable.** Arranca la app, cárgala con Chrome DevTools MCP o curl, **lee consola y network**. Errores 4xx/5xx, exceptions o issues de accesibilidad son bugs reales: créalos como tareas y arréglalos antes de cerrar. No los descartes como ruido sin investigarlos uno a uno.

3. **Verifica al subagente, no le creas.** Si un subagente dice "ejecuté X y pasó", confirma que el output de X está en su reporte. Si solo dice "lo escribí siguiendo las convenciones de X" sin output, recházalo.

4. **No asumas estado vivo.** Antes de declarar que la app funciona, comprueba el listener del puerto (`Get-NetTCPConnection -LocalPort N`). Los servidores en background pueden haber muerto entre turnos.

5. **No cierres con marcar todos los checkboxes.** Marca solo los verificados. Deja rojos con motivo los pendientes. Es preferible un cierre honesto con 2 gaps que un cierre falso con 0.

Si por descuido se cierra una iteración sin haber cumplido estas reglas y el usuario lo señala, el siguiente paso obligatorio es **rehacer la auditoría completa**, no defender el cierre anterior.

## Estado de la orquestación actual

Cuando trabajes en este repo, lee `specs/acceptance-criteria.md` para conocer el estado real de los criterios. La fuente de verdad es ese archivo, no resúmenes en chat.
