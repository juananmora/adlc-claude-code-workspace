---
name: generate-product-api
description: Genera API REST de catálogo de productos con modelo de datos, endpoints, validación, tests y documentación.
when_to_use: Cuando el proyecto necesita backend/API para productos, catálogo, stock, precios o fichas técnicas.
allowed-tools: Read Write Edit MultiEdit Bash Grep Glob
---

# Skill: Generate Product API

## Endpoints mínimos

- `GET /products`
- `GET /products/{id}`
- `GET /products?category=...`
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`

## Modelo mínimo

Producto:

- id;
- name;
- brand;
- category;
- description;
- price;
- stock;
- specs;
- imageUrl.

## Reglas

- Valida entradas.
- No hardcodees credenciales.
- Usa variables de entorno.
- Añade tests.
- Documenta con OpenAPI si procede.
