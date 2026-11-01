# Contratos

## Contrato de API

No se propone ningún cambio al contrato de API. La verificación utiliza el endpoint existente, definido en `apps/api/src/app.ts`:

- Método/ruta: `GET /health`.
- Respuesta esperada por la especificación aprobada: HTTP 200, JSON exacto `{ "status": "ok" }`.
- Alcance: respuesta del proceso local arrancado con `npm run dev --prefix apps/api` o `npm start --prefix apps/api`.

El test existente de `apps/api/tests/products.test.ts` cubre esa respuesta por `app.inject()`, pero no establece un socket TCP ni valida el server standalone. Por tanto, sigue siendo necesario el smoke HTTP a `127.0.0.1:4000` durante un proceso vivo.

## Contrato de comandos

Los comandos exactos están en `apps/api/package.json` y el comando de instalación en la configuración operativa de la ejecución SDD. Se documentan bajo `quickstart.md` y `plan.md`; no se introduce una interfaz CLI nueva.

## Fuera de alcance

Sin OpenAPI nuevo, contrato de errores nuevo, formato de configuración nuevo ni contrato entre servicios. Docker Compose, web, infraestructura y Python no forman parte de este contrato.

## Discrepancia pendiente

La spec afirma que `PORT` vacío falla; el código actual trata `PORT=""` como unset y usa el default 4000. La guía no debe fingir que el comportamiento fue ejecutado ni cambiarlo. Se requiere aclaración humana de la especificación antes de implementar.