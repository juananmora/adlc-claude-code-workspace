/**
 * Tipos del dominio "Tours" (iteración 12).
 *
 * Mirror manual de `apps/api/src/types/tour.ts`. No se importa cross-package
 * (mismo patrón que `album-types.ts`, `game-types.ts` y `console-types.ts`):
 * si cambias uno, cambia el otro.
 *
 * Decisión sobre `TourDecade`:
 * - El backend tipa `decade: 1980 | 1990 | 2000` como literal union.
 * - El frontend mantiene el mismo literal narrowing para alimentar chips de
 *   filtro y badges en la card.
 */

/** Gira histórica del metal clásico con metadatos editoriales. */
export interface Tour {
  /** Slug kebab-case ascii (^[a-z0-9]+(-[a-z0-9]+)*$). */
  id: string;
  /** Nombre comercial de la gira (p.ej. "World Slavery Tour"). */
  name: string;
  /** Banda principal (o cabeza de cartel con sufijo "(festival)"). */
  band: string;
  /** Año de inicio (1980..2010 en este catálogo). */
  year: number;
  /** Década normalizada (1980 | 1990 | 2000). */
  decade: TourDecade;
  /** Álbum que promocionó la gira (o "(festival)" cuando no aplica). */
  albumPromoted: string;
  /** Número de fechas confirmadas (lifetime de la gira). */
  showsCount: number;
  /** Países visitados (>=3). */
  countries: string[];
  /** Descripción larga (>=200 chars) con contexto histórico. */
  description: string;
  /**
   * Ruta del cartel bajo `apps/web/public/covers/tours/`. Prefijo obligado
   * `/covers/tours/`.
   */
  coverUrl: string;
}

/**
 * Décadas cubiertas por el catálogo. Mirror manual del literal union
 * `decade` del backend. Mantén el orden ascendente (1980 → 2000) para que
 * el render de chips siga la línea cronológica.
 */
export const TOUR_DECADES = [1980, 1990, 2000] as const;

export type TourDecade = (typeof TOUR_DECADES)[number];
