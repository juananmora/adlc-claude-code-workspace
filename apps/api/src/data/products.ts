import type { Product, ProductCategory } from "../types.js";

// Imágenes por categoría servidas localmente desde el frontend en
// `apps/web/public/products/category-<cat>.jpg`. El backend solo emite
// la ruta relativa; el navegador la resuelve contra el dominio del web.
const CATEGORY_IMAGE: Record<ProductCategory, string> = {
  Portatiles: "/products/category-portatiles.jpg",
  Sobremesa: "/products/category-sobremesa.jpg",
  Componentes: "/products/category-componentes.jpg",
  Perifericos: "/products/category-perifericos.jpg",
};



const productsRaw: Product[] = [
  {
    id: "mbp-16-m4-pro",
    name: "MacBook Pro 16\" M4 Pro",
    category: "Portatiles",
    price: 2899,
    stock: 12,
    description:
      "Portátil profesional con chip Apple M4 Pro, ideal para creadores de contenido, desarrolladores y trabajo intensivo en movilidad.",
    specs: {
      Procesador: "Apple M4 Pro (12 núcleos)",
      GPU: "GPU integrada 18 núcleos",
      RAM: "24 GB unificada",
      Almacenamiento: "1 TB SSD",
      Pantalla: "16.2\" Liquid Retina XDR",
      Bateria: "Hasta 22 h",
      Peso: "2.14 kg",
    },
    imageUrl: "",
  },
  {
    id: "thinkpad-x1-carbon-g12",
    name: "Lenovo ThinkPad X1 Carbon Gen 12",
    category: "Portatiles",
    price: 1899,
    stock: 8,
    description:
      "Ultrabook empresarial ligero con teclado premium, certificaciones MIL-STD y conectividad LTE opcional.",
    specs: {
      Procesador: "Intel Core Ultra 7 155H",
      GPU: "Intel Arc Graphics",
      RAM: "32 GB LPDDR5",
      Almacenamiento: "1 TB NVMe",
      Pantalla: "14\" 2.8K OLED táctil",
      Peso: "1.09 kg",
      SO: "Windows 11 Pro",
    },
    imageUrl: "",
  },
  {
    id: "dell-xps-15-9540",
    name: "Dell XPS 15 9540",
    category: "Portatiles",
    price: 2199,
    stock: 5,
    description:
      "Portátil potente con pantalla InfinityEdge OLED y GPU dedicada, pensado para creativos y profesionales.",
    specs: {
      Procesador: "Intel Core Ultra 9 185H",
      GPU: "NVIDIA RTX 4070 8 GB",
      RAM: "32 GB DDR5",
      Almacenamiento: "1 TB NVMe",
      Pantalla: "15.6\" 3.5K OLED",
      Peso: "1.86 kg",
    },
    imageUrl: "",
  },
  {
    id: "asus-rog-zephyrus-g14",
    name: "ASUS ROG Zephyrus G14 (2025)",
    category: "Portatiles",
    price: 2499,
    stock: 6,
    description:
      "Portátil gaming compacto con chasis CNC de aluminio y panel OLED de alta tasa de refresco.",
    specs: {
      Procesador: "AMD Ryzen AI 9 HX 370",
      GPU: "NVIDIA RTX 4070 8 GB",
      RAM: "32 GB LPDDR5X",
      Almacenamiento: "1 TB NVMe Gen4",
      Pantalla: "14\" 3K 120 Hz OLED",
      Peso: "1.5 kg",
    },
    imageUrl: "",
  },
  {
    id: "desktop-gaming-rtx5080",
    name: "Sobremesa Gaming Vortex RTX 5080",
    category: "Sobremesa",
    price: 3299,
    stock: 4,
    description:
      "Equipo gaming premium con refrigeración líquida AIO de 360 mm y chasis con cristal templado.",
    specs: {
      Procesador: "Intel Core i9-14900K",
      GPU: "NVIDIA RTX 5080 16 GB",
      RAM: "64 GB DDR5 6400 MHz",
      Almacenamiento: "2 TB NVMe Gen5 + 4 TB HDD",
      Refrigeracion: "Líquida AIO 360 mm",
      Fuente: "1000 W 80+ Platinum",
    },
    imageUrl: "",
  },
  {
    id: "workstation-ryzen-9950x",
    name: "Workstation Atlas Ryzen 9 9950X",
    category: "Sobremesa",
    price: 2799,
    stock: 3,
    description:
      "Workstation diseñada para renderizado 3D, simulación y compilaciones intensivas.",
    specs: {
      Procesador: "AMD Ryzen 9 9950X",
      GPU: "NVIDIA RTX 4070 Ti Super 16 GB",
      RAM: "128 GB DDR5 ECC",
      Almacenamiento: "2 TB NVMe Gen4",
      Placa: "X870E ATX",
      Fuente: "850 W 80+ Gold",
    },
    imageUrl: "",
  },
  {
    id: "imac-24-m4",
    name: "iMac 24\" M4",
    category: "Sobremesa",
    price: 1599,
    stock: 10,
    description:
      "Todo-en-uno con diseño icónico, pantalla Retina 4.5K y chip Apple M4.",
    specs: {
      Procesador: "Apple M4 (10 núcleos)",
      GPU: "GPU integrada 10 núcleos",
      RAM: "16 GB unificada",
      Almacenamiento: "512 GB SSD",
      Pantalla: "24\" 4.5K Retina",
      Conectividad: "Wi-Fi 6E, Bluetooth 5.3",
    },
    imageUrl: "",
  },
  {
    id: "gpu-rtx5080",
    name: "NVIDIA GeForce RTX 5080 Founders Edition",
    category: "Componentes",
    price: 1199,
    stock: 7,
    description:
      "Tarjeta gráfica de última generación con arquitectura Blackwell y DLSS 4.",
    specs: {
      Arquitectura: "Blackwell",
      Memoria: "16 GB GDDR7",
      Bus: "PCIe 5.0 x16",
      Conectores: "3x DisplayPort 2.1, 1x HDMI 2.1",
      TDP: "320 W",
      Alimentacion: "1x 12V-2x6",
    },
    imageUrl: "",
  },
  {
    id: "cpu-ryzen-9950x",
    name: "AMD Ryzen 9 9950X",
    category: "Componentes",
    price: 699,
    stock: 15,
    description:
      "Procesador de 16 núcleos basado en Zen 5 para gaming y creación de contenido.",
    specs: {
      Nucleos: "16 núcleos / 32 hilos",
      FrecuenciaBase: "4.3 GHz",
      Boost: "5.7 GHz",
      Cache: "80 MB",
      Socket: "AM5",
      TDP: "170 W",
    },
    imageUrl: "",
  },
  {
    id: "ssd-samsung-990pro-2tb",
    name: "Samsung 990 Pro 2 TB NVMe",
    category: "Componentes",
    price: 199,
    stock: 30,
    description:
      "SSD NVMe Gen4 de alto rendimiento con disipador integrado.",
    specs: {
      Capacidad: "2 TB",
      Interfaz: "PCIe 4.0 x4 NVMe",
      LecturaSec: "Hasta 7450 MB/s",
      EscrituraSec: "Hasta 6900 MB/s",
      FormFactor: "M.2 2280",
      Garantia: "5 años",
    },
    imageUrl: "",
  },
  {
    id: "monitor-lg-ultragear-32",
    name: "Monitor LG UltraGear 32\" 4K OLED 240 Hz",
    category: "Perifericos",
    price: 1299,
    stock: 5,
    description:
      "Monitor OLED de 32 pulgadas con 4K, 240 Hz y tiempo de respuesta de 0.03 ms.",
    specs: {
      Panel: "OLED",
      Resolucion: "3840 x 2160",
      Refresco: "240 Hz",
      Respuesta: "0.03 ms GtG",
      HDR: "DisplayHDR True Black 400",
      Conectividad: "DisplayPort 2.1, HDMI 2.1 x2, USB-C 90 W",
    },
    imageUrl: "",
  },
  {
    id: "keyboard-keychron-q1-pro",
    name: "Teclado Keychron Q1 Pro (75%)",
    category: "Perifericos",
    price: 199,
    stock: 18,
    description:
      "Teclado mecánico inalámbrico con chasis de aluminio, hot-swap y QMK/VIA.",
    specs: {
      Layout: "75% (84 teclas)",
      Switches: "Gateron Jupiter Brown (hot-swap)",
      Conectividad: "Bluetooth 5.1 / 2.4 GHz / USB-C",
      Iluminacion: "RGB por tecla",
      Chasis: "Aluminio CNC",
      Software: "QMK / VIA",
    },
    imageUrl: "",
  },
  {
    id: "mouse-logitech-mxmaster3s",
    name: "Logitech MX Master 3S",
    category: "Perifericos",
    price: 109,
    stock: 25,
    description:
      "Ratón ergonómico inalámbrico con sensor 8K DPI y clics silenciosos.",
    specs: {
      Sensor: "Darkfield 8000 DPI",
      Botones: "7 programables",
      Conectividad: "Bluetooth / Logi Bolt USB",
      Bateria: "Hasta 70 días",
      Carga: "USB-C rápida",
      Multidispositivo: "Easy-Switch hasta 3 equipos",
    },
    imageUrl: "",
  },
];

// imageUrl se deriva siempre de la categoría para mantener una única
// fuente de verdad (no se hardcodea por producto). Si en el futuro algún
// producto necesita su propia imagen, sobrescribir aquí o ampliar el tipo.
export const products: Product[] = productsRaw.map((p) => ({
  ...p,
  imageUrl: CATEGORY_IMAGE[p.category],
}));

export interface FindProductsOptions {
  q?: string;
  category?: ProductCategory;
}

export function findProducts({ q, category }: FindProductsOptions = {}): Product[] {
  const normalized = q?.trim().toLowerCase() ?? "";
  return products.filter((product) => {
    if (category && product.category !== category) return false;
    if (!normalized) return true;
    const haystack = [
      product.name,
      product.description,
      product.category,
      ...Object.values(product.specs),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export function findProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
