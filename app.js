// ============================================================
//  HEAT: PEDAL TO THE METAL — COMPANION APP  v2
//  New data model:
//  - championship.calendar[] for planned races
//  - player.upgrades[] for permanent season upgrades
//  - championship.playerIds[] for enrolled pilots
// ============================================================

// Data will be loaded asynchronously into window globals
// We'll use window.CIRCUITS, window.WEATHER_OPTIONS, etc.

// Make CHAMPIONSHIP_TEMPLATES globally accessible
if (typeof CHAMPIONSHIP_TEMPLATES !== 'undefined') {
  window.CHAMPIONSHIP_TEMPLATES = CHAMPIONSHIP_TEMPLATES;
}

// ---- STATE ----
let state = loadState();

function defaultState() {
  return {
    championship: {
      name: 'Mi Campeonato Heat',
      pointsSystem: 'classic',
      customPoints: [],
      playerIds: [],   // IDs of enrolled players
      calendar: []     // CalendarRace[]
    },
    players: [],
    circuits: [] // Circuitos personalizados creados por el usuario
  };
}

// CalendarRace shape:
// { id, circuitId, mods:{garage,weather,sponsors}, status:'scheduled'|'completed', results:[{playerId,position,dnf}] }

// Player shape:
// { id, name, color, icon, upgrades:string[] }

function loadState() {
  try {
    const raw = localStorage.getItem('heat-companion-v2');
    if (raw) {
      const loadedState = JSON.parse(raw);
      // Asegurar que el campo circuits exista
      if (!loadedState.circuits) {
        loadedState.circuits = [];
      }
      return loadedState;
    }
    // migrate from v1 if present
    const v1 = localStorage.getItem('heat-companion-v1');
    if (v1) {
      const old = JSON.parse(v1);
      const migrated = defaultState();
      migrated.championship.name         = old.championship?.name         || migrated.championship.name;
      migrated.championship.pointsSystem = old.championship?.pointsSystem || migrated.championship.pointsSystem;
      migrated.championship.customPoints = old.championship?.customPoints || [];
      migrated.players = (old.players || []).map(p => ({
        id: p.id, name: p.name, color: p.color, icon: p.icon || '', upgrades: []
      }));
      migrated.championship.playerIds = migrated.players.map(p => p.id);
      // migrate races→calendar
      migrated.championship.calendar = (old.races || []).map(r => ({
        id: r.id,
        circuitId: r.circuitId || null,
        mods: r.mods || { garage: true, weather: false, sponsors: false },
        status: r.results?.length ? 'completed' : 'scheduled',
        results: (r.results || []).map(res => ({
          playerId: res.playerId, position: res.position, dnf: res.dnf || false
        }))
      }));
      return migrated;
    }
  } catch (e) { /* ignore */ }
  return defaultState();
}

function saveState() {
  localStorage.setItem('heat-companion-v2', JSON.stringify(state));
}

// ---- HELPERS ----
function uid() {
  return Math.random().toString(36).slice(2, 6) + Math.random().toString(36).slice(2, 6);
}

let themeToggleTimeout = null;

// Helper function to get event data by ID
function getEventById(eventId) {
  if (!eventId || !window.RACE_EVENTS) return null;
  return window.RACE_EVENTS[eventId] || null;
}

// Helper function to get event data for a race (with fallback to legacy format)
function getRaceEventData(race) {
  if (race.eventId) {
    // New format: use eventId to get event data
    const event = getEventById(race.eventId);
    if (event) {
      return {
        name: event.name,
        description: event.description,
        pointsOverride: event.pointsOverride
      };
    }
  }
  
  // Legacy fallback: use event and rules directly from race
  return {
    name: race.event || 'Carrera',
    description: race.rules || '',
    pointsOverride: null
  };
}

// ============================================================
//  GLOBAL BUTTON BINDING
//  these buttons are independent of data loading and should
//  be wired even if the initialization sequence stalls.
// ============================================================
function bindGlobalButtons() {
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleTheme();
      showToast('Tema cambiado');
    });
  } else console.warn('Theme toggle button not found during bindGlobalButtons');

  const exportBtn = document.getElementById('btn-export');
  if (exportBtn) exportBtn.addEventListener('click', () => openModal('modal-export'));
  else console.warn('Export button not found during bindGlobalButtons');

  const importBtn = document.getElementById('btn-import');
  if (importBtn) importBtn.addEventListener('click', () => openModal('modal-import'));
  else console.warn('Import button not found during bindGlobalButtons');

  const importInput = document.getElementById('import-file-input');
  if (importInput) importInput.addEventListener('change', e => importData(e.target.files[0]));
  else console.warn('Import file input not found during bindGlobalButtons');
}

document.addEventListener('DOMContentLoaded', bindGlobalButtons);


