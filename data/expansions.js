// ============================================================
//  HEAT: PEDAL TO THE METAL — EXPANSION RULES DATA
// ============================================================

window.EXPANSION_RULES = {
  heavy_rain: {
    name: "Lluvia Torrencial",
    emoji: "🌧️",
    items: {
      rainy_zones: {
        name: "Zonas Lluviosas",
        description: "Zonas de la pista que dificultan la reducción de marchas.",
        effects: [
          "• Si empiezas la ronda en una Zona Lluviosa, pagarás +1 Heat adicional para reducir marchas.",
          "• Reducir 1 marcha cuesta 1 Heat.",
          "• Reducir 2 marchas cuesta 2 Heat."
        ]
      },
      chicanes: {
        name: "Chicanes",
        description: "Curvas consecutivas con la misma velocidad máxima.",
        effects: [
          "• Sin Clima/Estado: juégalas como curvas normales.",
          "• Con Clima/Estado: roba solo 1 ficha para toda la chicane.",
          "• Símbolo sector: afecta al sector siguiente.",
          "• Símbolo curva: afecta a ambas líneas de la chicane."
        ]
      },
      aggressive_legends: {
        name: "Leyendas Agresivas",
        description: "Las Leyendas (bots) pueden ser más rápidas en ciertos tramos.",
        effects: [
          "• Si una Leyenda empieza en un espacio con chevrón sobre el diamante, superará una línea de curva adicional esa ronda."
        ]
      }
    }
  },
  tunnel_vision: {
    name: "Visión de Túnel",
    emoji: "🔦",
    items: {
      tunnels: {
        name: "Túneles",
        description: "Tramos de pista que impiden el mantenimiento del coche.",
        effects: [
          "• Mientras estés en un túnel, no puedes descartar cartas de la mano.",
          "• Esta regla anula cualquier otro efecto de descarte (Evento, Mejora, etc.)."
        ]
      },
      drafting: {
        name: "Símbolo de Ráfaga",
        description: "Ventaja aerodinámica extra por ir a rebufo.",
        effects: [
          "• Se usa en el paso 5 (Reacción).",
          "• Avanza hasta # casillas si están libres y terminas justo detrás de otro coche.",
          "• No cuenta como velocidad.",
          "• Puedes combinar varios símbolos de Ráfaga.",
          "• Se pueden usar para cruzar o avanzar tras la línea de meta."
        ]
      },
      chicanes: {
        name: "Chicanes",
        description: "Curvas consecutivas con la misma velocidad máxima.",
        effects: [
          "• Sin Clima/Estado: juégalas como curvas normales.",
          "• Con Clima/Estado: roba solo 1 ficha para toda la chicane.",
          "• Símbolo sector: afecta al sector siguiente.",
          "• Símbolo curva: afecta a ambas líneas de la chicane."
        ]
      },
      aggressive_legends: {
        name: "Leyendas Agresivas",
        description: "Las Leyendas (bots) pueden ser más rápidas en ciertos tramos.",
        effects: [
          "• Si una Leyenda empieza en un espacio con chevrón sobre el diamante, superará una línea de curva adicional esa ronda."
        ]
      }
    }
  },
  rocky_roads: {
    name: "Terreno Inestable",
    emoji: "⛰️",
    items: {
      gravel: {
        name: "Grava",
        description: "Superficie que daña el motor al detenerse.",
        effects: [
          "• Al final del turno (paso 9), si estás en grava y tienes Heat en el motor, paga 1 Heat.",
          "• Si no tienes Heat disponible, ignora el efecto."
        ]
      },
      extra_slipstream: {
        name: "Rebufo adicional",
        description: "Permite encadenar rebufos en una misma ronda.",
        effects: [
          "• Si un rebufo te coloca en una nueva posición válida, puedes hacer un segundo rebufo.",
          "• Se aplican todas las bonificaciones activas de la ronda.",
          "• No cuenta como velocidad."
        ]
      },
      chicanes: {
        name: "Chicanes",
        description: "Curvas consecutivas con la misma velocidad máxima.",
        effects: [
          "• Sin Clima/Estado: juégalas como curvas normales.",
          "• Con Clima/Estado: roba solo 1 ficha para toda la chicane.",
          "• Símbolo sector: afecta al sector siguiente.",
          "• Símbolo curva: afecta a ambas líneas de la chicane."
        ]
      },
      aggressive_legends: {
        name: "Leyendas Agresivas",
        description: "Las Leyendas (bots) pueden ser más rápidas en ciertos tramos.",
        effects: [
          "• Si una Leyenda empieza en un espacio con chevrón sobre el diamante, superará una línea de curva adicional esa ronda."
        ]
      }
    }
  }
};
