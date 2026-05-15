# ByteForge — Catálogo Web (Demo)

Demo funcional de landing + catálogo de una tienda de ordenadores.
Stack: **Next.js 15 (App Router)** + **TypeScript** + **Tailwind CSS** + **shadcn/ui** + mock data en memoria.

> Esta demo es para ejecución **local**. No incluye checkout real ni base de datos.
> Los productos se sirven desde `lib/products.ts` a través de Route Handlers en `app/api/products/*`.

## Requisitos

- Node.js >= 18.18 (probado con Node 22).
- npm >= 9 (probado con npm 11).

## Cómo arrancar

Desde `apps/web/`:

```bash
npm install
npm run dev
```

La aplicación quedará disponible en [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — modo desarrollo con hot reload.
- `npm run build` — build de producción.
- `npm start` — sirve el build (`next start`).
- `npm run lint` — ESLint con la config de Next.

## Variables de entorno

Copia `.env.example` a `.env.local` solo si necesitas apuntar la UI a una API externa:

```
NEXT_PUBLIC_API_BASE_URL=
```

Si se deja vacío, el frontend consume los Route Handlers locales en `/api/products`.

## Estructura clave

```
apps/web/
├─ app/
│  ├─ layout.tsx            # Layout raíz, header y footer
│  ├─ page.tsx              # Landing con hero + grid
│  ├─ loading.tsx           # Estado de carga global
│  ├─ error.tsx             # Boundary de error global
│  ├─ products/[id]/
│  │  ├─ page.tsx           # Ficha de producto
│  │  └─ not-found.tsx      # 404 específico
│  └─ api/products/
│     ├─ route.ts           # GET /api/products?search=&category=
│     └─ [id]/route.ts      # GET /api/products/:id
├─ components/
│  ├─ catalog-grid.tsx      # Grid + buscador + filtros (cliente)
│  ├─ product-card.tsx      # Tarjeta de producto
│  ├─ hero.tsx              # Hero de la landing
│  ├─ site-header.tsx       # Header sticky
│  ├─ site-footer.tsx       # Footer
│  └─ ui/                   # Primitivas shadcn (button, card, input, badge, select)
├─ lib/
│  ├─ products.ts           # 14 productos mock
│  ├─ types.ts              # Tipos y categorías
│  ├─ api.ts                # Cliente fetch tipado
│  └─ utils.ts              # cn() y formatPrice()
└─ ...
```

## Funcionalidades

- Landing con hero, badges de categoría y CTA hacia el catálogo.
- Catálogo en grid responsive (1 / 2 / 3 / 4 columnas según viewport).
- Buscador por texto (nombre, descripción, specs).
- Filtro por categoría: Portátiles, Sobremesa, Componentes, Periféricos.
- Estados de carga, vacío y error en el grid.
- Ficha de producto con specs, precio, stock y botón "Añadir al carrito"
  (solo UI, sin lógica de carrito).
- Tema oscuro por defecto, tipografía y espaciado del sistema shadcn.

## Notas

- Los placeholders se sirven desde `placehold.co` para evitar binarios en el repo.
- No hay datos reales sensibles ni secretos.
- Se respeta `NEXT_PUBLIC_API_BASE_URL` para permitir apuntar la UI a una API
  externa en otros entornos.
