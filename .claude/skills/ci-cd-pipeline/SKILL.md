---
name: ci-cd-pipeline
description: Crea pipelines CI/CD con build, test, seguridad, despliegues por entorno y aprobación humana para producción.
when_to_use: Cuando el proyecto necesita GitHub Actions, Jenkins, Azure DevOps u otro pipeline de automatización.
allowed-tools: Read Write Edit MultiEdit Bash Grep Glob
---

# Skill: CI/CD Pipeline

## Instrucciones

Define workflows para:

- validación de PR;
- build;
- tests;
- escaneo de seguridad;
- build de contenedor;
- publicación de artefactos;
- despliegue en dev;
- aprobación para pre/prod;
- smoke tests post-deploy.

## Reglas

- Producción siempre con aprobación humana.
- No exponer secretos en logs.
- Fallos críticos bloquean merge.
