"use strict";

const STORAGE_KEY = "sombra-roja-save-v1";

const dom = {
  titleScreen: document.querySelector("#title-screen"),
  gameScreen: document.querySelector("#game-screen"),
  startButton: document.querySelector("#start-button"),
  brandButton: document.querySelector("#brand-button"),
  storyContent: document.querySelector("#story-content"),
  mapButton: document.querySelector("#map-button"),
  mapDialog: document.querySelector("#map-dialog"),
  mapCount: document.querySelector("#map-count"),
  mapEyebrow: document.querySelector("#map-eyebrow"),
  mapTitle: document.querySelector("#map-title"),
  adventureMap: document.querySelector("#adventure-map"),
  mapPlaceDetail: document.querySelector("#map-place-detail"),
  mapTransitionCopy: document.querySelector("#map-transition-copy"),
  mapTransitionRoute: document.querySelector("#map-transition-route"),
  mapTransitionHeading: document.querySelector("#map-transition-heading"),
  mapTransitionText: document.querySelector("#map-transition-text"),
  continueRouteButton: document.querySelector("#continue-route-button"),
  logButton: document.querySelector("#log-button"),
  logDialog: document.querySelector("#log-dialog"),
  logList: document.querySelector("#log-list"),
  emptyLog: document.querySelector("#empty-log"),
  logCount: document.querySelector("#log-count"),
  resetButton: document.querySelector("#reset-button"),
  resetDialog: document.querySelector("#reset-dialog"),
  confirmReset: document.querySelector("#confirm-reset"),
  objectList: document.querySelector("#object-list"),
  objectCount: document.querySelector("#object-count"),
  routeValue: document.querySelector("#route-value"),
  toast: document.querySelector("#toast"),
  ash: document.querySelector("#ash")
};

const statKeys = ["fragmentos", "marcasSombra", "pactos", "honor"];
const sceneOrder = ["intro", "mapa", "barquero", "espejo", "mercader", "sendero", "corsario", "fortaleza"];
const mapLocations = {
  intro: {
    title: "Mar abierto",
    subtitle: "La noche sin estrellas",
    x: 8,
    y: 75,
    symbol: "⚓"
  },
  mapa: {
    title: "La cala del mapa",
    subtitle: "Donde comenzó el juramento",
    x: 20,
    y: 60,
    symbol: "◇"
  },
  barquero: {
    title: "Embarcadero sumergido",
    subtitle: "El precio del cruce",
    x: 34,
    y: 72,
    symbol: "☾"
  },
  espejo: {
    title: "Playa de los reflejos",
    subtitle: "La verdad frente al cristal",
    x: 46,
    y: 46,
    symbol: "◈"
  },
  mercader: {
    title: "Mercado de las banderas",
    subtitle: "Toda verdad tiene un precio",
    x: 59,
    y: 58,
    symbol: "✦"
  },
  sendero: {
    title: "Bosque sin norte",
    subtitle: "El sendero que cambia",
    x: 70,
    y: 32,
    symbol: "♧"
  },
  corsario: {
    title: "Puerta del Corsario",
    subtitle: "El guardián encadenado",
    x: 82,
    y: 45,
    symbol: "⚔"
  },
  fortaleza: {
    title: "Fortaleza de la Sombra Roja",
    subtitle: "El corazón de la maldición",
    x: 93,
    y: 19,
    symbol: "♜"
  }
};

