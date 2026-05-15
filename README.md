# ADLC Claude Code Workspace

Plantilla de workspace para Claude Code orientada a un **Agentic Development Lifecycle (ADLC)**, **Spec-Driven Development (SDD)** y **Harness Engineering**.

La estructura está preparada para Claude Code:

```text
.claude/
  agents/                 # Subagents en Markdown con YAML frontmatter
  skills/<skill>/SKILL.md # Skills con SKILL.md y YAML frontmatter
specs/                    # Especificaciones del caso de uso
scripts/                  # Validaciones locales
docs/                     # Documentación de gobierno del workspace
```

## Cómo usarlo

1. Descomprime el ZIP en la raíz de un repositorio.
2. Abre Claude Code en esa carpeta.
3. Ejecuta `/agents` para comprobar que los subagents aparecen.
4. Ejecuta `/skills` para comprobar que las skills aparecen.
5. Pide al orquestador algo como:

```text
Use the ADLC orchestrator to plan a landing zone for a computer-store product catalog.
```

## Caso de uso incluido

El caso de uso base es:

> Crear una landing zone cloud para alojar una aplicación de catálogo de productos de una tienda de ordenadores.

Incluye agentes para:
- orquestación ADLC;
- arquitectura cloud;
- Terraform/IaC;
- backend API;
- frontend catálogo;
- CI/CD;
- QA;
- seguridad;
- observabilidad;
- revisión final.

## Validación

Puedes validar frontmatter y estructura con:

```bash
python scripts/validate_claude_workspace.py
```

## Nota

Esta plantilla no despliega infraestructura real. Está pensada como punto de partida gobernado: especificaciones, agentes, skills, validaciones, criterios de aceptación y puntos de aprobación humana.
