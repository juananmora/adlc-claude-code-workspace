/**
 * Créditos de las portadas del catálogo IRON DECK.
 *
 * Resuelve la deuda **SEC-07-01** de iter-7: dar trazabilidad pública a las
 * fuentes de las 32 portadas (22 álbumes + 10 juegos). Las imágenes provienen
 * mayoritariamente de Wikipedia bajo fair use editorial; la atribución
 * correcta es parte del cumplimiento del fair use.
 *
 * Fuente de los datos: `apps/api/src/data/albums.ts` y `apps/api/src/data/games.ts`.
 * Las URLs de portadas se mantienen como se descargaron en iter-3..7 (ver
 * `apps/web/public/covers/`).
 *
 * Si en una iteración futura se sustituye una portada, se debe actualizar la
 * entrada correspondiente aquí (REQ-CREDITS-1 lo verifica en tests).
 */

export interface CreditEntry {
  /** ID del recurso en su catálogo (album id o game id). */
  id: string;
  /** Título legible. */
  title: string;
  /** "album" o "game". */
  kind: "album" | "game" | "tour";
  /** Autor original (band para álbumes, developer para juegos). */
  author: string;
  /** Publisher del soporte físico original. */
  publisher: string;
  /** Año de publicación. */
  year: number;
  /** URL de la portada en su fuente. */
  sourceUrl: string;
  /** Notas adicionales (sustituciones, DOS box art, etc.). */
  note?: string;
}

