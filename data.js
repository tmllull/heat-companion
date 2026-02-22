// ============================================================
//  HEAT: PEDAL TO THE METAL — COMPANION APP
//  Game Data: Circuits & Upgrade Cards
// ============================================================

// --- CIRCUITS ---
const CIRCUITS = [
  // Base Game
  {
    id: "usa",
    name: "Great Lakes Speedway",
    country: "USA",
    flag: "🇺🇸",
    curves: 3,
    spaces: 48,
    difficulty: "Fácil",
    expansion: "Base"
  },
  {
    id: "gb",
    name: "Grand Prix Circuit",
    country: "Gran Bretaña",
    flag: "🇬🇧",
    curves: 6,
    spaces: 54,
    difficulty: "Media",
    expansion: "Base"
  },
  {
    id: "italy",
    name: "Autodromo Nazionale",
    country: "Italia",
    flag: "🇮🇹",
    curves: 5,
    spaces: 54,
    difficulty: "Media",
    expansion: "Base"
  },
  {
    id: "france",
    name: "Circuit de la Sarthe",
    country: "Francia",
    flag: "🇫🇷",
    curves: 5,
    spaces: 60,
    difficulty: "Media",
    expansion: "Base"
  },
  // Expansion: Heavy Rain (Lluvia Torrencial)
  {
    id: "japan",
    name: "Suzuka Circuit",
    country: "Japón",
    flag: "🇯🇵",
    curves: 9,
    spaces: 60,
    difficulty: "Difícil",
    expansion: "Lluvia Torrencial"
  },
  {
    id: "mexico",
    name: "Hermanos Rodríguez",
    country: "México",
    flag: "🇲🇽",
    curves: 7,
    spaces: 66,
    difficulty: "Media",
    expansion: "Lluvia Torrencial"
  },
  // Expansion: Tunnel Vision (Visión de Túnel)
  {
    id: "spain",
    name: "Circuit de Barcelona",
    country: "España",
    flag: "🇪🇸",
    curves: 11,
    spaces: 109,
    difficulty: "Difícil",
    expansion: "Visión de Túnel"
  },
  {
    id: "netherlands",
    name: "Zandvoort",
    country: "Países Bajos",
    flag: "🇳🇱",
    curves: 8,
    spaces: 76,
    difficulty: "Media",
    expansion: "Visión de Túnel"
  }
];

// --- WEATHER OPTIONS ---
const WEATHER_OPTIONS = [
  { id: "sun", name: "Sol", emoji: "☀️", effect: "3 Motor Forzado en el descarte / +2 Rebufo" },
  { id: "clouds", name: "Nubes", emoji: "☁️", effect: "-1 Estrés / Sin Enfriamiento" },
  { id: "rain", name: "Lluvia", emoji: "🌧️", effect: "3 Motor Forzado en el mazo / +1 Enfriamiento" },
  { id: "storm", name: "Tormenta", emoji: "⛈️", effect: "+1 Estrés / +2 Rebufo" },
  { id: "snow", name: "Nieve", emoji: "❄️", effect: "-1 Motor Forzado / +1 Enfriamiento" },
  { id: "fog", name: "Niebla", emoji: "🌫️", effect: "+1 Motor Forzado / Sin Rebufo" }
];

// --- GAME BASICS (Heat & Stress) ---
const GAME_BASICS = {
  heat: {
    name: "Motor Forzado (Heat)",
    emoji: "🔥",
    description: "Representa el sobrecalentamiento del motor.",
    effects: [
      "No se pueden jugar ni descartar de la mano.",
      "Se usan para pagar: Boost (+1 Heat), saltar 2 marchas (+1 Heat), exceso de velocidad en curva.",
      "Enfriar (Cooling): Mueve Heat de tu mano al Motor (Engine) bajando de marcha o con mejoras."
    ]
  },
  stress: {
    name: "Estrés",
    emoji: "⚠️",
    description: "Representa pérdida de concentración del piloto.",
    effects: [
      "Al jugarla, voltea cartas del mazo hasta revelar una de Vel. (1-4).",
      "No se pueden descartar de la mano (solo jugando la carta).",
      "Se obtienen al trompear (Spin-out) o por efectos de clima/eventos."
    ]
  },
  spinout: {
    name: "Trompo (Spin-out)",
    emoji: "🔄",
    description: "Ocurre al no poder pagar el Heat de una curva.",
    effects: [
      "Mueve el coche justo antes de la línea de la curva.",
      "Gana 1 Estrés (si vas en marcha 1-2) o 2 Estrés (si vas en 3-4).",
      "Baja obligatoriamente a Marcha 1."
    ]
  },
  weather_setup: {
    name: "Configuración de Clima",
    emoji: "🌤️",
    description: "Preparación del módulo de clima y carretera.",
    effects: [
      "Baraja las 6 fichas de Clima y coloca 1 en el tablero (determina c. iniciales).",
      "Baraja las 12 fichas de Condición de Carretera.",
      "Coloca 1 ficha de Condición en cada sector (espacio entre curvas) y curva.",
      "Las fichas con un símbolo '+' en el reverso van en las curvas, las demás en sectores."
    ]
  }
};

