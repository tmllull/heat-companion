// ============================================================
//  HEAT: PEDAL TO THE METAL — COMPANION APP
//  Game Data: Circuits & Upgrade Cards
// ============================================================

// --- CIRCUITS ---
const CIRCUITS = [
  // Base Game
  {
    id: "usa",
    name: "",
    country: "USA",
    flag: "🇺🇸",
    curves: 4,
    spaces: 69,
    difficulty: "Fácil",
    expansion: "Base",
    laps: 2
  },
  {
    id: "gb",
    name: "",
    country: "Gran Bretaña",
    flag: "🇬🇧",
    curves: 5,
    spaces: 63,
    difficulty: "Media",
    expansion: "Base",
    laps: 2
  },
  {
    id: "italy",
    name: "",
    country: "Italia",
    flag: "🇮🇹",
    curves: 3,
    spaces: 54,
    difficulty: "Media",
    expansion: "Base",
    laps: 3
  },
  {
    id: "france",
    name: "",
    country: "Francia",
    flag: "🇫🇷",
    curves: 5,
    spaces: 60,
    difficulty: "Media",
    expansion: "Base",
    laps: 2
  },
  // Expansion: Heavy Rain (Lluvia Torrencial)
  {
    id: "japan",
    name: "",
    country: "Japón",
    flag: "🇯🇵",
    curves: 5,
    spaces: 60,
    difficulty: "Difícil",
    expansion: "Lluvia Torrencial",
    laps: 2
  },
  {
    id: "mexico",
    name: "",
    country: "México",
    flag: "🇲🇽",
    curves: 6,
    spaces: 60,
    difficulty: "Media",
    expansion: "Lluvia Torrencial",
    laps: 3
  },
  // Expansion: Tunnel Vision (Visión de Túnel)
  {
    id: "spain",
    name: "",
    country: "España",
    flag: "🇪🇸",
    curves: 11,
    spaces: 109,
    difficulty: "Difícil",
    expansion: "Visión de Túnel",
    laps: 1
  },
  {
    id: "netherlands",
    name: "",
    country: "Países Bajos",
    flag: "🇳🇱",
    curves: 5,
    spaces: 55,
    difficulty: "Media",
    expansion: "Visión de Túnel",
    laps: 3
  }
];

// --- WEATHER OPTIONS ---
const WEATHER_OPTIONS = [
  {
    id: "sun",
    name: "Soleado",
    emoji: "☀️",
    effect: {
      preparation: "3 Motor Forzado en el descarte",
      trackEffect: "+2 Rebufo"
    }
  },
  {
    id: "clouds",
    name: "Nublado",
    emoji: "☁️",
    effect: {
      preparation: "-1 Estrés",
      trackEffect: "Sin Enfriamiento"
    }
  },
  {
    id: "rain",
    name: "Lluvia",
    emoji: "🌧️",
    effect: {
      preparation: "3 Motor Forzado en el mazo",
      trackEffect: "+1 Enfriamiento"
    }
  },
  {
    id: "storm",
    name: "Tormenta",
    emoji: "⛈️",
    effect: {
      preparation: "+1 Estrés",
      trackEffect: "+2 Rebufo"
    }
  },
  {
    id: "snow",
    name: "Nieve",
    emoji: "❄️",
    effect: {
      preparation: "-1 Motor Forzado",
      trackEffect: "+1 Enfriamiento"
    }
  },
  {
    id: "fog",
    name: "Niebla",
    emoji: "🌫️",
    effect: {
      preparation: "+1 Motor Forzado",
      trackEffect: "Sin Rebufo"
    }
  }
];

// --- GAME BASICS (Heat & Stress) ---
const GAME_BASICS = {
  heat: {
    name: "Motor Forzado (Heat)",
    emoji: "🔥",
    description: "Representa el sobrecalentamiento del motor.",
    effects: [
      "No se pueden jugar ni descartar de la mano.",
      `Se usan para pagar: Boost (+1 Heat), saltar 2 marchas 
(+1 Heat), exceso de velocidad en curva.`,
      `Enfríar (Cooling): Mueve Heat de tu mano al Motor 
(Engine) bajando de marcha o con mejoras.`
    ]
  },
  stress: {
    name: "Estrés",
    emoji: "⚠️",
    description: "Representa pérdida de concentración del piloto.",
    effects: [
      `Al jugarla, voltea cartas del mazo hasta revelar 
una de Vel. (1-4).`,
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
      `Gana 1 Estrés (si vas en marcha 1-2) o 
2 Estrés (si vas en 3-4).`,
      "Baja obligatoriamente a Marcha 1."
    ]
  },
  weather_setup: {
    name: "Configuración de Clima",
    emoji: "🌤️",
    description: "Preparación del módulo de clima y carretera.",
    effects: [
      `Baraja las 6 fichas de Clima y coloca 1 en el tablero 
(determina c. iniciales).`,
      "Baraja las 12 fichas de Condición de Carretera.",
      `Coloca 1 ficha de Condición en cada sector 
(espacio entre curvas) y curva.`,
      `Las fichas con un síbolo '+' en el reverso van en 
las curvas, las demás en sectores.`
    ]
  }
};

