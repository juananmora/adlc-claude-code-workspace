export type ProductCategory =
  | "Portatiles"
  | "Sobremesa"
  | "Componentes"
  | "Perifericos";

export interface ProductSpecs {
  [key: string]: string;
}

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

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  Portatiles: "Portátiles",
  Sobremesa: "Sobremesa",
  Componentes: "Componentes",
  Perifericos: "Periféricos",
};
