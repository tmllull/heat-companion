// ============================================================
//  HEAT: PEDAL TO THE METAL — COMPANION APP  v2
//  System Management Functions (Reset, Export, Import, Templates)
// ============================================================

// ---- RESET FUNCTIONS ----
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
      showToast('Configuración del campeonato reseteada', 'info'); 
      closeModal('modal-reset');
      break;
    case 'calendar':
      state.championship.calendar = [];
      renderView('dashboard'); renderView('championship'); renderView('standings');
      showToast('Calendario eliminado', 'info'); 
      closeModal('modal-reset');
      break;
    case 'players':
      state.players = [];
      state.championship.playerIds = [];
      state.championship.calendar = [];
      renderView('dashboard'); renderView('championship'); renderView('players'); renderView('standings');
      showToast('Pilotos y calendario eliminados', 'info'); 
      closeModal('modal-reset');
      break;
    case 'all':
      state = defaultState();
      renderSidebarChamp(); navigateTo('dashboard');
      showToast('Reset global completado 🏁', 'info'); 
      closeModal('modal-reset');
      break;
  }
  saveState();
}

function resetChampionship() {
  if (!confirm('¿Resetear el campeonato actual?\n\nSe borrará el calendario y resultados, pero los pilotos se conservarán.')) return;
  
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
  showToast('Campeonato reseteado. Los pilotos se han conservado.', 'info');
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
  
  showToast(`Datos ${section === 'all' ? 'completos' : `de ${section}`} exportados correctamente`, 'success');
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
      
      // Confirmación específica para cada sección
      const confirmMessages = {
        'players': '¿Importar pilotos? Reemplazará todos los pilotos actuales.',
        'races': '¿Importar carreras? Reemplazará todo el calendario actual.',
        'championship': '¿Importar configuración del campeonato? Reemplazará nombre y sistema de puntos.',
        'all': '⚠ ¿Importar todos los datos? Reemplazará TODO el estado actual de la aplicación.'
      };
      
      if (confirm(confirmMessages[section] || confirmMessages['all'])) {
        // Ejecutar la importación
        importFunction();
        saveState();
        renderSidebarChamp();
        navigateTo('dashboard');
        showToast(`Datos de ${section === 'all' ? 'campeonato completo' : section} importados ✓`, 'success');
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
  console.log('openChampTemplatesModal called');
  console.log('CHAMPIONSHIP_TEMPLATES:', window.CHAMPIONSHIP_TEMPLATES);
  console.log('CIRCUITS available:', window.CIRCUITS);
  
  const grid = document.getElementById('templates-grid');
  
  // Remover event listeners anteriores clonando el elemento
  const newGrid = grid.cloneNode(true);
  grid.parentNode.replaceChild(newGrid, grid);
  
  newGrid.innerHTML = window.CHAMPIONSHIP_TEMPLATES.map(t => {
    console.log('Processing template:', t);
    const circuitNames = t.races.map(r => {
      console.log('Processing race with circuitId:', r.circuitId);
      const circuit = getCircuitById(r.circuitId);
      console.log('Found circuit:', circuit);
      
      // Manejar diferentes casos para obtener el nombre del circuito
      let circuitName = `Circuit ${r.circuitId}`;
      if (circuit) {
        if (circuit.name && circuit.name.trim()) {
          circuitName = circuit.name;
        } else {
          // Si el nombre está vacío, usar el país
          const country = getCountryById(circuit.countryId);
          circuitName = country ? country.name : `Circuit ${r.circuitId}`;
        }
      }
      
      console.log('Final circuit name:', circuitName);
      return circuitName;
    });
    console.log('Circuit names for template:', circuitNames);
    
    return `<div class="template-card" data-template-id="${t.id}">
      <h3>${escHtml(t.name)}</h3>
      <div class="template-race-mini-list">${t.races.length} carreras: ${circuitNames.join(' · ')}</div>
      <div class="template-card-footer">Cargar campeonato →</div>
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
