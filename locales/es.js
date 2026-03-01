/**
 * HEAT Companion — Spanish Locale
 */

window.LOCALE_ES = {
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
    addRace: "Añadir carrera",
    deleteConfirm: "¿Eliminar carrera del calendario?",
    empty: "El calendario está vacío. ¡Añade la primera carrera!",
    originalCircuits: "🏁 Circuitos Originales",
    fanmadeCircuits: "📐 Circuitos Fanmade",
    laps: "{{n}} vueltas",
    curves: "{{n}} curvas",
    spaces: "{{n}} casillas",
    modules: "Módulos activos",
    weather: "🌧 Clima",
    sponsors: "💰 Patrocinios",
    press: "📷 Prensa",
    selectWeather: "Selecciona el clima",
    pressLocation: "Ubicación de la Prensa (Curvas)",
    pressPlaceholder: "Ej: A, B y D..."
  },
  players: {
    title: "Pilotos",
    subtitle: "Gestiona los pilotos y sus cartas de mejora",
    add: "+ Añadir piloto",
    empty: "No hay pilotos aún. ¡Añade el primero!",
    edit: "✎ Editar",
    delete: "🗑 Eliminar",
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
    add: "+ Añadir circuito",
    empty: "No hay circuitos configurados. ¡Añade el primero!"
  },
  standings: {
    title: "Clasificación del Campeonato",
    empty: "Añade pilotos al campeonato y disputa carreras para ver la clasificación",
    pos: "Pos",
    player: "Piloto",
    pts: "Pts",
    gap: "Gap",
    races: "Carreras"
  },
  manual: {
    title: "Manual de Referencia",
    subtitle: "Consulta las reglas rápidas de Clima, Motor Forzado y Estrés",
    downloadBasic: "📄 Descargar Manual Básico",
    downloadAdvanced: "📄 Descargar Manual Avanzado",
    basics: "🔥 Mecánicas Básicas",
    weather: "🌤️ Efectos de Clima"
  },
  modals: {
    cancel: "Cancelar",
    save: "Guardar",
    close: "Cerrar",
    delete: "Eliminar",
    editResult: "Editar resultado",
    addCircuit: {
      title: "Añadir circuito",
      name: "Nombre del circuito",
      country: "País",
      selectCountry: "Selecciona un país...",
      description: "Descripción",
      placeholderDescription: "Características del circuito...",
      spaces: "Espacios (casillas)",
      curves: "Número de curvas",
      laps: "Vueltas recomendadas"
    },
    championship: {
      title: "Configurar Campeonato",
      name: "Nombre del campeonato",
      points: "Sistema de puntos",
      classic: "Clásico (9-6-4-3-2-1)",
      podium: "Solo podio (3-2-1)",
      custom: "Personalizado",
      customPlaceholder: "Ej: 25,18,15,12,10,8,6,4,2,1 (separados por comas)"
    }
  },
  data: {
    expansions: {
      base: "Base",
      heavyRain: "Lluvia Torrencial",
      tunnelVision: "Visión de Túnel",
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
  toast: {
    themeChanged: "Tema cambiado",
    settingsUpdated: "Configuración actualizada ✓",
    raceUpdated: "Carrera actualizada ✓",
    circuitAdded: "{{emoji}} {{name}} añadido al calendario ✓",
    selectCircuit: "Selecciona un circuito"
  }
};
