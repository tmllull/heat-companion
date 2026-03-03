// ============================================================
//  HEAT: PEDAL TO THE METAL — COMPANION APP  v2
//  System Management Functions (Reset, Export, Import, Templates)
// ============================================================

// ---- RESET FUNCTIONS ----
function resetSection(section) {
  const msg = i18n.t(`system.resetConfirm.${section}`);
  if (!msg || !confirm(msg)) return;
  switch (section) {
    case 'calendar':
      state.championship.calendar = [];
      renderView('dashboard'); renderView('championship'); renderView('standings');
      showToast(i18n.t('system.resetSuccess'), 'info'); 
      closeModal('modal-reset');
      break;
    case 'players':
      state.players = [];
      state.championship.playerIds = [];
      state.championship.calendar = [];
      renderView('dashboard'); renderView('championship'); renderView('players'); renderView('standings');
      showToast(i18n.t('system.resetSuccess'), 'info'); 
      closeModal('modal-reset');
      break;
    case 'all':
      state = defaultState();
      renderSidebarChamp(); navigateTo('dashboard');
      showToast(i18n.t('system.resetSuccess') + ' 🏁', 'info'); 
      closeModal('modal-reset');
      break;
  }
  saveState();
}

function resetChampionship() {
  if (!confirm(i18n.t('system.resetConfirm.calendar'))) return;
  
  // Guardar los pilotos actuales
  const currentPlayers = state.players;
  
  // Resetear solo el campeonato
  state.championship = defaultState().championship;
  
  // Restaurar los pilotos
  state.players = currentPlayers;
  
  saveState();
  renderSidebarChamp();
  renderView('championship');
  renderView('dashboard');
  showToast(i18n.t('system.resetSuccess'), 'info');
}

// ---- EXPORT / IMPORT FUNCTIONS ----
function exportData(section = 'all') {
  let payload;
  let filename;
  
  switch (section) {
    case 'players':
      payload = { players: state.players };
      filename = 'heat-pilotos.json';
      break;
    case 'races':
      payload = { championship: { calendar: state.championship.calendar } };
      filename = 'heat-carreras.json';
      break;
    case 'championship':
      payload = { 
        championship: { 
          name: state.championship.name,
          pointsSystem: state.championship.pointsSystem,
          customPoints: state.championship.customPoints
        }
      };
      filename = 'heat-campeonato.json';
      break;
    case 'all':
    default:
      payload = state;
      filename = 'heat-companion-backup.json';
      break;
  }
  
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast(i18n.t('system.exportSuccess'), 'success');
}

function importData(file, section = 'all') {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.championship && !data.players && !data.calendar && !data.races) {
        showToast('El archivo no parece ser de HEAT Companion', 'error');
        return;
      }
      
      const importFunction = () => {
        switch (section) {
          case 'players':
            if (data.players) {
              state.players = data.players;
              state.championship.playerIds = data.players.map(p => p.id);
            }
            break;
          case 'races':
            if (data.championship?.calendar || data.calendar || data.races) {
              state.championship.calendar = data.championship?.calendar || data.calendar || data.races || [];
            }
            break;
          case 'championship':
            if (data.championship) {
              state.championship = { ...state.championship, ...data.championship };
            }
            break;
          case 'all':
          default:
            state = data;
            break;
        }
      };
      
      if (confirm(i18n.t(`system.importConfirm.${section}`))) {
        // Ejecutar la importación
        importFunction();
        saveState();
        renderSidebarChamp();
        navigateTo('dashboard');
        showToast(i18n.t('system.importSuccess'), 'success');
      };
    } catch (err) {
      showToast('Error al leer el archivo', 'error');
      console.error(err);
    }
  };
  reader.readAsText(file);
}

