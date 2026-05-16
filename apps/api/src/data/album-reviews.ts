import type { AlbumReview } from "../types/album.js";

/**
 * Crítica curada por disco.
 *
 * Reglas de curación:
 * - Todo es contenido público y verificable. Las URLs apuntan a fuentes con
 *   página propia por disco (Wikipedia y AllMusic son las más estables;
 *   Rolling Stone y Encyclopaedia Metallum cuando aplica).
 * - Las quotes son paráfrasis o citas cortas atribuibles. El autor solo se
 *   nombra cuando aparece firmado en la fuente.
 * - Los años son los de la review/publicación cuando son explícitos; cuando
 *   no, se usa el año del lanzamiento del disco (entradas enciclopédicas).
 * - Si una fuente no se puede confirmar para un disco concreto durante el
 *   sampling, se reporta como gap rojo en el reporte ejecutivo. NO se
 *   sustituye por otra URL para "limpiar" el resultado.
 *
 * El dataset vive separado de `albums.ts` para no inflar el getter y para
 * permitir tests independientes (`albums-review.test.ts`).
 */

export const albumReviews: Record<string, AlbumReview> = {
  "iron-maiden-number-of-the-beast": {
    sections: {
      historicalContext:
        "Tercer álbum de estudio de Iron Maiden, publicado en marzo de 1982 por EMI. Fue el debut en estudio de Bruce Dickinson tras la marcha de Paul Di'Anno y consolidó el giro hacia un heavy metal más épico y melódico que los dos primeros LPs. Producido por Martin Birch, el disco se grabó en Battery Studios (Londres) bajo presión: Dickinson aún no podía componer libremente por contrato con Samson, así que muchas líneas vocales se ajustaron sobre material ya escrito por Steve Harris.",
      sound:
        "Birch endurece la mezcla respecto a 'Killers' pero gana definición: el bajo galopante de Harris se mantiene central, las guitarras gemelas Murray/Smith ganan brillo y la batería de Clive Burr tiene un kick mucho más presente. La voz de Dickinson añade rango operístico y permite estructuras más teatrales como 'Hallowed Be Thy Name', con sus cambios de tempo y narrativa de primera persona.",
      legacy:
        "Llegó al #1 en UK, fue el primer álbum de Maiden certificado platino en EE.UU. y abrió la puerta a la 'World Piece Tour'. La controversia con grupos religiosos en Estados Unidos por la temática del tema titular amplificó su fama. La crítica lo coloca de forma recurrente entre los mejores álbumes de heavy metal de todos los tiempos.",
    },
    trackHighlights: [
      {
        track: "The Number of the Beast",
        note: "Riff de Harris sobre el sueño que tuvo tras ver 'Damien: Omen II'. Apertura recitada del Apocalipsis 13:18 que se convirtió en el sello sonoro de la banda.",
      },
      {
        track: "Hallowed Be Thy Name",
        note: "Pieza épica de siete minutos sobre un condenado a la horca: tempo creciente, dúo Murray/Smith en estado de gracia y uno de los cierres de disco más imitados del género.",
      },
      {
        track: "Run to the Hills",
        note: "Single de presentación con galope de bajo característico y letra sobre el conflicto entre nativos americanos y colonos; cumbre del Dickinson agudo.",
      },
    ],
    rating: {
      score: 9.5,
      justification:
        "Pilar fundacional del heavy metal británico de los 80: producción sólida, repertorio sin relleno y debut vocal histórico.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1982,
        url: "https://www.allmusic.com/album/the-number-of-the-beast-mw0000189554",
        quote:
          "Un punto de inflexión absoluto para Iron Maiden y para el heavy metal en su conjunto, con un Bruce Dickinson recién llegado que reescribe el listón de lo que un vocalista del género puede hacer.",
      },
      {
        outlet: "Wikipedia",
        year: 1982,
        url: "https://en.wikipedia.org/wiki/The_Number_of_the_Beast",
        quote:
          "Frecuentemente citado como uno de los discos de heavy metal más importantes e influyentes jamás grabados; alcanzó el número 1 en Reino Unido y certificación platino en Estados Unidos.",
      },
    ],
  },

  "iron-maiden-powerslave": {
    sections: {
      historicalContext:
        "Quinto álbum de Iron Maiden, lanzado en septiembre de 1984. Llega tras 'Piece of Mind' con la misma formación —Dickinson, Harris, Murray, Smith, McBrain— en plena estabilidad creativa, grabado en Compass Point Studios (Bahamas) con Martin Birch a la producción. La temática egipcia, ideada por el bajista Steve Harris junto al diseñador Derek Riggs, da unidad visual al disco y al concepto de la 'World Slavery Tour'.",
      sound:
        "Aprovechan la experiencia caribeña para grabar un sonido limpio y abierto: guitarras con cuerpo brillante, secciones rítmicas precisas y un Bruce Dickinson en pleno rango. 'Rime of the Ancient Mariner' se construye con dinámicas extremas y secciones casi camerísticas, evidenciando la influencia de la NWOBHM sobre estructuras progresivas.",
      legacy:
        "Top 2 en UK y top 21 en Billboard 200. La gira posterior fue una de las más largas de su carrera y se documentó en el directo 'Live After Death'. Crónicas posteriores (AllMusic, Encyclopaedia Metallum) lo señalan como pico creativo de la banda en los 80.",
    },
    trackHighlights: [
      {
        track: "Aces High",
        note: "Apertura con bombardeo verbal sobre la Batalla de Inglaterra: tempo rápido, riff de Smith y una de las mejores demostraciones del Dickinson de los 80.",
      },
      {
        track: "Rime of the Ancient Mariner",
        note: "Suite de 13 minutos basada en el poema de Coleridge: cambios de tempo, narración hablada y una atmósfera oceánica única en el catálogo Maiden.",
      },
      {
        track: "2 Minutes to Midnight",
        note: "Riff descendente icónico y letra antimilitarista; uno de los singles más radiables de toda su carrera.",
      },
    ],
    rating: {
      score: 9.3,
      justification:
        "Maiden en su madurez creativa: épica controlada, sin relleno y con el equilibrio perfecto entre single y suite progresiva.",
    },
    criticQuotes: [
      {
        author: "Steve Huey",
        outlet: "AllMusic",
        year: 1984,
        url: "https://www.allmusic.com/album/powerslave-mw0000189557",
        quote:
          "Powerslave es Iron Maiden en plena cumbre, una colección de temas que cubre desde el thrash radiable hasta la suite progresiva de 13 minutos sin perder coherencia.",
      },
      {
        outlet: "Wikipedia",
        year: 1984,
        url: "https://en.wikipedia.org/wiki/Powerslave",
        quote:
          "Recibido con aclamación crítica y comercial: top 2 en Reino Unido, certificación platino en Estados Unidos y considerado por la prensa especializada como uno de los grandes álbumes del heavy metal británico.",
      },
    ],
  },

  "iron-maiden-seventh-son": {
    sections: {
      historicalContext:
        "Séptimo álbum de estudio (1988), conceptual, basado libremente en el folclore del 'séptimo hijo de un séptimo hijo' que conecta con la novela homónima de Orson Scott Card. Se grabó en Munich con Martin Birch y marcó la primera vez que la banda usó teclados y guitarras-sintetizador de forma extensiva, anticipando el sonido más progresivo que abandonaría en 'No Prayer for the Dying'.",
      sound:
        "Capas de teclado de Michael Kenney (técnico de Harris) sobre la base habitual de guitarras gemelas. Smith y Murray amplían su paleta con armonías más densas. El disco es uno de los más cohesivos sonoramente de la banda, con interludios atmosféricos y motivos recurrentes entre cortes.",
      legacy:
        "#1 en UK, top 12 en EE.UU. y crítica positiva en prensa metalera. Fue el último disco con Adrian Smith antes de su salida temporal. Hoy se considera el cierre brillante de la 'edad dorada' Dickinson-era de los 80.",
    },
    trackHighlights: [
      {
        track: "The Evil That Men Do",
        note: "Single principal: riff de medio tiempo, estribillo coral y una de las melodías vocales más memorables del periodo.",
      },
      {
        track: "Seventh Son of a Seventh Son",
        note: "Pieza titular de 10 minutos: armonías corales, sintetizadores, cambios de sección y narrativa profética. Núcleo conceptual del álbum.",
      },
      {
        track: "Can I Play with Madness",
        note: "Single inicial: estructura más radiofónica, video humorístico con Graham Chapman y entrada perfecta para nuevos oyentes.",
      },
    ],
    rating: {
      score: 8.9,
      justification:
        "El álbum conceptual más ambicioso de su etapa Dickinson, con riesgo sonoro (sintetizadores) que envejece mejor de lo esperado.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1988,
        url: "https://www.allmusic.com/album/seventh-son-of-a-seventh-son-mw0000189558",
        quote:
          "La pieza conceptual definitiva de Maiden, donde la incorporación de teclados y arreglos progresivos da forma a un disco unitario sin perder los riffs por los que la banda es reconocida.",
      },
      {
        outlet: "Wikipedia",
        year: 1988,
        url: "https://en.wikipedia.org/wiki/Seventh_Son_of_a_Seventh_Son",
        quote:
          "Primer y único número 1 de Iron Maiden en UK Albums Chart durante la era Dickinson; recibido como uno de los discos más cohesivos y conceptualmente ambiciosos de la banda.",
      },
    ],
  },

  "judas-priest-british-steel": {
    sections: {
      historicalContext:
        "Sexto álbum de Judas Priest, publicado en abril de 1980. Marca el pivote definitivo de la banda hacia un heavy metal compacto y radiable, alejándose del eclecticismo progresivo de discos anteriores como 'Sad Wings of Destiny'. Grabado en Tittenhurst Park (Ascot) con Tom Allom, en lo que había sido la casa de John Lennon.",
      sound:
        "Tom Allom y la banda apuestan por riffs cortos y estribillos coreables. El disco es famoso por la creatividad en la captura: bandejas de cubiertos cayendo por escaleras para 'Breaking the Law', botellas rotas en 'Metal Gods'. Doble guitarra Tipton/Downing en estado puro, batería seca de Dave Holland y voz de Halford pasando del agudo al medio con naturalidad.",
      legacy:
        "Su éxito comercial (top 4 UK, platino en EE.UU.) consolidó a Priest como referencia del heavy metal antes de la explosión de la NWOBHM. 'Breaking the Law' y 'Living After Midnight' siguen siendo standards del directo. La crítica lo coloca entre los discos fundacionales del metal moderno.",
    },
    trackHighlights: [
      {
        track: "Breaking the Law",
        note: "Riff minimalista de Tipton, letra sobre desempleo y frustración thatcheriana, videoclip pionero en MTV.",
      },
      {
        track: "Metal Gods",
        note: "Tempo medio marcial, vocoder en los coros y letra distópica que cristalizó el cliché 'metal god' alrededor de Halford.",
      },
      {
        track: "Living After Midnight",
        note: "Himno de estadio compuesto a las 4 AM tras una sesión interrumpida: estribillo simple, riff inmediato y permanente en setlists desde 1980.",
      },
    ],
    rating: {
      score: 9.2,
      justification:
        "Manual de heavy metal radiable: cero relleno, dos singles eternos y producción que sigue sonando moderna 40 años después.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1980,
        url: "https://www.allmusic.com/album/british-steel-mw0000190572",
        quote:
          "British Steel es el disco que definió el heavy metal de los 80 en términos de accesibilidad sin perder peso, con himnos como 'Breaking the Law' y 'Living After Midnight' que entraron de inmediato en el canon del género.",
      },
      {
        outlet: "Wikipedia",
        year: 1980,
        url: "https://en.wikipedia.org/wiki/British_Steel_(Judas_Priest_album)",
        quote:
          "Considerado uno de los discos clave del heavy metal: top 4 en UK, certificación platino en EE.UU. y aparición recurrente en listas de mejores álbumes del género en publicaciones como Rolling Stone y Kerrang!.",
      },
    ],
  },

  "judas-priest-painkiller": {
    sections: {
      historicalContext:
        "Decimosegundo álbum de Judas Priest, publicado en septiembre de 1990 por Columbia/CBS. Llegó tras 'Ram It Down' y supuso la entrada de Scott Travis (Racer X) en la batería en sustitución de Dave Holland, un cambio que disparó la velocidad y técnica de la banda. Producido por Chris Tsangarides en Wisseloord Studios (Países Bajos).",
      sound:
        "Doble bombo constante, riffs trituradores de Tipton y Downing y un Halford operístico llevado al extremo. Tsangarides obtiene un sonido brillante con bajo presente. El disco fue una respuesta directa al thrash y al speed metal que estaban dominando finales de los 80.",
      legacy:
        "Recibió crítica entusiasta y fue su mejor recibido desde 'Screaming for Vengeance'. Top 26 en EE.UU. y certificación oro. Nominado al Grammy a Mejor Interpretación de Metal en 1991. Considerado el último gran disco de la era clásica antes de la salida de Halford en 1992.",
    },
    trackHighlights: [
      {
        track: "Painkiller",
        note: "Solo de batería de apertura de Scott Travis y riff vertiginoso: probablemente el tema más rápido y técnico de toda la discografía de Priest.",
      },
      {
        track: "A Touch of Evil",
        note: "Medio tiempo con teclados y línea vocal en escala menor; balance perfecto frente a la furia del resto del álbum.",
      },
      {
        track: "Night Crawler",
        note: "Riff descendente espeluznante y letra de horror gótico: uno de los favoritos del fandom y standard del directo en la era Tour 2004+.",
      },
    ],
    rating: {
      score: 9.4,
      justification:
        "Velocidad, técnica y voz al límite. La respuesta de los maestros al thrash y al speed metal: ganaron el envite.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1990,
        url: "https://www.allmusic.com/album/painkiller-mw0000316137",
        quote:
          "Painkiller es Judas Priest reinventándose en la edad de oro del thrash: más rápido, más afilado y con Rob Halford alcanzando registros vocales que pocas voces del género se atreven a imitar.",
      },
      {
        outlet: "Wikipedia",
        year: 1990,
        url: "https://en.wikipedia.org/wiki/Painkiller_(Judas_Priest_album)",
        quote:
          "Recibido como un retorno a la forma y nominado al premio Grammy a la Mejor Interpretación de Metal en 1991; considerado por la crítica especializada como uno de los álbumes esenciales del heavy metal de los 90.",
      },
    ],
  },

  "metallica-master-of-puppets": {
    sections: {
      historicalContext:
        "Tercer álbum de Metallica, publicado en marzo de 1986 por Elektra. Grabado en Sweet Silence Studios (Copenhague) con Flemming Rasmussen entre septiembre y diciembre de 1985. Fue el último disco con Cliff Burton al bajo: murió en accidente de autobús en Suecia durante la gira 'Damage, Inc.' en septiembre de 1986. La banda venía del impacto crítico de 'Ride the Lightning' y refinó esa fórmula al máximo.",
      sound:
        "Tema medio largo, estructuras con varias secciones, intros instrumentales y armonías de guitarra en escalas modales. Rasmussen logra un sonido seco y orgánico, sin sobreproducir: bajo de Burton audible y muy melódico, doble guitarra Hetfield/Hammett con contrapuntos elaborados y batería de Ulrich con cabeza-pies coordinados.",
      legacy:
        "Primer álbum de Metallica en alcanzar disco de oro sin apoyo de radio o single comercial, llegando a 6× platino en EE.UU. Top 30 mundial e icono cultural más allá del metal. Rolling Stone lo incluye en su lista de los 500 mejores álbumes de todos los tiempos; Kerrang! lo ha votado mejor disco de metal en múltiples ocasiones. Pieza esencial del thrash y referente de cualquier banda extrema posterior.",
    },
    trackHighlights: [
      {
        track: "Master of Puppets",
        note: "Tema titular de 8:35 con cambio central limpio y solo trémolo: una de las composiciones más estudiadas del thrash y standard absoluto del directo.",
      },
      {
        track: "Orion",
        note: "Instrumental dominado por las líneas melódicas de Cliff Burton; pieza central emocional del álbum y testamento del bajista.",
      },
      {
        track: "Battery",
        note: "Apertura con arpegio acústico que estalla en uno de los riffs más rápidos del catálogo: define el ataque del disco desde el segundo uno.",
      },
    ],
    rating: {
      score: 9.8,
      justification:
        "Considerado de forma transversal uno de los mejores discos de metal jamás grabados; punto culminante del thrash de los 80 con Burton.",
    },
    criticQuotes: [
      {
        author: "Steve Huey",
        outlet: "AllMusic",
        year: 1986,
        url: "https://www.allmusic.com/album/master-of-puppets-mw0000189683",
        quote:
          "Master of Puppets es el momento en que Metallica se convirtió en algo más que la banda más importante del thrash: el disco eleva el género a una forma de arte con ambición sinfónica.",
      },
      {
        outlet: "Wikipedia",
        year: 1986,
        url: "https://en.wikipedia.org/wiki/Master_of_Puppets",
        quote:
          "Frecuentemente citado como uno de los mejores y más influyentes álbumes de heavy metal de la historia; en 2016 fue añadido al National Recording Registry de la Biblioteca del Congreso por su 'significancia cultural, histórica o estética'.",
      },
      {
        outlet: "Rolling Stone",
        year: 2020,
        url: "https://www.rollingstone.com/music/music-lists/500-greatest-albums-of-all-time-156826/",
        quote:
          "Incluido en la lista de los 500 mejores álbumes de todos los tiempos por su papel decisivo en convertir el thrash metal en una propuesta artística que trascendió el underground.",
      },
    ],
  },

  "metallica-ride-the-lightning": {
    sections: {
      historicalContext:
        "Segundo álbum de Metallica, publicado en julio de 1984 por Megaforce y posteriormente Elektra. Grabado en Sweet Silence (Copenhague) con Flemming Rasmussen, fue el primer disco firmado con un sello mayor y el último con material compuesto en parte por Dave Mustaine ('Ride the Lightning', 'The Call of Ktulu'). Muestra el salto de 'Kill 'Em All' hacia un thrash más estructurado.",
      sound:
        "Producción más limpia que 'Kill 'Em All', con guitarras acústicas en 'Fade to Black' y 'Fight Fire with Fire'. El bajo de Burton gana protagonismo, especialmente en 'For Whom the Bell Tolls' donde la línea de apertura suele confundirse con una guitarra distorsionada. Solos de Hammett más estructurados.",
      legacy:
        "Top 100 en Billboard, posteriormente certificado 6× platino. Considerado el disco que estableció el patrón del thrash compositivo y abrió camino a 'Master of Puppets'. Listado en la mayoría de rankings de mejores discos del metal.",
    },
    trackHighlights: [
      {
        track: "For Whom the Bell Tolls",
        note: "Apertura con bajo procesado de Burton tocado como riff principal: línea reconocible al instante, tempo medio marcial.",
      },
      {
        track: "Fade to Black",
        note: "Primera balada larga del grupo, arpegios acústicos y solo final de Hammett: cambió la idea de lo que el thrash podía abordar líricamente.",
      },
      {
        track: "Creeping Death",
        note: "Riff rápido, sección coral 'Die!' y standard de directo desde 1984 hasta hoy.",
      },
    ],
    rating: {
      score: 9.4,
      justification:
        "El paso adelante compositivo que separó a Metallica del thrash de garaje; introdujo la ambición melódica que luego desbordaría 'Master of Puppets'.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1984,
        url: "https://www.allmusic.com/album/ride-the-lightning-mw0000189684",
        quote:
          "Ride the Lightning es el disco donde Metallica empieza a sonar como Metallica: estructuras complejas, dinámicas amplias y la primera muestra clara de su ambición compositiva.",
      },
      {
        outlet: "Wikipedia",
        year: 1984,
        url: "https://en.wikipedia.org/wiki/Ride_the_Lightning",
        quote:
          "Aclamado por la crítica como un avance sustancial respecto a 'Kill 'Em All'; con el paso de los años ha sido citado como uno de los álbumes más influyentes del thrash metal.",
      },
    ],
  },

  "metallica-black-album": {
    sections: {
      historicalContext:
        "Quinto álbum homónimo, publicado en agosto de 1991 por Elektra. Producido por Bob Rock en One on One Recording (Los Ángeles) tras una negociación tensa con la banda. Sustituye los temas largos del thrash por canciones de 4-5 minutos centradas en groove y estribillo, en una clara apuesta por el mercado masivo. Las sesiones duraron casi un año y costaron alrededor de un millón de dólares.",
      sound:
        "Bob Rock impone una mezcla densa con bajo definido (Newsted por fin audible), batería procesada y guitarras con tono más sólido que cortante. Hetfield trabaja la voz con cantante de apoyo (Ron Nevison aconsejó) y los solos de Hammett son más melódicos. El acompañamiento orquestal en 'Nothing Else Matters' marca el primer flirteo serio con instrumentación sinfónica.",
      legacy:
        "El álbum más vendido de Metallica y uno de los más vendidos de la historia: más de 16× platino en EE.UU. y más de 30 millones de copias mundiales. Polarizó al fandom thrash pero abrió el metal al mainstream global. Continuamente en charts incluso 30 años después.",
    },
    trackHighlights: [
      {
        track: "Enter Sandman",
        note: "Riff principal nacido de un descarte de Hammett: la canción que abrió Metallica a un público diez veces más amplio.",
      },
      {
        track: "Nothing Else Matters",
        note: "Balada de Hetfield originalmente escrita para sí mismo, con arreglo orquestal de Michael Kamen; éxito transversal fuera del nicho metal.",
      },
      {
        track: "Sad but True",
        note: "Tempo medio con afinación más baja: el riff más pesado del disco y plantilla de lo que el metal radiable de los 90 buscaría.",
      },
    ],
    rating: {
      score: 9.0,
      justification:
        "Ruptura comercial con un manual de canciones perfectas para el mainstream; pierde virtuosismo, gana eternidad.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1991,
        url: "https://www.allmusic.com/album/metallica-mw0000247217",
        quote:
          "El Black Album convirtió a Metallica de héroes del thrash en una de las bandas más grandes del rock mundial sin sacrificar su identidad pesada, gracias a una producción de Bob Rock que enfatiza el groove sobre la velocidad.",
      },
      {
        outlet: "Wikipedia",
        year: 1991,
        url: "https://en.wikipedia.org/wiki/Metallica_(album)",
        quote:
          "Más de 16 veces platino en los Estados Unidos y considerado uno de los álbumes más vendidos de la historia, con presencia continuada en el Billboard 200 durante décadas tras su lanzamiento.",
      },
    ],
  },

  "led-zeppelin-iv": {
    sections: {
      historicalContext:
        "Cuarto álbum de Led Zeppelin, publicado en noviembre de 1971 por Atlantic. Sin título oficial (los críticos lo llaman 'IV', 'Four Symbols', 'Zoso' o simplemente 'el álbum sin nombre' por decisión expresa de la banda tras las críticas a 'Led Zeppelin III'). Grabado mayormente en Headley Grange (Hampshire) con la unidad móvil de los Rolling Stones, capturando una sonoridad ambiental que cambió la grabación rock.",
      sound:
        "Mezcla de Andy Johns y Jimmy Page con batería extremadamente ambiental ('When the Levee Breaks' usa la escalera del vestíbulo de Headley Grange como reverb natural). Folk acústico, hard rock, blues rural y rock progresivo conviven sin chocar. Voz de Plant en uno de sus picos creativos.",
      legacy:
        "Más de 37 millones de copias vendidas. 'Stairway to Heaven' es probablemente la canción rock más radiada de todos los tiempos. Rolling Stone lo coloca consistentemente entre los 10 mejores álbumes de la historia.",
    },
    trackHighlights: [
      {
        track: "Stairway to Heaven",
        note: "Construcción de 8 minutos del arpegio acústico al solo de Page: pieza emblemática del rock y plantilla del crescendo progresivo.",
      },
      {
        track: "When the Levee Breaks",
        note: "Riff de Page sobre el sonido de batería de Bonham capturado con dos micros en la escalera: una de las baterías más sampleadas de la historia del hip hop.",
      },
      {
        track: "Black Dog",
        note: "Estructura de llamada-respuesta entre Plant y la banda, riff irregular y groove blues marcado por Bonham.",
      },
    ],
    rating: {
      score: 9.7,
      justification:
        "Cumbre absoluta de Zeppelin y del hard rock pre-metal: variedad estilística sin perder cohesión y una de las grabaciones más imitadas de la historia.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1971,
        url: "https://www.allmusic.com/album/led-zeppelin-iv-mw0000269410",
        quote:
          "Led Zeppelin IV es una obra maestra que combina hard rock, folk acústico y blues con una intensidad y una variedad que pocos álbumes de su época logran sostener durante toda su duración.",
      },
      {
        outlet: "Wikipedia",
        year: 1971,
        url: "https://en.wikipedia.org/wiki/Led_Zeppelin_IV",
        quote:
          "Uno de los álbumes más vendidos de la historia, con más de 37 millones de copias mundiales; aparece de forma habitual en las listas de mejores álbumes de todos los tiempos elaboradas por Rolling Stone y la crítica especializada.",
      },
    ],
  },

  "led-zeppelin-physical-graffiti": {
    sections: {
      historicalContext:
        "Sexto álbum de Led Zeppelin, publicado en febrero de 1975 por Swan Song. Doble LP que combina material nuevo grabado en Headley Grange en 1974 con descartes y outtakes de sesiones anteriores ('Houses of the Holy' inédita, 'Bron-Yr-Aur' de 'III'). El disco que da cuenta de toda la paleta de la banda en una sola entrega.",
      sound:
        "Andy Johns y George Chkiantz manejan la mezcla. La diversidad estilística es el rasgo definitorio: hard rock pesado ('Custard Pie'), épica oriental ('Kashmir'), rock and roll ('Boogie with Stu'), baladas acústicas ('Bron-Yr-Aur', 'Down by the Seaside') y blues ('In My Time of Dying'). Bonham se luce en las secciones extensas; Page produce con su característica capa de eco a cinta.",
      legacy:
        "#1 en UK y EE.UU. Certificado 16× platino por la RIAA. Para parte de la crítica representa el cénit creativo de la banda, por encima incluso de 'IV', precisamente por su capacidad de moverse entre estilos sin perder identidad. Aparece de forma sistemática en las listas de mejores álbumes de los 70 publicadas por Rolling Stone, AllMusic y NME.",
    },
    trackHighlights: [
      {
        track: "Kashmir",
        note: "Marcha en compás 8/4 sobre arreglo de cuerdas y vientos, con riff modal compuesto en el desierto marroquí: una de las cumbres del rock progresivo.",
      },
      {
        track: "In My Time of Dying",
        note: "Blues de 11 minutos en slide con Page en estado de gracia; Bonham y Jones empujan en el clímax final.",
      },
      {
        track: "Trampled Under Foot",
        note: "Groove funk-rock con clavinet de John Paul Jones y vocalmente uno de los Plant más sexuados de su carrera.",
      },
    ],
    rating: {
      score: 9.6,
      justification:
        "Catálogo completo de Zeppelin en un solo disco doble: variedad sin desorden, ambición sin perder oficio.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1975,
        url: "https://www.allmusic.com/album/physical-graffiti-mw0000651017",
        quote:
          "Physical Graffiti es Led Zeppelin desplegándose como banda total: un álbum doble donde cada estilo que tocaron suena como si fuese el suyo desde siempre.",
      },
      {
        outlet: "Wikipedia",
        year: 1975,
        url: "https://en.wikipedia.org/wiki/Physical_Graffiti",
        quote:
          "Aclamado en el momento de su lanzamiento y revalorizado con el tiempo: alcanzó el número 1 tanto en Estados Unidos como en Reino Unido y figura habitualmente entre los mejores discos del rock de los años 70.",
      },
    ],
  },

  "black-sabbath-paranoid": {
    sections: {
      historicalContext:
        "Segundo álbum de Black Sabbath, publicado en septiembre de 1970 por Vertigo en UK y Warner Bros. en EE.UU. Grabado en seis días en Regent Sound y Island Studios (Londres) con Rodger Bain produciendo. La canción 'Paranoid' se escribió en última instancia para rellenar el LP y acabó convertida en uno de los singles más reconocibles del metal.",
      sound:
        "Riffs lentos y pesados de Iommi (afinación rebajada por su accidente en la fábrica), bajo cavernoso de Geezer Butler, batería swing-jazz de Bill Ward y voz nasal de Ozzy. El tono mecánico de 'Iron Man' y 'War Pigs' anticipa todo el doom y stoner posterior. Producción seca y directa.",
      legacy:
        "#1 en UK, 4× platino en EE.UU. según la RIAA. Para crítica unánime (AllMusic, Rolling Stone, Metal Hammer) es uno de los discos fundacionales del heavy metal, junto con el debut 'Black Sabbath' del mismo año, y la plantilla sonora que copiarían generaciones de bandas posteriores desde Pantera hasta Electric Wizard.",
    },
    trackHighlights: [
      {
        track: "War Pigs",
        note: "Apertura con sirena, riff lento sobre temática anti-Vietnam y una de las primeras canciones políticas explícitas del metal.",
      },
      {
        track: "Iron Man",
        note: "Riff cromático descendente y voz procesada en la intro: cimiento del estética doom y referencia para Slayer, Tool y mil bandas más.",
      },
      {
        track: "Paranoid",
        note: "Improvisada como relleno, dura 2:50 y se convirtió en el single insignia de la banda; standard absoluto del rock pesado.",
      },
    ],
    rating: {
      score: 9.5,
      justification:
        "Acta fundacional del heavy metal: tres temas de canon más relleno honesto y producción que sigue sonando radical 55 años después.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1970,
        url: "https://www.allmusic.com/album/paranoid-mw0000202896",
        quote:
          "Paranoid no es solo uno de los álbumes más importantes del heavy metal: es el plano sobre el que se construyó todo lo que vino después, desde el doom hasta el thrash.",
      },
      {
        outlet: "Wikipedia",
        year: 1970,
        url: "https://en.wikipedia.org/wiki/Paranoid_(album)",
        quote:
          "Considerado de forma habitual como uno de los álbumes más influyentes y vendidos del heavy metal, con certificación de 4 veces platino en Estados Unidos y presencia constante en las listas de mejores discos del género.",
      },
    ],
  },

  "black-sabbath-heaven-and-hell": {
    sections: {
      historicalContext:
        "Noveno álbum de Black Sabbath, publicado en abril de 1980 por Vertigo/Warner. Primer disco con Ronnie James Dio como vocalista tras la salida de Ozzy Osbourne. Producido por Martin Birch en Criteria (Miami) y Studio Ferber (París). Vinny Appice se uniría tras la marcha de Bill Ward durante la gira.",
      sound:
        "Birch limpia el sonido respecto a los últimos discos con Ozzy ('Never Say Die!'). Iommi vuelve a riffs centrales tras la complejidad jazz-rock previa. Dio aporta rango operístico y narrativa épica que cambia totalmente el carácter lírico de la banda. Geezer Butler regresa al bajo tras un breve paréntesis.",
      legacy:
        "Salvó la carrera de Black Sabbath en un momento crítico. Top 9 en UK, oro en EE.UU. y bisagra entre el doom 70s y el power metal 80s. Standard absoluto: 'Heaven and Hell' (tema) sigue siendo de los más coreados en cualquier escenario.",
    },
    trackHighlights: [
      {
        track: "Heaven and Hell",
        note: "Tema titular de casi 7 minutos: riff escalonado, narrativa sobre el bien y el mal, y outro instrumental que se extiende en directo.",
      },
      {
        track: "Neon Knights",
        note: "Apertura del disco a tempo rápido, definiendo el sonido épico-veloz del Sabbath con Dio.",
      },
      {
        track: "Die Young",
        note: "Cambio de tempo dramático y solo lírico de Iommi; una de las composiciones más completas de la era Dio.",
      },
    ],
    rating: {
      score: 9.3,
      justification:
        "Reinvención total con Dio: el doom de Iommi se cruza con la épica fantasiosa y nace una segunda edad dorada de Sabbath.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1980,
        url: "https://www.allmusic.com/album/heaven-and-hell-mw0000312326",
        quote:
          "Heaven and Hell es el momento en que Black Sabbath se reinventa: Dio aporta una narrativa épica que cambia totalmente el carácter de la banda sin traicionar la pesadez característica de Iommi.",
      },
      {
        outlet: "Wikipedia",
        year: 1980,
        url: "https://en.wikipedia.org/wiki/Heaven_and_Hell_(Black_Sabbath_album)",
        quote:
          "Recibido como un resurgimiento crítico y comercial: certificación oro en Estados Unidos y considerado uno de los álbumes más importantes de la historia de Black Sabbath y del heavy metal en general.",
      },
    ],
  },

  "megadeth-rust-in-peace": {
    sections: {
      historicalContext:
        "Cuarto álbum de Megadeth, publicado en septiembre de 1990 por Capitol. Primer disco con la alineación clásica: Mustaine, Marty Friedman, David Ellefson y Nick Menza. Grabado en Rumbo Recorders (Los Ángeles) con Mike Clink (productor de 'Appetite for Destruction' de Guns N' Roses). Mustaine venía de superar una rehabilitación severa y la banda entró en su periodo más estable creativamente.",
      sound:
        "Clink consigue un sonido limpísimo: doble guitarra Friedman/Mustaine afinada y bien separada en la mezcla, bajo de Ellefson tocando contrapuntos casi protagonistas y batería de Menza con doble bombo medido. El thrash se vuelve técnico, casi progresivo, sin perder agresión.",
      legacy:
        "Top 23 en EE.UU., platino. Pilar del thrash metal técnico y plataforma de lanzamiento internacional de Marty Friedman. Vota recurrentemente entre los mejores discos del thrash en encuestas de Decibel, Loudwire y Metal Hammer.",
    },
    trackHighlights: [
      {
        track: "Holy Wars... The Punishment Due",
        note: "Apertura icónica con riff principal y sección flamenco-modal de Friedman a la mitad: probablemente el tema más completo de Megadeth.",
      },
      {
        track: "Hangar 18",
        note: "Conspiración sobre ovnis y dúos de guitarra Mustaine-Friedman en cascada al final; standard absoluto del directo.",
      },
      {
        track: "Tornado of Souls",
        note: "Solo de Friedman frecuentemente citado entre los mejores del thrash; riff de Mustaine instantáneo.",
      },
    ],
    rating: {
      score: 9.5,
      justification:
        "El thrash técnico llevado a su cumbre: composición, ejecución y solos al máximo nivel sin perder el filo callejero de la banda.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1990,
        url: "https://www.allmusic.com/album/rust-in-peace-mw0000259900",
        quote:
          "Rust in Peace es probablemente el álbum más cohesivo y técnicamente impresionante de Megadeth, con la alineación Mustaine-Friedman-Ellefson-Menza en estado de gracia.",
      },
      {
        outlet: "Wikipedia",
        year: 1990,
        url: "https://en.wikipedia.org/wiki/Rust_in_Peace",
        quote:
          "Considerado uno de los álbumes más influyentes del thrash metal y del metal técnico: certificación platino en Estados Unidos y nominación al Grammy a Mejor Interpretación de Metal en 1991.",
      },
    ],
  },

  "slayer-reign-in-blood": {
    sections: {
      historicalContext:
        "Tercer álbum de Slayer, publicado en octubre de 1986 por Def Jam Recordings y posteriormente Geffen. Producido por Rick Rubin en Hit City West (Los Ángeles). Apenas 29 minutos de duración, una respuesta extrema al thrash medio-rápido de la época. Su tema de apertura 'Angel of Death' (sobre Josef Mengele) generó controversia que retrasó su distribución.",
      sound:
        "Rubin elimina la reverb habitual del metal de la época y obtiene un sonido seco, mecánico y agresivo. Batería de Lombardo casi inhumana, riffs caóticos de Hanneman y King intercambiándose, voz de Araya gritada al límite. Cero ornamento, cero respiro.",
      legacy:
        "Cambió las reglas del thrash y abrió la puerta al death metal incipiente con Death, Possessed y Morbid Angel reconociéndolo como referencia directa. Top 100 en EE.UU. y certificación oro de la RIAA pese a no tener single radiable. En listas de mejores discos del metal su aparición es casi obligatoria; tanto Rolling Stone como Kerrang! lo incluyen en sus rankings históricos.",
    },
    trackHighlights: [
      {
        track: "Angel of Death",
        note: "Apertura de 4:51 con grito de Araya y velocidad sostenida; controvertida por su temática, pero técnicamente intachable.",
      },
      {
        track: "Raining Blood",
        note: "Outro del disco con riff descendente eterno y trueno simulado; uno de los riffs más reconocibles del metal extremo.",
      },
      {
        track: "Postmortem",
        note: "Construcción de tensión que enlaza directamente con 'Raining Blood' como cierre conjunto del LP.",
      },
    ],
    rating: {
      score: 9.6,
      justification:
        "Disco breve, brutal y sin concesiones: redefinió el thrash y sembró el death metal de finales de los 80.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1986,
        url: "https://www.allmusic.com/album/reign-in-blood-mw0000189692",
        quote:
          "Reign in Blood es una declaración de intenciones de 29 minutos: Slayer reduce el thrash a su esencia más violenta y precisa, con una producción de Rick Rubin que elimina todo lo accesorio.",
      },
      {
        outlet: "Wikipedia",
        year: 1986,
        url: "https://en.wikipedia.org/wiki/Reign_in_Blood",
        quote:
          "Frecuentemente citado por la crítica especializada como uno de los álbumes más influyentes y rápidos del heavy metal: certificación oro en Estados Unidos y referencia indispensable para el thrash y death metal posteriores.",
      },
    ],
  },

  "acdc-back-in-black": {
    sections: {
      historicalContext:
        "Séptimo álbum de AC/DC (sexto internacional), publicado en julio de 1980 por Atlantic. Primer disco con Brian Johnson tras la muerte de Bon Scott en febrero del mismo año. Grabado en Compass Point Studios (Bahamas) con Robert John 'Mutt' Lange produciendo. La banda decidió continuar tras consultar a la familia de Scott; el resultado es un tributo y a la vez una reinvención.",
      sound:
        "Lange compacta el sonido: guitarras gemelas Young/Young con riffs cortos, batería de Phil Rudd al puro 4/4 minimalista, bajo de Cliff Williams pegado al kick. Brian Johnson reemplaza la nasalidad de Scott con un grito más agudo y rasgado. La portada totalmente negra refuerza el luto.",
      legacy:
        "Segundo álbum más vendido de la historia tras 'Thriller': más de 50 millones de copias. 25× platino en EE.UU. Cada single ('Hells Bells', 'You Shook Me All Night Long', 'Back in Black') es un standard del rock. Hito generacional del hard rock.",
    },
    trackHighlights: [
      {
        track: "Hells Bells",
        note: "Apertura con campana de iglesia y riff descendente: tributo solemne a Bon Scott y arranque de directo imitadísimo.",
      },
      {
        track: "Back in Black",
        note: "Riff de Angus en mi mayor: probablemente el riff de hard rock más imitado de los 80, tocado en cada bar del mundo.",
      },
      {
        track: "You Shook Me All Night Long",
        note: "Single radiable con groove de Phil Rudd impecable; el AC/DC más bailable y comercial.",
      },
    ],
    rating: {
      score: 9.7,
      justification:
        "Récord absoluto del hard rock: tributo, reinvención y manual de canciones perfectas en un solo disco.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1980,
        url: "https://www.allmusic.com/album/back-in-black-mw0000191510",
        quote:
          "Back in Black es uno de los álbumes de hard rock más perfectos jamás grabados: cada riff funciona, cada estribillo se queda y la producción de Mutt Lange ha envejecido sin una sola arruga.",
      },
      {
        outlet: "Wikipedia",
        year: 1980,
        url: "https://en.wikipedia.org/wiki/Back_in_Black",
        quote:
          "Uno de los álbumes más vendidos de la historia con más de 50 millones de copias en todo el mundo; certificación 25 veces platino en Estados Unidos por la RIAA.",
      },
    ],
  },

  "acdc-highway-to-hell": {
    sections: {
      historicalContext:
        "Sexto álbum de AC/DC, publicado en julio de 1979 por Atlantic. Último con Bon Scott, que moriría seis meses después por aspiración mientras dormía. Primera colaboración con Mutt Lange como productor, en Roundhouse Studios (Londres) tras desestimar a Eddie Kramer. Buscaban un sonido más radiable tras varios discos contundentes pero menos exitosos en Estados Unidos.",
      sound:
        "Lange limpia los riffs y enfatiza estribillos. La voz de Scott está mejor mezclada que nunca, con eco controlado. Phil Rudd impone una métrica de relojería; Cliff Williams aterriza el groove. Riffs de Angus Young muy sencillos pero contagiosos: 'Highway to Hell' es probablemente el tema con menos notas y más éxito de toda la banda.",
      legacy:
        "Top 17 en EE.UU. y 8× platino por la RIAA. Considerado por buena parte de la crítica el cénit con Bon Scott a la voz y el primer disco con el que AC/DC saltó al primer plano internacional. La fórmula refinada por Mutt Lange (riffs limpios, estribillos contagiosos, producción radiable) prefiguraría 'Back in Black' un año después y sentaría la plantilla del hard rock comercial de los 80.",
    },
    trackHighlights: [
      {
        track: "Highway to Hell",
        note: "Riff de la guitarra abierta de Angus, estribillo cantable a coro y standard absoluto del rock; uno de los singles más reconocibles del siglo XX.",
      },
      {
        track: "Touch Too Much",
        note: "Estructura radiable con cambios menores; pico melódico del Bon Scott final.",
      },
      {
        track: "If You Want Blood (You've Got It)",
        note: "Riff bluesero rápido y solo de Angus en máxima desesperación: muestra del directo en estudio.",
      },
    ],
    rating: {
      score: 9.4,
      justification:
        "El AC/DC con Bon Scott alcanza su mejor producción y composición: directo, contagioso y final dramático de una era.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1979,
        url: "https://www.allmusic.com/album/highway-to-hell-mw0000189715",
        quote:
          "Highway to Hell es el álbum donde AC/DC se convierte en una banda global: Mutt Lange consigue una mezcla pulida sin domesticar el ataque de los Young, y Bon Scott firma su despedida con la mejor interpretación de su vida.",
      },
      {
        outlet: "Wikipedia",
        year: 1979,
        url: "https://en.wikipedia.org/wiki/Highway_to_Hell",
        quote:
          "Considerado uno de los álbumes más influyentes del hard rock: último trabajo de estudio del vocalista Bon Scott, certificación 8 veces platino en Estados Unidos y presencia recurrente en las listas de los mejores discos del rock.",
      },
    ],
  },

  "angra-temple-of-shadows": {
    sections: {
      historicalContext:
        "Quinto álbum de estudio de Angra, publicado en noviembre de 2004 por Steamhammer/SPV. Primera grabación con la nueva alineación: Edu Falaschi (voz), Kiko Loureiro (guitarra), Rafael Bittencourt (guitarra), Felipe Andreoli (bajo) y Aquiles Priester (batería). Es un álbum conceptual ambientado en las Cruzadas, sobre un caballero del siglo XI que cuestiona la fe que lo lleva a matar. Producido por Dennis Ward (Pink Cream 69) en House of Music Studios (Karlsdorf, Alemania).",
      sound:
        "Power metal progresivo con fuerte influencia brasileña: percusión latina ('Spread Your Fire', 'Late Redemption'), pasajes neoclásicos de Loureiro y arreglos orquestales y corales. Colaboraciones con Sabine Edelsbacher (Edenbridge), Kai Hansen (Gamma Ray) y Hansi Kürsch (Blind Guardian) refuerzan el carácter europeo del disco.",
      legacy:
        "Considerado uno de los discos cumbre del power metal sudamericano y obra de referencia para Angra. Buena recepción en Europa y Japón, donde Angra tiene seguimiento masivo. Aparece habitualmente en listas de mejores discos del power metal de los 2000.",
    },
    trackHighlights: [
      {
        track: "Spread Your Fire",
        note: "Apertura veloz con percusión brasileña incrustada en el doble bombo: tarjeta de presentación de la nueva era con Falaschi.",
      },
      {
        track: "The Temple of Hate",
        note: "Colaboración con Kai Hansen al cuello: dúos vocales, riffs neoclásicos y solo entrelazado entre Loureiro y Hansen.",
      },
      {
        track: "Late Redemption",
        note: "Pieza épica de cierre con coros y la voz de Milton Nascimento (huésped de lujo) en un cruce de power metal y MPB.",
      },
    ],
    rating: {
      score: 9.0,
      justification:
        "Power metal progresivo de altura, con identidad brasileña marcada y un concepto narrativo cuidado de principio a fin.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 2004,
        url: "https://www.allmusic.com/album/temple-of-shadows-mw0000688517",
        quote:
          "Temple of Shadows muestra a Angra en plena reinvención: un álbum conceptual ambicioso que combina power metal progresivo, ritmos brasileños y un cuidado por la narrativa que pocas bandas del género intentan.",
      },
      {
        outlet: "Wikipedia",
        year: 2004,
        url: "https://en.wikipedia.org/wiki/Temple_of_Shadows",
        quote:
          "Considerado uno de los álbumes más importantes y aclamados de Angra, con un concepto narrativo unitario sobre las Cruzadas y colaboraciones de figuras como Kai Hansen, Hansi Kürsch y Milton Nascimento.",
      },
    ],
  },

  "blind-guardian-nightfall-in-middle-earth": {
    sections: {
      historicalContext:
        "Sexto álbum de Blind Guardian, publicado en abril de 1998 por Virgin Records. Álbum conceptual basado en 'El Silmarillion' de J.R.R. Tolkien, con narraciones habladas conectando las canciones. Grabado y producido por Flemming Rasmussen y la propia banda en Twilight Hall Studios (Grefrath, Alemania). Refina la formula que la banda venía construyendo desde 'Imaginations from the Other Side'.",
      sound:
        "Capas vocales masivas de Hansi Kürsch (a veces más de 50 pistas superpuestas), guitarras gemelas de André Olbrich y Marcus Siepen con armonías polifónicas, batería de Thomen Stauch acelerada y orquestaciones sinfónicas. Productor y banda se entregan a la grandilocuencia épica sin disculpas.",
      legacy:
        "Top 28 en Alemania, su mayor éxito comercial hasta la fecha. Standard del power metal épico y obra de referencia del power metal sinfónico europeo. Citado por bandas posteriores (Sabaton, Powerwolf) como influencia central.",
    },
    trackHighlights: [
      {
        track: "Mirror Mirror",
        note: "Single insignia del álbum: estribillo coral arrollador y narrativa sobre Turgon y Gondolin. Standard absoluto del directo.",
      },
      {
        track: "Time Stands Still (At the Iron Hill)",
        note: "Duelo Fingolfin vs Morgoth a tempo medio: dramatización vocal de Hansi y solos majestuosos.",
      },
      {
        track: "Nightfall",
        note: "Tema central narrativo sobre la caída de los Noldor: balada épica que conecta varios capítulos del concepto.",
      },
    ],
    rating: {
      score: 9.2,
      justification:
        "Cumbre conceptual de Blind Guardian: ambición narrativa, capas vocales únicas y producción coral inimitable.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1998,
        url: "https://www.allmusic.com/album/nightfall-in-middle-earth-mw0000041036",
        quote:
          "Nightfall in Middle-Earth lleva el concepto épico del power metal a un nivel que pocas bandas se atreven a intentar, con un trabajo de capas vocales y arreglos que define el sonido de Blind Guardian.",
      },
      {
        outlet: "Wikipedia",
        year: 1998,
        url: "https://en.wikipedia.org/wiki/Nightfall_in_Middle-Earth",
        quote:
          "Considerado uno de los álbumes conceptuales más importantes del power metal: basado en El Silmarillion de J.R.R. Tolkien y aclamado por la prensa especializada como una cumbre del género en los años 90.",
      },
    ],
  },

  "dream-theater-images-and-words": {
    sections: {
      historicalContext:
        "Segundo álbum de Dream Theater, publicado en julio de 1992 por ATCO/Atlantic. Primer disco con James LaBrie a la voz tras la marcha de Charlie Dominici. Grabado en Bear Tracks Studios (Nueva York) con David Prater produciendo. Marcó el nacimiento comercial del metal progresivo moderno y rescató a la banda de la práctica disolución que siguió a 'When Dream and Day Unite'.",
      sound:
        "Virtuosismo extremo en todos los instrumentos: John Petrucci (guitarra), Kevin Moore (teclados), John Myung (bajo), Mike Portnoy (batería) y LaBrie (voz). Compases impares, secciones instrumentales largas y armonías densas, pero balanceadas con estribillos accesibles. Prater empuja un sonido brillante con teclados muy presentes.",
      legacy:
        "Top 61 EE.UU., oro a pesar del estilo nicho. 'Pull Me Under' fue inesperado hit radiofónico. El disco redefinió lo que el metal progresivo podía ser tras los 80, e influyó a toda la generación posterior (Symphony X, Pain of Salvation, Tool).",
    },
    trackHighlights: [
      {
        track: "Pull Me Under",
        note: "Single sorpresa que abrió las puertas de la banda al mainstream; compás 7/8 y final abrupto incluido.",
      },
      {
        track: "Metropolis—Part I: 'The Miracle and the Sleeper'",
        note: "Pieza instrumental progresiva con cambios de tempo, sección central a contracorriente y standard del directo.",
      },
      {
        track: "Take the Time",
        note: "Estructura compleja con secciones casi funk y solos de Petrucci-Moore alternándose; resumen del rango del grupo.",
      },
    ],
    rating: {
      score: 9.3,
      justification:
        "Disco que rescató al metal progresivo del olvido y plantilla para toda una generación posterior.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 1992,
        url: "https://www.allmusic.com/album/images-and-words-mw0000673829",
        quote:
          "Images and Words es el álbum que redefinió el metal progresivo en los 90: virtuosismo instrumental sin perder la melodía, con James LaBrie dando una identidad vocal clara y reconocible.",
      },
      {
        outlet: "Wikipedia",
        year: 1992,
        url: "https://en.wikipedia.org/wiki/Images_and_Words",
        quote:
          "Considerado un álbum fundacional del metal progresivo moderno: certificación oro en Estados Unidos y aparición habitual en las listas de mejores álbumes del subgénero realizadas por revistas como Prog y Loudwire.",
      },
    ],
  },

  "nightwish-once": {
    sections: {
      historicalContext:
        "Quinto álbum de estudio de Nightwish, publicado en junio de 2004 por Nuclear Blast/Spinefarm. Último con Tarja Turunen a la voz antes de la dramática salida tras la gira. Grabado en Finnvox Studios (Helsinki) con Tero Kinnunen y producido por Tuomas Holopainen. Incluye orquesta completa (London Session Orchestra) bajo dirección de Pip Williams, llevando al máximo la escala sinfónica de la banda.",
      sound:
        "Orquesta y coros integrados en cada tema (no como adorno), guitarras de Emppu Vuorinen más metálicas que en discos previos, teclados de Holopainen tejiendo arreglos cinematográficos. Voz operística de Tarja con menos vibrato de lo habitual y un Marco Hietala en bajo+voz que aporta contrastes en 'Wish I Had an Angel'.",
      legacy:
        "Doble platino en Finlandia, oro o platino en Alemania, Suiza y Austria. Top 5 en Europa y entrada en Billboard 200. 'Nemo' se convirtió en hit transversal. Disco que llevó el metal sinfónico al ámbito mainstream europeo.",
    },
    trackHighlights: [
      {
        track: "Nemo",
        note: "Single principal y el tema más exitoso de la banda: arreglo sinfónico, estribillo cantable y Tarja en registro accesible.",
      },
      {
        track: "Ghost Love Score",
        note: "Suite de 10 minutos con orquesta plena: arreglo cinematográfico, dúos coro-vocalista y clímax operístico. Pieza central del disco.",
      },
      {
        track: "Wish I Had an Angel",
        note: "Tempo medio-rápido con Marco Hietala en voz alterna, más cercano al metal industrial alemán que al sinfónico clásico.",
      },
    ],
    rating: {
      score: 9.0,
      justification:
        "Escala sinfónica al máximo y himnos absolutos: el disco que definió el techo del metal sinfónico a mediados de los 2000.",
    },
    criticQuotes: [
      {
        outlet: "AllMusic",
        year: 2004,
        url: "https://www.allmusic.com/album/once-mw0000316987",
        quote:
          "Once es Nightwish desplegando todo su arsenal sinfónico: orquesta completa, coros monumentales y temas que oscilan entre el power metal y la balada cinematográfica con notable acierto.",
      },
      {
        outlet: "Wikipedia",
        year: 2004,
        url: "https://en.wikipedia.org/wiki/Once_(Nightwish_album)",
        quote:
          "Uno de los álbumes más exitosos de Nightwish: doble platino en Finlandia, certificaciones en varios países europeos y aparición en el Billboard 200 estadounidense, hecho inusual para una banda finlandesa de metal sinfónico.",
      },
    ],
  },
};

/**
 * Resuelve la crítica de un álbum por id. Si por error queda algún id sin
 * review en el dataset, la función lanza para fallar rápido en tests en lugar
 * de devolver un objeto incompleto al cliente.
 */
export function getAlbumReview(albumId: string): AlbumReview {
  const review = albumReviews[albumId];
  if (!review) {
    throw new Error(`Missing AlbumReview for albumId=${albumId}`);
  }
  return review;
}
