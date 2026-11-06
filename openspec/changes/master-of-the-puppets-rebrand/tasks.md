# Tareas — Cambio de marca IRON DECK → MASTER OF THE PUPPETS

Slug: master-of-the-puppets-rebrand
Iteración: iter-13

Cada tarea es una sub-issue de la issue #31. La matriz de trazabilidad enlaza cada requisito del PRD con sus tareas.

```yaml
tasks:
  - id: T-01
    title: 'Sustituir IRON DECK por MASTER OF THE PUPPETS en el texto visible de apps/web (frontend-engineer)'
    covers:
      - RF-01
      - RF-02
      - RF-03
      - RF-04
      - RF-05
      - RF-06
      - RF-08
      - RNF-01
      - RNF-04
    depends_on: []
    verification: 'npm run build en apps/web; grep IRON DECK en apps/web sin texto visible; ls apps/web/components/iron-deck-*.tsx'
  - id: T-02
    title: 'Actualizar selectores e2e de home, about y responsive y ejecutar Playwright contra Docker (qa-engineer)'
    covers:
      - RF-07
      - RNF-02
    depends_on:
      - T-01
    verification: 'npx playwright test en apps/web contra docker compose up'
  - id: T-03
    title: 'Security gate Fase 7 sobre el delta; comprobar apps/api sin cambios y package.json intacto (security-engineer)'
    covers:
      - RNF-03
      - RNF-04
      - RNF-05
    depends_on:
      - T-01
      - T-02
    verification: 'reports/iter-13/security-engineer.md con veredicto sin CRITICAL/HIGH; git diff --stat -- apps/api vacío'
  - id: T-04
    title: 'Reviewer independiente Fase 10 contra PRD y criterios (reviewer)'
    covers:
      - RF-01
      - RF-02
      - RF-03
      - RF-04
      - RF-05
      - RF-06
      - RF-07
      - RF-08
      - RNF-01
      - RNF-02
      - RNF-03
      - RNF-04
      - RNF-05
    depends_on:
      - T-03
    verification: 'reports/iter-13/reviewer.md con veredicto APROBAR'
  - id: T-05
    title: 'Auditoría criterio por criterio, verify-report y DEC-NNN en openspec/config.yaml (orquestador)'
    covers:
      - RNF-04
    depends_on:
      - T-04
    verification: 'openspec/changes/master-of-the-puppets-rebrand/verify-report.md con tabla criterio/evidencia/estado'
```