// --- UPGRADE CARDS (Garaje) ---
const UPGRADES = [
  {
    id: "fuel_injection",
    name: "Inyección Comb.",
    category: "Velocidad",
    emoji: "⚡",
    description: `Descarta para añadir 
+1 a tu velocidad.`
  },
  {
    id: "turbocharger",
    name: "Turbocompresor",
    category: "Velocidad",
    emoji: "🌀",
    description: `Convierte Motor Forzado 
en velocidad extra.`
  },
  {
    id: "supercharger",
    name: "Compresor",
    category: "Velocidad",
    emoji: "💨",
    description: "Bono en aceleración."
  },
  {
    id: "nitro_tank",
    name: "Tanque de Nitro",
    category: "Velocidad",
    emoji: "🔥",
    description: `Gran impulso de velocidad. 
Genera mucho calor.`
  },
  {
    id: "large_engine",
    name: "Motor Grande",
    category: "Velocidad",
    emoji: "🏎",
    description: `Reemplaza cartas de velocidad 
baja.`
  },
  {
    id: "slipstream",
    name: "Optim. Rebufo",
    category: "Velocidad",
    emoji: "➡️",
    description: "Maximiza el beneficio del rebufo."
  },
  {
    id: "cooling_system",
    name: "Sist. Refrigeración",
    category: "Refrigeración",
    emoji: "❄️",
    description: `Elimina Motor Forzado 
de tu mano.`
  },
  {
    id: "heat_insulation",
    name: "Aislamiento Térm.",
    category: "Refrigeración",
    emoji: "🛡️",
    description: `Reduce el calor generado 
en cada curva.`
  },
  {
    id: "water_injection",
    name: "Inyección Agua",
    category: "Refrigeración",
    emoji: "💧",
    description: `Enfría el motor: 
descarta 2 cartas de Motor Forzado.`
  },
  {
    id: "aero_body",
    name: "Cuerpo Aero",
    category: "Refrigeración",
    emoji: "🔵",
    description: "Genera menos calor en las curvas rápidas."
  },
  {
    id: "abs_brakes",
    name: "Frenos ABS",
    category: "Manejo",
    emoji: "🛑",
    description: "Frenada mejorada. Ayuda a evitar el trompo."
  },
  {
    id: "traction_control",
    name: "Control Tracción",
    category: "Manejo",
    emoji: "🔧",
    description: "Mejora el agarre y la tracción en curvas."
  },
  {
    id: "chassis_upgrade",
    name: "Mejora Chasis",
    category: "Manejo",
    emoji: "⚙️",
    description: "Permite superar curvas con mayor velocidad."
  },
  {
    id: "aero_kit",
    name: "Kit Aerodinámico",
    category: "Manejo",
    emoji: "🪁",
    description: "Mejora el downforce y la estabilidad."
  },
  {
    id: "pit_strategy",
    name: "Estrategia Boxes",
    category: "Táctica",
    emoji: "🏁",
    description: "Optimiza las paradas y el enfriamiento."
  },
  {
    id: "race_experience",
    name: "Experiencia Carrera",
    category: "Táctica",
    emoji: "🧠",
    description: "Permite gestionar mejor el mazo de robo."
  },
  {
    id: "drafting_technique",
    name: "Técnica Rebufo",
    category: "Táctica",
    emoji: "🎯",
    description: "Bono extra al seguir de cerca a un rival."
  },
  {
    id: "double_overtake",
    name: "Doble Adelanto",
    category: "Táctica",
    emoji: "⏩",
    description: "Permite adelantar a dos coches a la vez."
  }
];

// --- SPONSOR CARDS (Patrocinio Permanente) ---
const SPONSORS = [
  {
    id: "sponsor_card_1",
    name: "Patrocinio (A)",
    category: "Patrocinio",
    emoji: "💰",
    description: "Carta de patrocinio permanente (A)."
  },
  {
    id: "sponsor_card_2",
    name: "Patrocinio (B)",
    category: "Patrocinio",
    emoji: "💰",
    description: "Carta de patrocinio permanente (B)."
  },
  {
    id: "sponsor_card_3",
    name: "Patrocinio (C)",
    category: "Patrocinio",
    emoji: "💰",
    description: "Carta de patrocinio permanente (C)."
  }
];