export const CREDITS: readonly CreditEntry[] = [
  // ============================================================
  // ÁLBUMES (22 entradas) — orden idéntico a apps/api/src/data/albums.ts
  // ============================================================
  {
    id: "iron-maiden-number-of-the-beast",
    title: "The Number of the Beast",
    kind: "album",
    author: "Iron Maiden",
    publisher: "EMI",
    year: 1982,
    sourceUrl: "https://en.wikipedia.org/wiki/The_Number_of_the_Beast",
  },
  {
    id: "iron-maiden-powerslave",
    title: "Powerslave",
    kind: "album",
    author: "Iron Maiden",
    publisher: "EMI",
    year: 1984,
    sourceUrl: "https://en.wikipedia.org/wiki/Powerslave",
  },
  {
    id: "iron-maiden-seventh-son",
    title: "Seventh Son of a Seventh Son",
    kind: "album",
    author: "Iron Maiden",
    publisher: "EMI",
    year: 1988,
    sourceUrl: "https://en.wikipedia.org/wiki/Seventh_Son_of_a_Seventh_Son",
  },
  {
    id: "judas-priest-british-steel",
    title: "British Steel",
    kind: "album",
    author: "Judas Priest",
    publisher: "Columbia Records",
    year: 1980,
    sourceUrl: "https://en.wikipedia.org/wiki/British_Steel_(Judas_Priest_album)",
  },
  {
    id: "judas-priest-painkiller",
    title: "Painkiller",
    kind: "album",
    author: "Judas Priest",
    publisher: "Columbia Records",
    year: 1990,
    sourceUrl: "https://en.wikipedia.org/wiki/Painkiller_(Judas_Priest_album)",
  },
  {
    id: "metallica-master-of-puppets",
    title: "Master of Puppets",
    kind: "album",
    author: "Metallica",
    publisher: "Elektra Records",
    year: 1986,
    sourceUrl: "https://en.wikipedia.org/wiki/Master_of_Puppets",
  },
  {
    id: "metallica-ride-the-lightning",
    title: "Ride the Lightning",
    kind: "album",
    author: "Metallica",
    publisher: "Megaforce Records",
    year: 1984,
    sourceUrl: "https://en.wikipedia.org/wiki/Ride_the_Lightning",
  },
  {
    id: "metallica-black-album",
    title: "Metallica (The Black Album)",
    kind: "album",
    author: "Metallica",
    publisher: "Elektra Records",
    year: 1991,
    sourceUrl: "https://en.wikipedia.org/wiki/Metallica_(album)",
  },
  {
    id: "led-zeppelin-iv",
    title: "Led Zeppelin IV",
    kind: "album",
    author: "Led Zeppelin",
    publisher: "Atlantic Records",
    year: 1971,
    sourceUrl: "https://en.wikipedia.org/wiki/Led_Zeppelin_IV",
  },
  {
    id: "led-zeppelin-physical-graffiti",
    title: "Physical Graffiti",
    kind: "album",
    author: "Led Zeppelin",
    publisher: "Swan Song Records",
    year: 1975,
    sourceUrl: "https://en.wikipedia.org/wiki/Physical_Graffiti",
  },
  {
    id: "black-sabbath-paranoid",
    title: "Paranoid",
    kind: "album",
    author: "Black Sabbath",
    publisher: "Vertigo Records",
    year: 1970,
    sourceUrl: "https://en.wikipedia.org/wiki/Paranoid_(album)",
  },
  {
    id: "black-sabbath-heaven-and-hell",
    title: "Heaven and Hell",
    kind: "album",
    author: "Black Sabbath",
    publisher: "Vertigo Records",
    year: 1980,
    sourceUrl: "https://en.wikipedia.org/wiki/Heaven_and_Hell_(Black_Sabbath_album)",
  },
  {
    id: "megadeth-rust-in-peace",
    title: "Rust in Peace",
    kind: "album",
    author: "Megadeth",
    publisher: "Capitol Records",
    year: 1990,
    sourceUrl: "https://en.wikipedia.org/wiki/Rust_in_Peace",
  },
  {
    id: "slayer-reign-in-blood",
    title: "Reign in Blood",
    kind: "album",
    author: "Slayer",
    publisher: "Def Jam Recordings",
    year: 1986,
    sourceUrl: "https://en.wikipedia.org/wiki/Reign_in_Blood",
  },
  {
    id: "acdc-back-in-black",
    title: "Back in Black",
    kind: "album",
    author: "AC/DC",
    publisher: "Atlantic Records",
    year: 1980,
    sourceUrl: "https://en.wikipedia.org/wiki/Back_in_Black",
  },
  {
    id: "acdc-highway-to-hell",
    title: "Highway to Hell",
    kind: "album",
    author: "AC/DC",
    publisher: "Atlantic Records",
    year: 1979,
    sourceUrl: "https://en.wikipedia.org/wiki/Highway_to_Hell",
  },
  {
    id: "angra-temple-of-shadows",
    title: "Temple of Shadows",
    kind: "album",
    author: "Angra",
    publisher: "SPV / Steamhammer",
    year: 2004,
    sourceUrl: "https://en.wikipedia.org/wiki/Temple_of_Shadows",
  },
  {
    id: "blind-guardian-nightfall-in-middle-earth",
    title: "Nightfall in Middle-Earth",
    kind: "album",
    author: "Blind Guardian",
    publisher: "Virgin Records",
    year: 1998,
    sourceUrl: "https://en.wikipedia.org/wiki/Nightfall_in_Middle-Earth",
  },
  {
    id: "dream-theater-images-and-words",
    title: "Images and Words",
    kind: "album",
    author: "Dream Theater",
    publisher: "Atco Records",
    year: 1992,
    sourceUrl: "https://en.wikipedia.org/wiki/Images_and_Words",
  },
  {
    id: "nightwish-once",
    title: "Once",
    kind: "album",
    author: "Nightwish",
    publisher: "Nuclear Blast / Spinefarm",
    year: 2004,
    sourceUrl: "https://en.wikipedia.org/wiki/Once_(Nightwish_album)",
  },
  {
    id: "motley-crue-shout-at-the-devil",
    title: "Shout at the Devil",
    kind: "album",
    author: "Mötley Crüe",
    publisher: "Elektra Records",
    year: 1983,
    sourceUrl: "https://en.wikipedia.org/wiki/Shout_at_the_Devil",
  },
  {
    id: "motley-crue-dr-feelgood",
    title: "Dr. Feelgood",
    kind: "album",
    author: "Mötley Crüe",
    publisher: "Elektra Records",
    year: 1989,
    sourceUrl: "https://en.wikipedia.org/wiki/Dr._Feelgood_(M%C3%B6tley_Cr%C3%BCe_album)",
  },

  // ============================================================
  // JUEGOS (10 entradas) — orden idéntico a apps/api/src/data/games.ts
  // ============================================================
  {
    id: "renegade",
    title: "Renegade",
    kind: "game",
    author: "Imagine Software (port de Technos arcade)",
    publisher: "Imagine Software",
    year: 1987,
    sourceUrl: "https://en.wikipedia.org/wiki/Renegade_(video_game)",
    note: "La portada disponible en Wikipedia es el flyer arcade original (no la inlay CPC específica).",
  },
  {
    id: "knight-lore",
    title: "Knight Lore",
    kind: "game",
    author: "Ultimate Play the Game (Stamper bros)",
    publisher: "Ultimate Play the Game",
    year: 1985,
    sourceUrl: "https://en.wikipedia.org/wiki/Knight_Lore",
  },
  {
    id: "chase-hq",
    title: "Chase H.Q.",
    kind: "game",
    author: "Ocean Software (port de Taito arcade)",
    publisher: "Ocean Software",
    year: 1988,
    sourceUrl: "https://en.wikipedia.org/wiki/Chase_H.Q.",
    note: "La portada disponible es el flyer arcade original.",
  },
  {
    id: "operation-wolf",
    title: "Operation Wolf",
    kind: "game",
    author: "Ocean Software (port de Taito arcade)",
    publisher: "Ocean Software",
    year: 1988,
    sourceUrl: "https://en.wikipedia.org/wiki/Operation_Wolf",
    note: "La portada disponible es el póster arcade original.",
  },
  {
    id: "head-over-heels",
    title: "Head Over Heels",
    kind: "game",
    author: "Jon Ritman & Bernie Drummond",
    publisher: "Ocean Software",
    year: 1987,
    sourceUrl: "https://en.wikipedia.org/wiki/Head_Over_Heels_(video_game)",
  },
  {
    id: "boulder-dash",
    title: "Boulder Dash",
    kind: "game",
    author: "Peter Liepa & Chris Gray",
    publisher: "First Star Software / Front Runner",
    year: 1985,
    sourceUrl: "https://en.wikipedia.org/wiki/Boulder_Dash_(video_game)",
  },
  {
    id: "elite",
    title: "Elite",
    kind: "game",
    author: "David Braben & Ian Bell",
    publisher: "Firebird",
    year: 1985,
    sourceUrl: "https://en.wikipedia.org/wiki/Elite_(video_game)",
  },
  {
    id: "la-abadia-del-crimen",
    title: "La Abadía del Crimen",
    kind: "game",
    author: "Paco Menéndez & Juan Delcán",
    publisher: "Opera Soft",
    year: 1987,
    sourceUrl: "https://en.wikipedia.org/wiki/The_Abbey_of_Crime",
    note: "La portada usada es el DOS box art (la versión CPC original carece de imagen canónica en Wikipedia). El art visual coincide con el lanzamiento de Opera Soft.",
  },
  {
    id: "dizzy",
    title: "Dizzy — The Ultimate Cartoon Adventure",
    kind: "game",
    author: "The Oliver Twins",
    publisher: "Codemasters",
    year: 1987,
    sourceUrl: "https://en.wikipedia.org/wiki/Dizzy_(video_game)",
    note: "Sustituye a Sorcery (Virgin Games 1984) en iter-7 por imposibilidad de localizar portada canónica para Sorcery. Cassette inlay CPC oficial de Codemasters.",
  },
  {
    id: "r-type",
    title: "R-Type",
    kind: "game",
    author: "Electric Dreams Software (port de Irem arcade, por Bob Pape)",
    publisher: "Electric Dreams Software",
    year: 1988,
    sourceUrl: "https://en.wikipedia.org/wiki/R-Type",
    note: "La portada disponible es el flyer arcade original.",
  },

  // ============================================================
  // TOURS (10 entradas) — orden idéntico a apps/api/src/data/tours.ts
  // Carteles placeholder generados in-house (iter-12); las giras como
  // tales son hechos editoriales públicos y la atribución apunta a las
  // entradas canónicas en Wikipedia.
  // ============================================================
  {
    id: "world-slavery-tour",
    title: "World Slavery Tour",
    kind: "tour",
    author: "Iron Maiden",
    publisher: "EMI / Sanctuary",
    year: 1984,
    sourceUrl: "https://en.wikipedia.org/wiki/World_Slavery_Tour",
    note: "Cartel placeholder (iter-12). La gira es hecho editorial público.",
  },
  {
    id: "monsters-of-rock-86",
    title: "Monsters of Rock 1986",
    kind: "tour",
    author: "Van Halen / Scorpions / Ozzy Osbourne",
    publisher: "Monsters of Rock (festival itinerante)",
    year: 1986,
    sourceUrl: "https://en.wikipedia.org/wiki/Monsters_of_Rock",
    note: "Cartel placeholder (iter-12).",
  },
  {
    id: "damaged-justice-tour",
    title: "Damaged Justice Tour",
    kind: "tour",
    author: "Metallica",
    publisher: "Elektra Records",
    year: 1988,
    sourceUrl: "https://en.wikipedia.org/wiki/Damaged_Justice_Tour",
    note: "Cartel placeholder (iter-12).",
  },
  {
    id: "clash-of-the-titans",
    title: "Clash of the Titans",
    kind: "tour",
    author: "Slayer / Megadeth / Anthrax",
    publisher: "Clash of the Titans (gira conjunta)",
    year: 1990,
    sourceUrl: "https://en.wikipedia.org/wiki/Clash_of_the_Titans_(tour)",
    note: "Cartel placeholder (iter-12).",
  },
  {
    id: "cowboys-from-hell-tour",
    title: "Cowboys From Hell Tour",
    kind: "tour",
    author: "Pantera",
    publisher: "Atco Records",
    year: 1990,
    sourceUrl: "https://en.wikipedia.org/wiki/Cowboys_from_Hell",
    note: "Cartel placeholder (iter-12).",
  },
  {
    id: "use-your-illusion-tour",
    title: "Use Your Illusion Tour",
    kind: "tour",
    author: "Guns N' Roses",
    publisher: "Geffen Records",
    year: 1991,
    sourceUrl: "https://en.wikipedia.org/wiki/Use_Your_Illusion_Tour",
    note: "Cartel placeholder (iter-12).",
  },
  {
    id: "black-album-tour",
    title: "Wherever I May Roam (Black Album Tour)",
    kind: "tour",
    author: "Metallica",
    publisher: "Elektra Records",
    year: 1991,
    sourceUrl: "https://en.wikipedia.org/wiki/Wherever_I_May_Roam_Tour",
    note: "Cartel placeholder (iter-12).",
  },
  {
    id: "ozzfest-1996",
    title: "Ozzfest 1996",
    kind: "tour",
    author: "Ozzy Osbourne",
    publisher: "Ozzfest (festival itinerante)",
    year: 1996,
    sourceUrl: "https://en.wikipedia.org/wiki/Ozzfest",
    note: "Cartel placeholder (iter-12).",
  },
  {
    id: "iowa-world-tour",
    title: "Iowa World Tour",
    kind: "tour",
    author: "Slipknot",
    publisher: "Roadrunner Records",
    year: 2001,
    sourceUrl: "https://en.wikipedia.org/wiki/Iowa_(album)",
    note: "Cartel placeholder (iter-12).",
  },
  {
    id: "judas-priest-redeemer",
    title: "Redeemer of Souls World Tour",
    kind: "tour",
    author: "Judas Priest",
    publisher: "Epic Records",
    year: 2008,
    sourceUrl: "https://en.wikipedia.org/wiki/Nostradamus_(Judas_Priest_album)",
    note: "Cartel placeholder (iter-12).",
  },
];
