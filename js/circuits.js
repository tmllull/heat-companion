// ============================================================
//  HEAT: PEDAL TO THE METAL — COMPANION APP  v2
//  Circuit Management Functions
// ============================================================

// ---- CIRCUIT STATE ----
let editingCircuitId = null;

// ---- CIRCUIT RENDER FUNCTIONS ----
function renderCircuits() {
  const grid = document.getElementById('circuits-grid');
  const empty = document.getElementById('circuits-empty');

  // Combinar circuitos oficiales con personalizados
  const allCircuits = [...(window.CIRCUITS || []), ...(state.circuits || [])];

  if (allCircuits.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  // Separar circuitos en originales y fanmade
  const originalCircuits = allCircuits.filter(c => 
    ['Base', 'Lluvia Torrencial', 'Visión de Túnel'].includes(c.expansion)
  );
  const fanmadeCircuits = allCircuits.filter(c => 
    !['Base', 'Lluvia Torrencial', 'Visión de Túnel'].includes(c.expansion)
  );

  let html = '<div class="circuits-sections-container">';

  // Sección de circuitos originales
  if (originalCircuits.length > 0) {
    html += `
      <div class="section-card collapsible collapsed" id="original-circuits-section">
        <div class="section-header" onclick="toggleSection(this)">
          <h2>🏁 Circuitos Originales</h2>
          <span class="section-toggle">▼</span>
        </div>
        <div class="section-content">
          <div class="circuits-grid">
            ${originalCircuits.map(c => renderCircuitCard(c)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // Sección de circuitos fanmade
  if (fanmadeCircuits.length > 0) {
    html += `
      <div class="section-card collapsible collapsed" id="fanmade-circuits-section">
        <div class="section-header" onclick="toggleSection(this)">
          <h2>📐 Circuitos Fanmade</h2>
          <span class="section-toggle">▼</span>
        </div>
        <div class="section-content">
          <div class="circuits-grid">
            ${fanmadeCircuits.map(c => renderCircuitCard(c)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  html += '</div>';

  grid.innerHTML = html;
}

function renderCircuitCard(c) {
  const country = getCountryById(c.countryId);
  
  // Determinar si el circuito pertenece a una expansión oficial (incluye fanmade)
  const isOfficialExpansion = ['Base', 'Lluvia Torrencial', 'Visión de Túnel', 'Fanmade'].includes(c.expansion);
  const canEdit = !isOfficialExpansion;
  
  // Determinar el badge y su clase
  let badgeHtml = '';
  if (c.expansion) {
    const badgeClass = c.expansion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
    badgeHtml = `<div class="diff-badge ${badgeClass}">${escHtml(c.expansion)}</div>`;
  }
  
  return `<div class="circuit-card" data-circuit-id="${c.id}">
    ${canEdit ? `
      <div class="circuit-card-actions-left">
        <button class="btn-icon btn-icon-edit" data-edit-circuit="${c.id}">✎</button>
      </div>
    ` : ''}
    <div class="circuit-flag">${country ? country.flag : '🏁'}</div>
    ${canEdit ? `
      <div class="circuit-card-actions-right">
        <button class="btn-icon btn-icon-del" data-del-circuit="${c.id}">🗑</button>
      </div>
    ` : ''}
    <div class="circuit-country">${country ? escHtml(country.name) : ''}</div>
    <div class="circuit-name">${escHtml(c.name) || '---'}</div>
    ${badgeHtml}
    <div class="circuit-details">
      ${c.spaces ? `<div>📏 ${c.spaces} espacios</div>` : ''}
      ${c.curves ? `<div>⤴️ ${c.curves} curvas</div>` : ''}
      ${c.laps ? `<div>🏁 ${c.laps} vueltas</div>` : ''}
    </div>
  </div>`;
}

// ---- CIRCUIT MODAL FUNCTIONS ----
function openCircuitModal(circuitId = null) {
  editingCircuitId = circuitId;
  const nameInput = document.getElementById('circuit-name-input');
  const countrySelect = document.getElementById('circuit-country-select');
  const descriptionInput = document.getElementById('circuit-description-input');
  const spacesInput = document.getElementById('circuit-spaces-input');
  const curvesInput = document.getElementById('circuit-curves-input');
  const lapsInput = document.getElementById('circuit-laps-input');

  // Populate country options
  countrySelect.innerHTML = '<option value="">Selecciona un país...</option>' + 
    COUNTRIES.map(c => `<option value="${c.id}">${c.flag} ${c.name}</option>`).join('');

  if (circuitId) {
    // Buscar en circuitos oficiales y personalizados
    const circuit = [...(window.CIRCUITS || []), ...(state.circuits || [])].find(c => c.id === circuitId);
    const country = getCountryById(circuit.countryId);
    document.getElementById('modal-circuit-title').textContent = 'Editar circuito';
    nameInput.value = circuit.name || '';
    countrySelect.value = circuit.countryId || '';
    descriptionInput.value = circuit.description || '';
    spacesInput.value = circuit.spaces || '';
    curvesInput.value = circuit.curves || '';
    lapsInput.value = circuit.laps || '';
  } else {
    document.getElementById('modal-circuit-title').textContent = 'Añadir circuito';
    nameInput.value = '';
    countrySelect.value = '';
    descriptionInput.value = '';
    spacesInput.value = '';
    curvesInput.value = '';
    lapsInput.value = '';
  }

  openModal('modal-circuit');
  setTimeout(() => nameInput.focus(), 100);
}

function openCircuitMapModal(circuitId) {
  // Buscar en circuitos oficiales y personalizados
  const circuit = [...(window.CIRCUITS || []), ...(state.circuits || [])].find(c => c.id === circuitId);
  if (!circuit) return;

  const country = getCountryById(circuit.countryId);
  const circuitName = circuit.name || country?.name || circuit.id;
  
  // Actualizar título del modal
  document.getElementById('modal-circuit-map-title').textContent = `Mapa: ${circuitName}`;
  
  // Construir ruta de la imagen
  const imagePath = circuit.mapImage ? `files/circuits/${circuit.mapImage}` : '';
  const mapImage = document.getElementById('circuit-map-image');
  const mapError = document.getElementById('circuit-map-error');
  
  if (imagePath) {
    // Ocultar imagen temporalmente y limpiar la anterior
    mapImage.style.display = 'none';
    mapError.style.display = 'none';
    
    // Cargar nueva imagen
    mapImage.src = imagePath;
    
    // Mostrar la imagen cuando se cargue correctamente
    mapImage.onload = function() {
      mapImage.style.display = 'block';
      mapError.style.display = 'none';
    };
    
    // Manejar errores de carga
    mapImage.onerror = function() {
      mapImage.style.display = 'none';
      mapError.style.display = 'block';
      mapError.textContent = 'No existe mapa para este circuito.';
    };
  } else {
    // No hay imagen definida
    mapImage.style.display = 'none';
    mapError.style.display = 'block';
    mapError.textContent = 'No existe mapa para este circuito.';
  }
  
  openModal('modal-circuit-map');
}

function saveCircuit() {
  const name = document.getElementById('circuit-name-input').value.trim();
  const countryId = document.getElementById('circuit-country-select').value;
  const description = document.getElementById('circuit-description-input').value.trim();
  const spaces = parseInt(document.getElementById('circuit-spaces-input').value) || null;
  const curves = parseInt(document.getElementById('circuit-curves-input').value) || null;
  const laps = parseInt(document.getElementById('circuit-laps-input').value) || null;

  if (!name) { showToast('Introduce un nombre para el circuito', 'error'); return; }
  if (!countryId) { showToast('Selecciona un país para el circuito', 'error'); return; }

  const circuitData = {
    id: editingCircuitId || uid(),
    name,
    countryId,
    description,
    spaces,
    curves,
    laps,
    expansion: 'Personalizado'
  };

  if (editingCircuitId) {
    // Editar circuito existente (solo circuitos personalizados)
    const index = state.circuits.findIndex(c => c.id === editingCircuitId);
    if (index !== -1) {
      state.circuits[index] = { ...state.circuits[index], ...circuitData };
      showToast('Circuito actualizado ✓', 'success');
    }
  } else {
    // Añadir nuevo circuito
    // Asegurar que state.circuits exista
    if (!state.circuits) {
      state.circuits = [];
    }
    state.circuits.push(circuitData);
    showToast(`${name} añadido ✓`, 'success');
  }

  closeModal('modal-circuit');
  renderCircuits();
  saveState(); // Guardar cambios en localStorage
}

function deleteCircuit(circuitId) {
  // Asegurar que state.circuits exista
  if (!state.circuits) {
    state.circuits = [];
  }
  
  const circuit = state.circuits.find(c => c.id === circuitId);
  
  if (!circuit) return;
  
  // Verificar si es un circuito oficial (incluye fanmade)
  const isOfficialExpansion = ['Base', 'Lluvia Torrencial', 'Visión de Túnel', 'Fanmade'].includes(circuit.expansion);
  if (isOfficialExpansion) {
    showToast('No se pueden eliminar circuitos oficiales', 'error');
    return;
  }
  
  if (!confirm(`¿Eliminar ${circuit.name}?\n\nEsta acción no se puede deshacer.`)) return;
  
  state.circuits = state.circuits.filter(c => c.id !== circuitId);
  showToast('Circuito eliminado', 'info');
  renderCircuits();
  saveState(); // Guardar cambios en localStorage
}

// ---- CIRCUIT EVENT LISTENERS ----
function bindCircuitEventListeners() {
  // Add circuit button
  const addCircuitBtn = document.getElementById('btn-add-circuit');
  if (addCircuitBtn) {
    addCircuitBtn.addEventListener('click', () => openCircuitModal());
  }

  // Save circuit button
  const saveCircuitBtn = document.getElementById('btn-save-circuit');
  if (saveCircuitBtn) {
    saveCircuitBtn.addEventListener('click', saveCircuit);
  }

  // Circuit card click (delegated) - show map modal
  document.addEventListener('click', (e) => {
    const circuitCard = e.target.closest('.circuit-card');
    if (circuitCard && !e.target.closest('.circuit-card-actions')) {
      // Si el clic es en la tarjeta pero no en los botones de acción
      const circuitId = circuitCard.dataset.circuitId;
      openCircuitMapModal(circuitId);
      return;
    }
  });

  // Edit and delete circuit buttons (delegated)
  document.addEventListener('click', (e) => {
    // Edit circuit
    const editCircuitBtn = e.target.closest('[data-edit-circuit]');
    if (editCircuitBtn) { 
      const circuitId = editCircuitBtn.dataset.editCircuit;
      // Buscar en circuitos oficiales y personalizados
      const circuit = [...(window.CIRCUITS || []), ...(state.circuits || [])].find(c => c.id === circuitId);
      
      // Verificar si es un circuito oficial (incluye fanmade)
      const isOfficialExpansion = ['Base', 'Lluvia Torrencial', 'Visión de Túnel', 'Fanmade'].includes(circuit.expansion);
      if (isOfficialExpansion) {
        showToast('No se pueden modificar circuitos oficiales', 'error');
        return;
      }
      
      openCircuitModal(circuitId); 
      return; 
    }

    // Delete circuit
    const delCircuitBtn = e.target.closest('[data-del-circuit]');
    if (delCircuitBtn) { 
      const circuitId = delCircuitBtn.dataset.delCircuit;
      // Buscar en circuitos oficiales y personalizados
      const circuit = [...(window.CIRCUITS || []), ...(state.circuits || [])].find(c => c.id === circuitId);
      
      // Verificar si es un circuito oficial (incluye fanmade)
      const isOfficialExpansion = ['Base', 'Lluvia Torrencial', 'Visión de Túnel', 'Fanmade'].includes(circuit.expansion);
      if (isOfficialExpansion) {
        showToast('No se pueden eliminar circuitos oficiales', 'error');
        return;
      }
      
      deleteCircuit(circuitId); 
      return; 
    }
  });
}

// Initialize circuit event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', bindCircuitEventListeners);
