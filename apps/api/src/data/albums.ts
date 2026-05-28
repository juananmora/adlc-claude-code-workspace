import type { Album } from "../types/album.js";
import { albumReviews } from "./album-reviews.js";

/**
 * Forma del álbum SIN la crítica curada: el array maestro vive con esta
 * forma para no inflar las 20 entradas con el bloque `review`. El campo
 * `review` se inyecta en `findAlbums()` y `findAlbumById()` desde el dataset
 * `albumReviews`, así seguimos devolviendo un `Album` completo desde la API.
 */
type AlbumWithoutReview = Omit<Album, "review">;

// Las portadas viven en el frontend bajo `apps/web/public/covers/<slug>.<ext>`.
// El API devuelve la ruta relativa; el navegador la resuelve contra el dominio
// del frontend. Mantener fuente única (sin URL absoluta) facilita despliegues
// en distintos entornos sin tocar el dataset.
const COVERS: Record<string, string> = {
  "iron-maiden-number-of-the-beast": "/covers/iron-maiden-number-of-the-beast.jpg",
  "iron-maiden-powerslave": "/covers/iron-maiden-powerslave.jpg",
  "iron-maiden-seventh-son": "/covers/iron-maiden-seventh-son.jpg",
  "judas-priest-british-steel": "/covers/judas-priest-british-steel.jpg",
  "judas-priest-painkiller": "/covers/judas-priest-painkiller.jpg",
  "metallica-master-of-puppets": "/covers/metallica-master-of-puppets.jpg",
  "metallica-ride-the-lightning": "/covers/metallica-ride-the-lightning.png",
  "metallica-black-album": "/covers/metallica-black-album.jpg",
  "led-zeppelin-iv": "/covers/led-zeppelin-iv.jpg",
  "led-zeppelin-physical-graffiti": "/covers/led-zeppelin-physical-graffiti.jpg",
  "black-sabbath-paranoid": "/covers/black-sabbath-paranoid.jpg",
  "black-sabbath-heaven-and-hell": "/covers/black-sabbath-heaven-and-hell.jpg",
  "megadeth-rust-in-peace": "/covers/megadeth-rust-in-peace.jpg",
  "slayer-reign-in-blood": "/covers/slayer-reign-in-blood.jpg",
  "acdc-back-in-black": "/covers/acdc-back-in-black.png",
  "acdc-highway-to-hell": "/covers/acdc-highway-to-hell.jpg",
  "angra-temple-of-shadows": "/covers/angra-temple-of-shadows.jpg",
  "blind-guardian-nightfall-in-middle-earth": "/covers/blind-guardian-nightfall-in-middle-earth.jpg",
  "dream-theater-images-and-words": "/covers/dream-theater-images-and-words.jpg",
  "nightwish-once": "/covers/nightwish-once.jpg",
  "motley-crue-shout-at-the-devil": "/covers/motley-crue-shout-at-the-devil.jpg",
  "motley-crue-dr-feelgood": "/covers/motley-crue-dr-feelgood.jpg",
  "pantera-cowboys-from-hell": "/covers/pantera-cowboys-from-hell.jpg",
  "pantera-vulgar-display-of-power": "/covers/pantera-vulgar-display-of-power.jpg",
};

const cover = (slug: string) => COVERS[slug] ?? "/covers/placeholder.jpg";

