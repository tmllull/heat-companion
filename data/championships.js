// ============================================================
//  HEAT: PEDAL TO THE METAL — CHAMPIONSHIP TEMPLATES DATA
// ============================================================

const CHAMPIONSHIP_TEMPLATES = [
  {
    id: "1961",
    name: "Campeonato Histórico 1961",
    year: 1961,
    pointsSystem: "classic",
    races: [
      {
        circuitId: "gb",
        eventId: "1961-inauguracion-tribuna",
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
        eventId: "1961-nuevo-record-velocidad",
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
        eventId: "1961-huelga-pilotos",
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
    pointsSystem: "classic",
    races: [
      {
        circuitId: "italy",
        eventId: "1962-restricciones-mecanicas",
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
        eventId: "1962-record-afluencia",
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
        eventId: "1962-corrupcion-comision",
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
    pointsSystem: "classic",
    races: [
      {
        circuitId: "usa",
        eventId: "1963-cambio-patrocinador",
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
        eventId: "1963-primera-tv-directo",
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
        eventId: "1963-nueva-normativa-seguridad",
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
        eventId: "1963-patrocinador-retira",
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
    pointsSystem: "classic",
    races: [
      {
        circuitId: "japan",
        eventId: "1964-internacionalizacion",
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
        eventId: "1964-vientes-turbulentos",
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
        eventId: "1964-chicanes-seguridad",
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
        eventId: "1964-lluvia-retrasa",
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
    pointsSystem: "classic",
    races: [
      {
        circuitId: "gb",
        eventId: "1965-sujetate-bien",
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
        eventId: "1965-sonrie-saluda",
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
        eventId: "1965-vision-tunel",
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
        eventId: "1965-olla-presion",
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