import type { Console } from "../types/console.js";

/**
 * Catálogo curado de 10 videoconsolas históricas (iteración 10).
 *
 * Las portadas viven en `apps/web/public/covers/consoles/<slug>.jpg` (las
 * descarga el agente frontend). Este dataset solo declara la ruta relativa
 * para permitir despliegues sin tocar datos.
 *
 * Las cifras de `unitsSoldM` provienen de cifras lifetime publicadas por los
 * propios fabricantes y/o agregadores ampliamente citados (VGChartz, informes
 * anuales). Se han redondeado a dos decimales. Los `iconicGames` son títulos
 * universalmente reconocidos como representativos de cada plataforma.
 */
const cover = (slug: string): string => `/covers/consoles/${slug}.jpg`;

export const CONSOLES: readonly Console[] = [
  {
    id: "nes",
    name: "Nintendo Entertainment System",
    manufacturer: "Nintendo",
    year: 1983,
    generation: 3,
    description:
      "Lanzada en Japón en 1983 como Famicom y comercializada en Norteamérica en 1985 bajo el nombre Nintendo Entertainment System, esta consola de 8 bits sacó a la industria del videojuego doméstico de la crisis de 1983. Su catálogo, con sagas como Super Mario Bros, The Legend of Zelda o Metroid, definió las plantillas de plataformas, aventura y acción que han marcado al medio durante décadas y consolidó el modelo de licencias de Nintendo a desarrolladores externos.",
    unitsSoldM: 61.91,
    iconicGames: [
      "Super Mario Bros.",
      "The Legend of Zelda",
      "Metroid",
      "Mega Man 2",
    ],
    media: "Cartucho",
    coverUrl: cover("nes"),
  },
  {
    id: "sega-genesis",
    name: "Sega Mega Drive / Genesis",
    manufacturer: "Sega",
    year: 1988,
    generation: 4,
    description:
      "Lanzada en Japón en 1988 como Mega Drive y en Norteamérica en 1989 como Genesis, fue la primera consola de 16 bits con éxito masivo en occidente. Su CPU Motorola 68000 permitió una generación de juegos arcade más rápidos y vistosos que los 8 bits previos, y la mascota Sonic the Hedgehog (1991) protagonizó la 'console war' contra Super Nintendo a principios de los 90, una rivalidad comercial que definió la cultura gamer de la década.",
    unitsSoldM: 30.75,
    iconicGames: [
      "Sonic the Hedgehog",
      "Streets of Rage 2",
      "Gunstar Heroes",
      "Phantasy Star IV",
    ],
    media: "Cartucho",
    coverUrl: cover("sega-genesis"),
  },
  {
    id: "game-boy",
    name: "Game Boy",
    manufacturer: "Nintendo",
    year: 1989,
    generation: 4,
    description:
      "Diseñada por Gunpei Yokoi y lanzada en 1989, la Game Boy popularizó el videojuego portátil con cartuchos intercambiables. Su pantalla LCD monocroma verde, su autonomía de hasta 30 horas con pilas AA y su robustez explican una vida comercial que se extendió hasta principios de los 2000 si se cuenta con la Game Boy Color. Tetris, incluido en muchas regiones con la consola, convirtió a Game Boy en un fenómeno cultural fuera del nicho gamer tradicional.",
    unitsSoldM: 118.69,
    iconicGames: [
      "Tetris",
      "Pokémon Red/Blue",
      "Super Mario Land",
      "The Legend of Zelda: Link's Awakening",
    ],
    media: "Cartucho",
    coverUrl: cover("game-boy"),
  },
  {
    id: "snes",
    name: "Super Nintendo (SNES)",
    manufacturer: "Nintendo",
    year: 1990,
    generation: 4,
    description:
      "Sucesora de la NES, la Super Famicom se lanzó en Japón en 1990 y como Super Nintendo Entertainment System en occidente en 1991-1992. Sus 16 bits, el modo 7 para escalado y rotación de fondos, y el procesador de sonido Sony SPC700 con samples PCM le dieron una identidad audiovisual reconocible. Su catálogo —Super Mario World, A Link to the Past, Chrono Trigger, Final Fantasy VI— está considerado uno de los mejores de la historia.",
    unitsSoldM: 49.10,
    iconicGames: [
      "Super Mario World",
      "The Legend of Zelda: A Link to the Past",
      "Chrono Trigger",
      "Super Metroid",
    ],
    media: "Cartucho",
    coverUrl: cover("snes"),
  },
  {
    id: "playstation",
    name: "PlayStation",
    manufacturer: "Sony",
    year: 1994,
    generation: 5,
    description:
      "Nacida de la ruptura entre Sony y Nintendo para un periférico de CD para Super Nintendo, la PlayStation se lanzó en Japón en diciembre de 1994 y en occidente en 1995. Fue la primera consola en superar las 100 millones de unidades vendidas y popularizó el CD-ROM como soporte estándar, los gráficos 3D poligonales y un marketing dirigido a un público adulto. Su catálogo —Final Fantasy VII, Metal Gear Solid, Resident Evil, Gran Turismo— definió el lenguaje del videojuego moderno.",
    unitsSoldM: 102.49,
    iconicGames: [
      "Final Fantasy VII",
      "Metal Gear Solid",
      "Gran Turismo",
      "Resident Evil 2",
    ],
    media: "CD",
    coverUrl: cover("playstation"),
  },
  {
    id: "nintendo-64",
    name: "Nintendo 64",
    manufacturer: "Nintendo",
    year: 1996,
    generation: 5,
    description:
      "Lanzada en Japón y Norteamérica en 1996, la Nintendo 64 fue la primera consola doméstica con CPU de 64 bits y popularizó el mando con stick analógico y gatillo Z, una plantilla seguida por el resto de la industria. La decisión de mantener el cartucho frente al CD limitó el espacio para los juegos y costó a Nintendo el favor de estudios como Square, pero permitió tiempos de carga inexistentes y experiencias técnicas como Super Mario 64 y Ocarina of Time que redefinieron el 3D jugable.",
    unitsSoldM: 32.93,
    iconicGames: [
      "Super Mario 64",
      "The Legend of Zelda: Ocarina of Time",
      "GoldenEye 007",
      "Super Smash Bros.",
    ],
    media: "Cartucho",
    coverUrl: cover("nintendo-64"),
  },
  {
    id: "dreamcast",
    name: "Dreamcast",
    manufacturer: "Sega",
    year: 1998,
    generation: 6,
    description:
      "Última consola de Sega, lanzada en Japón en noviembre de 1998 y en occidente en 1999. Introdujo módem de serie para juego online en una era pre-banda ancha y un mando con la VMU como pantalla auxiliar. Su catálogo cuenta con joyas como Shenmue, Soulcalibur, Jet Set Radio o Phantasy Star Online, pero las dificultades financieras de Sega y la inminencia de PlayStation 2 truncaron su vida comercial en 2001, retirando a la compañía del mercado del hardware doméstico.",
    unitsSoldM: 9.13,
    iconicGames: [
      "Shenmue",
      "Soulcalibur",
      "Jet Set Radio",
      "Phantasy Star Online",
    ],
    media: "GD-ROM",
    coverUrl: cover("dreamcast"),
  },
  {
    id: "playstation-2",
    name: "PlayStation 2",
    manufacturer: "Sony",
    year: 2000,
    generation: 6,
    description:
      "Lanzada en Japón en marzo de 2000 y en occidente meses después, la PlayStation 2 ha sido la consola más vendida de la historia, con más de 155 millones de unidades. Su procesador Emotion Engine, su capacidad de reproducir DVDs (en muchos hogares fue el primer reproductor de la casa) y su catálogo masivo —Grand Theft Auto III, Shadow of the Colossus, Final Fantasy X, Metal Gear Solid 2— le dieron una vida comercial extraordinariamente larga, con producción mantenida hasta 2013.",
    unitsSoldM: 155.0,
    iconicGames: [
      "Grand Theft Auto: San Andreas",
      "Shadow of the Colossus",
      "Final Fantasy X",
      "Metal Gear Solid 2: Sons of Liberty",
    ],
    media: "DVD",
    coverUrl: cover("playstation-2"),
  },
  {
    id: "xbox",
    name: "Xbox",
    manufacturer: "Microsoft",
    year: 2001,
    generation: 6,
    description:
      "Primera consola de Microsoft, lanzada en Norteamérica en noviembre de 2001 y en Europa y Japón en 2002. Construida alrededor de hardware tipo PC con CPU Intel Pentium III y disco duro interno (algo inédito en consolas de la época), introdujo Xbox Live en 2002 y consolidó el juego online en consola. Halo: Combat Evolved, lanzado junto al hardware, se convirtió en su sistema de venta principal y en la franquicia insignia de Microsoft durante dos décadas.",
    unitsSoldM: 24.0,
    iconicGames: [
      "Halo: Combat Evolved",
      "Halo 2",
      "Fable",
      "Star Wars: Knights of the Old Republic",
    ],
    media: "DVD",
    coverUrl: cover("xbox"),
  },
  {
    id: "wii",
    name: "Wii",
    manufacturer: "Nintendo",
    year: 2006,
    generation: 7,
    description:
      "Lanzada en noviembre de 2006, la Wii apostó por el mando con sensor de movimiento (Wiimote) en lugar de competir en potencia gráfica con Xbox 360 y PlayStation 3. Su propuesta accesible y de juego en familia conquistó a un público no tradicional —mayores, mujeres, niños— y batió récords de ventas durante años, especialmente con paquetes que incluían Wii Sports. Su legado influye hasta hoy en mandos con detección de movimiento y en el diseño 'pick up and play' de Nintendo.",
    unitsSoldM: 101.63,
    iconicGames: [
      "Wii Sports",
      "Super Mario Galaxy",
      "The Legend of Zelda: Twilight Princess",
      "Mario Kart Wii",
    ],
    media: "Wii Optical Disc",
    coverUrl: cover("wii"),
  },
];

