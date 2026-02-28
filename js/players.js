// ============================================================
//  HEAT: PEDAL TO THE METAL — COMPANION APP  v2
//  Player Management Functions
// ============================================================

// ---- PLAYER STATE ----
let editingPlayerId    = null;
let selectedPlayerColor = '#e63b2e';

// ---- PLAYER HELPERS ----
function getPlayerById(id) { 
  return state.players.find(p => p.id === id); 
}

function enrolledPlayers() {
  // CAMBIO: Ahora todos los pilotos existentes participan automáticamente en el campeonato
  // return state.championship.playerIds
  //   .map(id => getPlayerById(id))
  //   .filter(Boolean);
  return state.players;
}

function initials(name) {
  return (name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ---- PLAYER MODAL FUNCTIONS ----
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

  // Actualizar opciones de color para mostrar los usados
  updateColorOptions();
  updateIconValidation(); // Validar estado inicial

  // DESHABILITADO TEMPORALMENTE: Construir UI de mejoras
  // buildPlayerUpgradesUI(currentUpgrades);
  openModal('modal-player');
  setTimeout(() => nameInput.focus(), 100);
}

function updateColorOptions() {
  const usedColors = state.players
    .filter(p => p.id !== editingPlayerId) // Excluir el piloto que se está editando
    .map(p => p.color);
  
  document.querySelectorAll('.color-option').forEach(el => {
    const color = el.dataset.color;
    const isUsed = usedColors.includes(color);
    
    // Quitar o añadir clases según el estado
    el.classList.toggle('color-used', isUsed);
    el.classList.toggle('color-disabled', isUsed && editingPlayerId === null); // Solo deshabilitar al crear nuevo
    
    // Aplicar estilos para colores bloqueados
    if (isUsed && editingPlayerId === null) {
      // Color bloqueado para nuevo piloto
      el.style.opacity = '0.4';
      el.style.cursor = 'not-allowed';
      el.style.filter = 'grayscale(50%)';
      el.title = `Color ya usado por ${state.players.find(p => p.color === color)?.name}`;
    } else if (isUsed && editingPlayerId !== null && color !== selectedPlayerColor) {
      // Color bloqueado para edición (pero no es el color actual)
      el.style.opacity = '0.6';
      el.style.cursor = 'not-allowed';
      el.style.filter = 'grayscale(30%)';
      el.title = `Color ya usado por ${state.players.find(p => p.color === color)?.name}`;
    } else {
      // Color disponible
      el.style.opacity = '1';
      el.style.cursor = 'pointer';
      el.style.filter = 'none';
      el.title = '';
    }
  });
  
  // Si estamos creando un nuevo piloto y el color seleccionado está bloqueado, 
  // seleccionar automáticamente el siguiente color disponible
  if (editingPlayerId === null && usedColors.includes(selectedPlayerColor)) {
    selectNextAvailableColor();
  }
}

function selectNextAvailableColor() {
  const usedColors = state.players.map(p => p.color);
  const availableColors = Array.from(document.querySelectorAll('.color-option'))
    .filter(el => !usedColors.includes(el.dataset.color))
    .map(el => el.dataset.color);
  
  if (availableColors.length > 0) {
    selectedPlayerColor = availableColors[0];
    // Actualizar la UI para mostrar el nuevo color seleccionado
    document.querySelectorAll('.color-option').forEach(el =>
      el.classList.toggle('selected', el.dataset.color === selectedPlayerColor)
    );
  }
}

function updateIconValidation() {
  const usedIcons = state.players
    .filter(p => p.id !== editingPlayerId) // Excluir el piloto que se está editando
    .map(p => p.icon);
  
  const iconInput = document.getElementById('player-icon-input');
  const currentValue = iconInput.value.trim();
  const isDuplicate = usedIcons.includes(currentValue) && currentValue !== '';
  
  // Actualizar mensaje de validación
  const validationMsg = document.getElementById('icon-validation-msg');
  if (validationMsg) {
    if (isDuplicate) {
      validationMsg.textContent = `El número ${currentValue} ya está en uso`;
      validationMsg.style.color = 'red';
    } else if (currentValue && !/^\d+$/.test(currentValue)) {
      validationMsg.textContent = 'El número solo puede contener dígitos';
      validationMsg.style.color = 'red';
    } else {
      validationMsg.textContent = ''; // Eliminar mensaje verde de "Número disponible"
    }
  }
}

function updateNameValidation() {
  const nameInput = document.getElementById('player-name-input');
  const currentValue = nameInput.value.trim();
  const validationMsg = document.getElementById('name-validation-msg');
  
  if (validationMsg) {
    if (!currentValue) {
      validationMsg.textContent = 'El nombre del piloto es obligatorio';
      validationMsg.style.color = 'red';
    } else if (currentValue.length < 2) {
      validationMsg.textContent = 'El nombre debe tener al menos 2 caracteres';
      validationMsg.style.color = 'red';
    } else {
      validationMsg.textContent = ''; // Sin mensaje si es válido
    }
  }
}

function validatePlayerForm() {
  const name = document.getElementById('player-name-input').value.trim();
  const icon = document.getElementById('player-icon-input').value.trim();
  const nameValidationMsg = document.getElementById('name-validation-msg');
  const iconValidationMsg = document.getElementById('icon-validation-msg');
  
  let isValid = true;
  
  // Validar nombre
  if (!name) {
    if (nameValidationMsg) {
      nameValidationMsg.textContent = 'El nombre del piloto es obligatorio';
      nameValidationMsg.style.color = 'red';
    }
    isValid = false;
  } else if (name.length < 2) {
    if (nameValidationMsg) {
      nameValidationMsg.textContent = 'El nombre debe tener al menos 2 caracteres';
      nameValidationMsg.style.color = 'red';
    }
    isValid = false;
  } else {
    if (nameValidationMsg) nameValidationMsg.textContent = '';
  }
  
  // Validar número
  if (!icon) {
    if (iconValidationMsg) {
      iconValidationMsg.textContent = 'El número del piloto es obligatorio';
      iconValidationMsg.style.color = 'red';
    }
    isValid = false;
  } else if (!/^\d+$/.test(icon)) {
    if (iconValidationMsg) {
      iconValidationMsg.textContent = 'El número solo puede contener dígitos';
      iconValidationMsg.style.color = 'red';
    }
    isValid = false;
  } else {
    const iconConflict = state.players.find(p => p.icon === icon && p.id !== editingPlayerId);
    if (iconConflict) {
      if (iconValidationMsg) {
        iconValidationMsg.textContent = `El número ya lo usa ${iconConflict.name}`;
        iconValidationMsg.style.color = 'red';
      }
      isValid = false;
    } else {
      if (iconValidationMsg) iconValidationMsg.textContent = '';
    }
  }
  
  // Validar color
  const colorConflict = state.players.find(p => p.color === selectedPlayerColor && p.id !== editingPlayerId);
  if (colorConflict) {
    showToast(`El color ya lo usa ${colorConflict.name}`, 'error');
    isValid = false;
  }
  
  return isValid;
}

function savePlayer() {
  // Usar la nueva función de validación
  if (!validatePlayerForm()) {
    return; // Los mensajes de error ya se muestran en el modal
  }

  const name = document.getElementById('player-name-input').value.trim();
  const icon = document.getElementById('player-icon-input').value.trim();

  // DESHABILITADO TEMPORALMENTE: Guardar mejoras
  // const upgrades = [...document.querySelectorAll('#player-upgrades-container .upgrade-chip.selected')]
  //   .map(el => el.dataset.upgradeId);
  // const upgrades = []; // Mantener vacío para no perder datos existentes

  if (editingPlayerId) {
    // Editar piloto existente
    const player = getPlayerById(editingPlayerId);
    player.name = name;
    player.icon = icon;
    player.color = selectedPlayerColor;
    player.isLegend = document.getElementById('player-is-legend').checked;
    // player.upgrades = upgrades;
    showToast('Piloto actualizado ✓', 'success');
  } else {
    // Añadir nuevo piloto
    const newPlayer = {
      id: uid(),
      name,
      icon,
      color: selectedPlayerColor,
      isLegend: document.getElementById('player-is-legend').checked,
      upgrades: [] // upgrades
    };
    state.players.push(newPlayer);
    // Añadir automáticamente al campeonato
    if (!state.championship.playerIds.includes(newPlayer.id)) {
      state.championship.playerIds.push(newPlayer.id);
    }
    showToast('Piloto añadido ✓', 'success');
  }

  saveState();
  closeModal('modal-player');
  renderView('players');
  renderView('championship');
  renderView('standings');
  renderView('dashboard');
}

function deletePlayer(playerId) {
  const p = getPlayerById(playerId);
  if (!confirm(`¿Eliminar a ${p.name}? Sus resultados en carreras se conservarán pero sin nombre.`)) return;
  state.players = state.players.filter(x => x.id !== playerId);
  saveState();
  renderView('players');
  renderView('championship');
  showToast('Piloto eliminado', 'info');
}

// ---- PLAYER RENDER FUNCTIONS ----
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
      .reduce((sum, r) => { const res = r.results.find(x => x.playerId === p.id); return sum + (res ? (res.dnf ? 0 : getPoints(res.position, r.id)) : 0); }, 0);

    // DESHABILITADO TEMPORALMENTE: Visualización de mejoras
    // const upgBadges = (p.upgrades || []).map(uid => {
    //   const u = getUpgradeById(uid);
    //   return u ? `<span class="player-upg-badge ${u.category === 'Patrocinio' ? 'sponsor' : ''}" title="${u.description}">${u.emoji} ${u.name}</span>` : '';
    // }).join('');

    return `<div class="player-card" style="--player-color:${p.color}">
      <div class="player-avatar" style="background:${p.color}">${escHtml(p.icon || initials(p.name))}</div>
      <div class="player-name">
        ${escHtml(p.name)}
        ${p.isLegend ? '<span class="legend-badge">🤖</span>' : ''}
      </div>
      <div class="player-stats">${points} pts</div>
      <!-- DESHABILITADO TEMPORALMENTE: Visualización de mejoras -->
      <div class="player-card-actions">
        <button class="btn-icon btn-icon-edit" data-edit-player="${p.id}">✎ Editar</button>
        <button class="btn-icon btn-icon-del" data-del-player="${p.id}">🗑</button>
      </div>
    </div>`;
  }).filter(Boolean).join('');
}

