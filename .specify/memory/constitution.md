# Constitución del proyecto

**Estado:** propuesta; requiere revisión y ratificación humana antes de publicarse fuera de este checkout.  
**Versión propuesta:** 1.0.0  
**Fecha de ratificación:** pendiente de aprobación humana  
**Última modificación del borrador:** 2026-11-01

Esta constitución complementa las reglas ADLC de `CLAUDE.md`; no las sustituye ni autoriza cambios funcionales, infraestructura productiva o acciones externas.

## Principios

### 1. Especificación verificable antes de implementar

Todo cambio de comportamiento MUST tener una especificación explícita que identifique alcance, exclusiones y criterios de aceptación medibles antes de su implementación. Cada requisito obligatorio MUST poder vincularse a una prueba, comando o inspección reproducible. Una afirmación no comprobada MUST permanecer identificada como pendiente, no como cumplida.

### 2. Alcance mínimo y comportamiento preservado

Los cambios MUST permanecer dentro del alcance autorizado por la solicitud y su especificación. Un trabajo de documentación o verificación de arranque MUST NOT modificar el comportamiento de la aplicación. Si la implementación requiere ampliar el alcance o cambiar comportamiento, se detendrá ese cambio y se solicitará aprobación humana antes de proceder.

### 3. Evidencia acotada y reproducible

Toda afirmación de validación MUST nombrar el comando exacto, su directorio o selector de paquete y su resultado observado. La evidencia de una capa o paquete MUST NOT presentarse como validación de otras capas. Para el API, los comandos configurados son `npm test --prefix apps/api` y `npm run build --prefix apps/api`; ejecutarlos no valida `apps/web`, Terraform, Docker ni harnesses Python. Los límites de validación y cualquier comando no ejecutado MUST documentarse explícitamente.

### 4. Seguridad y manejo de datos

Secretos, credenciales y tokens MUST NOT almacenarse en código, especificaciones, reportes ni ejemplos como valores reales. La configuración sensible MUST permanecer fuera de los artefactos versionados. Las validaciones y reportes MUST evitar exponer valores sensibles; los ejemplos usarán datos ficticios o redactados.

### 5. Aprobación humana para acciones de alto impacto

Ningún agente puede inferir aprobación para publicar cambios externamente, abrir o actualizar un PR, crear issues, fusionar, desplegar o modificar infraestructura productiva. Estas acciones requieren la aprobación humana prevista por `CLAUDE.md` y el flujo aplicable. La revisión de un artefacto local no equivale a su aprobación ni autoriza su publicación.

### 6. Documentación operativa fiel al proyecto

Las instrucciones de arranque y validación MUST corresponder a scripts, archivos de configuración y dependencias presentes en el checkout. Cada procedimiento documentado MUST declarar sus precondiciones relevantes, resultado esperado y límites conocidos; no se presentarán comandos aspiracionales o no disponibles como verificados.

## Excepciones

Una excepción MUST documentarse antes de aplicarse en la especificación del cambio correspondiente, con el principio afectado, motivo, alcance, riesgo, mitigación, responsable de aprobación y condición o fecha de expiración. Las excepciones no pueden dispensar la prohibición de secretos ni los gates humanos de producción/publicación. Si una excepción exige cambiar esos controles, se requiere una enmienda constitucional aprobada por una persona antes de actuar.

## Gobernanza y enmiendas

Esta versión es un borrador y no se considera ratificada hasta que una persona revise y apruebe explícitamente el texto. El agente puede preparar cambios locales, pero MUST NOT declarar aprobación humana ni publicar externamente este documento.

Toda enmienda MUST incluir rationale, fecha, versión semántica propuesta, principios afectados y análisis de sincronización. Se propone incrementar:

- **PATCH** para correcciones editoriales que no cambien significado;
- **MINOR** para principios o requisitos aditivos compatibles;
- **MAJOR** para retirar, contradecir o reinterpretar materialmente un principio existente.

La aprobación de una enmienda corresponde a una persona. Tras la aprobación, se actualizan la fecha de ratificación o última modificación y la versión; hasta entonces, el nuevo texto permanece como propuesta. No se debe borrar la intención aprobada anterior sin explicar la transición en el cambio.

## Impacto de sincronización

Al ratificar o modificar esta constitución, revisar las fuentes relacionadas y actualizar únicamente las que tengan contenido divergente:

- `CLAUDE.md`: principios del proyecto, límites de autoridad y flujo ADLC;
- `specs/areas/platform/spec.md`: requisitos de aprobación humana e infraestructura;
- `openspec/config.yaml`: stack y comandos de validación reales, sin duplicar reglas ADLC;
- `.claude-portable/CLAUDE.md.template` y la documentación de onboarding pertinente, para mantener el harness portable alineado;
- `specs/001-startup-verification/` y cualquier especificación futura cuyo alcance o criterios dependan de estos principios;
- README y guías operativas de la capa afectada, cuando cambien los comandos o resultados esperados.

La sincronización MUST preservar las fuentes de verdad existentes: las reglas del flujo ADLC permanecen en `CLAUDE.md`, los comandos operativos en `openspec/config.yaml` y los requisitos de producto en sus especificaciones de área. La constitución no reescribe esas fuentes ni invalida historial archivado.
