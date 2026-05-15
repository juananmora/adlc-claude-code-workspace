export type ProductCategory =
  | "Portatiles"
  | "Sobremesa"
  | "Componentes"
  | "Perifericos";

export type ProductSpecs = Record<string, string>;

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  description: string;
  specs: ProductSpecs;
  imageUrl: string;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Portatiles",
  "Sobremesa",
  "Componentes",
  "Perifericos",
];
