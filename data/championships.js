// ============================================================
//  HEAT: PEDAL TO THE METAL — CHAMPIONSHIP TEMPLATES DATA
// ============================================================

window.CHAMPIONSHIP_TEMPLATES = [
  {
    id: "1961",
    name: "Campeonato Histórico 1961",
    year: 1961,
    pointsSystem: "f1old",
    races: [
      {
        circuitId: "gb",
        event: "Inauguración de la nueva Tribuna",
        rules: "Los 3 primeros pilotos en cruzar la linea de meta en la primera vuelta ganan inmediatamente 1 carta de patrocinio.",
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
        rules: "Cada vez que alcances una velocidad de 15 o más, ganas inmediatamente 1 carta de patrocinio.",
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
        rules: "Esta carrera es 1 vuelta más corta de lo habitual. El ganador de la carrera recibe 2 puntos de Campeonato extra.",
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
        rules: "Los pilotos comienzan la carrera con 1 carta de Motor forzado adicional de la reserva en su Motor",
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
        rules: "Esta carrera es 1 vuelta más larga de lo habitual, y el tamaño de mano de cartas aumenta a 8.",
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
        rules: "Los 3 primeros clasificados de la carrera reciben 1 punto de Campeonato extra",
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
        rules: "Esta carrera no tiene reglas especiales.",
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
        rules: "Si adelantas a 3 coches en una sola ronda, obtienes inmediatamente 1 carta de Patrocinio.",
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
        rules: "Todos los pilotos comienzan la carrera con 2 cartas de Motor forzado y 1 carta de Estrés menos de lo habitual. El tamaño de la mano de cartas se reduce a 6.",
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
        rules: "Todos los pilotos comienzan la carrera con 1 carta de Estrés adicional de la reserva en su mazo. Si hacer un trompo, quedas eliminado de la carrera y obtienes 0 puntos de Campeonato.",
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
        rules: "Las curvas con fichas de Prensa proporcionan 2 cartas de Patrocinio en lugar de 1.",
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
        rules: "Los Rebufos solo se permiten en 3ª o 4ª marcha.",
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
        rules: "En esta carrera puedes descartar cartas de Motor forzado durante el paso 8.",
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
        rules: "En esta carrera nadie puede beneficiarse de la Adrenalina.",
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
        rules: "Solo se puede descartar un máximo de 1 carta por turno.",
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
        rules: "La Prensa solo entrega cartas de Patrocinio a los Coches que circulen por dejabo de la Velocidad máxima de la curva.",
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
        rules: "En esta carrera puedes descartar cartas de Estrés durante el paso 8.",
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
        rules: "Esta carrera es más larga de lo habitual y tiene una vuelta más. Cada vez que un Piloto complete una vuelta deberá retirar de la partida una carta de Motor forzado (Paso 8. Orden de preferencia: Motor > Mano > Descarte > Mazo de cartas.).",
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