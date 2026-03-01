// ============================================================
//  HEAT: PEDAL TO THE METAL — COMPANION APP  v2
//  Championship Management Functions
// ============================================================

// ---- CHAMPIONSHIP RENDER FUNCTIONS ----
function renderChampionship() {
  const champ = state.championship;
  document.getElementById('champ-view-name').textContent = champ.name;
  document.getElementById('champ-view-sub').textContent  =
    `${champ.calendar.length} ${i18n.t('dashboard.statPending').toLowerCase()}`;

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
        const wOpt = window.WEATHER_OPTIONS.find(w => w.id === race.weatherType);
        mods.push(`${wOpt?.emoji || '🌧'} ${i18n.t('data.weather.' + race.weatherType + '.name')}`);
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
        <div class="cal-race-flag">${circuit ? (getCountryById(circuit.countryId)?.flag || '🏁') : '🏁'}</div>
        <div class="cal-race-info">
          <div class="cal-race-name">${escHtml(circuit?.country || getCircuitName(circuit))}</div>
          <div class="cal-race-event" style="font-size: smaller">${escHtml(getRaceEventData(race).name)}</div>
          <div class="cal-race-meta">
            <span>🏁 ${i18n.t('championship.laps', { n: race.laps || 3 })}</span>
            ${race.setup?.sponsors !== undefined ? `<span>📋 ${i18n.t('championship.sponsors')}: ${race.setup.sponsors}</span>` : ''}
            ${race.setup?.press ? `<span>🎥 ${i18n.t('championship.press')}: ${race.setup.press}</span>` : ''}
            ${mods.length ? `<span class="cal-mods">${mods.join(' ')}</span>` : `<span style="color:var(--text-dim)">${i18n.t('championship.empty').includes('Empty') ? 'No modules' : 'Sin módulos'}</span>`}
          </div>
          ${podiumHtml}
        </div>
        <div class="cal-race-actions" data-i18n-ctx="badges">
          ${completed
            ? `<span class="race-status-badge completed"> ${i18n.t('dashboard.completed')} </span>
               <button class="btn-cal-action" data-view-result="${race.id}">Ver</button>`
            : `<span class="race-status-badge pending"> ${i18n.t('dashboard.pending')} </span>
               <button class="btn-cal-action" data-edit-cal-race="${race.id}" title="Editar carrera">✎</button>
               <button class="btn-cal-action primary" data-enter-result="${race.id}">${i18n.t('modals.editResult')}</button>`
          }
          <button class="btn-cal-delete" data-delete-cal-race="${race.id}" title="Eliminar carrera">✕</button>
        </div>
      </div>`;
    }).join('');

    // --- Add Drag & Drop Listeners ---
    addCalendarDragListeners(listEl);
  }
}

// ---- CALENDAR DRAG & DROP ----
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

// ---- CHAMPIONSHIP MODAL FUNCTIONS ----
function openChampModal() {
  const completedRaces = state.championship.calendar.filter(r => r.status === 'completed');
  const hasCompletedRaces = completedRaces.length > 0;
  
  document.getElementById('champ-name-input').value = state.championship.name;
  document.getElementById('champ-points-select').value = state.championship.pointsSystem;
  
  // Bloquear sistema de puntos si hay carreras completadas
  const pointsSelect = document.getElementById('champ-points-select');
  const pointsCustom = document.getElementById('champ-points-custom');
  
  if (hasCompletedRaces) {
    pointsSelect.disabled = true;
    pointsCustom.disabled = true;
    
    // Mostrar mensaje de bloqueo
    let warningMsg = document.getElementById('points-system-warning');
    if (!warningMsg) {
      warningMsg = document.createElement('div');
      warningMsg.id = 'points-system-warning';
      warningMsg.className = 'form-warning';
      warningMsg.innerHTML = `⚠️ <strong>Points system locked</strong><br>The scoring system cannot be changed after the first race.`;
      if (i18n.currentLocale === 'es') {
        warningMsg.innerHTML = `⚠️ <strong>Sistema de puntos bloqueado</strong><br>No se puede cambiar el sistema de puntuación después de disputar la primera carrera.`;
      }
      pointsSelect.parentNode.insertBefore(warningMsg, pointsSelect.nextSibling);
    }
  } else {
    pointsSelect.disabled = false;
    pointsCustom.disabled = false;
    
    // Ocultar mensaje de bloqueo si existe
    const warningMsg = document.getElementById('points-system-warning');
    if (warningMsg) {
      warningMsg.remove();
    }
  }
  
  toggleCustomPoints(state.championship.pointsSystem);
  openModal('modal-champ');
}

function toggleCustomPoints(val) {
  document.getElementById('champ-points-custom').style.display = val === 'custom' ? 'block' : 'none';
}

function saveChampionship() {
  const completedRaces = state.championship.calendar.filter(r => r.status === 'completed');
  const hasCompletedRaces = completedRaces.length > 0;
  
  const name = document.getElementById('champ-name-input').value.trim();
  const pts  = document.getElementById('champ-points-select').value;
  
  if (!name) { showToast('Introduce un nombre para el campeonato', 'error'); return; }
  
  // Si hay carreras completadas, no permitir cambiar el sistema de puntos
  if (hasCompletedRaces && pts !== state.championship.pointsSystem) {
    showToast('No se puede cambiar el sistema de puntos después de disputar carreras', 'error');
    return;
  }

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
  showToast(i18n.t('toast.settingsUpdated'), 'success');
  renderView('dashboard');
  renderView('championship');
}

// ---- SIDEBAR FUNCTIONS ----
function renderSidebarChamp() {
  const nameEl = document.getElementById('sidebar-champ-name');
  if (nameEl) {
    nameEl.textContent = state.championship.name;
  }
}

// ---- RACE RESULTS FUNCTIONS ----
let resultsRaceId    = null;
let resultsOrder     = []; // [{playerId}]
let resultsDragSrcIdx = null;

function openResultsModal(raceId) {
  resultsRaceId = raceId;
  const race    = state.championship.calendar.find(r => r.id === raceId);
  if (!race) return;

  const circuit = getCircuitById(race.circuitId);
  document.getElementById('modal-results-title').textContent =
    `${i18n.t('modals.editResult')} — ${circuit?.flag || ''} ${getCircuitName(circuit)}`;

  // Build starting order: if already has results, use them; else standings order
  if (race.status === 'completed' && race.results.length > 0) {
    resultsOrder = race.results.map(r => ({ playerId: r.playerId, dnf: r.dnf || false }));
    // add any enrolled players not in results
    enrolledPlayers().forEach(p => {
      if (!resultsOrder.find(r => r.playerId === p.id)) resultsOrder.push({ playerId: p.id, dnf: false });
    });
  } else {
    const standing = getStandings();
    const ep = enrolledPlayers();
    // prefer standings order, fallback to enrolled order
    resultsOrder = ep.map(p => ({ playerId: p.id, dnf: false }));
  }

  renderResultsSortable();
  openModal('modal-results');
}

function renderResultsSortable() {
  const list = document.getElementById('results-sortable-list');
  const pts  = getPointsArray(resultsRaceId);

  list.innerHTML = resultsOrder.map((entry, i) => {
    const player = getPlayerById(entry.playerId);
    if (!player) return '';
    const pos   = i + 1;
    const earnedPts = entry.dnf ? 0 : (pts[i] ?? 0);
    return `<div class="result-row" draggable="true" data-player-id="${entry.playerId}" data-idx="${i}">
      <div class="result-pos pos-${pos <= 3 ? pos : ''}">${pos}º</div>
      <div class="result-avatar" style="background:${player.color}">${escHtml(player.icon || initials(player.name))}</div>
      <div class="result-name">${escHtml(player.name)}</div>
      <div class="result-pts-preview" id="rpts-${i}">${earnedPts + ' pts'}</div>
      <div class="result-dnf-container">
        <label class="checkbox-label">
          <input type="checkbox" class="result-dnf-checkbox" data-idx="${i}" ${entry.dnf ? 'checked' : ''}>
          DNF
        </label>
      </div>
      <div class="result-move-btns">
        <button class="result-move-btn" data-move="up" data-idx="${i}">▲</button>
        <button class="result-move-btn" data-move="down" data-idx="${i}">▼</button>
      </div>
    </div>`;
  }).join('');

  setupResultsDragDrop('results-sortable-list', resultsOrder, () => renderResultsSortable());

  // Add DNF checkbox event listeners
  list.querySelectorAll('.result-dnf-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const idx = parseInt(checkbox.dataset.idx);
      resultsOrder[idx].dnf = checkbox.checked;
      // Update points preview
      const ptsPreview = document.getElementById(`rpts-${idx}`);
      const earnedPts = checkbox.checked ? 0 : (getPointsArray(resultsRaceId)[idx] ?? 0);
      ptsPreview.textContent = earnedPts + ' pts';
      ptsPreview.style.color = checkbox.checked ? 'var(--text-dim)' : '';
    });
  });

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

function saveResults() {
  const race = state.championship.calendar.find(r => r.id === resultsRaceId);
  if (!race) return;

  // Validar que haya participantes
  if (!resultsOrder || resultsOrder.length === 0) {
    showToast('Debe añadir al menos un participante para guardar los resultados', 'error');
    return;
  }

  race.results = resultsOrder.map((entry, i) => ({
    playerId: entry.playerId,
    position: i + 1,
    dnf: entry.dnf || false
  }));
  race.status = 'completed';

  saveState();
  closeModal('modal-results');
  renderView('championship');
  renderView('dashboard');
  showToast(i18n.t('toast.settingsUpdated'), 'success');
}

// ---- CHAMPIONSHIP EVENT LISTENERS ----
function bindChampionshipEventListeners() {
  // Championship config button
  document.addEventListener('click', (e) => {
    if (e.target.closest('#btn-edit-champ') || e.target.closest('#btn-champ-settings-inline')) { 
      openChampModal(); 
      return; 
    }
  });

  // Championship points select
  const pointsSelect = document.getElementById('champ-points-select');
  if (pointsSelect) {
    pointsSelect.addEventListener('change', e => toggleCustomPoints(e.target.value));
  }

  // Save championship button
  const saveChampBtn = document.getElementById('btn-save-champ');
  if (saveChampBtn) {
    saveChampBtn.addEventListener('click', saveChampionship);
  }

  // Save results button
  const saveResultsBtn = document.getElementById('btn-save-results');
  if (saveResultsBtn) {
    saveResultsBtn.addEventListener('click', saveResults);
  }

  // Edit result button
  const editResultBtn = document.getElementById('btn-edit-result');
  if (editResultBtn) {
    editResultBtn.addEventListener('click', function () {
      const raceId = this.dataset.raceId;
      closeModal('modal-race-detail');
      openResultsModal(raceId);
    });
  }

  // Calendar race actions (delegated)
  document.addEventListener('click', (e) => {
    // Move up race
    const moveUpBtn = e.target.closest('[data-move-up]');
    if (moveUpBtn) {
      const raceId = moveUpBtn.dataset.moveUp;
      const idx = state.championship.calendar.findIndex(r => r.id === raceId);
      if (idx > 0) {
        [state.championship.calendar[idx - 1], state.championship.calendar[idx]] = 
        [state.championship.calendar[idx], state.championship.calendar[idx - 1]];
        saveState();
        renderChampionship();
      }
      return;
    }

    // Move down race
    const moveDownBtn = e.target.closest('[data-move-down]');
    if (moveDownBtn) {
      const raceId = moveDownBtn.dataset.moveDown;
      const idx = state.championship.calendar.findIndex(r => r.id === raceId);
      if (idx < state.championship.calendar.length - 1) {
        [state.championship.calendar[idx], state.championship.calendar[idx + 1]] = 
        [state.championship.calendar[idx + 1], state.championship.calendar[idx]];
        saveState();
        renderChampionship();
      }
      return;
    }

    // Delete calendar race
    const deleteCalRaceBtn = e.target.closest('[data-delete-cal-race]');
    if (deleteCalRaceBtn) {
      const raceId = deleteCalRaceBtn.dataset.deleteCalRace;
      const race = state.championship.calendar.find(r => r.id === raceId);
      if (!confirm(`${i18n.t('championship.deleteConfirm')}\n\n${getCircuitName(getCircuitById(race.circuitId))}`)) return;
      state.championship.calendar = state.championship.calendar.filter(r => r.id !== raceId);
      saveState();
      renderChampionship();
      renderView('dashboard');
      showToast(i18n.t('nav.reset'), 'info');
      return;
    }

    // View race result
    const viewResultBtn = e.target.closest('[data-view-result]');
    if (viewResultBtn) {
      openRaceDetailModal(viewResultBtn.dataset.viewResult);
      return;
    }

    // Edit calendar race
    const editCalRaceBtn = e.target.closest('[data-edit-cal-race]');
    if (editCalRaceBtn) {
      openAddRaceModal(editCalRaceBtn.dataset.editCalRace);
      return;
    }

    // Enter race result
    const enterResultBtn = e.target.closest('[data-enter-result]');
    if (enterResultBtn) {
      openResultsModal(enterResultBtn.dataset.enterResult);
      return;
    }
  });
}

// Initialize championship event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', bindChampionshipEventListeners);