export const albums: AlbumWithoutReview[] = [
  {
    id: "iron-maiden-number-of-the-beast",
    title: "The Number of the Beast",
    band: "Iron Maiden",
    year: 1982,
    genre: "Heavy Metal",
    description:
      "Tercer álbum de estudio de Iron Maiden y debut de Bruce Dickinson como vocalista, considerado un clásico absoluto del heavy metal.",
    coverUrl: cover("iron-maiden-number-of-the-beast"),
    tracks: [
      "Invaders",
      "Children of the Damned",
      "The Prisoner",
      "22 Acacia Avenue",
      "The Number of the Beast",
      "Run to the Hills",
      "Gangland",
      "Hallowed Be Thy Name",
    ],
  },
  {
    id: "iron-maiden-powerslave",
    title: "Powerslave",
    band: "Iron Maiden",
    year: 1984,
    genre: "Heavy Metal",
    description:
      "Quinto álbum de Iron Maiden con temática egipcia y la épica 'Rime of the Ancient Mariner'.",
    coverUrl: cover("iron-maiden-powerslave"),
    tracks: [
      "Aces High",
      "2 Minutes to Midnight",
      "Losfer Words (Big 'Orra)",
      "Flash of the Blade",
      "The Duellists",
      "Back in the Village",
      "Powerslave",
      "Rime of the Ancient Mariner",
    ],
  },
  {
    id: "iron-maiden-seventh-son",
    title: "Seventh Son of a Seventh Son",
    band: "Iron Maiden",
    year: 1988,
    genre: "Heavy Metal",
    description:
      "Álbum conceptual de Iron Maiden basado en la novela de Orson Scott Card, con uso pionero de teclados.",
    coverUrl: cover("iron-maiden-seventh-son"),
    tracks: [
      "Moonchild",
      "Infinite Dreams",
      "Can I Play with Madness",
      "The Evil That Men Do",
      "Seventh Son of a Seventh Son",
      "The Prophecy",
      "The Clairvoyant",
      "Only the Good Die Young",
    ],
  },
  {
    id: "judas-priest-british-steel",
    title: "British Steel",
    band: "Judas Priest",
    year: 1980,
    genre: "Heavy Metal",
    description:
      "Sexto álbum de Judas Priest, pieza fundacional del heavy metal con himnos atemporales.",
    coverUrl: cover("judas-priest-british-steel"),
    tracks: [
      "Rapid Fire",
      "Metal Gods",
      "Breaking the Law",
      "Grinder",
      "United",
      "You Don't Have to Be Old to Be Wise",
      "Living After Midnight",
      "The Rage",
      "Steeler",
    ],
  },
  {
    id: "judas-priest-painkiller",
    title: "Painkiller",
    band: "Judas Priest",
    year: 1990,
    genre: "Heavy Metal",
    description:
      "Decimosegundo álbum de Judas Priest, una obra maestra de velocidad y agresividad con el nuevo baterista Scott Travis.",
    coverUrl: cover("judas-priest-painkiller"),
    tracks: [
      "Painkiller",
      "Hell Patrol",
      "All Guns Blazing",
      "Leather Rebel",
      "Metal Meltdown",
      "Night Crawler",
      "Between the Hammer & the Anvil",
      "A Touch of Evil",
      "Battle Hymn",
      "One Shot at Glory",
    ],
  },
  {
    id: "metallica-master-of-puppets",
    title: "Master of Puppets",
    band: "Metallica",
    year: 1986,
    genre: "Thrash Metal",
    description:
      "Tercer álbum de Metallica, considerado una de las mejores obras del thrash metal y último con Cliff Burton.",
    coverUrl: cover("metallica-master-of-puppets"),
    tracks: [
      "Battery",
      "Master of Puppets",
      "The Thing That Should Not Be",
      "Welcome Home (Sanitarium)",
      "Disposable Heroes",
      "Leper Messiah",
      "Orion",
      "Damage, Inc.",
    ],
  },
  {
    id: "metallica-ride-the-lightning",
    title: "Ride the Lightning",
    band: "Metallica",
    year: 1984,
    genre: "Thrash Metal",
    description:
      "Segundo álbum de Metallica que mostró la madurez compositiva de la banda con piezas como 'Fade to Black'.",
    coverUrl: cover("metallica-ride-the-lightning"),
    tracks: [
      "Fight Fire with Fire",
      "Ride the Lightning",
      "For Whom the Bell Tolls",
      "Fade to Black",
      "Trapped Under Ice",
      "Escape",
      "Creeping Death",
      "The Call of Ktulu",
    ],
  },
  {
    id: "metallica-black-album",
    title: "Metallica (The Black Album)",
    band: "Metallica",
    year: 1991,
    genre: "Heavy Metal",
    description:
      "Quinto álbum homónimo de Metallica, su mayor éxito comercial con producción de Bob Rock.",
    coverUrl: cover("metallica-black-album"),
    tracks: [
      "Enter Sandman",
      "Sad but True",
      "Holier than Thou",
      "The Unforgiven",
      "Wherever I May Roam",
      "Don't Tread on Me",
      "Through the Never",
      "Nothing Else Matters",
      "Of Wolf and Man",
      "The God That Failed",
      "My Friend of Misery",
      "The Struggle Within",
    ],
  },
  {
    id: "led-zeppelin-iv",
    title: "Led Zeppelin IV",
    band: "Led Zeppelin",
    year: 1971,
    genre: "Hard Rock",
    description:
      "Cuarto álbum de Led Zeppelin, uno de los más vendidos de la historia, con la icónica 'Stairway to Heaven'.",
    coverUrl: cover("led-zeppelin-iv"),
    tracks: [
      "Black Dog",
      "Rock and Roll",
      "The Battle of Evermore",
      "Stairway to Heaven",
      "Misty Mountain Hop",
      "Four Sticks",
      "Going to California",
      "When the Levee Breaks",
    ],
  },
  {
    id: "led-zeppelin-physical-graffiti",
    title: "Physical Graffiti",
    band: "Led Zeppelin",
    year: 1975,
    genre: "Hard Rock",
    description:
      "Sexto álbum de Led Zeppelin, un doble LP que recorre todos los registros de la banda.",
    coverUrl: cover("led-zeppelin-physical-graffiti"),
    tracks: [
      "Custard Pie",
      "The Rover",
      "In My Time of Dying",
      "Houses of the Holy",
      "Trampled Under Foot",
      "Kashmir",
      "In the Light",
      "Bron-Yr-Aur",
      "Down by the Seaside",
      "Ten Years Gone",
      "Night Flight",
      "The Wanton Song",
      "Boogie with Stu",
      "Black Country Woman",
      "Sick Again",
    ],
  },
  {
    id: "black-sabbath-paranoid",
    title: "Paranoid",
    band: "Black Sabbath",
    year: 1970,
    genre: "Heavy Metal",
    description:
      "Segundo álbum de Black Sabbath, considerado uno de los discos fundacionales del heavy metal.",
    coverUrl: cover("black-sabbath-paranoid"),
    tracks: [
      "War Pigs",
      "Paranoid",
      "Planet Caravan",
      "Iron Man",
      "Electric Funeral",
      "Hand of Doom",
      "Rat Salad",
      "Fairies Wear Boots",
    ],
  },
  {
    id: "black-sabbath-heaven-and-hell",
    title: "Heaven and Hell",
    band: "Black Sabbath",
    year: 1980,
    genre: "Heavy Metal",
    description:
      "Noveno álbum de Black Sabbath y debut de Ronnie James Dio como vocalista, revitalizando a la banda.",
    coverUrl: cover("black-sabbath-heaven-and-hell"),
    tracks: [
      "Neon Knights",
      "Children of the Sea",
      "Lady Evil",
      "Heaven and Hell",
      "Wishing Well",
      "Die Young",
      "Walk Away",
      "Lonely Is the Word",
    ],
  },
  {
    id: "megadeth-rust-in-peace",
    title: "Rust in Peace",
    band: "Megadeth",
    year: 1990,
    genre: "Thrash Metal",
    description:
      "Cuarto álbum de Megadeth con la alineación clásica, considerado uno de los pilares del thrash metal técnico.",
    coverUrl: cover("megadeth-rust-in-peace"),
    tracks: [
      "Holy Wars... The Punishment Due",
      "Hangar 18",
      "Take No Prisoners",
      "Five Magics",
      "Poison Was the Cure",
      "Lucretia",
      "Tornado of Souls",
      "Dawn Patrol",
      "Rust in Peace... Polaris",
    ],
  },
  {
    id: "slayer-reign-in-blood",
    title: "Reign in Blood",
    band: "Slayer",
    year: 1986,
    genre: "Thrash Metal",
    description:
      "Tercer álbum de Slayer, una obra brutal y compacta producida por Rick Rubin que redefinió el thrash y el speed metal.",
    coverUrl: cover("slayer-reign-in-blood"),
    tracks: [
      "Angel of Death",
      "Piece by Piece",
      "Necrophobic",
      "Altar of Sacrifice",
      "Jesus Saves",
      "Criminally Insane",
      "Reborn",
      "Epidemic",
      "Postmortem",
      "Raining Blood",
    ],
  },
  {
    id: "acdc-back-in-black",
    title: "Back in Black",
    band: "AC/DC",
    year: 1980,
    genre: "Hard Rock",
    description:
      "El himno definitivo del hard rock, nacido del luto por Bon Scott y forjado en electricidad pura.",
    coverUrl: cover("acdc-back-in-black"),
    tracks: [
      "Hells Bells",
      "Shoot to Thrill",
      "What Do You Do for Money Honey",
      "Givin the Dog a Bone",
      "Let Me Put My Love into You",
      "Back in Black",
      "You Shook Me All Night Long",
      "Have a Drink on Me",
      "Shake a Leg",
      "Rock and Roll Ain't Noise Pollution",
    ],
  },
  {
    id: "acdc-highway-to-hell",
    title: "Highway to Hell",
    band: "AC/DC",
    year: 1979,
    genre: "Hard Rock",
    description:
      "El último grito de Bon Scott y la carretera más ruidosa jamás asfaltada.",
    coverUrl: cover("acdc-highway-to-hell"),
    tracks: [
      "Highway to Hell",
      "Girls Got Rhythm",
      "Walk All Over You",
      "Touch Too Much",
      "Beating Around the Bush",
      "Shot Down in Flames",
      "Get It Hot",
      "If You Want Blood (You've Got It)",
      "Love Hungry Man",
      "Night Prowler",
    ],
  },
  {
    id: "angra-temple-of-shadows",
    title: "Temple of Shadows",
    band: "Angra",
    year: 2004,
    genre: "Power Metal",
    description:
      "Una ópera-cruzada de power metal progresivo que selló a Angra entre los grandes del género.",
    coverUrl: cover("angra-temple-of-shadows"),
    tracks: [
      "Deus Le Volt!",
      "Spread Your Fire",
      "Angels and Demons",
      "Waiting Silence",
      "Wishing Well",
      "The Temple of Hate",
      "The Shadow Hunter",
      "No Pain for the Dead",
      "Winds of Destination",
      "Sprouts of Time",
      "Morning Star",
      "Late Redemption",
      "Gate XIII",
    ],
  },
  {
    id: "blind-guardian-nightfall-in-middle-earth",
    title: "Nightfall in Middle-Earth",
    band: "Blind Guardian",
    year: 1998,
    genre: "Power Metal",
    description:
      "Una epopeya conceptual sobre El Silmarillion que llevó el power metal al reino de Tolkien.",
    coverUrl: cover("blind-guardian-nightfall-in-middle-earth"),
    tracks: [
      "War of Wrath",
      "Into the Storm",
      "Lammoth",
      "Nightfall",
      "The Minstrel",
      "The Curse of Feanor",
      "Captured",
      "Blood Tears",
      "Mirror Mirror",
      "Face the Truth",
      "Noldor (Dead Winter Reigns)",
      "Battle of Sudden Flame",
      "Time Stands Still (At the Iron Hill)",
      "The Dark Elf",
      "Thorn",
      "The Eldar",
      "Nom the Wise",
      "When Sorrow Sang",
      "Out on the Water",
      "The Steadfast",
      "A Dark Passage",
      "Final Chapter (Thus Ends...)",
    ],
  },
  {
    id: "dream-theater-images-and-words",
    title: "Images and Words",
    band: "Dream Theater",
    year: 1992,
    genre: "Progressive Metal",
    description:
      "El álbum que abrió las puertas del metal progresivo moderno, con virtuosismo y melodía a partes iguales.",
    coverUrl: cover("dream-theater-images-and-words"),
    tracks: [
      "Pull Me Under",
      "Another Day",
      "Take the Time",
      "Surrounded",
      "Metropolis—Part I: 'The Miracle and the Sleeper'",
      "Under a Glass Moon",
      "Wait for Sleep",
      "Learning to Live",
    ],
  },
  {
    id: "nightwish-once",
    title: "Once",
    band: "Nightwish",
    year: 2004,
    genre: "Symphonic Metal",
    description:
      "Nightwish lleva el metal sinfónico a escala cinematográfica con orquesta y coros completos.",
    coverUrl: cover("nightwish-once"),
    tracks: [
      "Dark Chest of Wonders",
      "Wish I Had an Angel",
      "Nemo",
      "Planet Hell",
      "Creek Mary's Blood",
      "The Siren",
      "Dead Gardens",
      "Romanticide",
      "Ghost Love Score",
      "Kuolema Tekee Taiteilijan",
      "Higher Than Hope",
    ],
  },
  {
    id: "motley-crue-shout-at-the-devil",
    title: "Shout at the Devil",
    band: "Mötley Crüe",
    year: 1983,
    genre: "Hard Rock",
    description:
      "Segundo álbum de Mötley Crüe, oscuro y agresivo, que catapultó a la banda al primer plano del glam/hard rock estadounidense.",
    coverUrl: cover("motley-crue-shout-at-the-devil"),
    tracks: [
      "In the Beginning",
      "Shout at the Devil",
      "Looks That Kill",
      "Bastard",
      "God Bless the Children of the Beast",
      "Helter Skelter",
      "Red Hot",
      "Too Young to Fall in Love",
      "Knock 'Em Dead, Kid",
      "Ten Seconds to Love",
      "Danger",
    ],
  },
  {
    id: "motley-crue-dr-feelgood",
    title: "Dr. Feelgood",
    band: "Mötley Crüe",
    year: 1989,
    genre: "Hard Rock",
    description:
      "Quinto álbum de Mötley Crüe y su único #1 en EE.UU.; producido por Bob Rock, marca la cima comercial de la banda y del hard rock de los 80.",
    coverUrl: cover("motley-crue-dr-feelgood"),
    tracks: [
      "T.n.T. (Terror 'n Tinseltown)",
      "Dr. Feelgood",
      "Slice of Your Pie",
      "Rattlesnake Shake",
      "Kickstart My Heart",
      "Without You",
      "Same Ol' Situation (S.O.S.)",
      "Sticky Sweet",
      "She Goes Down",
      "Don't Go Away Mad (Just Go Away)",
      "Time for Change",
    ],
  },
  {
    id: "pantera-cowboys-from-hell",
    title: "Cowboys from Hell",
    band: "Pantera",
    year: 1990,
    genre: "Groove Metal",
    description:
      "Quinto álbum de estudio y debut en major (Atco/Atlantic) de Pantera, el disco con el que la banda de Arlington (Texas) deja atrás el glam metal de sus primeros LPs y firma el acta fundacional del groove metal con Phil Anselmo a la voz y los hermanos Abbott al mando.",
    coverUrl: cover("pantera-cowboys-from-hell"),
    tracks: [
      "Cowboys from Hell",
      "Primal Concrete Sledge",
      "Psycho Holiday",
      "Heresy",
      "Cemetery Gates",
      "Domination",
      "Shattered",
      "Clash with Reality",
      "Medicine Man",
      "Message in Blood",
      "The Sleep",
      "The Art of Shredding",
    ],
  },
  {
    id: "pantera-vulgar-display-of-power",
    title: "Vulgar Display of Power",
    band: "Pantera",
    year: 1992,
    genre: "Groove Metal",
    description:
      "Sexto álbum de estudio de Pantera y consolidación absoluta del groove metal: Dimebag Darrell pulveriza el riffing del thrash en favor del medio tiempo demoledor, Vinnie Paul aterriza el pulso y Phil Anselmo canta desde la garganta más amenazante de los 90.",
    coverUrl: cover("pantera-vulgar-display-of-power"),
    tracks: [
      "Mouth for War",
      "A New Level",
      "Walk",
      "Fucking Hostile",
      "This Love",
      "Rise",
      "No Good (Attack the Radical)",
      "Live in a Hole",
      "Regular People (Conceit)",
      "By Demons Be Driven",
      "Hollow",
    ],
  },
];

export interface FindAlbumsOptions {
  q?: string;
  band?: string;
  genre?: string;
}

/**
 * Empareja un álbum base con su `review` curada. Si por error un id no tiene
 * review en `album-reviews.ts`, el merge lanza para que el test/CI lo detecte
 * en lugar de devolver un objeto incompleto al cliente.
 */
function withReview(album: AlbumWithoutReview): Album {
  const review = albumReviews[album.id];
  if (!review) {
    throw new Error(`Missing AlbumReview for albumId=${album.id}`);
  }
  return { ...album, review };
}

export const GENRES: readonly string[] = Array.from(
  new Set(albums.map((a) => a.genre)),
).sort();

export function findAlbums({ q, band, genre }: FindAlbumsOptions = {}): Album[] {
  const normalized = q?.trim().toLowerCase() ?? "";
  return albums
    .filter((album) => {
      if (band && album.band !== band) return false;
      if (genre && genre !== "all" && album.genre !== genre) return false;
      if (!normalized) return true;
      const haystack = [album.title, album.description, ...album.tracks]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    })
    .map(withReview);
}

export function findAlbumById(id: string): Album | undefined {
  const base = albums.find((album) => album.id === id);
  return base ? withReview(base) : undefined;
}
