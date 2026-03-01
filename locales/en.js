/**
 * HEAT Companion — English Locale
 */

window.LOCALE_EN = {
  nav: {
    dashboard: "Dashboard",
    players: "Pilots",
    championship: "Championship",
    circuits: "Circuits",
    standings: "Standings",
    manual: "Reference",
    config: "Configure",
    theme: "Dark Theme",
    export: "Export",
    import: "Import",
    reset: "Reset...",
    menu: "Menu",
    inicio: "Home",
    tabla: "Table"
  },
  lang: {
    es: "Spanish",
    en: "English"
  },
  dashboard: {
    title: "Welcome to HEAT Companion",
    subtitle: "Manage your Heat: Pedal to the Metal championship",
    statRaces: "Races played",
    statPending: "Pending races",
    statPlayers: "Enrolled pilots",
    statLeader: "Championship leader",
    pending: "Pending",
    completed: "Completed",
    standingsTitle: "Current standings",
    viewAll: "View full →",
    recentRaces: "Upcoming / Recent races",
    viewCalendar: "View calendar →"
  },
  championship: {
    title: "Championship",
    subtitle: "Manage calendar, pilots and results",
    calendar: "Race calendar",
    historics: "Historics",
    restart: "Restart",
    addRace: "Add race",
    deleteConfirm: "Delete race from calendar?",
    empty: "The calendar is empty. Add the first race!",
    originalCircuits: "🏁 Original Circuits",
    fanmadeCircuits: "📐 Fanmade Circuits",
    laps: "{{n}} laps",
    curves: "{{n}} curves",
    spaces: "{{n}} spaces",
    modules: "Active Modules",
    weather: "🌧 Weather",
    sponsors: "💰 Sponsors",
    press: "📷 Press",
    selectWeather: "Select weather",
    pressLocation: "Press Location (Corners)",
    pressPlaceholder: "E.g.: A, B and D..."
  },
  players: {
    title: "Pilots",
    subtitle: "Manage pilots and their upgrade cards",
    add: "+ Add pilot",
    empty: "No pilots yet. Add the first one!",
    edit: "✎ Edit",
    delete: "🗑 Delete",
    legend: "Legend Pilot (Bot)",
    duplicateIcon: "The number {{n}} is already in use",
    numericOnly: "The number can only contain digits",
    nameRequired: "The pilot name is mandatory",
    nameMinLength: "The name must have at least 2 characters",
    colorInUse: "Color already used by {{name}}"
  },
  circuits: {
    title: "Circuits",
    subtitle: "Manage available circuits for races",
    add: "+ Add circuit",
    empty: "No circuits configured. Add the first one!"
  },
  standings: {
    title: "Championship Standings",
    empty: "Add pilots to the championship and play races to see the standings",
    pos: "Pos",
    player: "Pilot",
    pts: "Pts",
    gap: "Gap",
    races: "Races"
  },
  manual: {
    title: "Reference Manual",
    subtitle: "Check quick rules for Weather, Heat and Stress",
    downloadBasic: "📄 Download Basic Manual",
    downloadAdvanced: "📄 Download Advanced Manual",
    basics: "🔥 Basic Mechanics",
    weather: "🌤️ Weather Effects"
  },
  modals: {
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    delete: "Delete",
    editResult: "Edit result",
    addCircuit: {
      title: "Add circuit",
      name: "Circuit name",
      country: "Country",
      selectCountry: "Select a country...",
      description: "Description",
      placeholderDescription: "Circuit characteristics...",
      spaces: "Spaces (slots)",
      curves: "Number of curves",
      laps: "Recommended laps"
    },
    championship: {
      title: "Configure Championship",
      name: "Championship name",
      points: "Points system",
      classic: "Classic (9-6-4-3-2-1)",
      podium: "Podium only (3-2-1)",
      custom: "Custom",
      customPlaceholder: "E.g.: 25,18,15,12,10,8,6,4,2,1 (comma separated)"
    }
  },
  data: {
    expansions: {
      base: "Base",
      heavyRain: "Heavy Rain",
      tunnelVision: "Tunnel Vision",
      fanmade: "Fanmade"
    },
    weather: {
      sun: { name: "Sunny", prep: "3 Heat in discard", track: "+2 Slipstream" },
      clouds: { name: "Cloudy", prep: "-1 Stress", track: "No Cooldown" },
      rain: { name: "Rainy", prep: "3 Heat in deck", track: "+1 Cooldown" },
      storm: { name: "Storm", prep: "+1 Stress", track: "+2 Slipstream" },
      snow: { name: "Snowy", prep: "-1 Heat", track: "+1 Cooldown" },
      fog: { name: "Foggy", prep: "+1 Heat", track: "No Slipstream" }
    },
    countries: {
      usa: "USA",
      gb: "Great Britain",
      italy: "Italy",
      france: "France",
      japan: "Japan",
      spain: "Spain",
      netherlands: "Netherlands",
      germany: "Germany",
      belgium: "Belgium",
      monaco: "Monaco",
      canada: "Canada",
      australia: "Australia",
      brazil: "Brazil",
      mexico: "Mexico",
      argentina: "Argentina",
      other: "Other"
    }
  },
  toast: {
    themeChanged: "Theme changed",
    settingsUpdated: "Settings updated ✓",
    raceUpdated: "Race updated ✓",
    circuitAdded: "{{emoji}} {{name}} added to calendar ✓",
    selectCircuit: "Select a circuit"
  }
};
