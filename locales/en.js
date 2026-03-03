/**
 * HEAT Companion — English Locale
 */

window.LOCALE_EN = {
  common: {
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    weather: "Weather",
    sponsors: "Sponsors",
    press: "Press",
    laps: "Laps",
    curves: "Curves",
    spaces: "Spaces",
    circuit: "Circuit",
    event: "Event",
    rules: "Rules",
    result: "Result",
    player: "Driver",
    players: "Drivers",
    view: "View",
    confirmDelete: "Remove {{item}} from calendar?",
    noModules: "No modules"
  },
  nav: {
    dashboard: "Dashboard",
    players: "Drivers",
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
    statPlayers: "Enrolled drivers",
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
    subtitle: "Manage the calendar, drivers and results",
    calendar: "Race Calendar",
    historics: "Historics",
    restart: "Restart",
    addRace: {
      title: "Add race to calendar",
      eventName: "Event name",
      eventNamePlaceholder: "e.g.: Spanish Grand Prix, Night Race...",
      specialRules: "Special rules",
      specialRulesPlaceholder: "Specific rules for this race...",
      activeModules: "Active modules",
      newRaceHint: "New races will be added to the end of the calendar.",
      selectWeather: "Select weather",
      sponsorCards: "Sponsor cards at start",
      pressLocation: "Press Location (Curves)",
      pressLocationPlaceholder: "e.g.: A, B and D...",
      addToCalendar: "Add to calendar"
    }
  },
  players: {
    title: "Drivers",
    subtitle: "Manage drivers and their upgrade cards",
    empty: "No drivers yet. Add the first one!",
    legend: "Legend Driver (Bot)",
    duplicateIcon: "The number {{n}} is already in use",
    numericOnly: "The number can only contain digits",
    nameRequired: "The driver name is mandatory",
    nameMinLength: "The name must have at least 2 characters",
    colorInUse: "Color already used by {{name}}"
  },
  circuits: {
    title: "Circuits",
    subtitle: "Manage available circuits for races",
    empty: "No circuits configured. Add the first one!",
    original: "🏁 Original Circuits",
    fanmade: "📐 Fanmade Circuits"
  },
  standings: {
    title: "Championship Standings",
    empty: "Add drivers to the championship and play races to see the standings",
    pos: "Pos",
    player: "Driver",
    pts: "Pts",
    gap: "Gap",
    races: "Races"
  },
  manual: {
    title: "Reference Manual",
    subtitle: "Check quick rules for Weather, Heat and Stress",
    downloadBasic: "Download Basic Manual",
    downloadAdvanced: "Download Advanced Manual",
    basics: "Basic Mechanics",
    weather: "Weather Effects",
    heatTitle: "Heat",
    heatDescription: "Represents engine overheating.",
    stressTitle: "Stress",
    stressDescription: "Represents driver loss of concentration.",
    slipstreamTitle: "Slipstream (Optional)",
    slipstreamDescription: "Represents the aerodynamic advantage of being close to another car.",
    spinoutTitle: "Spin",
    spinoutDescription: "Occurs when unable to pay Heat for a curve.",
    weatherTrackTitle: "Weather and track conditions",
    weatherTrackDescription: "and more...",
    weather_setupTitle: "Weather and track conditions",
    weather_setupDescription: "Weather and road module preparation."
  },
  modals: {
    raceDetail: {
      title: "Race detail"
    },
    results: {
      title: "Register result",
      hint: "Order drivers by final position. Use ▲▼ buttons or drag.",
      saveResult: "Save result"
    },
    addCircuit: {
      title: "Add circuit",
      name: "Circuit name",
      country: "Country",
      selectCountry: "Select a country...",
      placeholderDescription: "Circuit characteristics..."
    },
    addPlayer: {
      title: "Add driver",
      name: "Driver name",
      namePlaceholder: "e.g.: Ayrton Senna",
      carColor: "Car color",
      number: "Number",
      numberPlaceholder: "Required: e.g.: 1, 77, 99"
    },
    championship: {
      title: "Configure Championship",
      name: "Championship name",
      points: "Points system",
      classic: "Classic (9-6-4-3-2-1)",
      podium: "Podium only (3-2-1)",
      custom: "Custom",
      customPlaceholder: "E.g.: 25,18,15,12,10,8,6,4,2,1 (comma separated)"
    },
    championshipTemplates: {
      title: "Historic Championships",
      description: "Select a historic championship to load its races and official rules.",
      loadChampionship: "Load championship →",
      races: "{{n}} races",
      historicEvent: "📜 Historic Event",
      trackEffect: "Track Effect",
      raceNotPlayed: "Race not yet played.",
      rulesSection: "Special Rules",
      setup: "Setup",
      events: {
        "1961-inauguracion-tribuna": {
          name: "New Grandstand Inauguration",
          description: "The first 3 drivers to cross the finish line on the first lap immediately gain 1 sponsor card."
        },
        "1961-nuevo-record-velocidad": {
          name: "New Speed Record!",
          description: "Each time you reach a speed of 15 or more, you immediately gain 1 sponsor card."
        },
        "1961-huelga-pilotos": {
          name: "Drivers' Strike",
          description: "This race is 1 lap shorter than usual. The race winner receives 2 extra Championship points."
        },
        "1962-restricciones-mecanicas": {
          name: "Mechanical Restrictions Lifted",
          description: "Drivers start the race with 1 additional Heat card from the reserve in their Engine"
        },
        "1962-record-afluencia": {
          name: "Record Attendance",
          description: "This race is 1 lap longer than usual, and hand size increases to 8."
        },
        "1962-corrupcion-comision": {
          name: "Commission Corruption",
          description: "The top 3 finishers receive 1 extra Championship point"
        },
        "1963-cambio-patrocinador": {
          name: "Sponsor Change",
          description: "This race has no special rules."
        },
        "1963-primera-tv-directo": {
          name: "First Live TV",
          description: "This race has no special rules."
        },
        "1963-nueva-normativa-seguridad": {
          name: "New Safety Regulations",
          description: "This race has no special rules."
        },
        "1963-patrocinador-retira": {
          name: "Sponsor Withdraws",
          description: "This race has no special rules."
        },
        "1964-internacionalizacion": {
          name: "Internationalization",
          description: "Press tokens on curves provide 2 Sponsor cards instead of 1."
        },
        "1964-vientes-turbulentos": {
          name: "Turbulent Winds",
          description: "Slipstreaming is only allowed in 3rd or 4th gear."
        },
        "1964-chicanes-seguridad": {
          name: "Safety Chicanes",
          description: "In this race you can discard Heat cards during step 8."
        },
        "1964-lluvia-retrasa": {
          name: "Rain Delays Race",
          description: "In this race no one can benefit from Adrenaline."
        },
        "1965-sujetate-bien": {
          name: "Hold On Tight!",
          description: "Only a maximum of 1 card can be discarded per turn."
        },
        "1965-sonrie-saluda": {
          name: "Smile and Wave",
          description: "Press only delivers Sponsor cards to Cars driving below the curve's maximum speed."
        },
        "1965-vision-tunel": {
          name: "Tunnel Vision",
          description: "In this race you can discard Stress cards during step 8."
        },
        "1965-olla-presion": {
          name: "Pressure Cooker",
          description: "This race is longer than usual and has one extra lap. Each time a Driver completes a lap they must remove a Heat card from the game (Step 8. Priority order: Engine > Hand > Discard > Card deck.)."
        }
      },
      championships: {
        "1961": "Historic Championship 1961",
        "1962": "Historic Championship 1962",
        "1963": "Historic Championship 1963", 
        "1964": "Historic Championship 1964",
        "1965": "Historic Championship 1965"
      }
    }
  },
  data: {
    expansions: {
      base: "Base",
      heavyRain: "Heavy Rain",
      tunnelVision: "Tunnel Vision",
      rockyRoads: "Rocky Roads",
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
      "south-africa": "South Africa",
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
  system: {
    resetConfirm: {
      championship: "Reset name and points system?\n\nDrivers and calendar will NOT be affected.",
      calendar: "Remove ALL races from the calendar?\n\nDrivers will be kept.",
      players: "Remove ALL drivers?\n\nCalendar will also be removed (depends on drivers).",
      all: "⚠ DELETE ALL and start from scratch?\n\nDrivers, calendar and configuration. This cannot be undone."
    },
    importConfirm: {
      players: "Import drivers? This will replace all current drivers.",
      races: "Import races? This will replace the entire current calendar.",
      championship: "Import championship config? This will replace name and points system.",
      all: "⚠ Import all data? This will replace the COMPLETE current state of the app."
    },
    modals: {
      reset: {
        title: "⚠ Reset data",
        intro: "Select the section you want to delete. This action cannot be undone.",
        championship: { title: "Championship config", desc: "Deletes name and points. Keeps drivers and calendar." },
        calendar: { title: "Race calendar", desc: "Deletes all races and results. Keeps drivers." },
        players: { title: "Drivers", desc: "Deletes all drivers and the calendar." },
        all: { title: "Global reset", desc: "Deletes everything and goes back to initial state." },
        btnReset: "Reset",
        btnAll: "Reset all"
      },
      export: {
        title: "📤 Export data",
        intro: "Select the section you want to export.",
        all: { title: "Everything", desc: "Export all data." },
        btnExport: "Export"
      },
      import: {
        title: "📥 Import data",
        intro: "Select the section you want to import. This can replace existing data.",
        btnImport: "Import"
      }
    },
    resetSuccess: "Reset successfully",
    importSuccess: "Imported successfully",
    exportSuccess: "Exported successfully"
  },
  toast: {
    themeChanged: "Theme changed",
    settingsUpdated: "Settings updated ✓",
    raceUpdated: "Race updated ✓",
    circuitAdded: "{{emoji}} {{name}} added to calendar ✓",
    selectCircuit: "Select a circuit"
  }
};