// ---- CHAMPIONSHIP TEMPLATES ----
function openChampTemplatesModal() {
  const grid = document.getElementById('templates-grid');
  
  // Remover event listeners anteriores clonando el elemento
  const newGrid = grid.cloneNode(true);
  grid.parentNode.replaceChild(newGrid, grid);
  
  newGrid.innerHTML = window.CHAMPIONSHIP_TEMPLATES.map(t => {
    const circuitNames = t.races.map(r => {
      const circuit = getCircuitById(r.circuitId);
      if (!circuit) return `Circuit ${r.circuitId}`;
      const country = getCountryById(circuit.countryId);
      const flag = country ? country.flag + ' ' : '';
      return flag + getCircuitName(circuit);
    });
    
    let badgeHtml = '';
    if (t.expansion) {
      const expansionKey = t.expansion === 'Lluvia Torrencial' ? 'heavyRain' : 
                           t.expansion === 'Visión de Túnel' ? 'tunnelVision' : 
                           t.expansion === 'Terreno Inestable' ? 'rockyRoads' :
                           t.expansion.toLowerCase();
      
      let badgeClass;
      if (t.expansion === 'Lluvia Torrencial') {
        badgeClass = 'lluvia-torrencial';
      } else if (t.expansion === 'Visión de Túnel') {
        badgeClass = 'vision-de-tunel';
      } else if (t.expansion === 'Terreno Inestable') {
        badgeClass = 'terreno-inestable';
      } else {
        badgeClass = expansionKey.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
      }
      badgeHtml = `<div class="diff-badge ${badgeClass}" style="margin-bottom: 8px; width: fit-content; margin-left: 0;">${i18n.t('data.expansions.' + expansionKey)}</div>`;
    }
    
    return `<div class="template-card" data-template-id="${t.id}">
      <h3>${i18n.t('modals.championshipTemplates.championships.' + t.id)}</h3>
      ${badgeHtml}
      <div class="template-race-mini-list">${i18n.t('modals.championshipTemplates.races', { n: t.races.length })}: ${circuitNames.join(' · ')}</div>
      <div class="template-card-footer">${i18n.t('modals.championshipTemplates.loadChampionship')}</div>
    </div>`;
  }).join('');

  // Add click listeners for load buttons (solo una vez)
  newGrid.addEventListener('click', e => {
    const card = e.target.closest('.template-card');
    if (!card) return;
    const templateId = card.dataset.templateId;
    const t = window.CHAMPIONSHIP_TEMPLATES.find(template => template.id === templateId);
    if (!t) return;
    
    // Solo mostrar confirmación si ya hay carreras programadas
    const hasExistingRaces = state.championship.calendar && state.championship.calendar.length > 0;
    
    if (hasExistingRaces) {
      // Si hay carreras existentes, pedir confirmación con advertencia
      if (!confirm(`¿Cargar plantilla "${t.name}" (${t.year})?\n\nReemplazará el calendario actual.`)) return;
    }
    // Si no hay carreras existentes, cargar directamente sin confirmación
    
    // Convert template races to calendar format
    state.championship.calendar = t.races.map(r => ({
      id: uid(),
      circuitId: r.circuitId,
      eventId: r.eventId || null,
      event: r.event || '',
      rules: r.rules || '',
      laps: r.laps || 3,
      mods: r.mods || { garage: true, weather: false, sponsors: false },
      weatherType: r.weatherType || 'sun',
      sponsorCards: r.sponsorCards || 0,
      setup: r.setup || {},
      status: 'scheduled',
      results: []
    }));

    saveState();
    closeModal('modal-champ-templates');
    renderSidebarChamp();
    renderChampionship();
    showToast(`${t.name} cargado correctamente ✓`, 'success');
  });

  openModal('modal-champ-templates');
}

// ---- SYSTEM EVENT LISTENERS ----
function bindSystemEventListeners() {
  // Reset section buttons
  document.addEventListener('click', (e) => {
    const resetBtn = e.target.closest('.btn-reset-section');
    if (resetBtn) { 
      resetSection(resetBtn.dataset.section); 
      return; 
    }
  });

  // Export section buttons
  document.addEventListener('click', (e) => {
    const exportBtn = e.target.closest('.btn-export-section');
    if (exportBtn) { 
      exportData(exportBtn.dataset.section); 
      return; 
    }
  });

  // Import section buttons
  document.addEventListener('click', (e) => {
    const importBtn = e.target.closest('.btn-import-section');
    if (importBtn) { 
      const section = importBtn.dataset.section;
      // Crear un input file temporal para esta sección
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => importData(e.target.files[0], section);
      input.click();
      return; 
    }
  });

  // Show championship templates
  document.addEventListener('click', (e) => {
    if (e.target.closest('#btn-show-champ-templates')) { 
      openChampTemplatesModal(); 
      return; 
    }
  });

  // Reset championship
  document.addEventListener('click', (e) => {
    if (e.target.closest('#btn-reset-championship')) { 
      resetChampionship(); 
      return; 
    }
  });
}

// Initialize system event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', bindSystemEventListeners);
