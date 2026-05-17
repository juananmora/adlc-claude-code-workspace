/**
 * Tipos del catálogo Consoles — videoconsolas históricas (iteración 10).
 *
 * El dataset estático se sirve desde `apps/api/src/data/consoles.ts` y se
 * expone mediante `GET /consoles` y `GET /consoles/:id` en
 * `apps/api/src/routes/consoles.ts`. El frontend en
 * `apps/web/lib/console-types.ts` mantiene un mirror de estos tipos.
 */

/** Videoconsola clásica con metadatos históricos y comerciales. */
export interface Console {
  /** Slug kebab-case sin acentos (p.ej. "playstation-2"). */
  id: string;
  /** Nombre comercial tal y como se conoció en occidente. */
  name: string;
  /** Fabricante (p.ej. "Nintendo", "Sega", "Sony", "Microsoft"). */
  manufacturer: string;
  /** Año de lanzamiento en el primer mercado relevante. */
  year: number;
  /** Generación de consolas (3-7 en este catálogo). */
  generation: number;
  /** Descripción contextual (>=200 chars) con historia y legado. */
  description: string;
  /** Unidades vendidas a nivel mundial, en millones (lifetime). */
  unitsSoldM: number;
  /** Lista de 3 a 5 títulos icónicos universalmente asociados a la consola. */
  iconicGames: string[];
  /** Soporte físico principal ("Cartucho", "CD", "DVD", "GD-ROM", etc.). */
  media: string;
  /**
   * Ruta de la portada bajo `apps/web/public/covers/consoles/`. Prefijo
   * obligado `/covers/consoles/`. La descarga física la realiza el agente
   * frontend.
   */
  coverUrl: string;
}
