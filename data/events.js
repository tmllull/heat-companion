// ============================================================
//  HEAT: PEDAL TO THE METAL — RACE EVENTS DATA
// ============================================================

window.RACE_EVENTS = {
  // 1961 Events
  "1961-inauguracion-tribuna": {
    id: "1961-inauguracion-tribuna",
    name: "Inauguración de la nueva Tribuna",
    description: "Los 3 primeros pilotos en cruzar la linea de meta en la primera vuelta ganan inmediatamente 1 carta de patrocinio.",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0] // Usa sistema por defecto
  },
  "1961-nuevo-record-velocidad": {
    id: "1961-nuevo-record-velocidad",
    name: "¡Nuevo Récord de Velocidad!",
    description: "Cada vez que alcances una velocidad de 15 o más, ganas inmediatamente 1 carta de patrocinio.",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  },
  "1961-huelga-pilotos": {
    id: "1961-huelga-pilotos",
    name: "Huelga de Pilotos",
    description: "Esta carrera es 1 vuelta más corta de lo habitual. El ganador de la carrera recibe 2 puntos de Campeonato extra.",
    pointsOverride: [+2, 0, 0, 0, 0, 0, 0] // 2 puntos extra al ganador
  },

  // 1962 Events
  "1962-restricciones-mecanicas": {
    id: "1962-restricciones-mecanicas",
    name: "Se levantan las restricciones mecánicas",
    description: "Los pilotos comienzan la carrera con 1 carta de Motor forzado adicional de la reserva en su Motor",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  },
  "1962-record-afluencia": {
    id: "1962-record-afluencia",
    name: "Record de afluencia",
    description: "Esta carrera es 1 vuelta más larga de lo habitual, y el tamaño de mano de cartas aumenta a 8.",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  },
  "1962-corrupcion-comision": {
    id: "1962-corrupcion-comision",
    name: "Corrupción en la Comisión de normas",
    description: "Los 3 primeros clasificados de la carrera reciben 1 punto de Campeonato extra",
    pointsOverride: [+1, +1, +1, 0, 0, 0, 0] // 1 punto extra a los 3 primeros
  },

  // 1963 Events
  "1963-cambio-patrocinador": {
    id: "1963-cambio-patrocinador",
    name: "Cambio de patrocinador",
    description: "Esta carrera no tiene reglas especiales.",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  },
  "1963-primera-tv-directo": {
    id: "1963-primera-tv-directo",
    name: "Primera carrera televisada en directo",
    description: "Si adelantas a 3 coches en una sola ronda, obtienes inmediatamente 1 carta de Patrocinio.",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  },
  "1963-nueva-normativa-seguridad": {
    id: "1963-nueva-normativa-seguridad",
    name: "Nueva normativa de seguridad",
    description: "Todos los pilotos comienzan la carrera con 2 cartas de Motor forzado y 1 carta de Estrés menos de lo habitual. El tamaño de la mano de cartas se reduce a 6.",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  },
  "1963-patrocinador-retira": {
    id: "1963-patrocinador-retira",
    name: "El patrocinador se retira: el futuro es incierto",
    description: "Todos los pilotos comienzan la carrera con 1 carta de Estrés adicional de la reserva en su mazo. Si hacer un trompo, quedas eliminado de la carrera y obtienes 0 puntos de Campeonato.",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  },

  // 1964 Events
  "1964-internacionalizacion": {
    id: "1964-internacionalizacion",
    name: "Internacionalización",
    description: "Las curvas con fichas de Prensa proporcionan 2 cartas de Patrocinio en lugar de 1.",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  },
  "1964-vientes-turbulentos": {
    id: "1964-vientes-turbulentos",
    name: "Vientos turbulentos",
    description: "Los Rebufos solo se permiten en 3ª o 4ª marcha.",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  },
  "1964-chicanes-seguridad": {
    id: "1964-chicanes-seguridad",
    name: "Chicanes de mejorar la seguridad",
    description: "En esta carrera puedes descartar cartas de Motor forzado durante el paso 8.",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  },
  "1964-lluvia-retrasa": {
    id: "1964-lluvia-retrasa",
    name: "La lluvia retrasa la carrera",
    description: "En esta carrera nadie puede beneficiarse de la Adrenalina.",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  },

  // 1965 Events
  "1965-sujetate-bien": {
    id: "1965-sujetate-bien",
    name: "¡Sujétate bien!",
    description: "Solo se puede descartar un máximo de 1 carta por turno.",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  },
  "1965-sonrie-saluda": {
    id: "1965-sonrie-saluda",
    name: "Sonríe y saluda",
    description: "La Prensa solo entrega cartas de Patrocinio a los Coches que circulen por dejabo de la Velocidad máxima de la curva.",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  },
  "1965-vision-tunel": {
    id: "1965-vision-tunel",
    name: "Visión de túnel",
    description: "En esta carrera puedes descartar cartas de Estrés durante el paso 8.",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  },
  "1965-olla-presion": {
    id: "1965-olla-presion",
    name: "Olla a presión",
    description: "Esta carrera es más larga de lo habitual y tiene una vuelta más. Cada vez que un Piloto complete una vuelta deberá retirar de la partida una carta de Motor forzado (Paso 8. Orden de preferencia: Motor > Mano > Descarte > Mazo de cartas.).",
    pointsOverride: [0, 0, 0, 0, 0, 0, 0]
  }
};
