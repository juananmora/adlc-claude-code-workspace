# Security gate — iter-10 (sección `/consoles`)

## Skills ejecutadas
- Skill(skill: "security-review") → aplicada

## Resumen ejecutivo

Iter-10 añade el catálogo `/consoles` (10 entradas estáticas, 2 endpoints REST, ficha de detalle SSR + grid CSR). El delta es funcional puro: **no introduce dependencias, no toca CORS ni Dockerfiles, no maneja secretos, no usa `dangerouslySetInnerHTML`**. Las dos suites `npm audit --omit=dev --audit-level=high` (API y web) devuelven `found 0 vulnerabilities`. Los `package.json` no han cambiado (`git diff --stat HEAD` vacío). Las 10 portadas en `apps/web/public/covers/consoles/` son JPEG legítimos < 53 KB cada una.

El endpoint `GET /consoles/:id` declara schema JSON con `additionalProperties: false`, `maxLength` en strings y un `pattern: ^[A-Za-z0-9_.-]+$` para el `id`, lo que impide IDs maliciosos antes de llegar al data-layer. El error handler global no expone stack traces y delega 404 a un mensaje sanitizado. La ficha `/consoles/[id]/page.tsx` renderiza todos los campos como texto plano vía JSX. La búsqueda libre del grid se envía al backend, que la valida con el mismo schema.

Único hallazgo no bloqueante: en `apps/web/lib/consoles-api.ts:55` la función `fetchConsole(id)` concatena el `id` directamente en la URL sin `encodeURIComponent`. Mismo patrón ya presente en `lib/api.ts:58` para products. No es explotable en flujo normal (Next route param valida + backend valida con `pattern`), pero se queda como deuda LOW para coherencia defensiva.

Veredicto: **APROBADO CON OBSERVACIONES** (1 LOW, no bloquea). El SEC-9-M1 previo (imagen API 398 MB) sigue diferido a iter-11 según el contexto recibido.

## Findings

| ID | Severidad | Archivo | Descripción | Recomendación |
|---|---|---|---|---|
| SEC-10-L1 | LOW | `apps/web/lib/consoles-api.ts:55` | `fetchConsole(id)` interpola `id` en la URL sin `encodeURIComponent`. En la práctica el backend rechaza con 400 cualquier `id` que no cumpla `^[A-Za-z0-9_.-]+$`, así que no hay path traversal real, pero el patrón es frágil si en el futuro se afloja el schema o se reutiliza el cliente desde otro contexto. | Aplicar `encodeURIComponent(id)` al construir la URL. Mismo arreglo recomendado para `lib/api.ts:58` (deuda heredada, fuera del scope iter-10). |

No se han identificado findings CRITICAL, HIGH ni MEDIUM en el delta de iter-10.

## Evidencias / outputs literales

### 1. `npm audit` (API)
```
$ cd apps/api && npm audit --omit=dev --audit-level=high
found 0 vulnerabilities
```

### 2. `npm audit` (web)
```
$ cd apps/web && npm audit --omit=dev --audit-level=high
found 0 vulnerabilities
```

### 3. `package.json` sin cambios
```
$ git diff --stat HEAD apps/api/package.json apps/web/package.json
(vacío)
$ git status --short apps/api/package.json apps/web/package.json
(vacío)
```
Confirma que iter-10 no añade dependencias.

### 4. Portadas `apps/web/public/covers/consoles/`
```
Name              Length (bytes)
----              --------------
dreamcast.jpg      25 662
game-boy.jpg       52 409
nes.jpg            28 177
nintendo-64.jpg    11 877
playstation-2.jpg  37 617
playstation.jpg    39 634
sega-genesis.jpg    8 428
snes.jpg           26 889
wii.jpg            31 019
xbox.jpg            7 094
```
10 archivos JPEG, todos < 53 KB, muy por debajo del umbral 100 KB. No se observan binarios sospechosos ni ejecutables disfrazados.

### 5. Búsqueda de secretos en el delta
```
$ grep -i -E "(password|secret|api[_-]?key|token)" \
    apps/api/src/data/consoles.ts \
    apps/api/src/routes/consoles.ts \
    apps/web/lib/consoles-api.ts \
    apps/web/app/consoles/**
No files found
```

### 6. Búsqueda de `dangerouslySetInnerHTML`
```
$ grep dangerouslySetInnerHTML apps/web/app/consoles apps/web/components/consoles-grid.tsx
No files found
```

### 7. Diff de `iron-deck-header.tsx`
Solo añade un `<Link href="/consoles">` entre Games y About, sin nueva lógica ni handlers. Verificado.

### 8. Schema de validación en `routes/consoles.ts`
```ts
const idParamSchema = {
  type: "object",
  required: ["id"],
  additionalProperties: false,
  properties: {
    id: { type: "string", minLength: 1, maxLength: 128,
          pattern: "^[A-Za-z0-9_.-]+$" },
  },
} as const;

const listQuerySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    q: { type: "string", maxLength: 200 },
    manufacturer: { type: "string", maxLength: 50 },
    generation: { type: "string", maxLength: 3 },
  },
} as const;
```
Cobertura completa: rechaza props extra, limita longitudes, restringe charset del `id`. Path traversal (`../`, `%2F`) bloqueado a nivel de Fastify antes de llegar al handler.

### 9. Error handler global (`apps/api/src/app.ts:37-47`)
No expone `error.stack`; solo `statusCode`, `error.name`, `error.message`. Logging de 500 server-side únicamente. Conforme.

## Checklist canónico de la skill

- Secretos en código: **OK** (ninguno en el delta).
- Variables sensibles en logs: **OK** (catálogo público, sin PII).
- IAM excesivo: **N/A** (sin cambios IaC en iter-10).
- Recursos públicos innecesarios: **N/A** (sin cambios IaC).
- Base de datos expuesta: **N/A** (catálogo en memoria).
- Dependencias vulnerables: **OK** (`npm audit` 0 findings ambos workspaces).
- Imágenes vulnerables: **deuda heredada** SEC-9-M1 (API image 398 MB), diferida a iter-11 por decisión previa.
- Falta de TLS: **N/A** en local; herencia compose ya auditada.
- Falta de backups: **N/A** (sin estado persistente).
- Falta de aprobación productiva: **N/A** (iter-10 no despliega).

## Veredicto final

**APROBADO CON OBSERVACIONES**

- 0 CRITICAL / 0 HIGH / 0 MEDIUM.
- 1 LOW (SEC-10-L1) documentado como deuda de robustez. No bloquea.
- Hallazgo previo SEC-9-M1 (imagen API 398 MB) continúa diferido a iter-11.

La sección `/consoles` puede pasar a Fase 10 (reviewer).
