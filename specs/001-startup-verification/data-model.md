# Modelo de datos

## Aplicabilidad

**N/A: esta feature no define ni altera datos de dominio.** Solo documenta cómo iniciar un proceso local existente y comprobar mediante HTTP la respuesta de `GET /health`. No hay entidades nuevas, almacenamiento, esquema, migración, retención, privacidad de datos ni ciclo de vida de datos que modelar.

El cuerpo `{ "status": "ok" }` es una respuesta efímera del contrato API existente; no constituye un modelo persistido ni un nuevo campo de dominio. El diseño no añadirá endpoints ni cambiará el cuerpo de respuesta.