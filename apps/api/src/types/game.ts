/**
 * Tipos del catálogo Games — Amstrad CPC (iteración 7).
 *
 * El dataset estático se sirve desde `apps/api/src/data/games.ts` y se expone
 * mediante `GET /games` y `GET /games/:id` en `apps/api/src/routes/games.ts`.
 * El frontend en `apps/web/lib/game-types.ts` mantiene un mirror de estos
 * tipos.
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

/**
 * Género del catálogo. No es un enum cerrado a propósito: el conjunto de
 * géneros se deriva del dataset (`GAME_GENRES`) y se valida en runtime/tests.
 *
 * Se mantiene como `string` aquí para no forzar un import circular desde
 * `types/` hacia `data/`. El frontend puede tipar más estrictamente como
 * `(typeof GAME_GENRES)[number]` si lo desea.
 */
export type GameGenre = string;

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
  /** Género tipo "Arcade", "Aventura gráfica", "Plataformas", etc. */
  genre: GameGenre;
  /**
   * Sistema soportado. Debe encajar con `/Amstrad CPC ?(464|6128|464 \/ 6128)/`.
   * Ej.: "Amstrad CPC 464", "Amstrad CPC 6128", "Amstrad CPC 464 / 6128".
   */
  system: string;
  /** Descripción extensa (>=200 chars) específica del juego (no genérica). */
  description: string;
  /**
   * Ruta de la portada bajo `apps/web/public/covers/games/`. Prefijo obligado
   * `/covers/games/`. La descarga física la realiza el agente frontend.
   *
   * Nombre del campo alineado con `Album.coverUrl` para consistencia entre
   * catálogos.
   */
  coverUrl: string;
  /** Una o dos citas de prensa. 1 <= length <= 2. */
  quotes: GameQuote[];
}
