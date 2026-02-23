// ============================================================
//  HEAT: PEDAL TO THE METAL — GAME BASICS DATA
// ============================================================

window.GAME_BASICS = {
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