const travelNarratives = {
  "intro:0": "Al extender la carta, la tinta roja abandona el pergamino y dibuja una estela sobre el mar. El barco vira solo: la primera marca del mapa os conduce hasta una cala que no existía un instante antes.",
  "mapa:0": "La Brújula de hueso encontrada bajo el mapa apunta hacia la campana sumergida. Siguiendo su aguja alcanzáis un embarcadero donde la niebla parece esperar vuestra llegada.",
  "mapa:1": "Respondéis a la campana con tres golpes en el casco. La niebla forma un canal y, al final, aparece el bote funerario del Barquero que habíais decidido buscar.",
  "mapa:2": "El fuego revela un símbolo bajo la esquina quemada: seis dedos rodeando una barca. Al seguirlo entre las cenizas, el mar os entrega directamente al embarcadero del Barquero.",
  "barquero:0": "La moneda se deshace en la palma del Barquero y se convierte en sal negra. Satisfecho, os lleva hasta una playa donde un espejo camina dejando huellas humanas.",
  "barquero:1": "El Barquero acepta vuestra promesa y ata a vuestro mástil un hilo invisible. La corriente de la deuda os deposita ante un espejo que ya refleja el favor que algún día reclamarán.",
  "barquero:2": "Los arrecifes desgarran el casco, pero lográis cruzar. La marca que deja el estrecho en vuestra piel brilla al mismo tiempo que un espejo solitario os observa desde la playa.",
  "espejo:0": "La verdad empaña el cristal y abre en él una puerta. Al cruzarla aparecéis bajo las banderas del Mercader, que sonríe porque ya conoce lo que habéis confesado.",
  "espejo:1": "El espejo guarda vuestra mentira como una mancha y señala un sendero de rostros. Todos conducen al toldo del Mercader, especialista en secretos que aún no han sido admitidos.",
  "espejo:2": "Las esquirlas huyen sobre la arena y forman una hilera brillante. Las seguís hasta un mercado imposible, donde el Mercader recoge una y la añade a su colección.",
  "mercader:0": "El Mercader pronuncia el Nombre de la Sombra sobre el fragmento entregado. Las sílabas abren una senda entre los árboles, pero el bosque responde cerrándose detrás de vosotros.",
  "mercader:1": "Bebéis el atajo y olvidáis un rostro querido. Cuando la taza queda vacía ya estáis dentro del bosque, incapaces de recordar qué camino habéis recorrido para llegar.",
  "mercader:2": "El Mercader recoge su puesto con una reverencia y deja visible el único camino que no vende. Es largo, oscuro y desemboca en el corazón del bosque cambiante.",
  "sendero:0": "La Brújula de hueso obliga a las raíces a apartarse. Su aguja termina clavándose en una puerta de hierro, frente a un hombre cuya sombra permanece encadenada a la fortaleza.",
  "sendero:1": "Las voces os guían hasta su dueño: el Corsario Maldito, que lleva siglos llamando a viajeros desde el bosque. Tras él se alzan las puertas que estabais buscando.",
  "sendero:2": "El Amuleto convoca una marea entre los troncos. La ola os arrastra sin daño y os deja a los pies del Corsario Maldito, guardián de la única entrada a la fortaleza.",
  "corsario:0": "El sello del Corsario bebe una gota de vuestra sombra y abre la puerta. Él queda atrás sonriendo, mientras las nuevas cadenas del pacto avanzan con vosotros hacia el corazón de la fortaleza.",
  "corsario:1": "El Filo espectral ganado en el duelo parte la cerradura. El Corsario inclina la cabeza ante vuestra victoria y la brecha conduce directamente a la cámara de la maldición.",
  "corsario:2": "Al terminar su confesión, la propia sombra del Corsario afloja una cadena. Con ese único eslabón abre la entrada y os ruega que no repitáis la decisión que lo condenó.",
  "fortaleza:0": "Vuestra orden rompe las cadenas del corazón. La Sombra Roja inunda la cámara y el destino de la tripulación se decide bajo una luna que acaba de perder su luz.",
  "fortaleza:1": "Los fragmentos vuelan de vuestras manos y forman un círculo alrededor del corazón. La fortaleza entera contiene el aliento mientras el nuevo sello se cierra.",
  "fortaleza:2": "Colocáis la sombra y la marea a ambos lados del corazón. Por primera vez en cien años, las cadenas dejan de tirar en direcciones opuestas."
};

function freshState() {
  return {
    fragmentos: 0,
    marcasSombra: 0,
    pactos: 0,
    honor: 0,
    objetos: ["Moneda antigua"],
    ruta: "Aguas desconocidas",
    currentScene: "intro",
    history: [],
    visitedScenes: ["intro"],
    pendingTransition: null,
    started: false,
    ending: null
  };
}

