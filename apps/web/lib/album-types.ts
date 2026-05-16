/**
 * Tipos del dominio de "Discos" (catálogo heavy metal).
 *
 * El contrato lo fija la API en :4000 (GET /albums). Mantenemos los nombres
 * EXACTOS de banda como vienen del backend porque los filtros por `band`
 * son `exact match` server-side y los tests E2E usan `data-band="<band>"`.
 *
 * NOTA: Los tipos relacionados con `AlbumReview` son un mirror manual de los
 * que define `apps/api/src/types/album.ts`. No se importa cross-package; si
 * cambias uno, cambia el otro.
 */
export interface AlbumReviewSections {
  /** Contexto histórico: cuándo, por qué, en qué escena nace el disco. */
  historicalContext: string;
  /** Sonido y producción: cómo suena, quién lo grabó, decisiones técnicas. */
  sound: string;
  /** Legado y recepción: impacto, ventas, herencia, ranking de críticos. */
  legacy: string;
}

export interface AlbumTrackHighlight {
  /** Nombre del track tal como aparece en `Album.tracks`. */
  track: string;
  /** Una o dos frases explicando por qué destaca. */
  note: string;
}

export interface AlbumRating {
  /** 1.0 a 10.0, normalmente con un decimal. */
  score: number;
  /** Justificación breve (1-2 frases) de la puntuación. */
  justification: string;
}

export interface AlbumCriticQuote {
  /** Autor de la cita si la fuente lo atribuye explícitamente. Opcional. */
  author?: string;
  /** Medio: AllMusic, Rolling Stone, Pitchfork, Metal Hammer, etc. */
  outlet: string;
  /** Año de publicación de la cita o de la review (1965-2026). */
  year: number;
  /** URL https verificable a la fuente original. */
  url: string;
  /** Texto literal de la cita o paráfrasis muy ceñida al original. */
  quote: string;
}

export interface AlbumReview {
  sections: AlbumReviewSections;
  trackHighlights: AlbumTrackHighlight[];
  rating: AlbumRating;
  criticQuotes: AlbumCriticQuote[];
}

export interface Album {
  id: string;
  title: string;
  band: string;
  year: number;
  genre: string;
  description: string;
  coverUrl: string;
  tracks: string[];
  review: AlbumReview;
}

/**
 * Lista canónica de bandas que el catálogo soporta. Se usa para poblar el
 * <Select> de filtros y debe coincidir literalmente con los valores que la
 * API devuelve en el campo `band`.
 */
export const BANDS: readonly string[] = [
  "Iron Maiden",
  "Judas Priest",
  "Metallica",
  "Led Zeppelin",
  "Black Sabbath",
  "Megadeth",
  "Slayer",
] as const;

export type Band = (typeof BANDS)[number];