// ---- PLAYER EVENT LISTENERS ----
function bindPlayerEventListeners() {
  // Color picker
  document.querySelectorAll('.color-option').forEach(el => {
    el.addEventListener('click', () => {
      const color = el.dataset.color;
      const colorConflict = state.players.find(p => p.color === color && p.id !== editingPlayerId);
      
      if (colorConflict) {
        showToast(`El color ya lo usa ${colorConflict.name}`, 'error');
        return; // No permitir seleccionar el color
      }
      
      selectedPlayerColor = color;
      document.querySelectorAll('.color-option').forEach(opt => 
        opt.classList.toggle('selected', opt.dataset.color === color)
      );
    });
  });

  // Name input validation
  const nameInput = document.getElementById('player-name-input');
  if (nameInput) {
    nameInput.addEventListener('input', updateNameValidation);
  }

  // Icon input validation
  const iconInput = document.getElementById('player-icon-input');
  if (iconInput) {
    iconInput.addEventListener('input', updateIconValidation);
  }

  // Save player button
  const saveBtn = document.getElementById('btn-save-player');
  if (saveBtn) {
    saveBtn.addEventListener('click', savePlayer);
  }

  // Add player button
  const addBtn = document.getElementById('btn-add-player');
  if (addBtn) {
    addBtn.addEventListener('click', () => openPlayerModal());
  }

  // Edit player buttons (delegated)
  document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit-player]');
    if (editBtn) { 
      openPlayerModal(editBtn.dataset.editPlayer); 
      return; 
    }
  });

  // Delete player buttons (delegated)
  document.addEventListener('click', (e) => {
    const delBtn = e.target.closest('[data-del-player]');
    if (delBtn) { 
      deletePlayer(delBtn.dataset.delPlayer); 
      return; 
    }
  });
}

