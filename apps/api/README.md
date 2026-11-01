# apps/api — Catalog API

Servicio HTTP en **Node.js + TypeScript + Fastify** que expone el catálogo de productos consumido por `apps/web`. La fuente de datos actual es in-memory; la integración con base de datos privada se planificará en una iteración posterior según el PRD `specs/computer-catalog-landing-zone-prd.md`.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Health-check. Devuelve `{ "status": "ok" }`. |
| GET | `/products` | Listado de productos. Acepta `?q=` (también `?search=`) y `?category=`. |
| GET | `/products/:id` | Ficha de un producto. Devuelve `404` si no existe. |

### Parámetros de `/products`

- `q` *(string, opcional)*: búsqueda full-text sobre nombre, descripción, categoría y specs. Alias: `search` (compatibilidad con el frontend actual).
- `category` *(string, opcional)*: filtro exacto. Valores permitidos: `Portatiles`, `Sobremesa`, `Componentes`, `Perifericos`.

Las validaciones se hacen con JSON Schema nativo de Fastify; cualquier parámetro desconocido o valor inválido devuelve `400` con un cuerpo de error consistente:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "querystring/category must be equal to one of the allowed values"
}
```

## Prerrequisitos y comandos

Ejecuta estos comandos desde la raíz del repositorio. Se requiere Node.js, npm y `curl` (o un cliente HTTP equivalente) disponibles, con versiones de Node.js/npm compatibles con el paquete y el lockfile. `apps/api/package.json` no declara `engines` ni fija una versión local; la versión del Dockerfile no establece un requisito para el host.

Instala las dependencias del API con el comando reproducible del repositorio:

```bash
npm ci --prefix apps/api --ignore-scripts --no-audit --no-fund
```

Los scripts disponibles para el API son:

```bash
npm run dev --prefix apps/api
npm run build --prefix apps/api
npm start --prefix apps/api
npm test --prefix apps/api
```

## Configuración

Los valores predeterminados proceden de `apps/api/src/config.ts` y se pueden sobrescribir mediante variables de entorno del proceso:

| Variable | Default | Uso |
|---|---|---|
| `HOST` | `0.0.0.0` | Interfaz en la que escucha el servidor. |
| `PORT` | `4000` | Puerto HTTP. El valor vacío se trata como no especificado; los valores no vacíos se convierten a entero y deben quedar entre 1 y 65535. |
| `CORS_ORIGIN` | `http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001` | Lista separada por comas de orígenes permitidos. |
| `NODE_ENV` | `development` | Modo de ejecución; con `test` se deshabilita logging. |

Por ejemplo, en una shell compatible con POSIX puedes elegir otro puerto válido así:

```bash
PORT=4001 npm run dev --prefix apps/api
```

Si `HOST` se configura para una interfaz distinta de `0.0.0.0`, comprueba el servicio en una dirección alcanzable por esa interfaz; `127.0.0.1` no necesariamente será accesible. No es necesario copiar `.env.example`: ese archivo no está presente en este checkout.

## Arranque local y comprobación HTTP

Un build correcto o los tests con `app.inject()` no demuestran que el proceso standalone haya enlazado un puerto. Para comprobar disponibilidad, deja el servidor ejecutándose en una terminal y haz la solicitud HTTP indicada desde otra. El criterio de éxito es **HTTP 200** y el cuerpo JSON exacto `{ "status": "ok" }`.

### Modo desarrollo

Desde la raíz del repositorio, inicia el servidor:

```bash
npm run dev --prefix apps/api
```

Mientras el proceso siga activo, comprueba el endpoint predeterminado:

```bash
curl --fail --show-error --include http://127.0.0.1:4000/health
```

Verifica el estado HTTP y el cuerpo. Si la solicitud falla, no devuelve 200 o el JSON esperado, el arranque no está verificado. Con un `PORT` distinto, usa ese puerto en la URL. Detén el proceso en primer plano con Ctrl+C. El manejador de SIGINT registra `shutting down` e intenta cerrar Fastify; ese mensaje por sí solo no prueba disponibilidad.

### Modo compilado

Primero compila el API y confirma que el comando termina correctamente; la salida TypeScript se genera en `apps/api/dist/`:

```bash
npm run build --prefix apps/api
```

Después, con el puerto libre, inicia el servidor compilado:

```bash
npm start --prefix apps/api
```

Mientras siga activo, en otra terminal ejecuta la misma comprobación HTTP:

```bash
curl --fail --show-error --include http://127.0.0.1:4000/health
```

Exige HTTP 200 y `{ "status": "ok" }`; luego detén el proceso en primer plano con Ctrl+C. Ejecuta los modos desarrollo y compilado en secuencia para no competir por el puerto predeterminado.

### Fallos de arranque

Un puerto ocupado, un valor no vacío de `PORT` rechazado por la validación o un error de bind/listen significa que el proceso no arrancó correctamente. Libera el puerto o selecciona uno válido, reinicia y repite la solicitud HTTP. Un build o un test satisfactorio no convierte estos fallos en readiness. Un `PORT` vacío se trata como no especificado y utiliza el predeterminado `4000`.

## Alcance de las comprobaciones

`npm run build --prefix apps/api` valida la compilación del API y `npm test --prefix apps/api` ejecuta sus tests automatizados. Son comprobaciones distintas del request HTTP contra un servidor independiente: los tests existentes usan `app.inject()` y no demuestran que haya un listener disponible. Informa los resultados de build, tests y cada arranque HTTP por separado.

Estas instrucciones y resultados se limitan a `apps/api`; no validan ni implican validación de `apps/web`, Docker Compose, Terraform ni harnesses Python.

## Conexión con el frontend

`apps/web` lee `NEXT_PUBLIC_API_BASE_URL`. Para apuntar al backend local:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Estructura

```text
apps/api/
├── src/
│   ├── app.ts             # instancia Fastify + plugins
│   ├── server.ts          # bootstrap + graceful shutdown
│   ├── config.ts          # parseo de variables de entorno
│   ├── routes/            # endpoints + JSON Schemas
│   └── data/              # datasets in-memory
├── tests/                 # vitest + app.inject
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Próximos pasos

- Sustituir los datasets in-memory por persistencia en BD privada (PRD: catálogo de ordenadores, dev/pre/prod).
- Añadir endpoints `POST/PUT/DELETE` y autenticación cuando se conecte la BD.
- Generar OpenAPI con `@fastify/swagger` cuando se estabilice el contrato.
