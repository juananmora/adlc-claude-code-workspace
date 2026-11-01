# Quickstart: API local

Este procedimiento se ejecuta desde la raíz del repositorio. Requiere Node.js/npm compatibles con el paquete y el lockfile; `apps/api/package.json` no declara `engines` ni fija una versión local. Para la comprobación HTTP se recomienda `curl` u otro cliente HTTP. En la ejecución registrada para esta feature la imagen no tenía curl, así que los smokes se hicieron con `fetch` integrado de Node.

## Instalar, compilar y probar (solo API)

```bash
npm ci --prefix apps/api --ignore-scripts --no-audit --no-fund
npm run build --prefix apps/api
npm test --prefix apps/api
```

La instalación está documentada, pero su ejecución no aparece en los eventos controlados T001–T007. El build ejecutado pasó y produjo `apps/api/dist/server.js` (T004). Los tests ejecutados pasaron: **6 archivos, 511 tests** (T006). Build/tests son checks de API y no demuestran que un proceso standalone esté escuchando.

## Modo desarrollo

En una terminal, desde la raíz:

```bash
npm run dev --prefix apps/api
```

Con el proceso activo, desde otra terminal:

```bash
curl --fail --show-error --include http://127.0.0.1:4000/health
```

Éxito: estado HTTP **200** y cuerpo JSON exacto:

```json
{"status":"ok"}
```

T003 registra que esta respuesta se obtuvo en vivo; la petición se realizó con `fetch` de Node porque curl no estaba instalado. SIGINT detuvo el proceso y registró `shutting down`.

## Modo compilado

Después de un build satisfactorio y con el puerto libre, inicia:

```bash
npm start --prefix apps/api
```

En otra terminal, mientras sigue activo, ejecuta la misma comprobación HTTP anterior. T004 registra HTTP 200 y `{"status":"ok"}`; la petición se hizo con `fetch` de Node. SIGINT detuvo el proceso y registró `shutting down`. Ejecuta los modos en secuencia para no competir por el puerto predeterminado.

## Configuración y errores

- Defaults desde `apps/api/src/config.ts`: `HOST=0.0.0.0`, `PORT=4000`. Pueden configurarse `HOST` y `PORT`; un valor de puerto válido debe quedar entre 1 y 65535. `PORT=""` se trata como no especificado y usa 4000, según la aclaración aprobada en la spec y el comportamiento actual del código.
- Si HOST se limita a una interfaz distinta, dirige la solicitud a una dirección alcanzable por esa interfaz; loopback no siempre será accesible.
- Si el puerto está ocupado, el valor de PORT es inválido o ocurre un fallo de bind/listen, el proceso no arrancó satisfactoriamente. Un build o test satisfactorio no implica readiness. Libera el puerto o selecciona uno válido y repite la verificación HTTP. Estos casos de fallo se documentan, pero no se reportan como inducidos en las ejecuciones T001–T007.
- No copies `.env.example`: ese archivo no aparece en el checkout.
- La falta o incompatibilidad del runtime es un bloqueo del entorno, no evidencia de arranque.

## Alcance de resultados

Los resultados registrados corresponden solo a `apps/api`: build, tests, y requests HTTP exitosos en ambos modos. No validan ni implican validación de `apps/web`, Docker Compose, Terraform ni harnesses Python. Los tests existentes usan `app.inject()` y no sustituyen el request al servidor standalone. Reporta build, tests y cada smoke HTTP por separado.
