# Contratos

## Contrato de API

No se propone ningún cambio al contrato de API. La verificación utiliza el endpoint existente, definido en `apps/api/src/app.ts`:

- Método/ruta: `GET /health`.
- Respuesta esperada por la especificación aprobada: HTTP 200, JSON exacto `{ "status": "ok" }`.
- Alcance: respuesta del proceso local arrancado con `npm run dev --prefix apps/api` o `npm start --prefix apps/api`.

El test existente de `apps/api/tests/products.test.ts` usa `app.inject()`, pero no establece un socket TCP ni valida el server standalone. Por tanto, se necesita un request HTTP al proceso vivo.

## Contrato de comandos

Los comandos exactos están en `apps/api/package.json` y el comando de instalación en la configuración operativa de la ejecución SDD. No se introduce una interfaz CLI nueva. T002 registra el comando de instalación documentado; T004 registra build satisfactorio y T006 los tests API satisfactorios.

## Evidencia de ejecución registrada

- Desarrollo (T003): HTTP 200 con `{"status":"ok"}` en `127.0.0.1:4000/health`; SIGINT y log `shutting down`.
- Compilado (T004): build pasó y emitió `apps/api/dist/server.js`; el proceso `npm start` devolvió HTTP 200 con `{"status":"ok"}`; SIGINT y log `shutting down`.
- Tests (T006): `npm test --prefix apps/api` pasó, 6 archivos y 511 tests.
- En ambos smokes, el entorno no tenía `curl`; el request HTTP real se realizó con `fetch` integrado de Node. El comando curl se documenta como procedimiento, no se afirma ejecutado.

## Configuración pertinente

`HOST` tiene default `0.0.0.0` y `PORT` default `4000`. Según la spec revisada con aprobación humana en T001, `PORT=""` equivale a no especificado y usa el default; valores no vacíos inválidos se rechazan. No se modificó la aplicación para esta feature.

## Fuera de alcance y límites

Sin OpenAPI nuevo, contrato de error nuevo, formato de configuración nuevo ni contrato entre servicios. Docker Compose, web, infraestructura, despliegues y Python no forman parte del contrato ni quedan validados por los resultados API-only. La ejecución de instalación y los fallos de puerto ocupado/inválido no constan como comprobados en los eventos T001–T007.