// ---- STANDINGS FUNCTIONS (related to players) ----
function getStandings() {
  const completedRaces = state.championship.calendar.filter(r => r.status === 'completed');
  const hasCompletedRaces = completedRaces.length > 0;
  
  return enrolledPlayers()
    .map(p => {
      const points = completedRaces.reduce((sum, r) => {
        const res = r.results.find(x => x.playerId === p.id);
        return sum + (res ? (res.dnf ? 0 : getPoints(res.position, r.id)) : 0);
      }, 0);
      const wins   = completedRaces.filter(r => { const res = r.results.find(x => x.playerId === p.id); return res && res.position === 1 && !res.dnf; }).length;
      const podiums = completedRaces.filter(r => { const res = r.results.find(x => x.playerId === p.id); return res && res.position <= 3 && !res.dnf; }).length;
      const racesParticipated = completedRaces.filter(r => r.results.some(x => x.playerId === p.id)).length;
      return { player: p, points, wins, podiums, races: racesParticipated };
    })
    .filter(s => hasCompletedRaces ? s.points > 0 : true) // Si no hay carreras, mostrar todos; si hay, solo los con puntos
    .sort((a, b) => {
      if (hasCompletedRaces) {
        // Ordenar por puntos (descendente) si hay carreras disputadas
        return b.points - a.points;
      } else {
        // Ordenar alfabéticamente si no hay carreras disputadas
        return a.player.name.localeCompare(b.player.name);
      }
    });
}

// Initialize player event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', bindPlayerEventListeners);
