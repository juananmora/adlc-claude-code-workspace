# PRD: Landing zone para catálogo de productos de tienda de ordenadores

## Objetivo

Crear una landing zone cloud segura y automatizada para desplegar una aplicación web de catálogo de productos de una tienda de ordenadores.

## Alcance

- Entornos dev, pre y prod.
- Frontend público para catálogo.
- Backend/API para productos.
- Base de datos privada.
- CI/CD.
- Observabilidad.
- Seguridad desde el diseño.
- Gestión de secretos.
- Validaciones automáticas.

## Fuera de alcance inicial

- Pasarela de pago.
- Checkout completo (formulario y confirmación).
- Integración real con ERP.
- Gestión avanzada de usuarios.
- Recomendador de productos.

## Iteración 2 — alcance ampliado

- Identidad visual Accenture (negro + púrpura corporativo #A100FF) sobre fondo claro.
- Carrito de la compra del lado cliente con persistencia local, drawer desde header y página `/cart`.
- Infraestructura Azure concreta: Container Apps (API), Static Web Apps/Storage+CDN (web), Azure SQL privado, Key Vault, Log Analytics, Application Insights.

## Iteración 3 — catálogo de discos de heavy metal

- Sección secundaria de catálogo de discos clásicos de heavy metal (Iron Maiden, Judas Priest, Metallica, Led Zeppelin y similares).
- Entrada en el menú principal del header con link a `/albums`.
- Listado con grid responsive, filtros por banda, ficha individual `/albums/[id]`.
- API REST en el servicio existente: `GET /albums`, `GET /albums/:id`, filtro por banda.
- Dataset mock en memoria (≥12 discos) — sin tienda real, sin compra, mismas reglas que el catálogo de ordenadores.
- Sin secretos en código. Reutiliza la identidad Accenture aplicada en iteración 2.

## Requisitos funcionales

- Ver listado de productos.
- Buscar productos por texto.
- Filtrar por categoría.
- Ver ficha individual.
- Consultar precio, stock y especificaciones.
- Gestionar productos desde API administrativa básica.
- Añadir productos al carrito desde card y ficha.
- Ver carrito (drawer y página `/cart`) con líneas, subtotal y total.
- Modificar cantidades y eliminar líneas.
- Persistir el carrito entre recargas (localStorage).

## Requisitos no funcionales

- Infraestructura reproducible.
- Separación de entornos.
- No secretos en código.
- Base de datos no expuesta públicamente.
- Producción con aprobación humana.
- Logs, métricas y alertas.
- Tests automáticos.

## Criterios de aceptación

- Existe spec versionada.
- Existen agentes y skills seleccionados.
- La arquitectura está documentada.
- Terraform valida sin errores.
- No hay secretos en código.
- La API expone endpoints mínimos.
- El frontend consume la API.
- CI ejecuta tests.
- Seguridad no reporta críticos.
- Observabilidad tiene métricas y alertas básicas.