const scenes = {
  intro: {
    label: "Prólogo",
    title: "La noche sin estrellas",
    number: "I",
    narrative: [
      "Durante cien años, ningún barco regresó de las aguas que rodean la Fortaleza de la Sombra Roja. Los viejos capitanes dicen que allí duerme una maldición capaz de conceder el deseo más profundo de una tripulación... y cobrarlo con sangre.",
      "Esta noche, la luna arde sobre el mar. En la bodega de vuestro navío, una caja sellada comienza a golpear desde dentro. Al abrirla encontráis un mapa húmedo, una moneda anterior a todos los reinos y una frase escrita con tinta todavía fresca: «La sombra ya conoce vuestros nombres»."
    ],
    choices: [
      {
        text: "Abrir el mapa y jurar que llegaréis hasta el final",
        hint: "La travesía comienza. No todas las promesas podrán romperse.",
        next: "mapa",
        effects: { ruta: "Hacia la luna roja" }
      }
    ]
  },
  mapa: {
    label: "Escena I",
    title: "El mapa encontrado",
    number: "01",
    narrative: [
      "El mapa está dibujado sobre una piel que conserva el calor. Sus costas cambian cada vez que apartáis la mirada y una línea roja late desde vuestro barco hasta una isla que no figura en ninguna carta.",
      "En el margen aparecen tres instrucciones contradictorias. La tripulación espera vuestra orden mientras, a lo lejos, una campana suena bajo el agua."
    ],
    choices: [
      {
        text: "Seguir el mapa sin desviarse",
        hint: "La ruta más clara rara vez es la menos peligrosa.",
        next: "barquero",
        effects: {
          fragmentos: 1,
          addObjects: ["Brújula de hueso"],
          ruta: "La línea carmesí"
        }
      },
      {
        text: "Consultar al Barquero de la Niebla",
        hint: "Los muertos conocen atajos que los vivos olvidaron.",
        next: "barquero",
        effects: {
          honor: 1,
          ruta: "El embarcadero sumergido"
        }
      },
      {
        text: "Quemar una esquina para revelar tinta oculta",
        hint: "El fuego muestra un secreto, pero algo os observa desde el humo.",
        next: "barquero",
        effects: {
          fragmentos: 1,
          marcasSombra: 1,
          addObjects: ["Amuleto de Marea"],
          ruta: "La ruta de las cenizas"
        }
      }
    ]
  },
  barquero: {
    label: "Escena II",
    title: "El Barquero",
    number: "02",
    narrative: [
      "La niebla se abre y deja ver un bote hecho con tablas de ataúd. Su dueño no tiene rostro, solo una capucha llena de agua negra. Extiende una mano de seis dedos y señala el estrecho que protege la isla.",
      "«Todo cruce exige un precio», murmura con voces de ahogados. Tras él, las corrientes se retuercen como serpientes alrededor de vuestro casco."
    ],
    choices: [
      {
        text: "Pagar con la moneda antigua",
        hint: "Una deuda saldada pesa menos que una promesa.",
        next: "espejo",
        requires: state => state.objetos.includes("Moneda antigua"),
        requirementText: "Necesitas la Moneda antigua",
        effects: {
          honor: 1,
          removeObjects: ["Moneda antigua"],
          addObjects: ["Sal negra"],
          ruta: "El paso de los ahogados"
        }
      },
      {
        text: "Prometer un favor futuro",
        hint: "El Barquero nunca olvida una deuda.",
        next: "espejo",
        effects: {
          pactos: 1,
          addObjects: ["Deuda del Barquero"],
          ruta: "La corriente del juramento"
        }
      },
      {
        text: "Ignorarlo y cruzar por vuestra cuenta",
        hint: "Desafiar al estrecho dejará una marca.",
        next: "espejo",
        effects: {
          marcasSombra: 1,
          honor: -1,
          ruta: "Los arrecifes negros"
        }
      }
    ]
  },
  espejo: {
    label: "Escena III",
    title: "El Espejo Andante",
    number: "03",
    narrative: [
      "En la playa os espera un espejo con patas de plata. Camina en círculos sobre la arena y refleja versiones de la tripulación que toman decisiones distintas a las vuestras.",
      "La figura de vuestro reflejo acerca los labios al cristal. «Solo quien diga por qué desea realmente la maldición podrá seguir». Detrás del espejo, el sendero se divide en siete direcciones."
    ],
    choices: [
      {
        text: "Decir la verdad ante toda la tripulación",
        hint: "La verdad fortalece, aunque cambie la forma en que os miran.",
        next: "mercader",
        effects: {
          honor: 2,
          fragmentos: 1,
          addObjects: ["Verdad confesada"]
        }
      },
      {
        text: "Mentir para proteger la misión",
        hint: "El espejo dejará pasar la mentira, pero se quedará con su sombra.",
        next: "mercader",
        effects: {
          fragmentos: 1,
          marcasSombra: 1,
          ruta: "El sendero de los rostros"
        }
      },
      {
        text: "Romper el espejo antes de responder",
        hint: "Cada fragmento conserva un reflejo que ya no os pertenece.",
        next: "mercader",
        effects: {
          marcasSombra: 2,
          honor: -2,
          addObjects: ["Esquirla del espejo"]
        }
      }
    ]
  },
  mercader: {
    label: "Escena IV",
    title: "El Mercader de Verdades",
    number: "04",
    narrative: [
      "Bajo un toldo cosido con banderas de barcos desaparecidos, un mercader sirve té en copas de oro. Sus frascos contienen recuerdos, secretos y últimas palabras.",
      "«La fortaleza no tiene puerta», dice sonriendo. «Pero puedo venderos la manera de entrar. Aquí la información no cuesta monedas»."
    ],
    choices: [
      {
        text: "Cambiar un fragmento por información",
        hint: "Conocer el nombre de la maldición puede inclinar la balanza.",
        next: "sendero",
        requires: state => state.fragmentos >= 1,
        requirementText: "Necesitas al menos 1 fragmento",
        effects: {
          fragmentos: -1,
          addObjects: ["Nombre de la Sombra"],
          ruta: "La senda sin puerta"
        }
      },
      {
        text: "Cambiar un recuerdo por un atajo",
        hint: "Llegaréis antes, pero olvidaréis por qué empezasteis.",
        next: "sendero",
        effects: {
          pactos: 1,
          honor: -1,
          addObjects: ["Recuerdo perdido"],
          ruta: "El atajo del olvido"
        }
      },
      {
        text: "Rechazar el trato",
        hint: "Conserváis lo vuestro y aceptáis el camino largo.",
        next: "sendero",
        effects: {
          honor: 1,
          ruta: "La senda honrada"
        }
      }
    ]
  },
  sendero: {
    label: "Escena V",
    title: "El Sendero Perdido",
    number: "05",
    narrative: [
      "El bosque cambia detrás de cada paso. Las raíces forman nombres conocidos y voces queridas os llaman desde lugares donde nunca estuvieron.",
      "En algún punto más allá de los árboles, la Fortaleza de la Sombra Roja hace sonar sus cadenas. Debéis elegir qué guía merece vuestra confianza."
    ],
    choices: [
      {
        text: "Seguir la brújula de hueso",
        hint: "La aguja apunta hacia aquello que más teme la sombra.",
        next: "corsario",
        requires: state => state.objetos.includes("Brújula de hueso"),
        requirementText: "Necesitas la Brújula de hueso",
        effects: {
          fragmentos: 1,
          honor: 1,
          ruta: "El norte imposible"
        }
      },
      {
        text: "Seguir las voces entre los árboles",
        hint: "Las voces conocen un camino, pero quieren compañía.",
        next: "corsario",
        effects: {
          fragmentos: 1,
          marcasSombra: 2,
          ruta: "El coro de los perdidos"
        }
      },
      {
        text: "Alzar el Amuleto de Marea",
        hint: "Una ola imposible barrerá el bosque y revelará la costa.",
        next: "corsario",
        requires: state => state.objetos.includes("Amuleto de Marea"),
        requirementText: "Necesitas el Amuleto de Marea",
        effects: {
          fragmentos: 1,
          honor: 1,
          ruta: "La marea entre los árboles"
        }
      }
    ]
  },
  corsario: {
    label: "Escena VI",
    title: "El Corsario Maldito",
    number: "06",
    narrative: [
      "Ante las puertas de la fortaleza, un corsario encadenado a su propia sombra afila una espada transparente. En su sombrero reconocéis el emblema del primer capitán que buscó la maldición.",
      "«Puedo abriros el camino», dice. «También puedo cerrarlo para siempre. Todo depende de cuánto estéis dispuestos a perder antes que vuestra tripulación»."
    ],
    choices: [
      {
        text: "Aceptar su pacto",
        hint: "Su sello abre cualquier puerta y reclama cualquier deuda.",
        next: "fortaleza",
        effects: {
          pactos: 2,
          marcasSombra: 1,
          addObjects: ["Sello del Corsario"],
          ruta: "La puerta del traidor"
        }
      },
      {
        text: "Retarlo a un duelo",
        hint: "Una victoria ganará su respeto y un fragmento de su espada.",
        next: "fortaleza",
        effects: {
          fragmentos: 1,
          honor: 2,
          addObjects: ["Filo espectral"],
          ruta: "La brecha del acero"
        }
      },
      {
        text: "Escuchar su historia completa",
        hint: "A veces una maldición comienza con una promesa bien intencionada.",
        next: "fortaleza",
        effects: {
          honor: 1,
          addObjects: ["Confesión del Corsario"],
          ruta: "La entrada de los arrepentidos"
        }
      }
    ]
  },
  fortaleza: {
    label: "Escena final",
    title: "La Fortaleza de la Sombra Roja",
    number: "07",
    narrative: [
      "La fortaleza despierta. Sus torres se levantan como mástiles y, en la cámara central, una sombra roja está encadenada a un corazón de cristal. Cada fragmento que lleváis vibra al mismo ritmo.",
      "La maldición no pide ser destruida. Pide una decisión. Afuera, el mar se alza hasta cubrir el cielo y toda la tripulación pronuncia vuestro nombre."
    ],
    choices: [
      {
        id: "release",
        text: "Liberar la maldición",
        hint: "Romper las cadenas y aceptar lo que el mar decida cobrar.",
        endingAction: "release",
        effects: {
          marcasSombra: 1,
          ruta: "La marea desatada"
        }
      },
      {
        id: "seal",
        text: "Encerrar la maldición para siempre",
        hint: "Los fragmentos formarán una nueva prisión.",
        endingAction: "seal",
        requires: state => state.fragmentos >= 3,
        requirementText: "Necesitas 3 fragmentos",
        effects: {
          ruta: "El círculo sellado"
        }
      },
      {
        id: "balance",
        text: "Equilibrar la sombra y la marea",
        hint: "Ni libertad ni prisión: un juramento compartido.",
        endingAction: "balance",
        requires: state => canBalance(state),
        requirementText: "Requiere 3 fragmentos, 4 de honor, pocas marcas y una guía",
        effects: {
          ruta: "El juramento de la marea"
        }
      }
    ]
  }
};

