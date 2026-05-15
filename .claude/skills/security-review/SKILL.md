---
name: security-review
description: Revisa secretos, IAM, exposición pública, dependencias, contenedores, IaC y hallazgos críticos.
when_to_use: Cuando hay cloud, IaC, despliegue, dependencias, contenedores, APIs públicas o datos sensibles.
allowed-tools: Read Write Edit Bash Grep Glob
---

# Skill: Security Review

## Checklist

- Secretos en código.
- Variables sensibles en logs.
- IAM excesivo.
- Recursos públicos innecesarios.
- Base de datos expuesta.
- Dependencias vulnerables.
- Imágenes vulnerables.
- Falta de TLS.
- Falta de backups.
- Falta de aprobación productiva.

## Reglas

- Findings críticos bloquean.
- Excepciones requieren aprobación humana.
- Propón mitigación y riesgo residual.
