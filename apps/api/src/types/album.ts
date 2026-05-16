export interface AlbumReviewSections {
  /** Contexto histórico: cuándo, por qué, en qué escena nace el disco. */
  historicalContext: string;
  /** Sonido y producción: cómo suena, quién lo grabó, qué decisiones técnicas marcan el carácter. */
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
  /** Medio: AllMusic, Rolling Stone, Wikipedia, Pitchfork, Metal Hammer, Kerrang!, Encyclopaedia Metallum, etc. */
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
