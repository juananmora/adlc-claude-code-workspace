import type { Tour } from "../types/tour.js";

/**
 * Catálogo curado de 10 giras históricas del metal clásico (iter-12).
 *
 * Selección editorial fijada en `openspec/changes/tours/design.md`. Las
 * cifras de `showsCount` y `countries` provienen de fuentes públicas
 * (Wikipedia, gigographies oficiales) redondeadas/aproximadas para encajar
 * en un catálogo editorial; no son ledger contable de venues. Las
 * descripciones (>=200 chars cada una) recogen el contexto histórico.
 *
 * Los carteles viven en `apps/web/public/covers/tours/<id>.jpg` (los
 * descarga el agente frontend). Este dataset solo declara la ruta relativa.
 */
const cover = (slug: string): string => `/covers/tours/${slug}.jpg`;

export const TOURS: readonly Tour[] = [
  {
    id: "world-slavery-tour",
    name: "World Slavery Tour",
    band: "Iron Maiden",
    year: 1984,
    decade: 1980,
    albumPromoted: "Powerslave",
    showsCount: 187,
    countries: [
      "Reino Unido",
      "Estados Unidos",
      "Canadá",
      "Japón",
      "Polonia",
      "Yugoslavia",
      "Hungría",
    ],
    description:
      "Iniciada en agosto de 1984 tras la publicación de Powerslave, la World Slavery Tour fue una de las primeras giras del metal en cruzar el telón de acero, con conciertos en Polonia, Hungría y Yugoslavia. La producción —incluida la imponente escenografía egipcia con sarcófago animatrónico de Eddie— y la duración extenuante (más de 180 fechas en 13 meses) marcaron tanto a la banda que motivaron el descanso prolongado posterior a Somewhere in Time (1986). El doble en directo Live After Death, grabado durante esta gira, está considerado uno de los mejores discos en vivo del heavy metal.",
    coverUrl: cover("world-slavery-tour"),
  },
  {
    id: "monsters-of-rock-86",
    name: "Monsters of Rock 1986",
    band: "Van Halen / Scorpions / Ozzy (festival)",
    year: 1986,
    decade: 1980,
    albumPromoted: "(festival)",
    showsCount: 26,
    countries: [
      "Estados Unidos",
      "Canadá",
      "Reino Unido",
    ],
    description:
      "La edición itinerante norteamericana de 1986 de Monsters of Rock, gestada al calor del festival británico de Donington, llevó por estadios de Estados Unidos y Canadá un cartel encabezado por Van Halen —ya en la era Sammy Hagar tras 5150— acompañados por Scorpions, Ozzy Osbourne, Dokken y Metallica como teloneros emergentes. Fue una operación logística inédita para el género: 26 fechas en menos de tres meses, escenarios giratorios y una asistencia media superior a las 50.000 personas que consolidó al heavy metal como producto de masas en EEUU.",
    coverUrl: cover("monsters-of-rock-86"),
  },
  {
    id: "damaged-justice-tour",
    name: "Damaged Justice Tour",
    band: "Metallica",
    year: 1988,
    decade: 1980,
    albumPromoted: "...And Justice for All",
    showsCount: 200,
    countries: [
      "Estados Unidos",
      "Canadá",
      "Reino Unido",
      "Alemania",
      "Países Bajos",
      "Japón",
      "Francia",
    ],
    description:
      "Damaged Justice arrancó en septiembre de 1988 como la primera gran gira de Metallica como cabeza de cartel, con la escenografía monumental de la estatua de Lady Justice desplomándose cada noche al ritmo de '...And Justice for All'. Fue también la primera gira tras la muerte de Cliff Burton en la que Jason Newsted se consolidó como bajista titular, y la que abrió a la banda los estadios europeos. Un videoclip filmado durante esta gira para 'One' supuso el primer single de Metallica en MTV, allanando el camino para el éxito masivo del Black Album.",
    coverUrl: cover("damaged-justice-tour"),
  },
  {
    id: "clash-of-the-titans",
    name: "Clash of the Titans",
    band: "Slayer / Megadeth / Anthrax (festival)",
    year: 1990,
    decade: 1990,
    albumPromoted: "Seasons in the Abyss",
    showsCount: 41,
    countries: [
      "Estados Unidos",
      "Reino Unido",
      "Alemania",
      "Países Bajos",
      "Francia",
    ],
    description:
      "Clash of the Titans agrupó en una misma gira a tres de los cuatro grandes del thrash metal —Slayer, Megadeth y Anthrax—, con Suicidal Tendencies y Alice in Chains como teloneros en distintas patas. La etapa europea de 1990 promocionó Seasons in the Abyss de Slayer y Rust in Peace de Megadeth, dos discos cumbre del subgénero. La etapa norteamericana de 1991 cerró la operación con récords de asistencia en venues medianos y consolidó la fórmula del 'package tour' que dominaría el metal de los noventa.",
    coverUrl: cover("clash-of-the-titans"),
  },
  {
    id: "cowboys-from-hell-tour",
    name: "Cowboys From Hell Tour",
    band: "Pantera",
    year: 1990,
    decade: 1990,
    albumPromoted: "Cowboys From Hell",
    showsCount: 165,
    countries: [
      "Estados Unidos",
      "Canadá",
      "Reino Unido",
      "Alemania",
      "Japón",
    ],
    description:
      "Tras pasar los ochenta como una banda glam regional de Texas, Pantera reescribió su identidad con Cowboys From Hell (1990) y se lanzó a una gira de más de 160 fechas que les sacó por primera vez fuera de Estados Unidos. La combinación de los riffs de groove de Dimebag Darrell, la batería martilleante de Vinnie Paul y la voz de Phil Anselmo encontró un público creciente en Europa y Japón, y posicionó al grupo como punta de lanza del 'power groove metal' que acabaría dominando los noventa.",
    coverUrl: cover("cowboys-from-hell-tour"),
  },
  {
    id: "use-your-illusion-tour",
    name: "Use Your Illusion Tour",
    band: "Guns N' Roses",
    year: 1991,
    decade: 1990,
    albumPromoted: "Use Your Illusion I & II",
    showsCount: 194,
    countries: [
      "Estados Unidos",
      "Canadá",
      "Reino Unido",
      "Alemania",
      "Argentina",
      "Brasil",
      "Japón",
      "Australia",
    ],
    description:
      "Iniciada en enero de 1991 —incluso antes de la publicación de los dos discos Use Your Illusion— y prolongada hasta julio de 1993, la Use Your Illusion Tour fue una de las giras más largas y caóticas de la historia del rock, con casi 200 fechas en 27 países. La producción incluía dos escenarios paralelos, pianos de cola, sección de vientos y coristas, y conciertos que se alargaban habitualmente por encima de las tres horas. El motín de Saint Louis (1991) y la disolución progresiva de la formación clásica al final de la gira son parte indisociable de su leyenda.",
    coverUrl: cover("use-your-illusion-tour"),
  },
  {
    id: "black-album-tour",
    name: "Wherever I May Roam",
    band: "Metallica",
    year: 1991,
    decade: 1990,
    albumPromoted: "Metallica (Black Album)",
    showsCount: 300,
    countries: [
      "Estados Unidos",
      "Canadá",
      "Reino Unido",
      "Alemania",
      "Rusia",
      "Japón",
      "España",
      "Italia",
    ],
    description:
      "La gira de promoción del Black Album, comercializada como Wherever I May Roam Tour, arrancó en agosto de 1991 y se prolongó hasta julio de 1993 con más de 300 fechas en cuatro continentes. Fue la consagración estadística y comercial de Metallica como banda de estadios: el concierto en el aeródromo de Tushino (Moscú, 1991) ante medio millón de personas, el escenario en forma de diamante con foso central y la rotación de telonero entre Guns N' Roses, Faith No More y otros la convirtieron en evento mediático. Para muchos seguidores marca también el punto en que la banda dejó atrás el thrash original.",
    coverUrl: cover("black-album-tour"),
  },
  {
    id: "ozzfest-1996",
    name: "Ozzfest 1996",
    band: "Ozzy Osbourne (festival)",
    year: 1996,
    decade: 1990,
    albumPromoted: "(festival)",
    showsCount: 24,
    countries: [
      "Estados Unidos",
      "Canadá",
      "Reino Unido",
    ],
    description:
      "Concebido por Sharon Osbourne tras la negativa de Lollapalooza a incluir a Ozzy en el cartel de 1995, Ozzfest debutó en 1996 con dos fechas en Phoenix y Devore (California) y se convirtió rápidamente en gira itinerante. La primera edición completa por Estados Unidos y Canadá ese mismo año reunió a Slayer, Sepultura, Biohazard, Danzig y Fear Factory, además del propio Ozzy y la reunión puntual de Black Sabbath sin Ronnie James Dio. Ozzfest definiría la temporada estival del metal norteamericano durante toda la década siguiente.",
    coverUrl: cover("ozzfest-1996"),
  },
  {
    id: "iowa-world-tour",
    name: "Iowa World Tour",
    band: "Slipknot",
    year: 2001,
    decade: 2000,
    albumPromoted: "Iowa",
    showsCount: 138,
    countries: [
      "Estados Unidos",
      "Reino Unido",
      "Alemania",
      "Japón",
      "Australia",
      "Países Bajos",
    ],
    description:
      "La gira mundial de Iowa (2001) consolidó a Slipknot como banda de masas tras el éxito sorpresa del debut homónimo. Las fechas, ya en festivales europeos y arenas norteamericanas, expusieron el lado más abrasivo del grupo —máscaras renovadas, pirotecnia masiva, ritmo de show extremadamente físico— en un contexto post-11S que tensionó la recepción cultural de su iconografía. La gira está documentada en el DVD Disasterpieces (2002), grabado en el Docklands Arena de Londres, y marcó el punto en que el llamado 'nu metal' alcanzó techo creativo y comercial.",
    coverUrl: cover("iowa-world-tour"),
  },
  {
    id: "judas-priest-redeemer",
    name: "Redeemer of Souls World Tour",
    band: "Judas Priest",
    year: 2008,
    decade: 2000,
    albumPromoted: "Nostradamus",
    showsCount: 102,
    countries: [
      "Estados Unidos",
      "Reino Unido",
      "Alemania",
      "España",
      "Japón",
      "Suecia",
      "Finlandia",
    ],
    description:
      "Anunciada inicialmente como 'Priest Feast' y reorganizada en torno al disco conceptual Nostradamus (2008), la gira de Judas Priest de ese año recorrió Europa, Estados Unidos y Japón con una escenografía teatral inspirada en el siglo XVI y una setlist que mezclaba clásicos con la suite profética del nuevo álbum. Aunque Nostradamus dividió a la base de seguidores, la gira reafirmó la vigencia escénica de la formación con Rob Halford recuperado y demostró que el heavy metal clásico podía sostener producciones ambiciosas en pleno auge de los festivales europeos.",
    coverUrl: cover("judas-priest-redeemer"),
  },
];

