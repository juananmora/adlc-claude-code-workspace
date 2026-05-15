# Harness Engineering del workspace

El harness es el sistema de control alrededor de los agentes.

## Componentes

- Specs versionadas.
- Agentes con permisos limitados.
- Skills reutilizables.
- Validaciones automáticas.
- Gates de seguridad.
- Aprobaciones humanas.
- Logs y evidencias.
- Bucles de corrección.

## Bucles de corrección

```text
generar → validar → leer fallo → corregir → volver a validar → escalar si no se resuelve
```

## Acciones críticas

Requieren aprobación humana:

- creación de recursos cloud productivos;
- despliegue a producción;
- excepción de seguridad;
- coste superior al umbral;
- uso de una skill no aprobada;
- acceso a secretos.
