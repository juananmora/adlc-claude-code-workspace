/**
 * Tipos del catálogo Tours — giras históricas del metal clásico (iteración 12).
 *
 * El dataset estático se sirve desde `apps/api/src/data/tours.ts` y se
 * expone mediante `GET /tours` y `GET /tours/:id` en
 * `apps/api/src/routes/tours.ts`. El frontend en
 * `apps/web/lib/tour-types.ts` mantiene un mirror de estos tipos.
 *
 * Selección editorial (10 entradas, 1980-2010) acordada en
 * `openspec/changes/tours/design.md` § "10 giras canónicas".
 */

/** Gira histórica de una banda (o festival) con metadatos editoriales. */
export interface Tour {
  /** Slug kebab-case ascii (^[a-z0-9]+(-[a-z0-9]+)*$). */
  id: string;
  /** Nombre comercial de la gira (p.ej. "World Slavery Tour"). */
  name: string;
  /**
   * Banda principal (p.ej. "Iron Maiden"). En festivales, cabeza de cartel
   * con sufijo "(festival)" para mantener un único campo string.
   */
  band: string;
  /** Año de inicio (1980..2010 en este catálogo). */
  year: number;
  /** Década normalizada (1980 | 1990 | 2000). */
  decade: 1980 | 1990 | 2000;
  /** Álbum que promocionó la gira (o "(festival)" cuando no aplica). */
  albumPromoted: string;
  /** Número de fechas confirmadas (lifetime de la gira). */
  showsCount: number;
  /** Países visitados (>=3, derivados de fuentes públicas). */
  countries: string[];
  /** Descripción larga (>=200 chars) con contexto histórico. */
  description: string;
  /**
   * Ruta de la portada/cartel bajo `apps/web/public/covers/tours/`. Prefijo
   * obligado `/covers/tours/`. La descarga física la realiza el agente frontend.
   */
  coverUrl: string;
}