// --- POINTS SYSTEMS ---
const POINTS_SYSTEMS = {
  f1: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
  f1old: [10, 6, 4, 3, 2, 1],
  simple: [6, 5, 4, 3, 2, 1],
  podium: [3, 2, 1]
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
        event: "Inauguración de la nueva Tribuna",
        rules: `Los 3 primeros pilotos en cruzar la linea de meta 
                en la primera vuelta ganan inmediatamente 
                1 carta de patrocinio.`,
        setup: {
          sponsors: 2,
          press: "A"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
      },
      {
        circuitId: "usa",
        event: "¡Nuevo Récord de Velocidad!",
        rules: `Cada vez que alcances una velocidad de 15 o más, 
        ganas inmediatamente 1 carta de patrocinio.`,
        setup: {
          sponsors: 1,
          press: "B"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
      },
      {
        circuitId: "italy",
        event: "Huelga de Pilotos",
        rules: `Esta carrera es 1 vuelta más corta de lo habitual.
        El ganador de la carrera recibe 2 puntos de Campeonato extra.`,
        setup: {
          sponsors: 1,
          press: "C"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
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
        event: "Se levantan las restricciones mecánicas",
        rules: `Los pilotos comienzan la carrera con 1 carta de 
        Motor forzado adicional de la reserva en su Motor`,
        setup: {
          sponsors: 2,
          press: "E"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
      },
      {
        circuitId: "gb",
        event: "Record de afluencia",
        rules: `Esta carrera es 1 vuelta más larga de lo habitual, 
        y el tamaño de mano de cartas aumenta a 8.`,
        setup: {
          sponsors: 1,
          press: "C y E"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
      },
      {
        circuitId: "france",
        event: "Corrupción en la Comisión de normas",
        rules: `Los 3 primeros clasificados de la carrera reciben 1 punto de 
        Campeonato extra`,
        setup: {
          sponsors: 1,
          press: "C"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
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
        event: "Cambio de patrocinador",
        rules: `Esta carrera no tiene reglas especiales.`,
        setup: {
          sponsors: 3,
          press: "A"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
      },
      {
        circuitId: "gb",
        event: "Primera carrera televisada en directo",
        rules: `Si adelantas a 3 coches en una sola ronda, 
        obtienes inmediatamente 1 carta de Patrocinio.`,
        setup: {
          sponsors: 1,
          press: "B y D"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
      },
      {
        circuitId: "france",
        event: "Nueva normativa de seguridad",
        rules: `Todos los pilotos comienzan la carrera con 2 cartas de Motor forzado 
        y 1 carta de Estrés menos de lo habitual. El tamaño de la mano de cartas se reduce a 6.`,
        setup: {
          sponsors: 1,
          press: "D"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
      },
      {
        circuitId: "italy",
        event: "El patrocinador se retira: el futuro es incierto",
        rules: `Todos los pilotos comienzan la carrera con 1 carta de Estrés adicional de 
        la reserva en su mazo. Si hacer un trompo, quedas eliminado de la carrera y obtienes 
        0 puntos de Campeonato.`,
        setup: {
          sponsors: 0,
          press: "D"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
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
        event: "Internacionalización",
        rules: `Las curvas con fichas de Prensa proporcionan 2 
        cartas de Patrocinio en lugar de 1.`,
        setup: {
          sponsors: 0,
          press: "B y C"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        },
        weatherType: "rain"
      },
      {
        circuitId: "france",
        event: "Vientos turbulentos",
        rules: `Los Rebufos solo se permiten en 3ª o 4ª marcha.`,
        setup: {
          sponsors: 1,
          press: "B"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        },
        weatherType: "clouds"
      },
      {
        circuitId: "mexico",
        event: "Chicanes de mejorar la seguridad",
        rules: `En esta carrera puedes descartar cartas de Motor forzado durante el paso 8.`,
        setup: {
          sponsors: 1,
          press: "C"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
      },
      {
        circuitId: "japan",
        event: "La lluvia retrasa la carrera",
        rules: `En esta carrera nadie puede beneficiarse de la Adrenalina.`,
        setup: {
          sponsors: 1,
          press: "-"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        },
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
        event: "¡Sujétate bien!",
        rules: `Solo se puede descartar un máximo de 1 carta por turno.`,
        setup: {
          sponsors: 2,
          press: "D"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
      },
      {
        circuitId: "usa",
        event: "Sonríe y saluda",
        rules: `La Prensa solo entrega cartas de Patrocinio a los 
        Coches que circulen por dejabo de la Velocidad máxima de la curva.`,
        setup: {
          sponsors: 0,
          press: "C"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
      },
      {
        circuitId: "spain",
        event: "Visión de túnel",
        rules: `En esta carrera puedes descartar cartas de Estrés durante el paso 8.`,
        setup: {
          sponsors: 0,
          press: "A y C"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
      },
      {
        circuitId: "netherlands",
        event: "Olla a presión",
        rules: `Esta carrera es más larga de lo habitual y tiene una vuelta más. 
        Cada vez que un Piloto complete una vuelta deberá retirar de la partida una carta 
        de Motor forzado (Paso 8. Orden de preferencia: Motor > Mano > Descarte > Mazo de cartas.).`,
        setup: {
          sponsors: 1,
          press: "B"
        },
        mods: {
          weather: true,
          sponsors: true,
          press: true
        }
      }
    ]
  }
];