/**
 * Bandas únicas del dataset, ordenadas alfabéticamente. Alimenta el filtro
 * `band` del frontend y se expone como enum derivado.
 */
export const TOUR_BANDS: readonly string[] = Array.from(
  new Set(TOURS.map((t) => t.band)),
).sort();

/**
 * Décadas únicas presentes en el dataset (1980, 1990, 2000), ordenadas
 * ascendentemente. Alimenta los chips por década en el listado.
 */
export const TOUR_DECADES: readonly (1980 | 1990 | 2000)[] = Array.from(
  new Set(TOURS.map((t) => t.decade)),
).sort((a, b) => a - b) as (1980 | 1990 | 2000)[];

export interface FindToursOptions {
  q?: string;
  decade?: string | number;
  band?: string;
}

/**
 * Filtra el dataset por `q` (substring case-insensitive sobre `name`),
 * `decade` (igualdad numérica, acepta string o number) y `band` (igualdad
 * estricta). Todos los filtros son opcionales y combinables. El resultado
 * se devuelve ordenado por `year` ascendente (orden cronológico).
 */
export function findTours({
  q,
  decade,
  band,
}: FindToursOptions = {}): Tour[] {
  const normalized = q?.trim().toLowerCase() ?? "";
  const decadeNumber =
    decade === undefined || decade === null || decade === ""
      ? undefined
      : Number(decade);

  const filtered = TOURS.filter((t) => {
    if (band && t.band !== band) return false;
    if (
      decadeNumber !== undefined &&
      !Number.isNaN(decadeNumber) &&
      t.decade !== decadeNumber
    ) {
      return false;
    }
    if (!normalized) return true;
    return t.name.toLowerCase().includes(normalized);
  });

  return [...filtered].sort((a, b) => a.year - b.year);
}

export function findTourById(id: string): Tour | undefined {
  return TOURS.find((t) => t.id === id);
}
