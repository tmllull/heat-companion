// ============================================================
//  HEAT: PEDAL TO THE METAL — COMPANION APP  v2
//  New data model:
//  - championship.calendar[] for planned races
//  - player.upgrades[] for permanent season upgrades
//  - championship.playerIds[] for enrolled pilots
// ============================================================

// ---- STATE ----
let state = loadState();

function defaultState() {
  return {
    championship: {
      name: 'Mi Campeonato Heat',
      pointsSystem: 'f1',
      customPoints: [],
      playerIds: [],   // IDs of enrolled players
      calendar: []     // CalendarRace[]
    },
    players: []
  };
}

// CalendarRace shape:
// { id, circuitId, date, mods:{garage,weather,sponsors}, status:'scheduled'|'completed', results:[{playerId,position,dnf}] }

// Player shape:
// { id, name, color, icon, upgrades:string[] }

function loadState() {
  try {
    const raw = localStorage.getItem('heat-companion-v2');
    if (raw) return JSON.parse(raw);
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
        date: r.date || '',
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
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function getPointsArray() {
  if (state.championship.pointsSystem === 'custom') return state.championship.customPoints;
  return POINTS_SYSTEMS[state.championship.pointsSystem] || POINTS_SYSTEMS.f1;
}

function getPoints(position) {
  const arr = getPointsArray();
  return arr[position - 1] ?? 0;
}

function getPlayerById(id)  { return state.players.find(p => p.id === id); }
function getCircuitById(id) { return CIRCUITS.find(c => c.id === id); }
function getCircuitName(circuit) {
  if (!circuit) return '—';
  return circuit.name || circuit.country || '—';
}
function getUpgradeById(id) { 
  return UPGRADES.find(u => u.id === id) || SPONSORS.find(s => s.id === id); 
}

function enrolledPlayers() {
  return state.championship.playerIds
    .map(id => getPlayerById(id))
    .filter(Boolean);
}

function initials(name) {
  return (name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---- STANDINGS ----
function getStandings() {
  const pts = getPointsArray();
  return enrolledPlayers()
    .map(p => {
      const races = state.championship.calendar.filter(r => r.status === 'completed');
      const points = races.reduce((sum, r) => {
        const res = r.results.find(x => x.playerId === p.id);
        return sum + (res ? getPoints(res.position) : 0);
      }, 0);
      const wins   = races.filter(r => { const res = r.results.find(x => x.playerId === p.id); return res && res.position === 1; }).length;
      const podiums = races.filter(r => { const res = r.results.find(x => x.playerId === p.id); return res && res.position <= 3; }).length;
      const raceCount = races.filter(r => r.results.some(x => x.playerId === p.id)).length;
      return { player: p, points, wins, podiums, races: raceCount };
    })
    .sort((a, b) => b.points - a.points || b.wins - a.wins || b.podiums - a.podiums);
}

// ---- TOAST ----
let toastTimer = null;
function showToast(msg, type = 'info') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${type}`;
  el.style.display = 'block';
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.style.display = 'none'; }, 3200);
}

// ---- MODAL ----
function openModal(id)  { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

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
    case 'players':      renderPlayers();      break;
    case 'standings':    renderStandings();    break;
    case 'manual':       renderManual();       break;
  }
}

// ============================================================
//  RENDER: MANUAL / REFERENCE
// ============================================================
function renderManual() {
  const basicsList = document.getElementById('manual-basics-list');
  const weatherList = document.getElementById('manual-weather-list');

  // Render Basics
  basicsList.innerHTML = Object.values(GAME_BASICS).map(b => `
    <div class="manual-item">
      <div class="manual-item-header">
        <span class="manual-item-icon">${b.emoji}</span>
        <span class="manual-item-name">${b.name}</span>
      </div>
      <p class="manual-item-desc">${b.description}</p>
      <ul class="manual-item-rules">
        ${b.effects.map(e => `<li>${e}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  // Render Weather
  weatherList.innerHTML = WEATHER_OPTIONS.map(w => `
    <div class="manual-item">
      <div class="manual-item-header">
        <span class="manual-item-icon">${w.emoji}</span>
        <span class="manual-item-name">${w.name}</span>
      </div>
      <div class="manual-item-effect">
        <div class="weather-prep"><strong>Preparación:</strong> ${w.effect.preparation}</div>
        <div class="weather-track"><strong>Pista:</strong> ${w.effect.trackEffect}</div>
      </div>
    </div>
  `).join('');
}

// ---- MOBILE SIDEBAR DRAWER ----
function openMobileSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-backdrop').classList.add('active');
}
function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('active');
}

// ============================================================
//  RENDER: DASHBOARD
// ============================================================
function renderDashboard() {
  const champ = state.championship;
  const calendar = champ.calendar;
  const completed = calendar.filter(r => r.status === 'completed');
  const pending   = calendar.filter(r => r.status === 'scheduled');

  document.getElementById('dash-title').textContent = champ.name;
  document.getElementById('dash-subtitle').textContent =
    enrolledPlayers().length > 0
      ? `${enrolledPlayers().length} piloto(s) · ${completed.length} carrera(s) disputada(s)`
      : 'Configura el campeonato para empezar';

  document.getElementById('stat-races-val').textContent   = completed.length;
  document.getElementById('stat-pending-val').textContent  = pending.length;
  document.getElementById('stat-players-val').textContent  = enrolledPlayers().length;

  const standings = getStandings();
  document.getElementById('stat-leader-val').textContent = standings[0]?.player.name || '—';

  // Mini standings (top 5)
  const miniEl = document.getElementById('dash-standings-list');
  if (standings.length === 0) {
    miniEl.innerHTML = '<div style="color:var(--text-dim);font-size:13px;text-align:center;padding:16px">Inscribe pilotos en el campeonato para ver la clasificación</div>';
  } else {
    miniEl.innerHTML = standings.slice(0, 5).map((s, i) => {
      const pos = i + 1;
      return `<div class="mini-standing-row">
        <div class="mini-pos pos-${pos <= 3 ? pos : ''}">${pos <= 3 ? ['🥇','🥈','🥉'][pos-1] : pos}</div>
        <div class="mini-car-dot" style="background:${s.player.color}"></div>
        <div class="mini-name">${escHtml(s.player.name)}</div>
        <span class="mini-pts">${s.points}</span><span class="mini-pts-label"> pts</span>
      </div>`;
    }).join('');
  }

  // Recent / upcoming races (show last 2 completed + next 2 pending)
  const recentEl = document.getElementById('dash-recent-races');
  const shown = [...completed.slice(-2).reverse(), ...pending.slice(0, 2)];
  if (shown.length === 0) {
    recentEl.innerHTML = '<div style="color:var(--text-dim);font-size:13px;text-align:center;padding:16px">No hay carreras en el calendario</div>';
  } else {
    recentEl.innerHTML = shown.map(race => {
      const circuit = getCircuitById(race.circuitId);
      const winner  = race.results.find(r => r.position === 1);
      const winnerP = winner ? getPlayerById(winner.playerId) : null;
      const isPending = race.status === 'scheduled';
      return `<div class="recent-race-row" data-cal-race-id="${race.id}">
        <div class="race-flag">${circuit?.flag || '🏁'}</div>
        <div class="race-info">
          <div class="race-info-name">${escHtml(getCircuitName(circuit))}</div>
          <div class="race-info-meta">
            <span class="race-info-date">${formatDate(race.date)}</span>
            <span class="race-info-laps">🏁 ${race.laps || 3} vueltas</span>
          </div>
        </div>
        ${isPending
          ? `<span class="race-status-badge pending">Pendiente</span>`
          : winnerP
            ? `<div class="race-winner"><div class="race-winner-dot" style="background:${winnerP.color}"></div>${escHtml(winnerP.name)}</div>`
            : ''
        }
      </div>`;
    }).join('');
  }
}

// ============================================================
//  RENDER: CHAMPIONSHIP
// ============================================================
function renderChampionship() {
  const champ = state.championship;
  document.getElementById('champ-view-name').textContent = champ.name;
  document.getElementById('champ-view-sub').textContent  =
    `${enrolledPlayers().length} piloto(s) · ${champ.calendar.length} carrera(s) en calendario`;

  // --- Enrolled players ---
  const enrolledEl  = document.getElementById('champ-enrolled-players');
  const noPlayersEl = document.getElementById('champ-no-players');

  if (state.players.length === 0) {
    enrolledEl.innerHTML = '';
    noPlayersEl.style.display = 'block';
  } else {
    noPlayersEl.style.display = 'none';
    enrolledEl.innerHTML = state.players.map(p => {
      const enrolled = champ.playerIds.includes(p.id);
      return `<div class="enrolled-player-chip ${enrolled ? 'enrolled' : ''}" data-toggle-player="${p.id}">
        <div class="enrolled-avatar" style="background:${p.color}">${escHtml(p.icon || initials(p.name))}</div>
        <span class="enrolled-name">${escHtml(p.name)} ${p.isLegend ? '🤖' : ''}</span>
        <span class="enrolled-check">${enrolled ? '✓' : '+'}</span>
      </div>`;
    }).join('');
  }

  // --- Calendar ---
  const listEl  = document.getElementById('calendar-list');
  const emptyEl = document.getElementById('calendar-empty');

  if (champ.calendar.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = 'block';
  } else {
    emptyEl.style.display = 'none';
    listEl.innerHTML = champ.calendar.map((race, i) => {
      const circuit   = getCircuitById(race.circuitId);
      const completed = race.status === 'completed';
      const mods      = [];
      if (race.mods?.weather) {
        const wOpt = WEATHER_OPTIONS.find(w => w.id === race.weatherType);
        mods.push(`${wOpt?.emoji || '🌧'} ${wOpt?.name || 'Clima'}`);
      }

      let podiumHtml = '';
      if (completed) {
        const top3 = race.results.sort((a, b) => a.position - b.position).slice(0, 3);
        podiumHtml = `<div class="cal-podium">${top3.map((r, j) => {
          const p = getPlayerById(r.playerId);
          return p ? `<div class="cal-podium-chip p${j+1}"><div class="podium-chip-dot" style="background:${p.color}"></div>${escHtml(p.name)}</div>` : '';
        }).join('')}</div>`;
      }

      return `<div class="cal-race-row ${completed ? 'completed' : ''}" 
                   data-cal-race-id="${race.id}" 
                   data-idx="${i}"
                   draggable="${!completed}">
        <div class="cal-race-num">
          <div>${i + 1}</div>
          ${!completed ? `
          <div class="cal-order-btns">
            <button class="btn-order" data-move-up="${race.id}" ${i === 0 ? 'disabled' : ''}>▲</button>
            <button class="btn-order" data-move-down="${race.id}" ${i === champ.calendar.length - 1 ? 'disabled' : ''}>▼</button>
          </div>` : ''}
        </div>
        <div class="cal-race-flag">${circuit?.flag || '🏁'}</div>
        <div class="cal-race-info">
          <div class="cal-race-name">${escHtml(race.event || getCircuitName(circuit))}</div>
          <div class="cal-race-meta">
            <span>🏁 Vueltas: ${race.laps || 3}</span>
            ${race.setup?.sponsors !== undefined ? `<span>📋 Patrocinios: ${race.setup.sponsors}</span>` : ''}
            ${race.setup?.press ? `<span>🎥 Prensa: ${race.setup.press}</span>` : ''}
            ${mods.length ? `<span class="cal-mods">${mods.join(' ')}</span>` : '<span style="color:var(--text-dim)">Sin módulos</span>'}
          </div>
          ${podiumHtml}
        </div>
        <div class="cal-race-actions">
          ${completed
            ? `<span class="race-status-badge completed">Completada</span>
               <button class="btn-cal-action" data-view-result="${race.id}">Ver</button>`
            : `<span class="race-status-badge pending">Pendiente</span>
               <button class="btn-cal-action" data-edit-cal-race="${race.id}" title="Editar carrera">✎</button>
               <button class="btn-cal-action primary" data-enter-result="${race.id}">Registrar resultado</button>`
          }
          <button class="btn-cal-delete" data-delete-cal-race="${race.id}" title="Eliminar carrera">✕</button>
        </div>
      </div>`;
    }).join('');

    // --- Add Drag & Drop Listeners ---
    addCalendarDragListeners(listEl);
  }
}


function addCalendarDragListeners(listEl) {
  listEl.addEventListener('dragstart', e => {
    const row = e.target.closest('.cal-race-row');
    if (!row || row.classList.contains('completed')) { e.preventDefault(); return; }
    row.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });

  listEl.addEventListener('dragover', e => {
    e.preventDefault();
    const dragging = listEl.querySelector('.dragging');
    const afterElement = getDragAfterElement(listEl, e.clientY);
    
    if (afterElement == null) {
      listEl.appendChild(dragging);
    } else {
      listEl.insertBefore(dragging, afterElement);
    }
  });

  listEl.addEventListener('dragend', e => {
    const dragging = e.target.closest('.cal-race-row');
    if (dragging) dragging.classList.remove('dragging');
    
    // Save new order
    const newOrderIds = [...listEl.querySelectorAll('.cal-race-row')].map(el => el.dataset.calRaceId);
    
    // Build new calendar array based on IDs
    const oldCalendar = [...state.championship.calendar];
    const newCalendar = newOrderIds.map(id => oldCalendar.find(r => r.id === id));
    
    // Safety: ensure completed races haven't changed position relative to each other
    // and are still at the top (or wherever they were)
    // Actually, just compare if status changed or position of completed changed
    const completedIndicesOld = oldCalendar.map((r, i) => r.status === 'completed' ? i : -1).filter(i => i !== -1);
    const completedIndicesNew = newCalendar.map((r, i) => r.status === 'completed' ? i : -1).filter(i => i !== -1);
    
    const isOrderSafe = completedIndicesOld.every((val, i) => val === completedIndicesNew[i]);
    
    if (isOrderSafe) {
      state.championship.calendar = newCalendar;
      saveState();
    }
    
    renderChampionship();
  });
}

function getDragAfterElement(container, y) {
  // Only consider pending races as valid drop targets to simplify
  const draggableElements = [...container.querySelectorAll('.cal-race-row:not(.dragging):not(.completed)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ============================================================
//  RENDER: PLAYERS
// ============================================================
function renderPlayers() {
  const grid  = document.getElementById('players-grid');
  const empty = document.getElementById('players-empty');

  if (state.players.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  const pts = getPointsArray();
  grid.innerHTML = state.players.map(p => {
    const points  = state.championship.calendar
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => { const res = r.results.find(x => x.playerId === p.id); return sum + (res ? getPoints(res.position) : 0); }, 0);
    const enrolled = state.championship.playerIds.includes(p.id);

    const upgBadges = (p.upgrades || []).map(uid => {
      const u = getUpgradeById(uid);
      return u ? `<span class="player-upg-badge ${u.category === 'Patrocinio' ? 'sponsor' : ''}" title="${u.description}">${u.emoji} ${u.name}</span>` : '';
    }).join('');

    return `<div class="player-card" style="--player-color:${p.color}">
      ${enrolled ? '<div class="player-enrolled-dot" title="Inscrito en el campeonato"></div>' : ''}
      <div class="player-avatar" style="background:${p.color}">${escHtml(p.icon || initials(p.name))}</div>
      <div class="player-name">
        ${escHtml(p.name)}
        ${p.isLegend ? '<span class="legend-badge">🤖</span>' : ''}
      </div>
      <div class="player-stats">${points} pts</div>
      ${upgBadges ? `<div class="player-upg-list">${upgBadges}</div>` : '<div class="player-upg-list no-upg">Sin mejoras asignadas</div>'}
      <div class="player-card-actions">
        <button class="btn-icon btn-icon-edit" data-edit-player="${p.id}">✎ Editar</button>
        <button class="btn-icon btn-icon-del" data-del-player="${p.id}">🗑</button>
      </div>
    </div>`;
  }).join('');
}

// ============================================================
//  RENDER: STANDINGS
// ============================================================
function renderStandings() {
  const wrap  = document.getElementById('standings-table-wrap');
  const empty = document.getElementById('standings-empty');
  document.getElementById('standings-champ-name').textContent = state.championship.name;

  const ep = enrolledPlayers();
  if (ep.length === 0) {
    wrap.innerHTML = '';
    empty.style.display = 'block';
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
    const gap = pos === 1 ? '' : `−${leader.points - s.points}`;
    const racePts = completedRaces.map(r => {
      const res = r.results.find(x => x.playerId === s.player.id);
      if (!res) return '<td style="text-align:center"><span style="color:var(--text-dim)">—</span></td>';
      const p = getPoints(res.position);
      return `<td><span class="race-pts-cell">${p}</span></td>`;
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
//  CHAMPIONSHIP MODAL
// ============================================================
function openChampModal() {
  document.getElementById('champ-name-input').value       = state.championship.name;
  document.getElementById('champ-points-select').value    = state.championship.pointsSystem;
  toggleCustomPoints(state.championship.pointsSystem);
  openModal('modal-champ');
}

function toggleCustomPoints(val) {
  document.getElementById('champ-points-custom').style.display = val === 'custom' ? 'block' : 'none';
}

document.getElementById('champ-points-select').addEventListener('change', e => toggleCustomPoints(e.target.value));

document.getElementById('btn-save-champ').addEventListener('click', () => {
  const name = document.getElementById('champ-name-input').value.trim();
  const pts  = document.getElementById('champ-points-select').value;
  if (!name) { showToast('Introduce un nombre para el campeonato', 'error'); return; }

  state.championship.name         = name;
  state.championship.pointsSystem = pts;
  if (pts === 'custom') {
    const arr = document.getElementById('champ-points-custom').value
      .split(',').map(x => parseInt(x.trim(), 10)).filter(n => !isNaN(n));
    if (!arr.length) { showToast('Introduce los puntos correctamente', 'error'); return; }
    state.championship.customPoints = arr;
  }

  saveState();
  renderSidebarChamp();
  closeModal('modal-champ');
  showToast('Campeonato guardado ✓', 'success');
  renderView('dashboard');
  renderView('championship');
});

// ============================================================
//  PLAYER MODAL (with upgrades)
// ============================================================
let editingPlayerId    = null;
let selectedPlayerColor = '#e63b2e';

function buildPlayerUpgradesUI(selectedUpgrades = []) {
  const container = document.getElementById('player-upgrades-container');
  
  const techCategories = ["Velocidad", "Refrigeración", "Manejo", "Táctica"];

  function renderGroup(title, items, icon, isSponsor = false) {
    if (items.length === 0) return '';
    
    // Group items by category if it's Technical, otherwise it's just one list for Sponsors
    let content = '';
    if (!isSponsor) {
      content = techCategories.map(cat => {
        const catUpgrades = items.filter(u => u.category === cat);
        if (catUpgrades.length === 0) return '';
        return `<div style="margin-bottom:12px">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);margin-bottom:6px">${cat}</div>
          <div class="upgrades-grid-small">
            ${catUpgrades.map(u => `
              <div class="upgrade-chip ${selectedUpgrades.includes(u.id) ? 'selected' : ''}"
                data-upgrade-id="${u.id}" title="${u.description}">
                ${u.emoji} ${u.name}
              </div>`).join('')}
          </div>
        </div>`;
      }).join('');
    } else {
      content = `<div class="upgrades-grid-small">
        ${items.map(u => `
          <div class="upgrade-chip sponsor ${selectedUpgrades.includes(u.id) ? 'selected' : ''}"
            data-upgrade-id="${u.id}" title="${u.description}">
            ${u.emoji} ${u.name}
          </div>`).join('')}
      </div>`;
    }

    return `
      <div class="upgrade-modal-group collapsed" data-group-type="${isSponsor ? 'sponsor' : 'tech'}">
        <div class="upgrade-modal-group-title" onclick="this.parentElement.classList.toggle('collapsed')">
          ${icon} ${title}
          <span class="upgrade-count-badge" id="count-${isSponsor ? 'sponsor' : 'tech'}">0 / ${isSponsor ? 5 : 3}</span>
          <span class="collapse-icon">▼</span>
        </div>
        <div class="upgrade-modal-group-content">
          ${content}
        </div>
      </div>`;
  }

  container.innerHTML = 
    renderGroup('Mejoras de Garaje (Boxes)', UPGRADES, '🔧') +
    renderGroup('Patrocinios Permanentes', SPONSORS, '💰', true);

  updateUpgradeCount();
}

function updateUpgradeCount() {
  const techCount = document.querySelectorAll('#player-upgrades-container [data-group-type="tech"] .upgrade-chip.selected').length;
  const sponsorCount = document.querySelectorAll('#player-upgrades-container [data-group-type="sponsor"] .upgrade-chip.selected').length;

  const techBadge = document.getElementById('count-tech');
  const sponsorBadge = document.getElementById('count-sponsor');

  if (techBadge) {
    techBadge.textContent = `${techCount} / 3`;
    techBadge.style.color = techCount >= 3 ? 'var(--heat-orange)' : 'var(--text-muted)';
  }
  if (sponsorBadge) {
    sponsorBadge.textContent = `${sponsorCount} / 5`;
    sponsorBadge.style.color = sponsorCount >= 5 ? 'var(--heat-gold)' : 'var(--text-muted)';
  }
}

document.getElementById('player-upgrades-container').addEventListener('click', e => {
  const chip = e.target.closest('.upgrade-chip');
  if (!chip) return;
  const group = chip.closest('.upgrade-modal-group');
  const groupType = group.dataset.groupType;
  const isSelected = chip.classList.contains('selected');

  if (!isSelected) {
    const currentCount = group.querySelectorAll('.upgrade-chip.selected').length;
    const limit = groupType === 'tech' ? 3 : 5;
    if (currentCount >= limit) {
      showToast(`Máximo ${limit} ${groupType === 'tech' ? 'mejoras' : 'patrocinios'} permitidos`, 'error');
      return;
    }
  }

  chip.classList.toggle('selected', !isSelected);
  updateUpgradeCount();
});

function openPlayerModal(playerId = null) {
  editingPlayerId = playerId;
  const nameInput = document.getElementById('player-name-input');
  const iconInput = document.getElementById('player-icon-input');
  let currentUpgrades = [];

  if (playerId) {
    const p = getPlayerById(playerId);
    document.getElementById('modal-player-title').textContent = 'Editar piloto';
    nameInput.value       = p.name;
    iconInput.value       = p.icon || '';
    document.getElementById('player-is-legend').checked = p.isLegend || false;
    selectedPlayerColor   = p.color;
    currentUpgrades       = p.upgrades || [];
  } else {
    document.getElementById('modal-player-title').textContent = 'Añadir piloto';
    nameInput.value = '';
    iconInput.value = '';
    document.getElementById('player-is-legend').checked = false;
    selectedPlayerColor = '#e63b2e';
  }

  document.querySelectorAll('.color-option').forEach(el =>
    el.classList.toggle('selected', el.dataset.color === selectedPlayerColor)
  );

  buildPlayerUpgradesUI(currentUpgrades);
  openModal('modal-player');
  setTimeout(() => nameInput.focus(), 100);
}

document.querySelectorAll('.color-option').forEach(el => {
  el.addEventListener('click', () => {
    selectedPlayerColor = el.dataset.color;
    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
  });
});

document.getElementById('btn-save-player').addEventListener('click', () => {
  const name = document.getElementById('player-name-input').value.trim();
  const icon = document.getElementById('player-icon-input').value.trim();
  if (!name) { showToast('Introduce un nombre para el piloto', 'error'); return; }

  const colorConflict = state.players.find(p => p.color === selectedPlayerColor && p.id !== editingPlayerId);
  if (colorConflict) { showToast(`El color ya lo usa ${colorConflict.name}`, 'error'); return; }

  const upgrades = [...document.querySelectorAll('#player-upgrades-container .upgrade-chip.selected')]
    .map(el => el.dataset.upgradeId);
  const isLegend = document.getElementById('player-is-legend').checked;

  if (editingPlayerId) {
    const idx = state.players.findIndex(p => p.id === editingPlayerId);
    state.players[idx] = { ...state.players[idx], name, color: selectedPlayerColor, icon, upgrades, isLegend };
    showToast('Piloto actualizado ✓', 'success');
  } else {
    state.players.push({ id: uid(), name, color: selectedPlayerColor, icon, upgrades, isLegend });
    showToast(`${name} añadido ✓`, 'success');
  }

  saveState();
  closeModal('modal-player');
  renderView('players');
  renderView('championship');
});

function deletePlayer(playerId) {
  const p = getPlayerById(playerId);
  if (!confirm(`¿Eliminar a ${p.name}? Sus resultados en carreras se conservarán pero sin nombre.`)) return;
  state.players = state.players.filter(x => x.id !== playerId);
  state.championship.playerIds = state.championship.playerIds.filter(id => id !== playerId);
  saveState();
  renderView('players');
  renderView('championship');
  showToast('Piloto eliminado', 'info');
}

// ============================================================
//  ENROLL / UN-ENROLL PLAYER
// ============================================================
function toggleEnrollPlayer(playerId) {
  const ids = state.championship.playerIds;
  const idx = ids.indexOf(playerId);
  if (idx === -1) {
    ids.push(playerId);
    showToast(`${getPlayerById(playerId)?.name} inscrito en el campeonato ✓`, 'success');
  } else {
    ids.splice(idx, 1);
    showToast(`${getPlayerById(playerId)?.name} retirado del campeonato`, 'info');
  }
  saveState();
  renderView('championship');
  renderView('dashboard');
}

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
  document.getElementById('add-race-setup-section').style.display = hasSponsors ? 'block' : 'none';
  document.getElementById('add-race-press-input').value = race ? (race.press || '') : '';

  // Setup configuration (only when sponsors module is active)
  if (hasSponsors) {
    const setupSponsors = race ? (race.setup?.sponsors || 0) : 1;
    const setupPress = race ? (race.setup?.press || '') : '';
    document.querySelectorAll('#add-race-setup-sponsors-grid .number-chip').forEach(c => {
      c.classList.toggle('selected', parseInt(c.dataset.val) === setupSponsors);
    });
    document.getElementById('add-race-setup-press-input').value = setupPress;
  }

  // render circuits
  const grid = document.getElementById('add-race-circuits-grid');
  grid.innerHTML = CIRCUITS.map(c => `
    <div class="circuit-card ${c.id === addRaceSelectedCircuit ? 'selected' : ''}" data-circuit="${c.id}">
      <div class="circuit-flag">${c.flag}</div>
      <div class="circuit-name">${c.name || c.country}</div>
      <div class="circuit-info-stats">
        <span>⤵ ${c.curves} curvas</span>
        <span>📏 ${c.spaces} casillas</span>
        <span>🏁 ${c.laps} vueltas</span>
      </div>
      <div class="circuit-info-footer">
        <span class="diff-badge ${c.difficulty.toLowerCase()}">${c.difficulty}</span>
        <span class="expansion-label">${c.expansion}</span>
      </div>
    </div>`).join('');

  // render weather options
  const wGrid = document.getElementById('add-race-weather-grid');
  wGrid.innerHTML = WEATHER_OPTIONS.map(w => `
    <div class="weather-card ${w.id === addRaceSelectedWeather ? 'selected' : ''}" data-weather="${w.id}">
      <div class="weather-card-emoji">${w.emoji}</div>
      <div class="weather-card-name">${w.name}</div>
      <div class="weather-card-effect">
        <div><strong>Prep:</strong> ${w.effect.preparation}</div>
        <div><strong>Pista:</strong> ${w.effect.trackEffect}</div>
      </div>
    </div>`).join('');

  openModal('modal-add-race');
}

document.getElementById('add-race-mod-weather').addEventListener('change', e => {
  document.getElementById('add-race-weather-section').style.display = e.target.checked ? 'block' : 'none';
});

document.getElementById('add-race-mod-sponsors').addEventListener('change', e => {
  document.getElementById('add-race-sponsors-section').style.display = e.target.checked ? 'block' : 'none';
  document.getElementById('add-race-setup-section').style.display = e.target.checked ? 'block' : 'none';
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
  addRaceSelectedSponsors = parseInt(chip.dataset.val);
  document.querySelectorAll('#add-race-sponsors-grid .number-chip').forEach(c => c.classList.remove('selected'));
  chip.classList.add('selected');
});

document.getElementById('add-race-setup-sponsors-grid').addEventListener('click', e => {
  const chip = e.target.closest('.number-chip');
  if (!chip) return;
  const val = parseInt(chip.dataset.val);
  document.querySelectorAll('#add-race-setup-sponsors-grid .number-chip').forEach(c => c.classList.remove('selected'));
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
    sponsorCards: isSponsorsActive ? addRaceSelectedSponsors : 0,
    press: isPressActive ? document.getElementById('add-race-press-input').value.trim() : '',
    setup: isSponsorsActive ? {
      sponsors: parseInt(document.querySelector('#add-race-setup-sponsors-grid .number-chip.selected')?.dataset.val || '1'),
      press: document.getElementById('add-race-setup-press-input').value.trim()
    } : { sponsors: 0, press: '' }
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

//  ENTER RACE RESULTS
// ============================================================
let resultsRaceId    = null;
let resultsOrder     = []; // [{playerId}]
let resultsDragSrcIdx = null;

function openResultsModal(raceId) {
  resultsRaceId = raceId;
  const race    = state.championship.calendar.find(r => r.id === raceId);
  if (!race) return;

  const circuit = getCircuitById(race.circuitId);
  document.getElementById('modal-results-title').textContent =
    `Registrar resultado — ${circuit?.flag || ''} ${getCircuitName(circuit)}`;

  // Build starting order: if already has results, use them; else standings order
  if (race.status === 'completed' && race.results.length > 0) {
    resultsOrder = race.results.map(r => ({ playerId: r.playerId }));
    // add any enrolled players not in results
    enrolledPlayers().forEach(p => {
      if (!resultsOrder.find(r => r.playerId === p.id)) resultsOrder.push({ playerId: p.id });
    });
  } else {
    const standing = getStandings();
    const ep = enrolledPlayers();
    // prefer standings order, fallback to enrolled order
    resultsOrder = ep.map(p => ({ playerId: p.id }));
  }

  renderResultsSortable();
  openModal('modal-results');
}

function renderResultsSortable() {
  const list = document.getElementById('results-sortable-list');
  const pts  = getPointsArray();

  list.innerHTML = resultsOrder.map((entry, i) => {
    const player = getPlayerById(entry.playerId);
    if (!player) return '';
    const pos   = i + 1;
    const earnedPts = pts[i] ?? 0;
    return `<div class="result-row" draggable="true" data-player-id="${entry.playerId}" data-idx="${i}">
      <div class="result-pos pos-${pos <= 3 ? pos : ''}">${pos}º</div>
      <div class="result-avatar" style="background:${player.color}">${escHtml(player.icon || initials(player.name))}</div>
      <div class="result-name">${escHtml(player.name)}</div>
      <div class="result-pts-preview" id="rpts-${i}">${earnedPts + ' pts'}</div>
      <div class="result-move-btns">
        <button class="result-move-btn" data-move="up" data-idx="${i}">▲</button>
        <button class="result-move-btn" data-move="down" data-idx="${i}">▼</button>
      </div>
    </div>`;
  }).join('');

  setupResultsDragDrop('results-sortable-list', resultsOrder, () => renderResultsSortable());



  list.querySelectorAll('.result-move-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx    = parseInt(btn.dataset.idx);
      const newIdx = btn.dataset.move === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= resultsOrder.length) return;
      [resultsOrder[idx], resultsOrder[newIdx]] = [resultsOrder[newIdx], resultsOrder[idx]];
      renderResultsSortable();
    });
  });
}

function setupResultsDragDrop(listId, orderArr, rerenderFn) {
  const rows = document.querySelectorAll(`#${listId} .result-row`);
  let dragSrc = null;
  rows.forEach(row => {
    row.addEventListener('dragstart', () => { dragSrc = parseInt(row.dataset.idx); row.style.opacity = '0.5'; });
    row.addEventListener('dragend',   () => { row.style.opacity = '1'; });
    row.addEventListener('dragover',  e => { e.preventDefault(); row.classList.add('drag-over'); });
    row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
    row.addEventListener('drop', e => {
      e.preventDefault(); row.classList.remove('drag-over');
      const dropIdx = parseInt(row.dataset.idx);
      if (dragSrc === null || dragSrc === dropIdx) return;
      const moved = orderArr.splice(dragSrc, 1)[0];
      orderArr.splice(dropIdx, 0, moved);
      dragSrc = null;
      rerenderFn();
    });
  });
}

document.getElementById('btn-save-results').addEventListener('click', () => {
  const race = state.championship.calendar.find(r => r.id === resultsRaceId);
  if (!race) return;

  race.results = resultsOrder.map((entry, i) => ({
    playerId: entry.playerId,
    position: i + 1
  }));
  race.status = 'completed';

  saveState();
  closeModal('modal-results');
  renderView('championship');
  renderView('dashboard');
  showToast('Resultado registrado ✓', 'success');
});

// ============================================================
//  RACE DETAIL MODAL
// ============================================================
function openRaceDetailModal(raceId) {
  const race = state.championship.calendar.find(r => r.id === raceId);
  if (!race) return;

  const circuit = getCircuitById(race.circuitId);
  document.getElementById('detail-race-title').textContent =
    `${circuit?.flag || '🏁'} ${getCircuitName(circuit)}`;

  const activeMods = [];
  if (race.mods?.weather) {
    const wOpt = WEATHER_OPTIONS.find(w => w.id === race.weatherType);
    activeMods.push(`${wOpt?.emoji || '🌧'} ${wOpt?.name || 'Clima'}`);
  }
  if (race.mods?.sponsors) {
    const count = race.sponsorCards || 1;
    activeMods.push(`💰 Patrocinadores (${count})`);
  }
  if (race.mods?.press && race.setup?.press) {
    activeMods.push(`📷 Prensa (${race.setup.press})`);
  }

  // Build upgrades section for enrolled players
  const enrolledIds = state.championship.playerIds;
  const upgradesHtml = enrolledIds.map(pid => {
    const p = getPlayerById(pid);
    if (!p || !(p.upgrades?.length)) return null;
    return `<div class="detail-upgrade-player">
      <div style="display:flex;align-items:center;gap:8px;min-width:110px">
        <div class="detail-result-avatar" style="background:${p.color};width:26px;height:26px;font-size:11px">${escHtml(p.icon || initials(p.name))}</div>
        <span class="detail-upgrade-player-name">${escHtml(p.name)}</span>
      </div>
      <div class="detail-upgrade-tags">
        ${p.upgrades.map(uid => { const u = getUpgradeById(uid); return u ? `<span class="detail-upgrade-tag">${u.emoji} ${u.name}</span>` : ''; }).join('')}
      </div>
    </div>`;
  }).filter(Boolean).join('');

  const resultsHtml = race.status === 'completed'
    ? race.results.sort((a, b) => a.position - b.position).map(r => {
        const player     = getPlayerById(r.playerId);
        if (!player) return '';
        const earnedPts  = getPoints(r.position);
        return `<div class="detail-result-row">
          <div class="detail-result-pos pos-${r.position <= 3 ? r.position : ''}">${r.position <= 3 ? ['🥇','🥈','🥉'][r.position-1] : r.position + 'º'}</div>
          <div class="detail-result-avatar" style="background:${player.color}">${escHtml(player.icon || initials(player.name))}</div>
          <div class="detail-result-name">${escHtml(player.name)}</div>
          <div class="detail-result-pts">${earnedPts} pts</div>
        </div>`;
      }).join('')
    : '<div style="color:var(--text-dim);font-size:13px;padding:12px">Carrera aún no disputada.</div>';

  const wOpt = race.mods?.weather ? WEATHER_OPTIONS.find(w => w.id === race.weatherType) : null;
  
  let moduleBannerHtml = '';
  if (wOpt || race.setup?.sponsors !== undefined || race.setup?.press) {
    let bannerContent = '';
    if (wOpt) {
      bannerContent += `
        <div style="margin-bottom:8px">
          <div style="font-size:13px; font-weight:600"><span style="font-size:16px">${wOpt.emoji}</span> Clima: ${wOpt.name}</div>
          <div style="font-size:11px; color:var(--text-muted); margin-left:24px">Efecto: ${wOpt.effect}</div>
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

  const historicHtml = race.event ? `
    <div class="detail-section">
      <h3>📜 Evento Histórico</h3>
      <div class="historic-event-card">
        <div class="historic-event-title">${race.event}</div>
        <div class="historic-event-rules"><strong>Reglas</strong><br>${race.rules}</div>
        <div class="historic-event-setup"><strong>Setup</strong><br>
          📋 Patrocinadores: ${race.setup.sponsors}<br>
          🎥 Prensa: ${race.setup.press}
        </div>
      </div>
    </div>` : '';

  document.getElementById('detail-race-body').innerHTML = `
    ${historicHtml}
    <div class="detail-section">
      <h3>Circuito</h3>
      <div class="detail-circuit-card">
        <div class="detail-circuit-flag">${circuit?.flag || '🏁'}</div>
        <div style="flex:1">
          <div class="detail-circuit-name">${getCircuitName(circuit)}</div>
          <div class="detail-circuit-meta-row">
            <span>${circuit?.country || ''} · ${circuit?.expansion || ''}</span>
            <span class="diff-badge ${circuit?.difficulty?.toLowerCase() || ''}">${circuit?.difficulty || ''}</span>
          </div>
          <div class="detail-circuit-stats-row">
            <span>⤵ ${circuit?.curves || 0} curvas · 📏 ${circuit?.spaces || 0} casillas · 🏁 ${race.laps || circuit?.laps || 3} vueltas</span>
          </div>
        </div>
      </div>
      ${moduleBannerHtml}
    </div>
    ${upgradesHtml ? `<div class="detail-section">
      <h3>Mejoras de pilotos</h3>
      <div class="detail-upgrades-grid">${upgradesHtml}</div>
    </div>` : ''}
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

document.getElementById('btn-edit-result').addEventListener('click', function () {
  const raceId = this.dataset.raceId;
  closeModal('modal-race-detail');
  openResultsModal(raceId);
});

// ============================================================
//  SIDEBAR
// ============================================================
function renderSidebarChamp() {
  document.getElementById('sidebar-champ-name').textContent = state.championship.name;
}

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

  // Championship config
  if (e.target.closest('#btn-edit-champ') || e.target.closest('#btn-champ-settings-inline')) { openChampModal(); return; }

  // Open reset modal
  if (e.target.closest('#btn-open-reset')) { openModal('modal-reset'); return; }

  // Reset section buttons
  const resetBtn = e.target.closest('.btn-reset-section');
  if (resetBtn) { resetSection(resetBtn.dataset.section); return; }

  // Add player
  if (e.target.closest('#btn-add-player')) { openPlayerModal(); return; }

  // Edit player
  const editBtn = e.target.closest('[data-edit-player]');
  if (editBtn) { openPlayerModal(editBtn.dataset.editPlayer); return; }

  // Delete player
  const delBtn = e.target.closest('[data-del-player]');
  if (delBtn) { deletePlayer(delBtn.dataset.delPlayer); return; }

  // Toggle enroll player
  const toggleBtn = e.target.closest('[data-toggle-player]');
  if (toggleBtn) { toggleEnrollPlayer(toggleBtn.dataset.togglePlayer); return; }

  // Add calendar race
  if (e.target.closest('#btn-add-cal-race')) { openAddRaceModal(); return; }

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
  if (calRow && !e.target.closest('button')) { openRaceDetailModal(calRow.dataset.calRaceId); return; }

  // Dashboard recent race row
  const recentRow = e.target.closest('.recent-race-row');
  if (recentRow) { openRaceDetailModal(recentRow.dataset.calRaceId); return; }

  // Mobile sidebar
  if (e.target.closest('#mnav-menu-btn')) { openMobileSidebar(); return; }
  if (e.target.closest('#sidebar-backdrop') || e.target.closest('#btn-close-sidebar')) { closeMobileSidebar(); return; }
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') { e.preventDefault(); openPlayerModal(); }
});

// ============================================================
//  RESET
// ============================================================
const RESET_CONFIRM = {
  championship: { msg: '¿Resetear el nombre y sistema de puntos?\n\nLos pilotos y el calendario NO se verán afectados.' },
  calendar:     { msg: '¿Eliminar TODAS las carreras del calendario?\n\nLos pilotos se mantendrán.' },
  players:      { msg: '¿Eliminar TODOS los pilotos?\n\nTambién se eliminará el calendario (depende de los pilotos).' },
  all:          { msg: '⚠ ¿BORRAR TODO y empezar desde cero?\n\nPilotos, calendario y configuración. No se puede deshacer.' }
};

function resetSection(section) {
  const cfg = RESET_CONFIRM[section];
  if (!cfg || !confirm(cfg.msg)) return;
  switch (section) {
    case 'championship':
      state.championship = { ...defaultState().championship, playerIds: state.championship.playerIds, calendar: state.championship.calendar };
      renderSidebarChamp(); renderView('dashboard'); renderView('championship');
      showToast('Configuración del campeonato reseteada', 'info'); break;
    case 'calendar':
      state.championship.calendar = [];
      renderView('championship'); renderView('dashboard');
      showToast('Calendario eliminado', 'info'); break;
    case 'players':
      state.players = []; state.championship.playerIds = []; state.championship.calendar = [];
      renderView('players'); renderView('championship'); renderView('dashboard');
      showToast('Pilotos y calendario eliminados', 'info'); break;
    case 'all':
      state = defaultState();
      renderSidebarChamp(); navigateTo('dashboard');
      showToast('Reset global completado 🏁', 'info'); break;
  }
  saveState();
  closeModal('modal-reset');
}

// ============================================================
//  EXPORT / IMPORT
// ============================================================
function exportData() {
  const payload = { _meta: { app: 'heat-companion', version: 2, exportedAt: new Date().toISOString() }, ...state };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const champSlug = (state.championship.name || 'campeonato').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').slice(0, 40);
  const filename = `heat-${champSlug}-${new Date().toISOString().slice(0, 10)}.json`;
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  showToast(`Exportado como "${filename}" ✓`, 'success');
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    let parsed;
    try { parsed = JSON.parse(e.target.result); } catch { showToast('JSON inválido', 'error'); return; }
    if (!parsed.championship || !Array.isArray(parsed.players)) {
      showToast('El archivo no es un guardado de HEAT Companion', 'error'); return;
    }
    const champName  = parsed.championship?.name || '?';
    const numPlayers = parsed.players?.length ?? 0;
    const numRaces   = parsed.championship?.calendar?.length ?? 0;
    if (!confirm(`¿Importar campeonato "${champName}"?\n👤 Pilotos: ${numPlayers}\n🏁 Carreras: ${numRaces}\n\n⚠ Reemplazará todos los datos actuales.`)) return;
    const { _meta, ...importedState } = parsed;
    state = { ...defaultState(), ...importedState };
    saveState();
    renderSidebarChamp();
    navigateTo('dashboard');
    showToast(`"${champName}" importado ✓`, 'success');
  };
  reader.onerror = () => showToast('Error al leer el archivo', 'error');
  reader.readAsText(file);
  document.getElementById('import-file-input').value = '';
}

// ============================================================
//  HISTORIC CHAMPIONSHIP TEMPLATES
// ============================================================
function openChampTemplatesModal() {
  const grid = document.getElementById('templates-grid');
  grid.innerHTML = CHAMPIONSHIP_TEMPLATES.map(t => {
    const raceNames = t.races.map(r => getCircuitById(r.circuitId)?.name || 'Carrera').join(' · ');
    return `<div class="template-card" data-template-id="${t.id}">
      <h3>${t.name}</h3>
      <div class="template-race-mini-list">${t.races.length} carreras: ${raceNames}</div>
      <div class="template-card-footer">Cargar campeonato →</div>
    </div>`;
  }).join('');
  openModal('modal-champ-templates');
}

document.getElementById('templates-grid').addEventListener('click', e => {
  const card = e.target.closest('.template-card');
  if (!card) return;
  const tid = card.dataset.templateId;
  loadChampTemplate(tid);
});

function loadChampTemplate(tid) {
  const t = CHAMPIONSHIP_TEMPLATES.find(x => x.id === tid);
  if (!t) return;

  if (state.championship.calendar.length > 0) {
    if (!confirm('¿Cargar este campeonato histórico? Perderás el calendario actual y los resultados de carreras no completadas.')) return;
  }

  state.championship.name = t.name;
  state.championship.pointsSystem = t.pointsSystem || 'f1old';
  state.championship.calendar = t.races.map(r => ({
    id: uid(),
    circuitId: r.circuitId,
    date: new Date().toISOString().slice(0, 10),
    mods: r.mods || { weather: false, sponsors: false, press: false },
    weatherType: r.weatherType || 'sun',
    event: r.event || '',
    rules: r.rules || '',
    setup: r.setup || { sponsors: 0, press: '' },
    status: 'scheduled',
    results: []
  }));

  saveState();
  closeModal('modal-champ-templates');
  renderSidebarChamp();
  renderView('championship');
  showToast(`${t.name} cargado correctamente ✓`, 'success');
}

function resetChampionship() {
  if (!confirm('¿Deseas vaciar el calendario de carreras del campeonato? Los pilotos y sus mejoras se conservarán.')) return;
  state.championship.calendar = [];
  saveState();
  renderView('championship');
  showToast('Calendario reseteado', 'info');
}

// ============================================================
//  INIT
// ============================================================
function init() {
  renderSidebarChamp();
  navigateTo('dashboard');

  document.getElementById('btn-export').addEventListener('click', exportData);
  document.getElementById('btn-import').addEventListener('click', () => document.getElementById('import-file-input').click());
  document.getElementById('import-file-input').addEventListener('change', e => importData(e.target.files[0]));

  document.getElementById('btn-show-champ-templates').addEventListener('click', openChampTemplatesModal);
  document.getElementById('btn-reset-championship').addEventListener('click', resetChampionship);

  // Mobile sidebar controls
  document.getElementById('mnav-menu-btn').addEventListener('click', openMobileSidebar);
  document.getElementById('sidebar-backdrop').addEventListener('click', closeMobileSidebar);
  document.getElementById('btn-close-sidebar').addEventListener('click', closeMobileSidebar);

  // Theme support
  document.getElementById('btn-theme-toggle').addEventListener('click', toggleTheme);
  applyTheme(localStorage.getItem('heat-theme') || 'dark');

  // Background decoration
  document.body.insertAdjacentHTML('beforeend', `
    <div class="bg-grid-overlay"></div>
    <div class="bg-glow-overlay"></div>`);
}

function toggleTheme() {
  const current = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  const target = current === 'dark' ? 'light' : 'dark';
  applyTheme(target);
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    document.getElementById('btn-theme-toggle').innerHTML = '☀️ Modo';
  } else {
    document.body.classList.remove('light-theme');
    document.getElementById('btn-theme-toggle').innerHTML = '🌙 Modo';
  }
  localStorage.setItem('heat-theme', theme);
}

init();