// --- UPGRADE CARDS (Garaje) ---
const UPGRADES = [
  { id: "fuel_injection", name: "Inyección Comb.", category: "Velocidad", emoji: "⚡", description: "Descarta para añadir +1 a tu velocidad." },
  { id: "turbocharger", name: "Turbocompresor", category: "Velocidad", emoji: "🌀", description: "Convierte Motor Forzado en velocidad extra." },
  { id: "supercharger", name: "Compresor", category: "Velocidad", emoji: "💨", description: "Bono en aceleración." },
  { id: "nitro_tank", name: "Tanque de Nitro", category: "Velocidad", emoji: "🔥", description: "Gran impulso de velocidad. Genera mucho calor." },
  { id: "large_engine", name: "Motor Grande", category: "Velocidad", emoji: "🏎", description: "Reemplaza cartas de velocidad baja." },
  { id: "slipstream", name: "Optim. Rebufo", category: "Velocidad", emoji: "➡️", description: "Maximiza el beneficio del rebufo." },
  { id: "cooling_system", name: "Sist. Refrigeración", category: "Refrigeración", emoji: "❄️", description: "Elimina Motor Forzado de tu mano." },
  { id: "heat_insulation", name: "Aislamiento Térm.", category: "Refrigeración", emoji: "🛡️", description: "Reduce el calor generado en cada curva." },
  { id: "water_injection", name: "Inyección Agua", category: "Refrigeración", emoji: "💧", description: "Enfría el motor: descarta 2 cartas de Motor Forzado." },
  { id: "aero_body", name: "Cuerpo Aero", category: "Refrigeración", emoji: "🔵", description: "Genera menos calor en las curvas rápidas." },
  { id: "abs_brakes", name: "Frenos ABS", category: "Manejo", emoji: "🛑", description: "Frenada mejorada. Ayuda a evitar el trompo." },
  { id: "traction_control", name: "Control Tracción", category: "Manejo", emoji: "🔧", description: "Mejora el agarre y la tracción en curvas." },
  { id: "chassis_upgrade", name: "Mejora Chasis", category: "Manejo", emoji: "⚙️", description: "Permite superar curvas con mayor velocidad." },
  { id: "aero_kit", name: "Kit Aerodinámico", category: "Manejo", emoji: "🪁", description: "Mejora el downforce y la estabilidad." },
  { id: "pit_strategy", name: "Estrategia Boxes", category: "Táctica", emoji: "🏁", description: "Optimiza las paradas y el enfriamiento." },
  { id: "race_experience", name: "Experiencia Carrera", category: "Táctica", emoji: "🧠", description: "Permite gestionar mejor el mazo de robo." },
  { id: "drafting_technique", name: "Técnica Rebufo", category: "Táctica", emoji: "🎯", description: "Bono extra al seguir de cerca a un rival." },
  { id: "double_overtake", name: "Doble Adelanto", category: "Táctica", emoji: "⏩", description: "Permite adelantar a dos coches a la vez." }
];

// --- SPONSOR CARDS (Patrocinio Permanente) ---
const SPONSORS = [
  { id: "sponsor_card_1", name: "Patrocinio (A)", category: "Patrocinio", emoji: "💰", description: "Carta de patrocinio permanente (A)." },
  { id: "sponsor_card_2", name: "Patrocinio (B)", category: "Patrocinio", emoji: "💰", description: "Carta de patrocinio permanente (B)." },
  { id: "sponsor_card_3", name: "Patrocinio (C)", category: "Patrocinio", emoji: "💰", description: "Carta de patrocinio permanente (C)." }
];

// --- POINTS SYSTEMS ---
const POINTS_SYSTEMS = {
  f1: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
  f1old: [10, 6, 4, 3, 2, 1],
  simple: [6, 5, 4, 3, 2, 1],
  podium: [3, 2, 1],
};