/**
 * Fabricantes únicos del dataset, ordenados alfabéticamente. Alimenta los
 * chips de filtro del frontend (`/consoles`).
 */
export const CONSOLE_MANUFACTURERS: readonly string[] = Array.from(
  new Set(CONSOLES.map((c) => c.manufacturer)),
).sort();

/**
 * Generaciones únicas presentes en el dataset, ordenadas ascendentemente.
 */
export const CONSOLE_GENERATIONS: readonly number[] = Array.from(
  new Set(CONSOLES.map((c) => c.generation)),
).sort((a, b) => a - b);

export interface FindConsolesOptions {
  q?: string;
  manufacturer?: string;
  generation?: string | number;
}

/**
 * Filtra el dataset por `q` (substring case-insensitive sobre el nombre),
 * `manufacturer` (igualdad exacta) y `generation` (igualdad numérica
 * aceptando string o number). Todos los filtros son opcionales y combinables.
 */
export function findConsoles({
  q,
  manufacturer,
  generation,
}: FindConsolesOptions = {}): Console[] {
  const normalized = q?.trim().toLowerCase() ?? "";
  const generationNumber =
    generation === undefined || generation === null || generation === ""
      ? undefined
      : Number(generation);

  return CONSOLES.filter((c) => {
    if (manufacturer && c.manufacturer !== manufacturer) return false;
    if (
      generationNumber !== undefined &&
      !Number.isNaN(generationNumber) &&
      c.generation !== generationNumber
    ) {
      return false;
    }
    if (!normalized) return true;
    return c.name.toLowerCase().includes(normalized);
  });
}

export function findConsoleById(id: string): Console | undefined {
  return CONSOLES.find((c) => c.id === id);
}
