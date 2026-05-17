# `specs/areas/` — specs vivos por dominio

Cada subdirectorio aquí declara el **estado actual** de un dominio del producto, en formato Given/When/Then + RFC 2119 (MUST/SHALL/SHOULD/MAY).

## Estructura

```
specs/areas/
├── platform/       → fundación cloud (entornos, red, identidad, secretos, gates humanos)
├── infra-azure/    → IaC Terraform sobre Azure
├── catalog-products/ → /products + carrito de ordenadores
├── cart/           → carrito de compra (legacy iter-2, parte de catalog-products)
├── albums/         → catálogo de 22 discos heavy metal
└── games/          → catálogo de 10 clásicos Amstrad CPC
```

Cada área tiene un `spec.md` con:

- **Resumen** del dominio (1-3 frases).
- **Criterios verificables** en G/W/T + RFC 2119.
- **Evidencia** por criterio (test, archivo, comando o captura reproducible).

## Diferencia con `specs/acceptance-criteria-archive.md`

- El archivo `acceptance-criteria-archive.md` es el **log histórico** de iter-1 a iter-7, mantenido tal cual para trazabilidad.
- `specs/areas/<area>/spec.md` es el **estado vivo** del dominio. Cuando una iteración futura cambia un comportamiento, se edita el spec del área correspondiente.

## Cuándo crear un área nueva

Crea `specs/areas/<slug>/spec.md` cuando una iteración introduce un dominio que no encaja en los existentes (ej. "monitoring", "auth", "payments").

## Cómo se relaciona con `openspec/changes/<slug>/`

- Una iteración propone cambios en `openspec/changes/<slug>/proposal.md`.
- El delta de criterios va en `openspec/changes/<slug>/specs/<area>.md` con el formato `## ADDED Requirements`, `## MODIFIED Requirements`, `## REMOVED Requirements`.
- Al archivar la iteración tras `/ship`, el delta se merge al `specs/areas/<area>/spec.md` correspondiente.