const endings = {
  released: {
    symbol: "☾",
    title: "La Sombra Liberada",
    text: "Las cadenas revientan y la sombra se extiende sobre el océano como una segunda noche. Vuestra tripulación navega en su centro, invencible y temida, mientras cada puerto apaga sus faros al ver acercarse vuestras velas rojas. Habéis ganado todos los mares, pero ya ningún amanecer recuerda vuestros rostros."
  },
  balance: {
    symbol: "◈",
    title: "El Equilibrio de la Marea",
    text: "Colocáis los fragmentos alrededor del corazón y ofrecéis vuestro honor en lugar de una vida. La sombra se funde con la marea sin dominarla. Desde entonces, vuestro barco aparece cuando una tripulación está a punto de perderse, guiando a los valientes y confundiendo a los crueles. La maldición no termina: aprende a elegir."
  },
  sealed: {
    symbol: "✧",
    title: "La Fortaleza Sellada",
    text: "Los fragmentos vuelven a ser uno y el corazón de cristal encierra la sombra con un estruendo que parte la isla. Escapáis mientras la fortaleza se hunde bajo siete olas. Nadie cantará vuestro triunfo, porque habéis jurado borrar la ruta, pero cada noche tranquila del mar será una canción en vuestro honor."
  },
  cursed: {
    symbol: "☠",
    title: "Tripulación Maldita",
    text: "La sombra reconoce sus marcas antes de que pronunciéis la orden. Trepa por los mástiles, llena los pulmones de la tripulación y convierte vuestro navío en parte de la fortaleza. A partir de esa noche, quienes siguen voces entre la niebla encuentran un barco sin capitán y una tripulación que suplica que nadie suba a bordo."
  },
  betrayal: {
    symbol: "⚔",
    title: "La Traición del Corsario",
    text: "Los pactos cobran forma de cadenas. El Corsario sonríe y tira de ellas desde la oscuridad: cada promesa que hicisteis era una llave de su prisión. Libre al fin, toma vuestro barco, vuestro nombre y vuestra historia. La tripulación regresa a casa convertida en leyenda, pero es él quien recibe los brindis."
  }
};

