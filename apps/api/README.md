# apps/api — Catalog API

Servicio HTTP en **Node.js + TypeScript + Fastify** que expone el catálogo de productos consumido por `apps/web`. Hasta ahora la fuente de datos es un fichero in-memory (`src/data/products.ts`); la integración con base de datos privada se planificará en una iteración posterior según el PRD `specs/computer-catalog-landing-zone-prd.md`.

## Endpoints

| Método | Ruta                  | Descripción                                                                 |
| ------ | --------------------- | --------------------------------------------------------------------------- |
| GET    | `/health`             | Health-check. Devuelve `{ "status": "ok" }`.                                |
| GET    | `/products`           | Listado de productos. Acepta `?q=` (también `?search=`) y `?category=`.     |
| GET    | `/products/:id`       | Ficha de un producto. Devuelve `404` si no existe.                          |

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

## Scripts

```bash
npm install         # instala dependencias
npm run dev         # arranca con tsx watch (recarga en caliente)
npm run build       # compila a dist/
npm start           # ejecuta dist/server.js
npm test            # ejecuta tests con vitest
```

Por defecto el servicio escucha en `http://localhost:4000`.

## Variables de entorno

Documentadas en `.env.example`:

| Variable      | Default                  | Descripción                                            |
| ------------- | ------------------------ | ------------------------------------------------------ |
| `PORT`        | `4000`                   | Puerto HTTP.                                           |
| `HOST`        | `0.0.0.0`                | Interfaz de escucha.                                   |
| `CORS_ORIGIN` | `http://localhost:3000`  | Orígenes permitidos (coma-separados).                  |
| `NODE_ENV`    | `development`            | Modo de ejecución. Con `test` se deshabilita logging.  |

Copia `.env.example` a `.env` y ajusta valores. **No** se hardcodean credenciales en código.

## Conexión con el frontend

`apps/web` lee `NEXT_PUBLIC_API_BASE_URL`. Para apuntar al backend local:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Ya configurado en `apps/web/.env.example` y `apps/web/.env.local`.

## Estructura

```
apps/api/
├── src/
│   ├── app.ts             # instancia Fastify + plugins (cors, sensible)
│   ├── server.ts          # bootstrap + graceful shutdown
│   ├── config.ts          # parseo de variables de entorno
│   ├── types.ts           # tipos Product / ProductCategory
│   ├── routes/
│   │   └── products.ts    # endpoints + JSON Schemas
│   └── data/
│       └── products.ts    # dataset in-memory (14 productos)
├── tests/
│   └── products.test.ts   # vitest + app.inject
├── .env.example
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Próximos pasos

- Sustituir el dataset in-memory por persistencia en BD privada (PRD: catálogo de ordenadores, dev/pre/prod).
- Añadir endpoints `POST/PUT/DELETE` y autenticación cuando se conecte la BD.
- Generar OpenAPI con `@fastify/swagger` cuando se estabilice el contrato.
