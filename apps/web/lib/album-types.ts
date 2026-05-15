/**
 * Tipos del dominio de "Discos" (catálogo heavy metal).
 *
 * El contrato lo fija la API en :4000 (GET /albums). Mantenemos los nombres
 * EXACTOS de banda como vienen del backend porque los filtros por `band`
 * son `exact match` server-side y los tests E2E usan `data-band="<band>"`.
 */
export interface Album {
  id: string;
  title: string;
  band: string;
  year: number;
  genre: string;
  description: string;
  coverUrl: string;
  tracks: string[];
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