function getPointsArray(raceId = null) {
  let basePoints;
  if (state.championship.pointsSystem === 'custom') {
    basePoints = state.championship.customPoints;
  } else {
    basePoints = window.POINTS_SYSTEMS[state.championship.pointsSystem] || window.POINTS_SYSTEMS.classic;
  }
  
  // If no raceId provided, return base points
  if (!raceId) return basePoints;
  
  // Find the race and apply event modifiers if any
  const race = state.championship.calendar.find(r => r.id === raceId);
  if (!race) return basePoints;
  
  const eventData = getRaceEventData(race);
  if (!eventData.pointsOverride) return basePoints;
  
  // Apply modifiers to base points
  return basePoints.map((points, index) => {
    const modifier = eventData.pointsOverride[index] || 0;
    return Math.max(0, points + modifier); // Ensure no negative points
  });
}

function getPoints(position, raceId = null) {
  const arr = getPointsArray(raceId);
  return arr[position - 1] ?? 0;
}

// ---- PLAYER HELPERS ----
// getPlayerById() moved to players.js
// enrolledPlayers() moved to players.js
// initials() moved to players.js

// ---- OTHER HELPERS ----
function getCircuitById(id) { 
  // Buscar en circuitos oficiales y personalizados
  const allCircuits = [...(window.CIRCUITS || []), ...(state.circuits || [])];
  if (!allCircuits || !Array.isArray(allCircuits)) {
    console.warn('CIRCUITS not available:', allCircuits);
    return null;
  }
  return allCircuits.find(c => c.id === id); 
}
function getCountryById(countryId) { 
  const country = COUNTRIES.find(c => c.id === countryId);
  return country;
}

// ---- META INFO FUNCTIONS ----
function renderMetaInfo() {
  const meta = window.APP_META;
  if (!meta) return;
  
  const content = document.getElementById('meta-info-content');
  if (!content) return;
  
  const html = `
    <div class="meta-info-section">
      <h3>🏎️ HEAT Companion</h3>
      <p>${meta.description}</p>
    </div>
  `;
  
  content.innerHTML = html;
}
function getCircuitName(circuit) {
  if (!circuit) return '—';
  const country = getCountryById(circuit.countryId);
  return country ? country.name : '—';
}
function getUpgradeById(id) { 
  return window.UPGRADES.find(u => u.id === id) || window.SPONSORS.find(s => s.id === id); 
}

// ---- FUNCTIONS NEEDED BY PLAYERS.JS ----
// These functions are used by players.js and need to be available globally
let toastTimer = null;

