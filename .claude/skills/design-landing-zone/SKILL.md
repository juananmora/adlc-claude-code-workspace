---
name: design-landing-zone
description: Diseña una landing zone cloud con red, identidad, entornos, seguridad, observabilidad y gobierno.
when_to_use: Cuando el usuario pide landing zone, plataforma cloud base, entornos dev/pre/prod o arquitectura cloud gobernada.
allowed-tools: Read Write Edit Grep Glob
---

# Skill: Design Landing Zone

## Instrucciones

Define:

- proveedor cloud asumido o alternativas;
- entornos;
- red y segmentación;
- exposición pública/privada;
- identidad y acceso;
- gestión de secretos;
- registro de contenedores;
- base de datos;
- observabilidad;
- políticas de seguridad;
- costes y límites;
- diagrama Mermaid si ayuda.

## Reglas

- Aplica mínimo privilegio.
- Producción requiere aprobación humana.
- Base de datos privada por defecto.
- Secretos gestionados por vault/secret manager.
