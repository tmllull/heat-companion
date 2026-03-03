/**
 * HEAT Companion — Spanish Locale
 */

window.LOCALE_ES = {
  common: {
    cancel: "Cancelar",
    save: "Guardar",
    close: "Cerrar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Añadir",
    weather: "Clima",
    sponsors: "Patrocinios",
    press: "Prensa",
    laps: "Vueltas",
    curves: "Curvas",
    spaces: "Casillas",
    circuit: "Circuito",
    event: "Evento",
    rules: "Reglas",
    result: "Resultado",
    player: "Piloto",
    players: "Pilotos",
    view: "Ver",
    confirmDelete: "¿Eliminar {{item}} del calendario?",
    noModules: "Sin módulos"
  },
  nav: {
    dashboard: "Dashboard",
    players: "Pilotos",
    championship: "Campeonato",
    circuits: "Circuitos",
    standings: "Clasificación",
    manual: "Referencia",
    config: "Configurar",
    theme: "Cambiar tema",
    export: "Exportar",
    import: "Importar",
    reset: "Resetear...",
    menu: "Menú",
    inicio: "Inicio",
    tabla: "Tabla"
  },
  lang: {
    es: "Español",
    en: "Inglés"
  },
  dashboard: {
    title: "Bienvenido a HEAT Companion",
    subtitle: "Gestiona tu campeonato de Heat: Pedal to the Metal",
    statRaces: "Carreras disputadas",
    statPending: "Carreras pendientes",
    statPlayers: "Pilotos inscritos",
    statLeader: "Líder del campeonato",
    pending: "Pendiente",
    completed: "Completada",
    standingsTitle: "Clasificación actual",
    viewAll: "Ver completa →",
    recentRaces: "Próximas / Últimas carreras",
    viewCalendar: "Ver calendario →"
  },
  championship: {
    title: "Campeonato",
    subtitle: "Gestiona el calendario, los pilotos y los resultados",
    calendar: "Calendario de carreras",
    historics: "Históricos",
    restart: "Reiniciar",
    addRace: {
      title: "Añadir carrera al calendario",
      eventName: "Nombre del evento",
      eventNamePlaceholder: "Ej: Gran Premio de España, Carrera Nocturna...",
      specialRules: "Reglas especiales",
      specialRulesPlaceholder: "Reglas específicas de esta carrera...",
      activeModules: "Módulos activos",
      newRaceHint: "Las nuevas carreras se añadirán al final del calendario.",
      selectWeather: "Selecciona el clima",
      sponsorCards: "Cartas de patrocinio al inicio",
      pressLocation: "Ubicación de la Prensa (Curvas)",
      pressLocationPlaceholder: "Ej: A, B y D...",
      addToCalendar: "Añadir al calendario"
    }
  },
  players: {
    title: "Pilotos",
    subtitle: "Gestiona los pilotos y sus cartas de mejora",
    empty: "No hay pilotos aún. ¡Añade el primero!",
    legend: "Piloto Leyenda (Bot)",
    duplicateIcon: "El número {{n}} ya está en uso",
    numericOnly: "El número solo puede contener dígitos",
    nameRequired: "El nombre del piloto es obligatorio",
    nameMinLength: "El nombre debe tener al menos 2 caracteres",
    colorInUse: "El color ya lo usa {{name}}"
  },
  circuits: {
    title: "Circuitos",
    subtitle: "Gestiona los circuitos disponibles para las carreras",
    empty: "No hay circuitos configurados. ¡Añade el primero!",
    original: "🏁 Circuitos Originales",
    fanmade: "📐 Circuitos Fanmade"
  },
  standings: {
    title: "Clasificación del Campeonato",
    empty: "Añade pilotos al campeonato y disputa carreras para ver la clasificación",
    pos: "Pos",
    player: "Piloto",
    pts: "Puntos",
    gap: "Diferencia",
    races: "Carreras"
  },
  manual: {
    title: "Manual de Referencia",
    subtitle: "Consulta las reglas rápidas de Clima, Motor Forzado y Estrés",
    downloadBasic: " Descargar Manual Básico",
    downloadAdvanced: " Descargar Manual Avanzado",
    basics: " Mecánicas Básicas",
    weather: " Efectos de Clima",
    heatTitle: "Motor Forzado",
    heatDescription: "Representa el sobrecalentamiento del motor.",
    stressTitle: "Estrés",
    stressDescription: "Representa pérdida de concentración del piloto.",
    slipstreamTitle: "Rebufo (Opcional)",
    slipstreamDescription: "Representa la ventaja aerodinámica de estar cerca de otro coche.",
    spinoutTitle: "Trompo",
    spinoutDescription: "Ocurre al no poder pagar el Heat de una curva.",
    weatherTrackTitle: "Clima y estado de la pista",
    weatherTrackDescription: "y mas...",
    weather_setupTitle: "Clima y estado de la pista",
    weather_setupDescription: "Preparación del módulo de clima y carretera."
  },
  modals: {
    raceDetail: {
      title: "Detalle de carrera"
    },
    results: {
      title: "Registrar resultado",
      hint: "Ordena los pilotos según la posición final. Usa los botones ▲▼ o arrastra.",
      saveResult: "Guardar resultado"
    },
    addCircuit: {
      title: "Añadir circuito",
      name: "Nombre del circuito",
      country: "País",
      selectCountry: "Selecciona un país...",
      placeholderDescription: "Características del circuito..."
    },
    addPlayer: {
      title: "Añadir piloto",
      name: "Nombre del piloto",
      namePlaceholder: "Ej: Ayrton Senna",
      carColor: "Color del coche",
      number: "Número",
      numberPlaceholder: "Obligatorio: Ej: 1, 77, 99"
    },
    championship: {
      title: "Configurar Campeonato",
      name: "Nombre del campeonato",
      points: "Sistema de puntos",
      classic: "Clásico (9-6-4-3-2-1)",
      podium: "Solo podio (3-2-1)",
      custom: "Personalizado",
      customPlaceholder: "Ej: 25,18,15,12,10,8,6,4,2,1 (separados por comas)"
    },
    championshipTemplates: {
      title: "Campeonatos Históricos",
      description: "Selecciona un campeonato histórico para cargar sus carreras y reglas oficiales.",
      loadChampionship: "Cargar campeonato →",
      races: "{{n}} carreras",
      historicEvent: "📜 Evento Histórico",
      trackEffect: "Efecto de pista",
      raceNotPlayed: "Carrera aún no disputada.",
      rulesSection: "Reglas Especiales",
      setup: "Preparación",
      events: {
        "1961-inauguracion-tribuna": {
          name: "Inauguración de la nueva Tribuna",
          description: "Los 3 primeros pilotos en cruzar la linea de meta en la primera vuelta ganan inmediatamente 1 carta de patrocinio."
        },
        "1961-nuevo-record-velocidad": {
          name: "¡Nuevo Récord de Velocidad!",
          description: "Cada vez que alcances una velocidad de 15 o más, ganas inmediatamente 1 carta de patrocinio."
        },
        "1961-huelga-pilotos": {
          name: "Huelga de Pilotos",
          description: "Esta carrera es 1 vuelta más corta de lo habitual. El ganador de la carrera recibe 2 puntos de Campeonato extra."
        },
        "1962-restricciones-mecanicas": {
          name: "Se levantan las restricciones mecánicas",
          description: "Los pilotos comienzan la carrera con 1 carta de Motor forzado adicional de la reserva en su Motor"
        },
        "1962-record-afluencia": {
          name: "Record de afluencia",
          description: "Esta carrera es 1 vuelta más larga de lo habitual, y el tamaño de mano de cartas aumenta a 8."
        },
        "1962-corrupcion-comision": {
          name: "Corrupción en la Comisión de normas",
          description: "Los 3 primeros clasificados de la carrera reciben 1 punto de Campeonato extra"
        },
        "1963-cambio-patrocinador": {
          name: "Cambio de patrocinador",
          description: "Esta carrera no tiene reglas especiales."
        },
        "1963-primera-tv-directo": {
          name: "Primera TV en directo",
          description: "Esta carrera no tiene reglas especiales."
        },
        "1963-nueva-normativa-seguridad": {
          name: "Nueva normativa de seguridad",
          description: "Esta carrera no tiene reglas especiales."
        },
        "1963-patrocinador-retira": {
          name: "Patrocinador se retira",
          description: "Esta carrera no tiene reglas especiales."
        },
        "1964-internacionalizacion": {
          name: "Internacionalización",
          description: "Las curvas con fichas de Prensa proporcionan 2 cartas de Patrocinio en lugar de 1."
        },
        "1964-vientes-turbulentos": {
          name: "Vientos turbulentos",
          description: "Los Rebufos solo se permiten en 3ª o 4ª marcha."
        },
        "1964-chicanes-seguridad": {
          name: "Chicanes de mejorar la seguridad",
          description: "En esta carrera puedes descartar cartas de Motor forzado durante el paso 8."
        },
        "1964-lluvia-retrasa": {
          name: "La lluvia retrasa la carrera",
          description: "En esta carrera nadie puede beneficiarse de la Adrenalina."
        },
        "1965-sujetate-bien": {
          name: "¡Sujétate bien!",
          description: "Solo se puede descartar un máximo de 1 carta por turno."
        },
        "1965-sonrie-saluda": {
          name: "Sonríe y saluda",
          description: "La Prensa solo entrega cartas de Patrocinio a los Coches que circulen por dejabo de la Velocidad máxima de la curva."
        },
        "1965-vision-tunel": {
          name: "Visión de túnel",
          description: "En esta carrera puedes descartar cartas de Estrés durante el paso 8."
        },
        "1965-olla-presion": {
          name: "Olla a presión",
          description: "Esta carrera es más larga de lo habitual y tiene una vuelta más. Cada vez que un Piloto complete una vuelta deberá retirar de la partida una carta de Motor forzado (Paso 8. Orden de preferencia: Motor > Mano > Descarte > Mazo de cartas.)."
        }
      },
      championships: {
        "1961": "Campeonato Histórico 1961",
        "1962": "Campeonato Histórico 1962", 
        "1963": "Campeonato Histórico 1963",
        "1964": "Campeonato Histórico 1964",
        "1965": "Campeonato Histórico 1965"
      }
    }
  },
  data: {
    expansions: {
      base: "Base",
      heavyRain: "Lluvia Torrencial",
      tunnelVision: "Visión de Túnel",
      rockyRoads: "Terreno Inestable",
      fanmade: "Fanmade"
    },
    weather: {
      sun: { name: "Soleado", prep: "3 Motor Forzado en el descarte", track: "+2 Rebufo" },
      clouds: { name: "Nublado", prep: "-1 Estrés", track: "Sin Enfriamiento" },
      rain: { name: "Lluvia", prep: "3 Motor Forzado en el mazo", track: "+1 Enfriamiento" },
      storm: { name: "Tormenta", prep: "+1 Estrés", track: "+2 Rebufo" },
      snow: { name: "Nieve", prep: "-1 Motor Forzado", track: "+1 Enfriamiento" },
      fog: { name: "Niebla", prep: "+1 Motor Forzado", track: "Sin Rebufo" }
    },
    countries: {
      usa: "Estados Unidos",
      gb: "Gran Bretaña",
      italy: "Italia",
      france: "Francia",
      japan: "Japón",
      spain: "España",
      "south-africa": "Sudáfrica",
      netherlands: "Países Bajos",
      germany: "Alemania",
      belgium: "Bélgica",
      monaco: "Mónaco",
      canada: "Canadá",
      australia: "Australia",
      brazil: "Brasil",
      mexico: "México",
      argentina: "Argentina",
      other: "Otro"
    }
  },
  system: {
    resetConfirm: {
      championship: "¿Resetear el nombre y sistema de puntos?\n\nLos pilotos y el calendario NO se verán afectados.",
      calendar: "¿Eliminar TODAS las carreras del calendario?\n\nLos pilotos se mantendrán.",
      players: "¿Eliminar TODOS los pilotos?\n\nTambién se eliminará el calendario (depende de los pilotos).",
      all: "⚠ ¿BORRAR TODO y empezar desde cero?\n\nPilotos, calendario y configuración. No se puede deshacer."
    },
    importConfirm: {
      players: "¿Importar pilotos? Reemplazará todos los pilotos actuales.",
      races: "¿Importar carreras? Reemplazará todo el calendario actual.",
      championship: "¿Importar configuración del campeonato? Reemplazará nombre y sistema de puntos.",
      all: "⚠ ¿Importar todos los datos? Reemplazará TODO el estado actual de la aplicación."
    },
    modals: {
      reset: {
        title: "⚠ Resetear datos",
        intro: "Selecciona qué sección quieres borrar. Esta acción no se puede deshacer.",
        championship: { title: "Configuración del campeonato", desc: "Borra nombre y puntos. Mantiene pilotos y calendario." },
        calendar: { title: "Calendario de carreras", desc: "Elimina todas las carreras y resultados. Mantiene los pilotos." },
        players: { title: "Pilotos", desc: "Elimina todos los pilotos y también el calendario." },
        all: { title: "Reset global", desc: "Borra absolutamente todo y vuelve al estado inicial." },
        btnReset: "Resetear",
        btnAll: "Reset todo"
      },
      export: {
        title: "📤 Exportar datos",
        intro: "Selecciona qué sección quieres exportar.",
        all: { title: "Todo", desc: "Exporta todos los datos completos." },
        btnExport: "Exportar"
      },
      import: {
        title: "📥 Importar datos",
        intro: "Selecciona qué sección quieres importar. Esta acción puede reemplazar datos existentes.",
        btnImport: "Importar"
      }
    },
    resetSuccess: "Reseteado correctamente",
    importSuccess: "Importado correctamente",
    exportSuccess: "Exportado correctamente"
  },
  toast: {
    themeChanged: "Tema cambiado",
    settingsUpdated: "Configuración actualizada ✓",
    raceUpdated: "Carrera actualizada ✓",
    circuitAdded: "{{emoji}} {{name}} añadido al calendario ✓",
    selectCircuit: "Selecciona un circuito"
  }
};