let state = loadState();
let toastTimer = null;

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return freshState();

    const parsed = JSON.parse(saved);
    const currentIndex = Math.max(0, sceneOrder.indexOf(parsed.currentScene));
    const fallbackVisited = sceneOrder.slice(0, currentIndex + 1);
    return {
      ...freshState(),
      ...parsed,
      objetos: Array.isArray(parsed.objetos) ? parsed.objetos : ["Moneda antigua"],
      history: Array.isArray(parsed.history) ? parsed.history : [],
      visitedScenes: Array.isArray(parsed.visitedScenes) ? parsed.visitedScenes : fallbackVisited,
      pendingTransition: parsed.pendingTransition || null
    };
  } catch (error) {
    return freshState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    showToast("La aventura continúa, pero este navegador no permite guardar el progreso.");
  }
}

function canBalance(currentState) {
  const hasGuide = ["Brújula de hueso", "Amuleto de Marea", "Nombre de la Sombra"]
    .some(item => currentState.objetos.includes(item));

  return currentState.fragmentos >= 3
    && currentState.honor >= 4
    && currentState.marcasSombra <= 2
    && hasGuide;
}

function applyEffects(effects = {}) {
  statKeys.forEach(key => {
    if (typeof effects[key] === "number") {
      state[key] += effects[key];
    }
  });

  if (effects.ruta || effects.route) {
    state.ruta = effects.ruta || effects.route;
  }

  if (effects.addObjects) {
    effects.addObjects.forEach(item => {
      if (!state.objetos.includes(item)) state.objetos.push(item);
    });
  }

  if (effects.removeObjects) {
    state.objetos = state.objetos.filter(item => !effects.removeObjects.includes(item));
  }
}

function startGame() {
  state.started = true;
  state.currentScene = state.currentScene || "intro";
  state.ending = null;
  saveState();
  showGame();
  render();
}

