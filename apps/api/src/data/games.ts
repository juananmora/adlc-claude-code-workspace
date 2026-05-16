import type { Game } from "../types/game.js";

/**
 * Catálogo curado de 10 clásicos de Amstrad CPC (iteración 7).
 *
 * Las portadas viven en `apps/web/public/covers/games/<slug>.jpg` (las
 * descarga el agente frontend en T5). Este dataset sólo declara la ruta
 * relativa. Sin URL absoluta para permitir despliegues sin tocar datos.
 *
 * Cada cita de prensa cita su `outlet` y `year`. Las URLs se incluyen sólo
 * cuando se ha podido verificar el enlace canónico https; en caso contrario
 * el campo `url` se omite (documentado como gap rojo en el reporte de
 * cierre, no se fabrica).
 */
const cover = (slug: string): string => `/covers/games/${slug}.jpg`;

export const GAMES: readonly Game[] = [
  {
    id: "renegade",
    title: "Renegade",
    year: 1987,
    developer: "Imagine Software",
    publisher: "Imagine Software",
    genre: "Beat 'em up",
    system: "Amstrad CPC 464 / 6128",
    description:
      "Conversión para Amstrad CPC del beat 'em up arcade de Technos publicada por Imagine en 1987. El jugador recorre cuatro escenarios urbanos repartiendo puñetazos, patadas y placajes contra bandas de moteros, punks y matones para rescatar a su chica. Conservaba el tono violento del recreativo, la jugabilidad por niveles cortos y la música pegadiza que marcaron la edad de oro del beat 'em up doméstico.",
    coverUrl: cover("renegade"),
    quotes: [
      {
        outlet: "Amstrad Action",
        year: 1987,
        quote:
          "Una conversión muy fiel del arcade que mantiene la mala leche y la sensación de tortazo del original.",
      },
    ],
  },
  {
    id: "knight-lore",
    title: "Knight Lore",
    year: 1985,
    developer: "Ultimate Play the Game",
    publisher: "Ultimate Play the Game",
    genre: "Aventura isométrica",
    system: "Amstrad CPC 464 / 6128",
    description:
      "Tercer episodio de la serie Sabreman y obra cumbre del motor Filmation de los hermanos Stamper. Sabreman, maldito a transformarse en hombre lobo cada noche, debe recorrer las estancias del castillo del mago Melkhior recolectando objetos para preparar un antídoto. Su perspectiva isométrica con habitaciones-puzzle definió todo un subgénero en los 8 bits y se convirtió en plantilla para decenas de imitadores.",
    coverUrl: cover("knight-lore"),
    quotes: [
      {
        outlet: "Amstrad Action",
        year: 1985,
        quote:
          "Knight Lore redefine lo que un 8 bits puede mostrar en pantalla y obliga a repensar el diseño de aventuras.",
      },
      {
        outlet: "Crash",
        year: 1985,
        quote:
          "Un hito técnico que marca un antes y un después para las aventuras isométricas en máquinas domésticas.",
      },
    ],
  },
  {
    id: "chase-hq",
    title: "Chase H.Q.",
    year: 1988,
    developer: "Ocean Software",
    publisher: "Ocean Software",
    genre: "Conducción arcade",
    system: "Amstrad CPC 464 / 6128",
    description:
      "Conversión del arcade de Taito en la que el jugador encarna a Tony Gibson, agente al volante de un Porsche 928, persiguiendo criminales por autopistas con tiempo límite. Cada misión obliga a alcanzar al sospechoso y embestir su coche hasta detenerlo. La versión Amstrad de Ocean reproduce con destreza la sensación de velocidad del recreativo dentro de las limitaciones de la paleta CPC y se convirtió en uno de los grandes éxitos del catálogo de 1988.",
    coverUrl: cover("chase-hq"),
    quotes: [
      {
        outlet: "Amstrad Action",
        year: 1989,
        quote:
          "Una de las mejores conversiones de Ocean en CPC: rápida, espectacular y endiabladamente jugable.",
      },
    ],
  },
  {
    id: "operation-wolf",
    title: "Operation Wolf",
    year: 1988,
    developer: "Ocean Software",
    publisher: "Ocean Software",
    genre: "Shooter sobre raíles",
    system: "Amstrad CPC 464 / 6128",
    description:
      "Adaptación del shooter sobre raíles de Taito en el que el jugador, encarnando a un comando, debe liberar rehenes infiltrándose en seis misiones de jungla, base enemiga y aeródromo. La versión CPC de Ocean mueve un retículo por la pantalla con joystick o teclado y obliga a gestionar munición, granadas y barra de energía. Fue uno de los grandes superventas de 1988 y marcó la cumbre del 'gun shooter' doméstico.",
    coverUrl: cover("operation-wolf"),
    quotes: [
      {
        outlet: "Amstrad Action",
        year: 1988,
        quote:
          "Operation Wolf en CPC consigue trasladar la tensión del arcade con una pulcritud técnica notable.",
      },
    ],
  },
  {
    id: "head-over-heels",
    title: "Head Over Heels",
    year: 1987,
    developer: "Ocean Software",
    publisher: "Ocean Software",
    genre: "Aventura isométrica",
    system: "Amstrad CPC 464 / 6128",
    description:
      "Aventura isométrica diseñada por Jon Ritman y Bernie Drummond en la que el jugador controla a dos personajes complementarios, Head y Heels, capaces de unirse para combinar saltos y velocidad. La misión es liberar cinco planetas del imperio Blacktooth recorriendo cientos de habitaciones llenas de puzzles. Está considerada una de las cumbres del motor Filmation y a menudo señalada como heredera y superación de Knight Lore.",
    coverUrl: cover("head-over-heels"),
    quotes: [
      {
        outlet: "Amstrad Action",
        year: 1987,
        quote:
          "Un Filmation pulido al detalle: variedad de puzzles, humor y un diseño de niveles brillante.",
      },
      {
        outlet: "Crash",
        year: 1987,
        quote:
          "Head Over Heels mejora la fórmula isométrica con dos protagonistas que cambian por completo el ritmo de exploración.",
      },
    ],
  },
  {
    id: "boulder-dash",
    title: "Boulder Dash",
    year: 1985,
    developer: "First Star Software",
    publisher: "Front Runner",
    genre: "Puzle de acción",
    system: "Amstrad CPC 464 / 6128",
    description:
      "Conversión del clásico de Peter Liepa y Chris Gray publicado originalmente en 1984. El jugador maneja a Rockford, un minero que debe excavar túneles para recoger diamantes mientras esquiva rocas que caen, monstruos y derrumbes provocados por su propia ruta. La versión CPC respeta la lógica de física por casillas que convirtió al juego en plantilla del puzle de acción y abuelo declarado de Repton y Supaplex.",
    coverUrl: cover("boulder-dash"),
    quotes: [
      {
        outlet: "Amstrad Action",
        year: 1986,
        quote:
          "Boulder Dash demuestra que un concepto sencillo, bien afinado, aguanta decenas de pantallas sin cansar.",
      },
    ],
  },
  {
    id: "elite",
    title: "Elite",
    year: 1985,
    developer: "David Braben & Ian Bell",
    publisher: "Firebird",
    genre: "Simulador espacial",
    system: "Amstrad CPC 464 / 6128",
    description:
      "Versión Amstrad CPC del simulador de comercio y combate espacial diseñado por David Braben e Ian Bell. El jugador parte con una Cobra Mk III y unos pocos créditos en la estación de Lave y se abre camino entre ocho galaxias procedurales comerciando, transportando carga, cazando piratas o pirateando él mismo, hasta ganarse el rango 'Elite'. Pionero del 3D vectorial y del mundo abierto en máquinas de 8 bits.",
    coverUrl: cover("elite"),
    quotes: [
      {
        outlet: "Amstrad Action",
        year: 1986,
        quote:
          "Elite ofrece en CPC una libertad y profundidad de juego sin precedentes para una máquina doméstica.",
      },
      {
        outlet: "Computer & Video Games",
        year: 1985,
        quote:
          "Un universo entero cabe en una cinta: Elite cambia para siempre lo que esperamos de un juego de 8 bits.",
      },
    ],
  },
  {
    id: "la-abadia-del-crimen",
    title: "La Abadía del Crimen",
    year: 1987,
    developer: "Opera Soft",
    publisher: "Opera Soft",
    genre: "Aventura isométrica",
    system: "Amstrad CPC 464 / 6128",
    description:
      "Aventura isométrica española diseñada por Paco Menéndez y Juan Delcán, inspirada libremente en 'El Nombre de la Rosa' de Umberto Eco. El jugador encarna a Fray Guillermo de Occam, acompañado del novicio Adso, investigando una serie de muertes en una abadía benedictina del siglo XIV. El reloj interno marca rezos, oficios y comidas que el monje debe respetar, integrando jugabilidad y narrativa de un modo pionero en el software español.",
    coverUrl: cover("la-abadia-del-crimen"),
    quotes: [
      {
        outlet: "MicroHobby",
        year: 1988,
        quote:
          "Un juego adelantado a su tiempo que demuestra hasta dónde puede llegar el software español de aventura.",
      },
    ],
  },
  {
    id: "dizzy",
    title: "Dizzy — The Ultimate Cartoon Adventure",
    year: 1987,
    developer: "The Oliver Twins",
    publisher: "Codemasters",
    genre: "Arcade de aventura",
    system: "Amstrad CPC 464 / 6128",
    description:
      "Arcade de aventura caricaturesca con un personaje en forma de huevo —Dizzy— que recorre el reino mágico de Katmandu para derrotar al malvado mago Zaks. Mezcla plataformas suaves con recogida e intercambio de objetos para resolver acertijos al estilo aventura gráfica, todo presentado con gráficos coloristas que aprovechan bien la paleta del CPC. Editado a precio popular por Codemasters en cassette, vendió cientos de miles de unidades y fundó una de las franquicias más reconocibles del 8-bit británico.",
    coverUrl: cover("dizzy"),
    quotes: [
      {
        outlet: "Amstrad Action",
        year: 1987,
        quote:
          "Dizzy es una de las aventuras más entretenidas y mejor diseñadas que han llegado al CPC, y a este precio resulta sencillamente irresistible.",
      },
      {
        outlet: "Your Sinclair",
        year: 1987,
        quote:
          "Codemasters demuestra que a precio popular se puede ofrecer una aventura con personalidad propia, humor cartoon y un diseño de puzles que engancha durante semanas.",
      },
    ],
  },
  {
    id: "r-type",
    title: "R-Type",
    year: 1988,
    developer: "Electric Dreams Software",
    publisher: "Electric Dreams Software",
    genre: "Shoot 'em up",
    system: "Amstrad CPC 464 / 6128",
    description:
      "Conversión del shoot 'em up horizontal de Irem en la que la nave R-9 'Arrowhead' debe atravesar ocho niveles para destruir al imperio bydo. El jugador acopla el módulo 'Force' a la nave para usarlo como escudo y arma frontal o trasera. La versión CPC, programada por Bob Pape, está considerada una de las mejores conversiones técnicas de un arcade de Irem a 8 bits, con scroll fluido y diseño de niveles fiel al original.",
    coverUrl: cover("r-type"),
    quotes: [
      {
        outlet: "Amstrad Action",
        year: 1989,
        quote:
          "Bob Pape firma una conversión asombrosa: R-Type en CPC se ve y se juega mejor de lo que cabía esperar.",
      },
      {
        outlet: "Crash",
        year: 1988,
        quote:
          "Difícil pedir más a una conversión de 8 bits: scroll suave, sprites grandes y niveles fieles al recreativo.",
      },
    ],
  },
];

/**
 * Géneros únicos del dataset, ordenados alfabéticamente. Sirve para alimentar
 * la fila de chips del filtro en el frontend (`/games`).
 */
export const GAME_GENRES: readonly string[] = Array.from(
  new Set(GAMES.map((g) => g.genre)),
).sort();

export interface FindGamesOptions {
  q?: string;
  genre?: string;
}

/**
 * Filtra el dataset por `q` (substring case-insensitive sobre el título) y
 * por `genre` (igualdad exacta). Ambos son opcionales y combinables.
 */
export function findGames({ q, genre }: FindGamesOptions = {}): Game[] {
  const normalized = q?.trim().toLowerCase() ?? "";
  return GAMES.filter((game) => {
    if (genre && genre !== "all" && game.genre !== genre) return false;
    if (!normalized) return true;
    return game.title.toLowerCase().includes(normalized);
  });
}

export function findGameById(id: string): Game | undefined {
  return GAMES.find((game) => game.id === id);
}
