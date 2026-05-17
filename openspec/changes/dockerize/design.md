# Design — Dockerización con multi-stage

> Decisiones arquitectónicas del change `dockerize`.

## 1. Estructura general

```
repo/
├── docker-compose.yml          ← NUEVO. Orquesta los 2 servicios.
├── apps/
│   ├── api/
│   │   ├── Dockerfile          ← NUEVO. Multi-stage.
│   │   ├── .dockerignore       ← NUEVO.
│   │   └── (código existente)
│   └── web/
│       ├── Dockerfile          ← NUEVO. Multi-stage con Next standalone.
│       ├── .dockerignore       ← NUEVO.
│       ├── next.config.mjs     ← MODIFICADO: output: "standalone".
│       └── (código existente)
```

## 2. Dockerfile de `apps/api`

Multi-stage en 3 capas:

```dockerfile
# ---- Stage 1: deps ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- Stage 2: build ----
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build  # produce dist/

# ---- Stage 3: runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 4000
USER node
CMD ["node", "dist/server.js"]
```

**Justificación:**

- `deps` separado del `build` para aprovechar la cache de Docker cuando
  solo cambia el código.
- `npm ci` (no `npm install`) para reproducibilidad estricta.
- `USER node` para no correr como root (security buena práctica).
- `EXPOSE 4000` es documental; el bind real viene en compose.

## 3. Dockerfile de `apps/web`

Next.js 15 soporta `output: "standalone"` que copia solo lo necesario.
Estructura similar al API pero con la fase final que solo copia el
`.next/standalone` + `public/` + `.next/static`:

```dockerfile
# ---- Stage 1: deps ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- Stage 2: build ----
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# El cliente JS necesita la URL pública en build time
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
RUN npm run build

# ---- Stage 3: runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
USER node
CMD ["node", "server.js"]
```

**Justificación:**

- `output: "standalone"` en `next.config.mjs` es clave. Sin él, la
  imagen final pesaría >1GB.
- `NEXT_PUBLIC_*` se baked en build time (esto es Next vanilla). El
  default `http://localhost:4000` cubre el caso compose con puerto
  publicado. Si se cambia, hay que rebuild.
- `HOSTNAME=0.0.0.0` para que Next escuche en todas las interfaces del
  contenedor, no solo en localhost.
- `USER node` igual que en API.

## 4. `docker-compose.yml`

```yaml
services:
  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    container_name: ironheart-api
    ports:
      - "4000:4000"
    environment:
      NODE_ENV: production
      PORT: 4000
      CORS_ORIGIN: "http://localhost:3000,http://web:3000"
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:4000/products"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 30s
    networks:
      - ironheart

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_BASE_URL: "http://localhost:4000"
    container_name: ironheart-web
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      HOSTNAME: "0.0.0.0"
    depends_on:
      api:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 45s
    networks:
      - ironheart

networks:
  ironheart:
    driver: bridge
```

**Decisiones:**

- `container_name` explícito (`ironheart-api`, `ironheart-web`) para
  que `docker start <nombre>` funcione literalmente como pide el
  usuario tras el primer `up`.
- `depends_on` con `condition: service_healthy` asegura que web no
  arranca hasta que api responde 200 en `/products`.
- Red `ironheart` bridge: los servicios se ven entre sí por nombre
  (`api` resuelve al contenedor api). El navegador del host no usa
  esta red — usa puertos publicados.
- `wget --spider` está disponible en `node:22-alpine` sin instalar
  nada extra.
- `CORS_ORIGIN` incluye ambos orígenes (host con puerto publicado +
  red interna) por si algún test E2E futuro corre desde dentro.

## 5. `.dockerignore` (idéntico patrón en api y web)

```
node_modules
.next
dist
.git
.vscode
.idea
*.log
.env*.local
test-results
playwright-report
coverage
.DS_Store
```

**Justificación:** sin esto, el build COPIA `node_modules` del host (que
fue resuelto para tu arquitectura, no la del contenedor), invalidando
todo el sentido de Docker. Crítico.

## 6. Cambio en `next.config.mjs`

```js
const nextConfig = {
  output: "standalone",  // ← nuevo, para Docker
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};
```

`output: "standalone"` es no-op cuando se ejecuta `next dev` o `next
start` normales, así que no rompe el flujo de desarrollo.

## 7. Verificación end-to-end

1. `docker compose build` debe completar sin warnings sospechosos.
2. `docker compose up -d` → ambos servicios `healthy` en `docker ps`.
3. `curl http://localhost:4000/products` → 200 con JSON.
4. `curl http://localhost:3000` → 200 con HTML del catálogo.
5. Navegador en `http://localhost:3000`: ver productos, navegar a
   `/albums`, `/games`, `/about`. 0 errores en consola.
6. `docker compose down` y `docker compose start` deben funcionar como
   ciclo de pausa/reanudación.

## 8. Tamaño objetivo de imágenes

| Imagen | Objetivo | Mecanismo |
|---|---|---|
| `apps/api` | <200 MB | node:22-alpine base (~50MB) + dist + deps prod |
| `apps/web` | <300 MB | node:22-alpine + Next standalone (no incluye devDeps) |

Si alguna pasa de 500MB, hay un problema (probablemente devDeps colándose).
