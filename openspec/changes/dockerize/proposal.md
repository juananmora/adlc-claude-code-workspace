# Proposal — Dockerizar API y web en 2 contenedores

> **Change ID:** `dockerize`
> **Iteración:** iter-9
> **Estado:** activa
> **Áreas afectadas:** nueva área `deployment-docker`.

## Objetivo

Empaquetar `apps/api` y `apps/web` cada una en su propia imagen Docker
de producción, orquestadas con `docker compose` para que cualquier
desarrollador (o cualquier máquina con Docker) pueda arrancar la
aplicación completa con un único comando:

```bash
docker compose up -d
```

Y reanudarla después con `docker compose start`.

## Motivación

- **Onboarding instantáneo** sin necesidad de Node 22, npm install, ni
  configurar puertos manualmente.
- **Reproducibilidad**: la misma imagen corre igual en dev, demo y
  cualquier registry futuro.
- **Aislamiento**: la API y el frontend no contaminan el host con sus
  dependencias.
- **Banco de pruebas** del flujo ADLC con `cicd-engineer` y su skill
  `ci-cd-pipeline`.

## Alcance

**Incluye:**

- `apps/api/Dockerfile` multi-stage (deps → build → runtime) sobre
  `node:22-alpine`. Imagen final solo con `dist/` + dependencias de
  producción.
- `apps/web/Dockerfile` multi-stage usando Next.js standalone output
  para imagen mínima.
- `apps/api/.dockerignore` y `apps/web/.dockerignore` para builds
  rápidos y sin filtrar secretos.
- `docker-compose.yml` en la raíz con 2 services (`api`, `web`), red
  interna, healthchecks, variables de entorno.
- Ajustar `apps/web/next.config.mjs` para `output: "standalone"`.
- Sección en `README.md` explicando cómo arrancar con Docker.

**Fuera de alcance:**

- Push a un registry externo (GHCR, Docker Hub).
- Despliegue a un cluster (Kubernetes, ECS, Azure Container Apps real).
- Modo desarrollo con hot-reload dentro de Docker (queda como deuda
  para iter-10 si se necesita).
- CI/CD que construya las imágenes en GitHub Actions.

## Decisiones técnicas (confirmadas con humano)

1. **Perfil: producción.** Multi-stage con builds compilados. Imágenes
   ligeras (objetivo <300MB cada una).
2. **docker compose up.** Un solo comando arranca ambos servicios.
   Compose crea la red, expone los puertos y propaga las variables.
3. **Comunicación API↔web:**
   - Browser (CSR) → `http://localhost:4000` (puerto publicado del host).
   - SSR de Next dentro del contenedor → `http://api:4000` (nombre del
     servicio en la red interna de compose).
   - Implementación: `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`
     llega como build arg al `apps/web` build (afecta solo CSR);
     `API_BASE_URL_INTERNAL=http://api:4000` opcional para SSR si
     necesitamos diferenciar (mejor: que ambos usen `localhost:4000`
     publicado y compose mapee la red — más simple).
4. **Healthchecks:**
   - API: `wget --spider http://localhost:4000/products || exit 1`
     cada 10s con 30s de gracia inicial.
   - Web: `wget --spider http://localhost:3000 || exit 1` cada 10s con
     45s de gracia (Next tarda más en arrancar).
   - `depends_on: api: condition: service_healthy` para que web no
     marque ready hasta que api responda.

## Rollback

Si Docker falla o introduce regresión:

1. `docker compose down -v` para todo.
2. `git revert <commit-iter-9>` revierte Dockerfiles, compose y
   next.config.
3. Sin cambios destructivos en el código: apps/api y apps/web siguen
   funcionando con `npm run dev` como antes.

## Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Imagen `node:22-alpine` con CVE futuro | MEDIO | Pin a hash específico recomendable; documentar deuda. |
| Next standalone deja archivos fuera del bundle | MEDIO | Probar build localmente antes de aceptar; verificar `public/` y `.next/static` copiados. |
| Comunicación API↔web rota por CORS o por nombres de host | MEDIO | Smoke MCP real apuntando a `localhost:3000` desde el navegador del host. |
| Puerto 3000 o 4000 ocupado en el host | BAJO | Mensaje claro en README + posibilidad de override con `.env`. |
| Imágenes pesadas (>500MB cada una) | BAJO | Multi-stage + standalone debe dejarlas <300MB. Verificar con `docker images`. |

## Criterio de éxito

`docker compose up -d` desde un clone limpio del repo, sin Node
instalado en el host, arranca ambos servicios y `http://localhost:3000`
muestra el catálogo con productos servidos por `http://localhost:4000`
sin errores en consola.
