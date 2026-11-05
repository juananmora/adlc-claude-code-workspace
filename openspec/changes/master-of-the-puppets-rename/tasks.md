Slug: master-of-the-puppets-rename
Iteración: iter-13

# Tareas: master-of-the-puppets-rename

Cada tarea es una sub-issue de la issue #32. Las tareas cubren los requisitos del PRD (RF-01..RF-07, RNF-01..RNF-05) y el riesgo de marca.

```yaml
tasks:
  - id: T-01
    title: 'Sustituir el título y la descripción meta de la home'
    agent: frontend-engineer
    covers: [RF-01]
    depends_on: []
    verification: 'apps/web/app/layout.tsx y e2e/home.spec.ts (AC-01, AC-02)'
  - id: T-02
    title: 'Sustituir el wordmark y el aria-label del header'
    agent: frontend-engineer
    covers: [RF-02]
    depends_on: []
    verification: 'apps/web/components/iron-deck-header.tsx y e2e/responsive.spec.ts:13 (AC-03)'
  - id: T-03
    title: 'Sustituir el copyright del footer'
    agent: frontend-engineer
    covers: [RF-03]
    depends_on: []
    verification: 'apps/web/components/iron-deck-footer.tsx:23 (AC-04)'
  - id: T-04
    title: 'Sustituir la etiqueta del hero'
    agent: frontend-engineer
    covers: [RF-04]
    depends_on: []
    verification: 'apps/web/components/hero.tsx:34 (AC-05)'
  - id: T-05
    title: 'Sustituir el texto y el h1 de la página About y su e2e'
    agent: frontend-engineer
    covers: [RF-05]
    depends_on: []
    verification: 'apps/web/app/about/page.tsx y e2e/about.spec.ts:25 (AC-06)'
  - id: T-06
    title: 'Sustituir los títulos de sección y de ficha de producto'
    agent: frontend-engineer
    covers: [RF-06]
    depends_on: []
    verification: 'layouts de albums, consoles, games, tours y products/[id]/page.tsx (AC-07)'
  - id: T-07
    title: 'Eliminar las apariciones de IRON DECK en texto visible y revisar el README'
    agent: frontend-engineer
    covers: [RF-07]
    depends_on: [T-01, T-02, T-03, T-04, T-05, T-06]
    verification: 'grep -rn IRON DECK apps/web/app apps/web/components devuelve 0 texto visible (AC-08)'
  - id: T-08
    title: 'Actualizar tests Vitest y Playwright sin cambiar el número de casos'
    agent: qa-engineer
    covers: [RF-07, RNF-02]
    depends_on: [T-07]
    verification: 'npm test en apps/api y npx playwright test en apps/web (AC-10)'
  - id: T-09
    title: 'Smoke de consola y network con Chrome DevTools MCP en las rutas clave'
    agent: qa-engineer
    covers: [RNF-01]
    depends_on: [T-07]
    verification: 'list_console_messages sin errores nuevos en /, /about, /albums, /consoles, /games, /tours y una ficha (AC-09)'
  - id: T-10
    title: 'Verificar build, tsc y ausencia de dependencias nuevas'
    agent: frontend-engineer
    covers: [RNF-03, RNF-04]
    depends_on: [T-07]
    verification: 'npm run build y npx tsc --noEmit en apps/web; git diff de package.json sin cambios (AC-11, AC-12)'
  - id: T-11
    title: 'Revisión de seguridad (Fase 7)'
    agent: security-engineer
    covers: [RNF-04]
    depends_on: [T-08, T-09, T-10]
    verification: 'reports/iter-13/security-engineer.md sin hallazgos CRITICAL ni HIGH abiertos'
  - id: T-12
    title: 'Revisión independiente (Fase 10) y auditoría de criterios'
    agent: reviewer
    covers: [RF-01, RF-02, RF-03, RF-04, RF-05, RF-06, RF-07, RNF-01, RNF-02, RNF-03, RNF-04, RNF-05]
    depends_on: [T-11]
    verification: 'reports/iter-13/reviewer.md con veredicto APROBAR; verify-report.md con tabla criterio | evidencia | estado'
  - id: T-13
    title: 'Registrar la aprobación de la marca y la deuda de identificadores'
    agent: humano
    covers: [RNF-05]
    depends_on: [T-12]
    verification: 'Decisión humana registrada en el gate G2 (AC-13, AC-14)'
```

## Agentes que no participan

- `backend-engineer`, `cloud-architect`, `terraform-engineer`, `cicd-engineer` y `observability-engineer`: sus stages se saltan porque el cambio no toca API, infraestructura, workflows ni observabilidad.

## Dependencias

- T-01 a T-06 son independientes y pueden ir en un solo agente en serie (`frontend-engineer`), ya que tocan ficheros distintos pero comparten el mismo ejecutor.
- T-07 depende de T-01..T-06. T-08, T-09 y T-10 dependen de T-07.
- T-11 (security) y T-12 (reviewer) van al final.
