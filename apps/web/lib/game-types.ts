/**
 * Tipos del dominio "Games — retro 8-bit" (Amstrad CPC + Commodore 64).
 *
 * Mirror manual de `apps/api/src/types/game.ts`. No se importa cross-package
 * (mismo patrón que `album-types.ts`): si cambias uno, cambia el otro.
 *
 * iter-7 introdujo Amstrad CPC. iter-11 generaliza el dominio a multi-sistema
 * añadiendo Commodore 64. El conjunto de `GAME_GENRES` crece a 13.
 *
 * Decisión sobre `GameGenre`:
 * - El backend tipa `GameGenre = string` deliberadamente para no forzar un
 *   import circular entre `types/` y `data/` (el conjunto real se deriva del
 *   dataset y se valida en runtime/tests).
 * - El frontend SÍ se permite estrechar a literal: conoce el dataset cerrado
 *   y se beneficia de literal narrowing en filtros y componentes. El runtime
 *   sigue siendo `string` y la API expone el campo como string, así que la
 *   compatibilidad estructural se mantiene.
 */

/** Cita de prensa contemporánea (Amstrad Action, MicroHobby, Crash, etc.). */
export interface GameQuote {
  /** Medio: "Amstrad Action", "MicroHobby", "Crash", "Your Sinclair", etc. */
  outlet: string;
  /** Año de publicación de la cita o de la review (1984-1995). */
  year: number;
  /** Texto literal o paráfrasis ceñida al original. No vacío. */
  quote: string;
  /**
   * URL https verificable a la fuente. Opcional: si no se ha podido
   * verificar una URL fiable, el campo se omite (no se inventa).
   */
  url?: string;
  /** Autor de la cita si la fuente lo atribuye explícitamente. Opcional. */
  author?: string;
}

/** Juego clásico de Amstrad CPC con metadatos y citas de prensa. */
export interface Game {
  /** Slug kebab-case sin acentos (p.ej. "la-abadia-del-crimen"). */
  id: string;
  /** Título tal y como aparece en la portada original. */
  title: string;
  /** Año de publicación (1984-1995). */
  year: number;
  /** Estudio desarrollador (p.ej. "Ultimate Play the Game"). */
  developer: string;
  /** Editor / distribuidor (p.ej. "Ocean", "Imagine", "Opera Soft"). */
  publisher: string;
  /** Género del catálogo. */
  genre: GameGenre;
  /**
   * Sistema soportado. Encaja con
   * `/^(Amstrad CPC (464|6128|464 \/ 6128)|Commodore 64)$/`.
   * Ej.: "Amstrad CPC 464", "Amstrad CPC 6128",
   * "Amstrad CPC 464 / 6128", "Commodore 64".
   */
  system: string;
  /** Descripción extensa (>=200 chars) específica del juego (no genérica). */
  description: string;
  /**
   * Ruta de la portada bajo `apps/web/public/covers/games/`. Prefijo obligado
   * `/covers/games/`. Alineado con `Album.coverUrl` para consistencia entre
   * catálogos.
   */
  coverUrl: string;
  /** Una o dos citas de prensa. 1 <= length <= 2. */
  quotes: GameQuote[];
}

/**
 * Lista canónica de géneros del catálogo. Mirror manual de los géneros
 * únicos presentes en `apps/api/src/data/games.ts` (`GAME_GENRES`).
 * Mantén orden alfabético y coincidencia EXACTA con los valores que devuelve
 * la API en `game.genre` (filtro exact-match server-side).
 */
export const GAME_GENRES = [
  "Acción isométrica",
  "Arcade de aventura",
  "Aventura gráfica",
  "Aventura isométrica",
  "Beat 'em up",
  "Conducción arcade",
  "Lucha",
  "Plataformas puzle",
  "Plataformas run & gun",
  "Puzle de acción",
  "Shoot 'em up",
  "Shooter sobre raíles",
  "Simulador espacial",
] as const;

export type GameGenre = (typeof GAME_GENRES)[number];