function showGame() {
  dom.titleScreen.hidden = true;
  dom.gameScreen.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showTitle() {
  dom.gameScreen.hidden = true;
  dom.titleScreen.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function makeChoice(choiceIndex) {
  const scene = scenes[state.currentScene];
  const choice = scene.choices[choiceIndex];
  if (!choice) return;

  const allowed = !choice.requires || choice.requires(state);
  if (!allowed) {
    showToast(choice.requirementText || "Esa decisión aún no está disponible.");
    return;
  }

  applyEffects(choice.effects);
  const origin = state.currentScene;
  const bridge = travelNarratives[`${origin}:${choiceIndex}`] || "";
  let destination = choice.next || "fortaleza";
  let endingId = null;

  if (choice.endingAction) {
    endingId = determineEnding(choice.endingAction);
    destination = "fortaleza";
    state.ending = endingId;
  } else {
    state.currentScene = destination;
    if (!state.visitedScenes.includes(destination)) {
      state.visitedScenes.push(destination);
    }
  }

  state.history.push({
    scene: scene.title,
    choice: choice.text,
    route: state.ruta,
    origin,
    destination,
    bridge
  });

  state.pendingTransition = {
    origin,
    destination,
    route: state.ruta,
    bridge,
    endingId
  };

  saveState();
  updateHud();
  updateLog();
  updateMapCount();
  openMap(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function determineEnding(action) {
  if (state.pactos >= 4) return "betrayal";
  if (action === "balance" && canBalance(state)) return "balance";
  if (action === "seal" && state.fragmentos >= 3) return "sealed";

  if (state.marcasSombra >= 5 && state.fragmentos <= 2 && state.honor <= 0) {
    return "cursed";
  }

  return "released";
}

function render() {
  updateHud();
  updateLog();
  updateMapCount();

  if (state.ending) {
    renderEnding(state.ending);
  } else {
    renderScene(state.currentScene);
  }
}

function renderScene(sceneId) {
  const scene = scenes[sceneId] || scenes.intro;
  const latestJourney = [...state.history]
    .reverse()
    .find(entry => entry.destination === sceneId && entry.bridge);
  const continuityMarkup = latestJourney
    ? `<p class="continuity-note"><span>Durante la travesía</span>${escapeHtml(latestJourney.bridge)}</p>`
    : "";

  const choicesMarkup = scene.choices.map((choice, index) => {
    const allowed = !choice.requires || choice.requires(state);
    const detail = allowed ? choice.hint : choice.requirementText;
    const detailClass = allowed ? "" : " choice-requirement";

    return `
      <button class="choice-button" type="button" data-choice="${index}" ${allowed ? "" : "disabled"}>
        <span class="choice-index">${index + 1}</span>
        <span class="choice-copy">
          <strong>${escapeHtml(choice.text)}</strong>
          <small class="${detailClass.trim()}">${escapeHtml(detail)}</small>
        </span>
        <span class="choice-arrow" aria-hidden="true">${allowed ? "›" : "×"}</span>
      </button>
    `;
  }).join("");

  dom.storyContent.classList.remove("scene-enter");
  void dom.storyContent.offsetWidth;
  dom.storyContent.innerHTML = `
    <div class="scene-header">
      <div>
        <p class="scene-kicker">${escapeHtml(scene.label)}</p>
        <h2 class="scene-title">${escapeHtml(scene.title)}</h2>
      </div>
      <div class="scene-number" aria-hidden="true">${escapeHtml(scene.number)}</div>
    </div>
    <div class="ink-rule" aria-hidden="true"><span></span></div>
    ${continuityMarkup}
    <div class="narrative">
      ${scene.narrative.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}
    </div>
    <p class="decision-prompt">${sceneId === "intro" ? "Abrir la bitácora" : "¿Qué decide la tripulación?"}</p>
    <div class="choices">${choicesMarkup}</div>
  `;
  dom.storyContent.classList.add("scene-enter");
  dom.storyContent.querySelectorAll("[data-choice]").forEach(button => {
    button.addEventListener("click", () => makeChoice(Number(button.dataset.choice)));
  });
}

function renderEnding(endingId) {
  const ending = endings[endingId];
  const decisionSummary = state.history.map(entry => entry.choice).join(" · ");

  dom.storyContent.classList.remove("scene-enter");
  void dom.storyContent.offsetWidth;
  dom.storyContent.innerHTML = `
    <div class="ending-content">
      ${endingCinematic(endingId)}
      <div class="ending-seal" aria-hidden="true">${ending.symbol}</div>
      <p class="scene-kicker">Fin de la travesía</p>
      <h2 class="ending-title">${escapeHtml(ending.title)}</h2>
      <p class="ending-text">${escapeHtml(ending.text)}</p>
      <div class="ending-stats" aria-label="Estadísticas finales">
        ${endingStat("Fragmentos", state.fragmentos)}
        ${endingStat("Marcas", state.marcasSombra)}
        ${endingStat("Pactos", state.pactos)}
        ${endingStat("Honor", state.honor)}
      </div>
      <div class="ending-summary">
        <h3>La ruta que os trajo hasta aquí</h3>
        <p>${escapeHtml(decisionSummary)}</p>
      </div>
      <button id="play-again-button" class="primary-button" type="button">
        <span>Jugar otra vez</span>
        <span class="button-arrow" aria-hidden="true">↻</span>
      </button>
    </div>
  `;
  dom.storyContent.classList.add("scene-enter");
  document.querySelector("#play-again-button").addEventListener("click", resetAdventure);
}

function endingCinematic(endingId) {
  const labels = {
    released: "La sombra rompe sus cadenas y cubre el mar",
    balance: "La marea y la sombra giran en equilibrio alrededor del corazón",
    sealed: "La fortaleza queda sellada y se hunde bajo las olas",
    cursed: "La sombra invade el barco y transforma a la tripulación",
    betrayal: "El Corsario toma el navío mientras las cadenas atrapan a la tripulación"
  };

  const specialEffects = {
    released: `
      <div class="cinematic-shadow-surge"></div>
      <span class="broken-chain chain-left"></span>
      <span class="broken-chain chain-right"></span>
    `,
    balance: `
      <div class="balance-orbit orbit-one"></div>
      <div class="balance-orbit orbit-two"></div>
      <div class="balance-heart"></div>
    `,
    sealed: `
      <div class="seal-ring seal-ring-one"></div>
      <div class="seal-ring seal-ring-two"></div>
      <div class="seal-ring seal-ring-three"></div>
    `,
    cursed: `
      <div class="curse-tendrils">
        <i></i><i></i><i></i><i></i><i></i>
      </div>
      <div class="curse-eyes"><span></span><span></span><span></span></div>
    `,
    betrayal: `
      <div class="corsair-figure">
        <span class="corsair-hat"></span>
        <span class="corsair-head"></span>
        <span class="corsair-body"></span>
        <span class="corsair-sword"></span>
      </div>
      <span class="betrayal-chain chain-one"></span>
      <span class="betrayal-chain chain-two"></span>
    `
  };

  return `
    <div class="ending-cinematic ending-${endingId}" role="img" aria-label="${labels[endingId]}">
      <div class="cinematic-moon"></div>
      <div class="cinematic-cloud cloud-one"></div>
      <div class="cinematic-cloud cloud-two"></div>
      <div class="cinematic-fortress" aria-hidden="true">
        <span class="tower tower-left"></span>
        <span class="tower tower-center"></span>
        <span class="tower tower-right"></span>
      </div>
      <div class="cinematic-ship" aria-hidden="true">
        <span class="ship-mast"></span>
        <span class="ship-sail"></span>
        <span class="ship-hull"></span>
      </div>
      ${specialEffects[endingId]}
      <div class="cinematic-sea sea-back"></div>
      <div class="cinematic-sea sea-front"></div>
      <div class="cinematic-vignette"></div>
    </div>
  `;
}

function endingStat(label, value) {
  return `
    <div class="ending-stat">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function updateHud() {
  const maxValues = {
    fragmentos: 6,
    marcasSombra: 6,
    pactos: 5,
    honor: 8
  };

  statKeys.forEach(key => {
    const valueNode = document.querySelector(`#stat-${key}`);
    const meterNode = document.querySelector(`#meter-${key}`);
    const progressNode = meterNode.parentElement;
    const value = state[key];
    const displayValue = key === "honor" && value > 0 ? `+${value}` : value;
    const normalized = key === "honor" ? Math.max(0, value) : Math.max(0, value);
    const percentage = Math.min(100, (normalized / maxValues[key]) * 100);

    valueNode.textContent = displayValue;
    meterNode.style.width = `${percentage}%`;
    progressNode.setAttribute("aria-valuenow", value);
  });

  dom.routeValue.textContent = state.ruta;
  dom.objectCount.textContent = state.objetos.length;
  dom.objectList.innerHTML = state.objetos.length
    ? state.objetos.map(item => `<li>${escapeHtml(item)}</li>`).join("")
    : '<li class="empty-inventory">Sin objetos</li>';
}

function updateLog() {
  dom.logCount.textContent = state.history.length;
  dom.emptyLog.hidden = state.history.length > 0;
  dom.logList.hidden = state.history.length === 0;
  dom.logList.innerHTML = state.history.map(entry => `
    <li>
      <strong>${escapeHtml(entry.scene)}</strong>
      <span>${escapeHtml(entry.choice)}</span>
    </li>
  `).join("");
}

function updateMapCount() {
  dom.mapCount.textContent = state.visitedScenes.length;
}

function renderAdventureMap(selectedScene = state.currentScene, animateRoute = false) {
  const visited = sceneOrder.filter(sceneId => state.visitedScenes.includes(sceneId));
  const allPoints = sceneOrder
    .map(sceneId => `${mapLocations[sceneId].x},${mapLocations[sceneId].y}`)
    .join(" ");
  const visitedPoints = visited
    .map(sceneId => `${mapLocations[sceneId].x},${mapLocations[sceneId].y}`)
    .join(" ");

  const nodes = sceneOrder.map((sceneId, index) => {
    const location = mapLocations[sceneId];
    const isVisited = state.visitedScenes.includes(sceneId);
    const isCurrent = sceneId === state.currentScene;
    const isSelected = sceneId === selectedScene;
    const classes = [
      "map-node",
      isVisited ? "is-visited" : "is-locked",
      isCurrent ? "is-current" : "",
      isSelected ? "is-selected" : ""
    ].filter(Boolean).join(" ");

    return `
      <button
        class="${classes}"
        type="button"
        style="left: ${location.x}%; top: ${location.y}%;"
        data-map-scene="${sceneId}"
        ${isVisited ? "" : "disabled"}
        aria-label="${isVisited ? escapeHtml(location.title) : `Lugar ${index + 1} aún no descubierto`}"
        aria-pressed="${isSelected}"
      >
        <span>${isVisited ? location.symbol : "?"}</span>
        <small>${isVisited ? escapeHtml(location.title) : "Desconocido"}</small>
      </button>
    `;
  }).join("");

  dom.adventureMap.innerHTML = `
    <div class="map-sea-lines" aria-hidden="true"></div>
    <div class="map-island island-one" aria-hidden="true"></div>
    <div class="map-island island-two" aria-hidden="true"></div>
    <div class="map-island island-three" aria-hidden="true"></div>
    <svg class="map-routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polyline class="map-route-base" points="${allPoints}"></polyline>
      <polyline class="map-route-progress ${animateRoute ? "is-drawing" : ""}" pathLength="1" points="${visitedPoints}"></polyline>
    </svg>
    <div class="map-compass" aria-hidden="true"><span>N</span><i></i></div>
    ${nodes}
  `;

  dom.adventureMap.querySelectorAll("[data-map-scene]:not(:disabled)").forEach(button => {
    button.addEventListener("click", () => {
      renderAdventureMap(button.dataset.mapScene, false);
      renderMapPlaceDetail(button.dataset.mapScene);
    });
  });
}

function renderMapPlaceDetail(sceneId) {
  const location = mapLocations[sceneId];
  const journey = [...state.history]
    .reverse()
    .find(entry => entry.destination === sceneId);
  const status = sceneId === state.currentScene ? "Posición actual" : "Lugar visitado";

  dom.mapPlaceDetail.innerHTML = `
    <div>
      <span>${status}</span>
      <h3>${escapeHtml(location.title)}</h3>
    </div>
    <p>${journey
      ? escapeHtml(`${journey.choice}. ${journey.route}.`)
      : escapeHtml(location.subtitle)}</p>
  `;
}

function openMap(asTransition = false) {
  const transition = state.pendingTransition;
  const transitionMode = asTransition && transition;
  const selectedScene = transitionMode ? transition.destination : state.currentScene;
  const closeButton = dom.mapDialog.querySelector("[data-close-dialog]");

  dom.mapDialog.classList.toggle("transition-mode", Boolean(transitionMode));
  dom.mapEyebrow.textContent = transitionMode ? "Nuevo tramo descubierto" : "Carta de navegación";
  dom.mapTitle.textContent = transitionMode ? "La ruta continúa" : "El rumbo de la Sombra Roja";
  dom.mapPlaceDetail.hidden = Boolean(transitionMode);
  dom.mapTransitionCopy.hidden = !transitionMode;
  closeButton.hidden = Boolean(transitionMode);

  renderAdventureMap(selectedScene, Boolean(transitionMode));

  if (transitionMode) {
    const destination = mapLocations[transition.destination];
    dom.mapTransitionRoute.textContent = transition.route;
    dom.mapTransitionHeading.textContent = transition.endingId
      ? "La última decisión está tomada"
      : `Rumbo a ${destination.title}`;
    dom.mapTransitionText.textContent = transition.bridge;
  } else {
    renderMapPlaceDetail(selectedScene);
  }

  openDialog(dom.mapDialog);
}

function continueRoute() {
  state.pendingTransition = null;
  saveState();
  closeDialog(dom.mapDialog);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetAdventure() {
  state = freshState();
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // The in-memory reset still works when storage is unavailable.
  }

  closeDialog(dom.resetDialog);
  closeDialog(dom.logDialog);
  closeDialog(dom.mapDialog);
  showTitle();
  updateHud();
  updateLog();
  updateMapCount();
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeDialog(dialog) {
  if (!dialog || !dialog.open) return;
  if (typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    dom.toast.classList.remove("visible");
  }, 3200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createAsh() {
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 22; index += 1) {
    const ember = document.createElement("span");
    ember.style.left = `${Math.random() * 100}%`;
    ember.style.bottom = `${Math.random() * 20 - 10}%`;
    ember.style.setProperty("--duration", `${8 + Math.random() * 11}s`);
    ember.style.setProperty("--delay", `${Math.random() * -16}s`);
    ember.style.setProperty("--drift", `${-30 + Math.random() * 60}px`);
    fragment.appendChild(ember);
  }
  dom.ash.appendChild(fragment);
}

dom.startButton.addEventListener("click", startGame);
dom.brandButton.addEventListener("click", showTitle);
dom.mapButton.addEventListener("click", () => openMap(false));
dom.continueRouteButton.addEventListener("click", continueRoute);
dom.logButton.addEventListener("click", () => openDialog(dom.logDialog));
dom.resetButton.addEventListener("click", () => openDialog(dom.resetDialog));
dom.confirmReset.addEventListener("click", resetAdventure);

document.querySelectorAll("[data-close-dialog]").forEach(button => {
  button.addEventListener("click", () => {
    closeDialog(document.querySelector(`#${button.dataset.closeDialog}`));
  });
});

[dom.logDialog, dom.mapDialog, dom.resetDialog].forEach(dialog => {
  dialog.addEventListener("click", event => {
    if (event.target === dialog && !(dialog === dom.mapDialog && state.pendingTransition)) {
      closeDialog(dialog);
    }
  });
});

dom.mapDialog.addEventListener("cancel", event => {
  if (state.pendingTransition) event.preventDefault();
});

document.addEventListener("keydown", event => {
  const hasOpenDialog = document.querySelector("dialog[open]");
  if (event.key >= "1" && event.key <= "3" && !dom.gameScreen.hidden && !state.ending && !hasOpenDialog) {
    const index = Number(event.key) - 1;
    const button = dom.storyContent.querySelector(`[data-choice="${index}"]`);
    if (button && !button.disabled) button.click();
  }
});

createAsh();
updateHud();
updateLog();
updateMapCount();

if (state.started) {
  showGame();
  render();
  if (state.pendingTransition) {
    window.setTimeout(() => openMap(true), 0);
  }
}
