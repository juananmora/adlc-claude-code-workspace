# Design — `/about` + créditos

> Decisiones arquitectónicas para el change `about-credits`.

## 1. Estructura del dataset

`apps/web/lib/credits.ts` exporta:

```ts
export interface CreditEntry {
  /** ID del recurso en su catálogo (album id o game id). */
  id: string;
  /** Título legible del recurso. */
  title: string;
  /** "album" o "game". */
  kind: "album" | "game";
  /** Autor original (band para álbumes, developer para juegos). */
  author: string;
  /** Publisher del soporte físico original. */
  publisher: string;
  /** Año de publicación. */
  year: number;
  /** URL de la portada en su fuente (upload.wikimedia.org típicamente). */
  sourceUrl: string;
  /** Notas adicionales (sustituciones, DOS box art, etc.). */
  note?: string;
}

export const CREDITS: readonly CreditEntry[] = [ ... ];
```

**Decisión:** mantener el dataset en el frontend (`lib/`) en lugar del backend. Razón: es metadata visual del catálogo, no contenido de negocio. No necesita endpoint API ni filtros. Reusa el patrón de `albums-credits-archive.md` (no existe pero podría existir).

## 2. Estructura de la página

```
apps/web/app/about/
└── page.tsx       → server component
```

Sin layout específico: hereda del root layout (header IRON DECK global aplica automáticamente desde el hotfix iter-7.1).

Secciones de la página:

1. **Hero** con `<h1>About IRON DECK</h1>` + tagline corto.
2. **Sección "Sobre este proyecto"**: 2-3 párrafos explicando que es una demo ADLC educativa.
3. **Sección "Créditos de portadas"** con tabla o grid de los 32 créditos.
4. **Sección "Stack"** con bullets de tecnologías clave.
5. **Sección "Agradecimientos"** mencionando gentle-ai como inspiración del modelo openspec.

## 3. Entry en el header

`apps/web/components/iron-deck-header.tsx` añade un `<Link href="/about">About</Link>` entre "Games" y "Contacto". Patrón idéntico al de iter-7 para "Games".

## 4. Convenciones para atribución

| Caso | Atribución |
|---|---|
| Portada original del álbum/juego en CPC | publisher original del soporte físico |
| `la-abadia-del-crimen.jpg` (DOS box art usado como sustituto del CPC inlay) | Opera Soft (publisher original del CPC), nota explicativa |
| `dizzy.jpg` (sustitución de Sorcery por fuente no localizable) | Codemasters (publisher real de Dizzy), nota explicativa |
| 5 PNG renombrados a .jpg | atribución igual, sin nota especial (deuda técnica REC-6 separada) |

## 5. data-testids

- `data-testid="about-credits-table"` en el contenedor de créditos.
- `data-testid="credit-entry"` en cada fila/card.
- `data-id` y `data-kind` en cada entry para asertions E2E sin depender de copy.

## 6. Estilo

Reutiliza paleta metalera (`var(--metal-bone)` titles, `border-stone-800` separadores, mayúsculas tracking en headings). No introduce nuevas custom properties ni assets.

## 7. Test plan resumido

- E2E verifica que la página existe, hay `>=32` créditos visibles, link al header funciona.
- E2E verifica que cada credit-entry tiene `data-id` (no vacío), `data-kind` ∈ {album, game}, link a `sourceUrl` con `target="_blank" rel="noopener noreferrer"`.
- Smoke MCP verifica que no hay errores de consola.

## 8. Diagrama de flujo (UI)

```
[Header global]
   |
   v
[Link "About"] ---> [/about]
                       |
                       v
                  [Hero IRON DECK About]
                       |
                       v
                  [Sección "Sobre este proyecto"]
                       |
                       v
                  [Sección "Créditos" → grid 32 entries]
                       |
                       v
                  [Sección "Stack"]
                       |
                       v
                  [Sección "Agradecimientos"]
                       |
                       v
                  [Footer global]
```
