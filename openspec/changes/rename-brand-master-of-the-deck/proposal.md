# Proposal — rename-brand-master-of-the-deck: IRON DECK → MASTER OF THE DECK

Slug: rename-brand-master-of-the-deck
Iteración: iter-13

> **Estado**: borrador pendiente de aprobación humana (gate G2 de criterios y G3 de plan).
> **Tipo**: change (propuesta activa) → al cerrar mueve a `specs/areas/catalog-viewer/spec.md`.

## Objetivo

Sustituir la marca visible del sitio `apps/web` "IRON DECK" por "MASTER OF THE DECK", manteniendo paleta, tipografía y estética metálica. Fuente: [[adlc-prd]] y [[adlc-solicitud]].

## Por qué

- La solicitud pide un cambio de título del sitio. La marca aparece en cabecera, pie, hero, About, metadatos y tests E2E.

## Alcance

- Wordmark de cabecera (`apps/web/components/iron-deck-header.tsx`) y su `aria-label` de inicio (RF-01, RF-05).
- Copyright y wordmark del pie (`apps/web/components/iron-deck-footer.tsx`) (RF-02).
- Hero de la home (`apps/web/components/hero.tsx`) (RF-06).
- Página `/about` (h1 y cuerpo) (RF-04).
- `title` y `description` de `apps/web/app/layout.tsx` y de los `layout.tsx` de sección (RF-03).
- Tests E2E `apps/web/e2e/about.spec.ts`, `responsive.spec.ts`, `home.spec.ts` (RF-07).
- Textos visibles restantes de `apps/web` que contengan la marca (p. ej. créditos de `apps/web/lib/credits.ts`, si aplica).

## Fuera de alcance

- Identificadores técnicos y clases CSS: `IronDeckHeader`, `iron-deck-header.tsx`, `iron-deck-footer.tsx`, clases CSS (RNF-01, AC-08).
- Paleta, tipografía y estilo visual.
- `specs/**` (salvo el PRD), `openspec/**` (salvo este change), `reports/**`, `docs/**`, `specs/acceptance-criteria-archive.md`, `.claude-portable/**` (pendiente de confirmación, ver preguntas).
- Cambios fuera de `apps/web`. El comentario de `apps/api/src/data/tours.ts` se deja tal cual (PRD).

## Preguntas abiertas para G2 (no bloquean el plan, sí el cierre)

1. **Casing**: el PRD fija "MASTER OF THE DECK" en mayúsculas; los criterios (AC-02, AC-04, AC-05, AC-10) asumen "Master of the Deck" en metadatos y en el texto de About. Hay que decidir una forma única por superficie antes de implementar.
2. **Footer**: el PRD no lo incluye explícitamente; AC-03 sí. Se incluye porque el wordmark del pie es marca visible.
3. **`home.spec.ts`**: no comprueba la marca (solo tiene un comentario); se excluye de la edición salvo que G2 indique lo contrario.
4. **`.claude-portable/**`**: cita "IRON DECK" como línea gráfica. Fuera de alcance hasta confirmación.

## Agentes necesarios

| Agente | Participa | Motivo |
|---|---|---|
| `frontend-engineer` | Sí | Cambia textos y metadatos de `apps/web`. |
| `qa-engineer` | Sí (obligatorio) | Actualiza E2E y ejecuta la suite; smoke con Chrome DevTools MCP (AC-09). |
| `security-engineer` | Sí (obligatorio, Fase 7) | Gate de seguridad: scope, headers, sin cambios de dependencias. |
| `reviewer` | Sí (obligatorio, Fase 10) | Auditoría independiente antes de cierre. |
| `backend-engineer` | No | No se tocan `apps/api/**` (PRD). |
| `terraform-engineer`, `cloud-architect` | No | Sin cambios de infraestructura. |
| `cicd-engineer` | No | Sin cambios en `.github/workflows/**`. |
| `observability-engineer` | No | Sin cambios de logs, métricas ni alertas. |

## Riesgos

- Un rename de texto puede romper selectores E2E que dependen del texto (`getByLabel`, `getByRole`). Mitigación: T-02 actualiza los tests y ejecuta la suite completa.
- Cambiar `<title>` puede afectar a SEO. Mitigación: confirmar casing en G2 (pregunta 1).
