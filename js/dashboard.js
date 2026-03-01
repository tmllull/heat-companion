// ============================================================
//  HEAT: PEDAL TO THE METAL — COMPANION APP  v2
//  Dashboard Management Functions
// ============================================================

// ---- DASHBOARD RENDER FUNCTIONS ----
function renderDashboard() {
  const champ = state.championship;
  const calendar = champ.calendar;
  const completed = calendar.filter(r => r.status === 'completed');
  const pending   = calendar.filter(r => r.status === 'scheduled');

  document.getElementById('dash-title').textContent = champ.name;
  document.getElementById('dash-subtitle').textContent =
    enrolledPlayers().length > 0
      ? `${enrolledPlayers().length} ${i18n.t('nav.players').toLowerCase()} · ${completed.length} ${i18n.t('dashboard.statRaces').toLowerCase()}`
      : i18n.t('dashboard.subtitle');

  document.getElementById('stat-races-val').textContent   = completed.length;
  document.getElementById('stat-pending-val').textContent  = pending.length;
  document.getElementById('stat-players-val').textContent  = enrolledPlayers().length;

  const standings = getStandings();
  document.getElementById('stat-leader-val').textContent = standings[0]?.player.name || '—';

  // Mini standings (top 5)
  const miniEl = document.getElementById('dash-standings-list');
  if (standings.length === 0) {
    miniEl.innerHTML = `<div style="color:var(--text-dim);font-size:13px;text-align:center;padding:16px">${i18n.t('standings.empty')}</div>`;
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
  const shown = [...completed.slice(-3).reverse(), ...pending.slice(0, 3)];
  if (shown.length === 0) {
    recentEl.innerHTML = `<div style="color:var(--text-dim);font-size:13px;text-align:center;padding:16px">${i18n.t('championship.empty')}</div>`;
  } else {
    recentEl.innerHTML = shown.map(race => {
      const circuit = getCircuitById(race.circuitId);
      const winner  = race.results.find(r => r.position === 1);
      const winnerP = winner ? getPlayerById(winner.playerId) : null;
      const isPending = race.status === 'scheduled';
      return `<div class="recent-race-row" data-cal-race-id="${race.id}">
        <div class="race-flag">${circuit ? (getCountryById(circuit.countryId)?.flag || '🏁') : '🏁'}</div>
        <div class="race-info">
          <div class="race-info-name">${escHtml(getCircuitName(circuit))}</div>
          <div class="race-info-meta">
            <span class="race-info-laps">🏁 ${i18n.t('championship.laps', { n: race.laps || 3 })}</span>
            ${circuit ? `<span class="race-info-spaces">📏 ${i18n.t('championship.spaces', { n: circuit.spaces || 0 })}</span>` : ''}
            ${circuit ? `<span class="race-info-curves">⤵ ${i18n.t('championship.curves', { n: circuit.curves || 0 })}</span>` : ''}
            ${race.mods?.weather ? `<span class="race-info-weather">${window.WEATHER_OPTIONS.find(w => w.id === race.weatherType)?.emoji || '🌧'} ${i18n.t('data.weather.' + race.weatherType + '.name')}</span>` : ''}
          </div>
        </div>
        ${isPending
          ? `<span class="race-status-badge pending">${i18n.t('dashboard.pending').toUpperCase()}</span>`
          : winnerP
            ? `<div class="race-winner"><div class="race-winner-dot" style="background:${winnerP.color}"></div>${escHtml(winnerP.name)}</div>`
            : ''
        }
      </div>`;
    }).join('');
  }
}

// ---- DASHBOARD EVENT LISTENERS ----
function bindDashboardEventListeners() {
  // Dashboard race rows (click to view details)
  document.addEventListener('click', (e) => {
    const recentRow = e.target.closest('.recent-race-row');
    if (recentRow) { 
      openRaceDetailModal(recentRow.dataset.calRaceId); 
      return; 
    }
  });
}

// Initialize dashboard event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', bindDashboardEventListeners);