function uid() {
  return Math.random().toString(36).slice(2, 6) + Math.random().toString(36).slice(2, 6);
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showToast(msg, type = 'info') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${type}`;
  el.style.display = 'block';
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.style.display = 'none'; }, 3200);
}

function openModal(id)  { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function saveState() {
  localStorage.setItem('heat-companion-v2', JSON.stringify(state));
}

function getPointsArray(raceId = null) {
  let basePoints;
  if (state.championship.pointsSystem === 'custom') {
    basePoints = state.championship.customPoints;
  } else {
    basePoints = window.POINTS_SYSTEMS[state.championship.pointsSystem] || window.POINTS_SYSTEMS.classic;
  }
  
  // If no raceId provided, return base points
  if (!raceId) return basePoints;
  
  // Find the race and apply event modifiers if any
  const race = state.championship.calendar.find(r => r.id === raceId);
  if (!race) return basePoints;
  
  const eventData = getRaceEventData(race);
  if (!eventData.pointsOverride) return basePoints;
  
  // Apply modifiers to base points
  return basePoints.map((points, index) => {
    const modifier = eventData.pointsOverride[index] || 0;
    return Math.max(0, points + modifier); // Ensure no negative points
  });
}

function getPoints(position, raceId = null) {
  const arr = getPointsArray(raceId);
  return arr[position - 1] ?? 0;
}

function renderView(name) {
  switch (name) {
    case 'dashboard':    renderDashboard();    break;
    case 'championship': renderChampionship(); break;
    case 'circuits':     renderCircuits();     break;
    case 'players':      renderPlayers();      break;
    case 'standings':    renderStandings();    break;
    case 'manual':       
      renderManual();       
      break;
  }
}

// ---- STANDINGS ----
// getStandings() moved to players.js

// ---- NAVIGATION ----
function navigateTo(viewName) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-link, .mobile-nav-item[data-view]').forEach(l => l.classList.remove('active'));

  const view  = document.getElementById(`view-${viewName}`);
  const link  = document.getElementById(`nav-${viewName}`);
  const mlink = document.getElementById(`mnav-${viewName}`);
  if (view)  view.classList.add('active');
  if (link)  link.classList.add('active');
  if (mlink) mlink.classList.add('active');

  // Close mobile sidebar if open
  closeMobileSidebar();

  renderView(viewName);
}

function renderView(name) {
  switch (name) {
    case 'dashboard':    renderDashboard();    break;
    case 'championship': renderChampionship(); break;
    case 'circuits':     renderCircuits();     break;
    case 'players':      renderPlayers();      break;
    case 'standings':    renderStandings();    break;
  }
}

// ============================================================
//  MOBILE SIDEBAR DRAWER ----
// ---- MOBILE SIDEBAR DRAWER ----
function openMobileSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-backdrop').classList.add('active');
  document.body.classList.add('sidebar-open');
}
function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('active');
  document.body.classList.remove('sidebar-open');
}

// ---- MANUAL SECTIONS TOGGLE (moved to manual.js) ----

// ============================================================
//  RENDER: DASHBOARD (moved to dashboard.js)
// ============================================================

// ============================================================
//  RENDER: CHAMPIONSHIP (moved to championship.js)
// ============================================================

// Calendar drag & drop functions moved to championship.js

// ============================================================
//  RENDER: PLAYERS (moved to players.js)
// ============================================================

// ============================================================
//  RENDER: STANDINGS
// ============================================================
function renderStandings() {
  const wrap  = document.getElementById('standings-table-wrap');
  const empty = document.getElementById('standings-empty');
  document.getElementById('standings-champ-name').textContent = state.championship.name;

  const ep = enrolledPlayers();
  if (ep.length === 0) {
    wrap.innerHTML = '<table class="standings-table"><thead><tr><th>Pos</th><th>Piloto</th><th>Pts</th><th>Gap</th><th>Carreras</th></tr></thead><tbody><tr><td colspan="5" style="text-align:center;color:var(--text-dim);padding:20px">No hay pilotos creados. Ve a la sección "Pilotos" para añadirlos.</td></tr></tbody></table>';
    empty.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  const standings = getStandings();
  const leader    = standings[0];
  const completedRaces = state.championship.calendar.filter(r => r.status === 'completed');

  const raceCols = completedRaces.map((r, i) => {
    const c = getCircuitById(r.circuitId);
    return `<th title="${c?.name || ''}"> ${c?.flag || '🏁'} R${i + 1}</th>`;
  }).join('');

  const rows = standings.map((s, i) => {
    const pos = i + 1;
    const gap = pos === 1 || !completedRaces.length ? '' : `−${leader.points - s.points}`;
    const racePts = completedRaces.map(r => {
      const res = r.results.find(x => x.playerId === s.player.id);
      if (!res) return '<td style="text-align:center"><span style="color:var(--text-dim)">—</span></td>';
      const p = res.dnf ? 0 : getPoints(res.position, r.id);
      const display = res.dnf ? 'DNF' : p.toString();
      const style = res.dnf ? 'color:var(--text-dim);font-style:italic' : '';
      return `<td><span class="race-pts-cell" style="${style}">${display}</span></td>`;
    }).join('');

    return `<tr>
      <td class="st-pos pos-${pos <= 3 ? pos : ''}">${pos <= 3 ? ['🥇','🥈','🥉'][pos-1] : pos}</td>
      <td><div class="st-player">
        <div class="st-avatar" style="background:${s.player.color}">${escHtml(s.player.icon || initials(s.player.name))}</div>
        <div>
          <div class="st-name">${escHtml(s.player.name)}</div>
          <div style="font-size:11px;color:var(--text-muted)">${s.wins}V · ${s.podiums} podios</div>
        </div>
      </div></td>
      <td><span class="st-pts">${s.points}</span></td>
      <td><span class="gap-badge">${gap}</span></td>
      <td style="text-align:center">${s.races}</td>
      ${racePts}
    </tr>`;
  }).join('');

  wrap.innerHTML = `<table class="standings-table">
    <thead><tr>
      <th>Pos</th><th>Piloto</th><th>Pts</th><th>Gap</th><th>Carreras</th>
      ${raceCols}
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

// ============================================================
//  CHAMPIONSHIP MODAL (moved to championship.js)
// ============================================================

// ============================================================
//  RENDER: CIRCUITS (moved to circuits.js)
// ============================================================

// ============================================================
//  CIRCUIT MODAL (moved to circuits.js)
// ============================================================

// DESHABILITADO: Ya no se necesita inscripción manual, todos los pilotos participan automáticamente
// // ============================================================
// //  ENROLL / UN-ENROLL PLAYER
// // ============================================================
// function toggleEnrollPlayer(playerId) {
//   const ids = state.championship.playerIds;
//   const idx = ids.indexOf(playerId);
//   if (idx === -1) {
//     ids.push(playerId);
//     showToast(`${getPlayerById(playerId)?.name} inscrito en el campeonato ✓`, 'success');
//   } else {
//     ids.splice(idx, 1);
//     showToast(`${getPlayerById(playerId)?.name} retirado del campeonato`, 'info');
//   }
//   saveState();
//   renderView('championship');
//   renderView('dashboard');
// }

// ============================================================
//  ADD RACE TO CALENDAR
// ============================================================
let addRaceSelectedCircuit = null;
let addRaceSelectedWeather = 'sun';
let addRaceSelectedSponsors = 1;
let addRaceSelectedLaps = 3;
let editingRaceId = null;

function openAddRaceModal(raceId = null) {
  editingRaceId = raceId;
  const race = raceId ? state.championship.calendar.find(r => r.id === raceId) : null;

  addRaceSelectedCircuit = race ? race.circuitId : null;
  addRaceSelectedWeather = race ? (race.weatherType || 'sun') : 'sun';
  addRaceSelectedSponsors = race ? (race.sponsorCards || 0) : 1;
  addRaceSelectedLaps = race ? (race.laps || 3) : 3;
  
  document.getElementById('modal-add-race-title').textContent = raceId ? 'Editar carrera' : 'Añadir carrera al calendario';
  document.getElementById('add-race-laps-input').value = addRaceSelectedLaps;
  document.getElementById('add-race-event-input').value = race ? (race.event || '') : '';
  document.getElementById('add-race-rules-input').value = race ? (race.rules || '') : '';
  
  const hasWeather = race ? !!race.mods?.weather : false;
  const hasSponsors = race ? !!race.mods?.sponsors : false;
  const hasPress = race ? !!race.mods?.press : false;

  document.getElementById('add-race-mod-weather').checked  = hasWeather;
  document.getElementById('add-race-mod-sponsors').checked = hasSponsors;
  document.getElementById('add-race-mod-press').checked = hasPress;
  
  document.getElementById('add-race-weather-section').style.display = hasWeather ? 'block' : 'none';
  document.getElementById('add-race-sponsors-section').style.display = hasSponsors ? 'block' : 'none';
  document.getElementById('add-race-press-section').style.display = hasPress ? 'block' : 'none';

  // Setup configuration
  if (hasSponsors) {
    const setupSponsors = race ? (race.setup?.sponsors || 1) : 1;
    document.querySelectorAll('#add-race-sponsors-grid .number-chip').forEach(c => {
      c.classList.toggle('selected', parseInt(c.dataset.val) === setupSponsors);
    });
  }
  if (hasPress) {
    const setupPress = race ? (race.setup?.press || '') : '';
    document.getElementById('add-race-press-input').value = setupPress;
  }

  // render circuits
  const grid = document.getElementById('add-race-circuits-grid');
  // Combinar circuitos oficiales con personalizados
  const allCircuits = [...(window.CIRCUITS || []), ...(state.circuits || [])];
  
  // Separar circuitos en originales y fanmade
  const originalCircuits = allCircuits.filter(c => 
    ['Base', 'Lluvia Torrencial', 'Visión de Túnel'].includes(c.expansion)
  );
  const fanmadeCircuits = allCircuits.filter(c => 
    !['Base', 'Lluvia Torrencial', 'Visión de Túnel'].includes(c.expansion)
  );

  let circuitsHtml = '<div class="circuits-sections-container">';

  // Sección de circuitos originales
  if (originalCircuits.length > 0) {
    circuitsHtml += `
      <div class="section-card collapsible" style="margin-bottom: 0;">
        <div class="section-header" onclick="toggleSection(this)">
          <h3>🏁 Circuitos Originales</h3>
          <span class="section-toggle">▼</span>
        </div>
        <div class="section-content">
          <div class="circuits-grid">
            ${originalCircuits.map(c => renderRaceCircuitCard(c)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // Sección de circuitos fanmade
  if (fanmadeCircuits.length > 0) {
    circuitsHtml += `
      <div class="section-card collapsible collapsed" style="margin-bottom: 0;">
        <div class="section-header" onclick="toggleSection(this)">
          <h3>🎨 Circuitos Fanmade</h3>
          <span class="section-toggle">▼</span>
        </div>
        <div class="section-content">
          <div class="circuits-grid">
            ${fanmadeCircuits.map(c => renderRaceCircuitCard(c)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  circuitsHtml += '</div>';

  grid.innerHTML = circuitsHtml;

  // render weather options
  const wGrid = document.getElementById('add-race-weather-grid');
  wGrid.innerHTML = window.WEATHER_OPTIONS.map(w => `
    <div class="weather-card ${w.id === addRaceSelectedWeather ? 'selected' : ''}" data-weather="${w.id}">
      <div class="weather-card-emoji">${w.emoji}</div>
      <div class="weather-card-name">${w.name}</div>
      <div class="weather-card-effect">
        <div><strong>Prep:</strong> ${w.effect.preparation}</div>
        <div><strong>Efecto de pista:</strong> ${w.effect.trackEffect}</div>
      </div>
    </div>`).join('');

  openModal('modal-add-race');
}

function renderRaceCircuitCard(c) {
  const country = getCountryById(c.countryId);
  // Determinar el badge
  let badgeHtml = '';
  if (c.expansion) {
    const badgeClass = c.expansion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
    badgeHtml = `<div class="diff-badge ${badgeClass}">${escHtml(c.expansion)}</div>`;
  }
  
  return `<div class="circuit-card ${c.id === addRaceSelectedCircuit ? 'selected' : ''}" data-circuit="${c.id}">
    <div class="circuit-flag">${country ? country.flag : '🏁'}</div>
    <div class="circuit-name">${c.name || (country ? country.name : '')}</div>
    ${badgeHtml}
    <div class="circuit-info-stats">
      <span>🏁 ${c.laps} vueltas</span>
      <span>⤵ ${c.curves} curvas</span>
    </div>
  </div>`;
}

document.getElementById('add-race-mod-weather').addEventListener('change', e => {
  document.getElementById('add-race-weather-section').style.display = e.target.checked ? 'block' : 'none';
});

document.getElementById('add-race-mod-sponsors').addEventListener('change', e => {
  document.getElementById('add-race-sponsors-section').style.display = e.target.checked ? 'block' : 'none';
});

document.getElementById('add-race-mod-press').addEventListener('change', e => {
  document.getElementById('add-race-press-section').style.display = e.target.checked ? 'block' : 'none';
});

document.getElementById('add-race-weather-grid').addEventListener('click', e => {
  const card = e.target.closest('.weather-card');
  if (!card) return;
  addRaceSelectedWeather = card.dataset.weather;
  document.querySelectorAll('#add-race-weather-grid .weather-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
});

document.getElementById('add-race-sponsors-grid').addEventListener('click', e => {
  const chip = e.target.closest('.number-chip');
  if (!chip) return;
  const val = parseInt(chip.dataset.val);
  document.querySelectorAll('#add-race-sponsors-grid .number-chip').forEach(c => c.classList.remove('selected'));
  chip.classList.add('selected');
});

document.getElementById('add-race-circuits-grid').addEventListener('click', e => {
  const card = e.target.closest('.circuit-card');
  if (!card) return;
  addRaceSelectedCircuit = card.dataset.circuit;
  // Auto-fill laps from circuit data
  const circuit = getCircuitById(card.dataset.circuit);
  if (circuit) {
    addRaceSelectedLaps = circuit.laps;
    document.getElementById('add-race-laps-input').value = circuit.laps;
  }
  document.querySelectorAll('#add-race-circuits-grid .circuit-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
});

document.getElementById('add-race-laps-input').addEventListener('change', e => {
  addRaceSelectedLaps = parseInt(e.target.value) || 3;
});

document.getElementById('btn-save-cal-race').addEventListener('click', () => {
  if (!addRaceSelectedCircuit) { showToast('Selecciona un circuito', 'error'); return; }
  
  const isWeatherActive = document.getElementById('add-race-mod-weather').checked;
  const isSponsorsActive = document.getElementById('add-race-mod-sponsors').checked;
  const isPressActive = document.getElementById('add-race-mod-press').checked;
  
  const raceData = {
    circuitId: addRaceSelectedCircuit,
    laps: addRaceSelectedLaps,
    event: document.getElementById('add-race-event-input').value.trim(),
    rules: document.getElementById('add-race-rules-input').value.trim(),
    mods: {
      garage:   true, 
      weather:  isWeatherActive,
      sponsors: isSponsorsActive,
      press:    isPressActive
    },
    weatherType: isWeatherActive ? addRaceSelectedWeather : 'sun',
    sponsorCards: 0,
    press: '',
    setup: {
      sponsors: isSponsorsActive ? parseInt(document.querySelector('#add-race-sponsors-grid .number-chip.selected')?.dataset.val || '1') : 0,
      press: isPressActive ? document.getElementById('add-race-press-input').value.trim() : ''
    }
  };

  if (editingRaceId) {
    const idx = state.championship.calendar.findIndex(r => r.id === editingRaceId);
    if (idx !== -1) {
      state.championship.calendar[idx] = { ...state.championship.calendar[idx], ...raceData };
      showToast('Carrera actualizada ✓', 'success');
    }
  } else {
    const newRace = {
      id: uid(),
      ...raceData,
      status:  'scheduled',
      results: []
    };
    state.championship.calendar.push(newRace);
    const c = getCircuitById(addRaceSelectedCircuit);
    showToast(`${c?.flag || '🏁'} ${c?.name} añadido al calendario ✓`, 'success');
  }

  saveState();
  closeModal('modal-add-race');
  renderView('championship');
  renderView('dashboard');
});

// ============================================================
//  ENTER RACE RESULTS (moved to championship.js)
// ============================================================

// ============================================================
//  RACE DETAIL MODAL
// ============================================================
function openRaceDetailModal(raceId) {
  const race = state.championship.calendar.find(r => r.id === raceId);
  if (!race) return;

  const circuit = getCircuitById(race.circuitId);
  document.getElementById('detail-race-title').textContent =
    `${circuit ? (getCountryById(circuit.countryId)?.flag || '🏁') : '🏁'} ${getCircuitName(circuit)}`;

  const activeMods = [];
  if (race.mods?.weather) {
    const wOpt = window.WEATHER_OPTIONS.find(w => w.id === race.weatherType);
    activeMods.push(`${wOpt?.emoji || '🌧'} ${wOpt?.name || 'Clima'}`);
  }
  if (race.mods?.sponsors) {
    const count = race.sponsorCards || 1;
    activeMods.push(`💰 Patrocinios (${count})`);
  }
  if (race.mods?.press && race.setup?.press) {
    activeMods.push(`📷 Prensa (${race.setup.press})`);
  }

  // DESHABILITADO TEMPORALMENTE: Visualización de mejoras en campeonato
  // Build upgrades section for enrolled players
  // const enrolledIds = state.championship.playerIds;
  // const upgradesHtml = enrolledIds.map(pid => {
  //   const p = getPlayerById(pid);
  //   if (!p || !(p.upgrades?.length)) return null;
  //   return `<div class="detail-upgrade-player">
  //     <div style="display:flex;align-items:center;gap:8px;min-width:110px">
  //       <div class="detail-result-avatar" style="background:${p.color};width:26px;height:26px;font-size:11px">${escHtml(p.icon || initials(p.name))}</div>
  //       <span class="detail-upgrade-player-name">${escHtml(p.name)}</span>
  //     </div>
  //     <div class="detail-upgrade-tags">
  //       ${p.upgrades.map(uid => { const u = getUpgradeById(uid); return u ? `<span class="detail-upgrade-tag">${u.emoji} ${u.name}</span>` : ''; }).join('')}
  //     </div>
  //   </div>`;
  // }).filter(Boolean).join('');

  const resultsHtml = race.status === 'completed'
    ? race.results.sort((a, b) => a.position - b.position).map(r => {
        const player     = getPlayerById(r.playerId);
        if (!player) return '';
        const earnedPts  = getPoints(r.position, race.id);
        return `<div class="detail-result-row">
          <div class="detail-result-pos pos-${r.position <= 3 ? r.position : ''}">${r.position <= 3 ? ['🥇','🥈','🥉'][r.position-1] : r.position + 'º'}</div>
          <div class="detail-result-avatar" style="background:${player.color}">${escHtml(player.icon || initials(player.name))}</div>
          <div class="detail-result-name">${escHtml(player.name)}</div>
          <div class="detail-result-pts">${earnedPts} pts</div>
        </div>`;
      }).join('')
    : '<div style="color:var(--text-dim);font-size:13px;padding:12px">Carrera aún no disputada.</div>';

  const wOpt = race.mods?.weather ? window.WEATHER_OPTIONS.find(w => w.id === race.weatherType) : null;
  
  let moduleBannerHtml = '';
  if (wOpt || race.setup?.sponsors !== undefined || race.setup?.press) {
    let bannerContent = '';
    if (wOpt) {
      bannerContent += `
        <div style="margin-bottom:8px">
          <div style="font-size:13px; font-weight:600"><span style="font-size:16px">${wOpt.emoji}</span> Clima: ${wOpt.name}</div>
          <div style="font-size:11px; color:var(--text-muted); margin-left:24px">
            Prep: ${wOpt.effect.preparation}<br>
            Efecto de pista: ${wOpt.effect.trackEffect}
          </div>
        </div>`;
    }
    if (race.setup?.sponsors !== undefined) {
      bannerContent += `<div style="font-size:13px"><span style="font-weight:600">📋 Patrocinios:</span> ${race.setup.sponsors}</div>`;
    }
    if (race.setup?.press) {
      bannerContent += `<div style="font-size:13px"><span style="font-weight:600">🎥 Prensa:</span> ${race.setup.press}</div>`;
    }
    moduleBannerHtml = `
    <div style="margin-top:8px; padding:8px 12px; background:rgba(139,92,246,0.05); border:1px solid rgba(139,92,246,0.2); border-radius:var(--radius-sm)">
      ${bannerContent}
    </div>`;
  }

  const eventData = getRaceEventData(race);
  const historicHtml = eventData.name && eventData.name !== 'Carrera' ? `
    <div class="detail-section">
      <h3>📜 Evento Histórico</h3>
      <div class="historic-event-card">
        <div class="historic-event-title">${eventData.name}</div>
        ${eventData.description ? `<div class="historic-event-rules"><strong>Reglas</strong><br>${eventData.description}</div>` : ''}
        <div class="historic-event-setup"><strong>Setup</strong><br>
          📋 Patrocinios: ${race.setup.sponsors}<br>
          🎥 Prensa: ${race.setup.press}
        </div>
      </div>
    </div>` : '';

  document.getElementById('detail-race-body').innerHTML = `
    ${historicHtml}
    <div class="detail-section">
      <h3>Circuito</h3>
      <div class="detail-circuit-card">
        <div class="detail-circuit-flag">${circuit ? (getCountryById(circuit.countryId)?.flag || '🏁') : '🏁'}</div>
        <div style="flex:1">
          <div class="detail-circuit-name">${getCircuitName(circuit)}</div>
          <div class="detail-circuit-meta-row">
            <span>${circuit?.country || ''}</span>
            <span class="diff-badge ${circuit?.expansion ? circuit.expansion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-') : ''}">${circuit?.expansion || ''}</span>
          </div>
          <div class="detail-circuit-stats-row">
            <span>🏁 ${race.laps || circuit?.laps || 3} vueltas · ⤵ ${circuit?.curves || 0} curvas · 📏 ${circuit?.spaces || 0} casillas</span>
          </div>
        </div>
      </div>
      ${moduleBannerHtml}
    </div>
    <div class="detail-section">
      <h3>Resultado</h3>
      <div class="detail-results-list">${resultsHtml}</div>
    </div>`;

  document.getElementById('btn-delete-race').dataset.raceId   = raceId;
  document.getElementById('btn-edit-result').dataset.raceId   = raceId;
  document.getElementById('btn-edit-result').style.display    = race.status === 'completed' ? 'inline-flex' : 'none';
  openModal('modal-race-detail');
}

document.getElementById('btn-delete-race').addEventListener('click', function () {
  const raceId = this.dataset.raceId;
  const race   = state.championship.calendar.find(r => r.id === raceId);
  const circuit = getCircuitById(race?.circuitId);
  if (!confirm(`¿Eliminar la carrera en ${getCircuitName(circuit)}?`)) return;
  state.championship.calendar = state.championship.calendar.filter(r => r.id !== raceId);
  saveState();
  closeModal('modal-race-detail');
  renderView('championship');
  renderView('dashboard');
  showToast('Carrera eliminada', 'info');
});

// Edit result button (moved to championship.js)

// ============================================================
//  SIDEBAR (renderSidebarChamp moved to championship.js)
// ============================================================

// ============================================================
//  EVENT DELEGATION
// ============================================================
document.addEventListener('click', e => {
  // Navigation
  const navLink = e.target.closest('.nav-link, .link-view-all, .mobile-nav-item[data-view]');
  if (navLink) { e.preventDefault(); navigateTo(navLink.dataset.view); return; }

  // Modal close
  const modalClose = e.target.closest('.modal-close, [data-modal]');
  if (modalClose?.dataset.modal) { closeModal(modalClose.dataset.modal); return; }

  // Overlay backdrop
  if (e.target.classList.contains('modal-overlay')) { e.target.style.display = 'none'; return; }

  // Championship config (moved to championship.js)
  if (e.target.closest('#btn-edit-champ') || e.target.closest('#btn-champ-settings-inline')) { 
    // openChampModal() - handled in championship.js
    return; 
  }

  // Open reset modal
  if (e.target.closest('#btn-open-reset')) { openModal('modal-reset'); return; }

  // Open meta info modal
  if (e.target.closest('#btn-meta-info')) { 
    openModal('modal-meta-info'); 
    renderMetaInfo(); 
    return; 
  }

  // System actions (moved to system.js)
  // Reset, Export, Import, Templates handled in system.js

  // Player actions (moved to players.js)
  // Add player, Edit player, Delete player handled in players.js

  // DESHABILITADO: Ya no se necesita toggle de inscripción
  // // Toggle enroll player
  // const toggleBtn = e.target.closest('[data-toggle-player]');
  // if (toggleBtn) { toggleEnrollPlayer(toggleBtn.dataset.togglePlayer); return; }

  // Circuit actions (moved to circuits.js)
  // Add circuit, Edit circuit, Delete circuit handled in circuits.js

  // Add calendar race
  if (e.target.closest('#btn-add-cal-race')) { openAddRaceModal(); return; }

  // System actions (moved to system.js)
  // Templates, Reset championship handled in system.js

  // Delete calendar race
  const delRaceBtn = e.target.closest('[data-delete-cal-race]');
  if (delRaceBtn) {
    e.stopPropagation();
    const raceId  = delRaceBtn.dataset.deleteCalRace;
    const race    = state.championship.calendar.find(r => r.id === raceId);
    const circuit = getCircuitById(race?.circuitId);
    if (!confirm(`¿Eliminar la carrera en ${getCircuitName(circuit)}?`)) return;
    state.championship.calendar = state.championship.calendar.filter(r => r.id !== raceId);
    saveState();
    renderView('championship');
    renderView('dashboard');
    showToast('Carrera eliminada', 'info');
    return;
  }

  // Edit calendar race
  const editRaceBtn = e.target.closest('[data-edit-cal-race]');
  if (editRaceBtn) {
    e.stopPropagation();
    openAddRaceModal(editRaceBtn.dataset.editCalRace);
    return;
  }

  // Move race up
  const moveUpBtn = e.target.closest('[data-move-up]');
  if (moveUpBtn) {
    e.stopPropagation();
    const id = moveUpBtn.dataset.moveUp;
    const idx = state.championship.calendar.findIndex(r => r.id === id);
    if (idx > 0) {
      const temp = state.championship.calendar[idx];
      state.championship.calendar[idx] = state.championship.calendar[idx - 1];
      state.championship.calendar[idx - 1] = temp;
      saveState();
      renderChampionship();
    }
    return;
  }

  // Move race down
  const moveDownBtn = e.target.closest('[data-move-down]');
  if (moveDownBtn) {
    e.stopPropagation();
    const id = moveDownBtn.dataset.moveDown;
    const idx = state.championship.calendar.findIndex(r => r.id === id);
    if (idx !== -1 && idx < state.championship.calendar.length - 1) {
      const temp = state.championship.calendar[idx];
      state.championship.calendar[idx] = state.championship.calendar[idx + 1];
      state.championship.calendar[idx + 1] = temp;
      saveState();
      renderChampionship();
    }
    return;
  }

  // Enter result for a calendar race
  const enterResultBtn = e.target.closest('[data-enter-result]');
  if (enterResultBtn) { e.stopPropagation(); openResultsModal(enterResultBtn.dataset.enterResult); return; }

  // View completed race result
  const viewResultBtn = e.target.closest('[data-view-result]');
  if (viewResultBtn) { e.stopPropagation(); openRaceDetailModal(viewResultBtn.dataset.viewResult); return; }

  // Cal race row (open detail)
  const calRow = e.target.closest('.cal-race-row');
  if (calRow && !e.target.closest('button')) { 
    openRaceDetailModal(calRow.dataset.calRaceId); 
    return; 
  }

  // Dashboard actions (moved to dashboard.js)
  // Recent race rows handled in dashboard.js

  // Mobile sidebar
  if (e.target.closest('#mnav-menu-btn')) { openMobileSidebar(); return; }
  if (e.target.closest('#sidebar-backdrop') || e.target.closest('#btn-close-sidebar')) { closeMobileSidebar(); return; }
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
  // Ctrl+P shortcut moved to players.js
});

// ============================================================
//  RESET (moved to system.js)
// ============================================================

// ============================================================
//  EXPORT / IMPORT (moved to system.js)
// ============================================================

// ============================================================
//  HISTORIC CHAMPIONSHIP TEMPLATES (moved to system.js)
// ============================================================

// ============================================================
//  INIT
// ============================================================
function init() {
  if (window.APP_META && window.APP_META.version) {
    const versionEl = document.getElementById('sidebar-version-label');
    if (versionEl) versionEl.textContent = 'v' + window.APP_META.version;
  }
  
  // Apply saved theme on init
  const savedTheme = localStorage.getItem('heat-theme');
  applyTheme(savedTheme || 'dark');
  
  renderSidebarChamp();
  navigateTo('dashboard');

  // bind core UI buttons (also bound on DOMContentLoaded for safety)
  bindGlobalButtons();

  // System event listeners (moved to system.js)

  // Mobile sidebar controls
  document.getElementById('mnav-menu-btn').addEventListener('click', openMobileSidebar);
  document.getElementById('sidebar-backdrop').addEventListener('click', closeMobileSidebar);
  document.getElementById('btn-close-sidebar').addEventListener('click', closeMobileSidebar);

  // Theme support (already bound above but apply on init)
  applyTheme(localStorage.getItem('heat-theme') || 'dark');

  // Background decoration
  document.body.insertAdjacentHTML('beforeend', `
    <div class="bg-grid-overlay"></div>
    <div class="bg-glow-overlay"></div>`);
}

function toggleTheme() {
  // Clear existing timeout
  if (themeToggleTimeout) {
    clearTimeout(themeToggleTimeout);
  }
  
  // Throttle to prevent multiple rapid executions
  themeToggleTimeout = setTimeout(() => {
    const current = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    const target = current === 'dark' ? 'light' : 'dark';
    applyTheme(target);
  }, 50); // 50ms delay
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    document.getElementById('btn-theme-toggle').innerHTML = '☀️';
  } else {
    document.body.classList.remove('light-theme');
    document.getElementById('btn-theme-toggle').innerHTML = '🌙';
  }
  localStorage.setItem('heat-theme', theme);
}

// Wait for data to load before initializing
function waitForDataAndInit() {
  if (typeof window.CIRCUITS !== 'undefined' &&
      typeof window.WEATHER_OPTIONS !== 'undefined' &&
      typeof window.GAME_BASICS !== 'undefined' &&
      typeof window.UPGRADES !== 'undefined' &&
      typeof window.SPONSORS !== 'undefined' &&
      typeof window.POINTS_SYSTEMS !== 'undefined' &&
      typeof window.RACE_EVENTS !== 'undefined' &&
      typeof window.CHAMPIONSHIP_TEMPLATES !== 'undefined') {
    init();
  } else {
    setTimeout(waitForDataAndInit, 50);
  }
}

waitForDataAndInit();
