/**
 * Tipos del dominio "Consoles" (iteración 10).
 *
 * Mirror manual de `apps/api/src/types/console.ts`. No se importa
 * cross-package (mismo patrón que `album-types.ts` y `game-types.ts`): si
 * cambias uno, cambia el otro.
 *
 * Decisión sobre `ConsoleGeneration`:
 * - El backend tipa `generation: number` (validado por JSON Schema con un
 *   `enum: [3,4,5,6,7]`) para no forzar imports cruzados entre `types/` y
 *   `data/`.
 * - El frontend SÍ se permite estrechar a literal: conoce el conjunto cerrado
 *   y se beneficia de literal narrowing en los chips de filtro y en los
 *   componentes. El runtime sigue siendo `number` y la API expone el campo
 *   como número, así que la compatibilidad estructural se mantiene.
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
  generation: ConsoleGeneration;
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
   * obligado `/covers/consoles/`.
   */
  coverUrl: string;
}

/**
 * Generaciones cubiertas por el catálogo. Mirror manual del enum
 * `generation` en el JSON Schema del backend. Mantén el orden ascendente
 * (3 → 7) para que el render de chips siga la línea cronológica.
 */
export const CONSOLE_GENERATIONS = [3, 4, 5, 6, 7] as const;

export type ConsoleGeneration = (typeof CONSOLE_GENERATIONS)[number];