// --- CHAMPIONSHIP TEMPLATES ---
const CHAMPIONSHIP_TEMPLATES = [
  {
    id: "1961",
    name: "Campeonato Histórico 1961",
    year: 1961,
    pointsSystem: "f1old",
    races: [
      {
        circuitId: "gb",
        event: "Inauguración de la Tribuna",
        rules: "Los 3 primeros en cruzar la meta en la vuelta 1 ganan 1 carta de patrocinio.",
        setup: "Sponsors: 1, Prensa: Curva C",
        mods: { weather: true, sponsors: true }
      },
      {
        circuitId: "usa",
        event: "Nuevo Récord de Velocidad",
        rules: "Al alcanzar velocidad 15+, gana inmediatamente 1 carta de patrocinio.",
        setup: "Sponsors: 1, Prensa: Curva A",
        mods: { weather: true, sponsors: true }
      },
      {
        circuitId: "italy",
        event: "Huelga de Pilotos",
        rules: "La carrera es 1 vuelta más corta. El ganador obtiene +2 puntos extra.",
        setup: "Sponsors: 1, Prensa: Curva B",
        mods: { weather: true, sponsors: true }
      }
    ]
  },
  {
    id: "1962",
    name: "Campeonato Histórico 1962",
    year: 1962,
    pointsSystem: "f1old",
    races: [
      {
        circuitId: "italy",
        event: "Récord de Asistencia",
        rules: "Carrera +1 vuelta. Tamaño de mano sube a 8 cartas.",
        setup: "Sponsors: 1, Prensa: Curvas C y E",
        mods: { weather: true, sponsors: true }
      },
      {
        circuitId: "gb",
        event: "Corrupción en la Comisión",
        rules: "Los 3 primeros obtienen +1 punto adicional en el campeonato.",
        setup: "Sponsors: 1, Prensa: Curva D",
        mods: { weather: true, sponsors: true }
      },
      {
        circuitId: "france",
        event: "Nuevo Patrocinador Principal",
        rules: "Bonus de patrocinio mejorado para el podio.",
        setup: "Sponsors: 2, Prensa: Curva A",
        mods: { weather: true, sponsors: true }
      }
    ]
  },
  {
    id: "1963",
    name: "Campeonato Histórico 1963",
    year: 1963,
    pointsSystem: "f1old",
    races: [
      {
        circuitId: "usa",
        event: "Primera Carrera TV en Vivo",
        rules: "Adelantar 3 coches en un turno otorga 1 carta de patrocinio.",
        setup: "Sponsors: 1, Prensa: Curvas B y D",
        mods: { weather: true, sponsors: true }
      },
      {
        circuitId: "gb",
        event: "Nuevas Reglas de Seguridad",
        rules: "Todos empiezan con -2 Heat y -1 Stress. Tamaño de mano baja a 6.",
        setup: "Sponsors: 1, Prensa: Curva D",
        mods: { weather: true, sponsors: true }
      },
      {
        circuitId: "france",
        event: "Retirada de Patrocinadores",
        rules: "Todos empiezan con +1 Stress. Un spin-off supone descalificación (0 pts).",
        setup: "Sponsors: 0, Prensa: Curva D",
        mods: { weather: true, sponsors: true }
      },
      {
        circuitId: "italy",
        event: "Incertidumbre en el Futuro",
        rules: "Todos empiezan con +1 Stress extra en el mazo.",
        setup: "Sponsors: 0, Prensa: Curvas C y E",
        mods: { weather: true, sponsors: true }
      }
    ]
  },
  {
    id: "1964",
    name: "Campeonato Histórico 1964 (Lluvia Torrencial)",
    year: 1964,
    pointsSystem: "f1old",
    races: [
      {
        circuitId: "japan",
        event: "Impresiona a la Prensa",
        rules: "Gana 2 patrocinadores si impresionas a la prensa (rebufo o +2 vel en curva).",
        setup: "Sponsors: 1, Prensa: Curvas B y F",
        mods: { weather: true, sponsors: true },
        weatherType: "rain"
      },
      {
        circuitId: "france",
        event: "Vientos Turbulentos",
        rules: "Ráfagas que afectan al movimiento en rectas largas.",
        setup: "Sponsors: 1, Prensa: Curva E",
        mods: { weather: true, sponsors: true },
        weatherType: "clouds"
      },
      {
        circuitId: "mexico",
        event: "Chicanes de Seguridad",
        rules: "Penalización doble por exceso de velocidad en chicanes.",
        setup: "Sponsors: 1, Prensa: Curva D",
        mods: { weather: true, sponsors: true }
      },
      {
        circuitId: "japan",
        event: "Lluvia Torrencial Repentina",
        rules: "Casillas inundadas. Bajar marcha cuesta +1 Heat si empiezas en agua.",
        setup: "Sponsors: 1, Prensa: Curvas G y I",
        mods: { weather: true, sponsors: true },
        weatherType: "storm"
      }
    ]
  },
  {
    id: "1965",
    name: "Campeonato Histórico 1965 (Visión de Túnel)",
    year: 1965,
    pointsSystem: "f1old",
    races: [
      {
        circuitId: "gb",
        event: "Saluda a la Cámara",
        rules: "En curvas de prensa, solo ganas patrocinio si vas por debajo del límite.",
        setup: "Sponsors: 0, Prensa: Curva C",
        mods: { weather: true, sponsors: true }
      },
      {
        circuitId: "usa",
        event: "Visión de Túnel",
        rules: "Puedes descartar cartas de Stress en el paso 8.",
        setup: "Sponsors: 0, Prensa: Curvas A y C",
        mods: { weather: true, sponsors: true }
      },
      {
        circuitId: "spain",
        event: "Olla a Presión",
        rules: "Carrera +1 vuelta. Al completar vuelta, elimina 1 carta de Heat del juego.",
        setup: "Sponsors: 1, Prensa: Curva B",
        mods: { weather: true, sponsors: true }
      },
      {
        circuitId: "netherlands",
        event: "Trampa de Arena",
        rules: "Las salidas de pista en chicanes son especialmente castigadas.",
        setup: "Sponsors: 1, Prensa: Curva D",
        mods: { weather: true, sponsors: true }
      }
    ]
  }
];
