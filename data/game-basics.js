// ============================================================
//  HEAT: PEDAL TO THE METAL — GAME BASICS DATA
// ============================================================

window.GAME_BASICS = {
  heat: {
    name: "Motor Forzado",
    emoji: "🔥",
    description: "Representa el sobrecalentamiento del motor.",
    effects: [
      "• Se usan para ir más rápido.",
      "• Ciclo: Motor → descarte → mazo → mano.",
      "• Solo el Enfriamiento las devuelve al Motor.",
      "• No se pueden jugar ni descartar desde la mano.",
    ]
  },
  stress: {
    name: "Estrés",
    emoji: "⚠️",
    description: "Representa pérdida de concentración del piloto.",
    effects: [
      "• Empiezas la carrera con 3 cartas de Estrés en tu mazo.",
      "• Debes jugarlas para quitarlas de la mano.",
      "• Al jugarlas, añaden aleatoriedad a tu Velocidad."
    ]
  },
  slipstream: {
    name: "Rebufo (Opcional)",
    emoji: "💨",
    description: "Representa la ventaja aerodinámica de estar cerca de otro coche.",
    effects: [
      "• Si terminas tu movimiento al lado o a 1 espacio de otro coche, recibes un Rebufo.",
      "• Avanza +2 espacios",
      "• Máx. 1 vez por turno.",
      "• Si el espacio final está ocupado, colócate en el primer espacio libre detrás.",
      "• No aumenta la velocidad al comprobar una curva."]
  },
  spinout: {
    name: "Trompo",
    emoji: "🔄",
    description: "Ocurre al no poder pagar el Heat de una curva.",
    effects: [
      "• Si no puedes pagar todo el exceso de velocidad con Motor forzado, sufres un trompo.",
      "• Paga todas las cartas de Motor forzado que tengas.",
      "• Coloca el coche antes de la curva que causó el trompo.",
      "• Roba Estrés:",
      "  • 1 carta si estabas en 1ª–2ª.",
      "  • 2 cartas si estabas en 3ª–4ª.",
      "• Baja la Caja de cambios a 1ª Marcha.",
      "• Pierdes tu turno actual."
    ]
  },
  weather_setup: {
    name: "Clima y estado de la pista",
    emoji: "🌤️",
    description: "Preparación del módulo de clima y carretera.",
    effects: [
      "Clima:",
      "• Baraja las 6 fichas de Clima y roba 1 para toda la carrera.",
      "• Colócala en la Cartelera.",
      "• Ajusta para toda la carrera tus cartas de Motor forzado o Estrés según su efecto.",
      " ",
      "Estado de la pista:",
      "• Baraja las 12 fichas de Estado de la pista.",
      "• Roba 1 por cada curva del circuito.",
      "• Revélalas en orden, desde la primera curva.",
      "• Si tiene símbolo de sector: afecta a todos los espacios hasta la siguiente curva y se coloca en la caseta del sector.",
      "• Si no: afecta solo a esa curva y se coloca junto a ella."
    ]
  }
};