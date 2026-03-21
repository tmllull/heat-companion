// ============================================================
//  HEAT: PEDAL TO THE METAL — COMPANION APP  v2
//  Circuit Management Functions
// ============================================================

// ---- CIRCUIT STATE ----
// ---- CIRCUIT STATE ----
let editingCircuitId = null;

// ---- CIRCUIT RENDER FUNCTIONS ----
function renderCircuits() {
  const grid = document.getElementById('circuits-grid');
  const empty = document.getElementById('circuits-empty');

  // Solo circuitos oficiales
  const allCircuits = window.CIRCUITS || [];

  if (allCircuits.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  // Separar circuitos en originales y fanmade
  const originalCircuits = allCircuits.filter(c => 
    ['Base', 'Lluvia Torrencial', 'Visión de Túnel', 'Terreno Inestable'].includes(c.expansion)
  );
  const fanmadeCircuits = allCircuits.filter(c => 
    !['Base', 'Lluvia Torrencial', 'Visión de Túnel', 'Terreno Inestable'].includes(c.expansion)
  );

  let html = '<div class="circuits-sections-container">';

  // Sección de circuitos originales
  if (originalCircuits.length > 0) {
    html += `
      <div class="section-card collapsible" id="original-circuits-section">
        <div class="section-header" onclick="toggleSection(this)">
          <h2 data-i18n="circuits.original">${i18n.t('circuits.original')}</h2>
          <span class="section-toggle">▲</span>
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
      <div class="section-card collapsible" id="fanmade-circuits-section">
        <div class="section-header" onclick="toggleSection(this)">
          <h2 data-i18n="circuits.fanmade">${i18n.t('circuits.fanmade')}</h2>
          <span class="section-toggle">▲</span>
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
  
  // Determinar el badge y su clase
  let badgeHtml = '';
  if (c.expansion) {
    const expansionKey = c.expansion === 'Lluvia Torrencial' ? 'heavyRain' : 
                         c.expansion === 'Visión de Túnel' ? 'tunnelVision' : 
                         c.expansion === 'Terreno Inestable' ? 'rockyRoads' :
                         c.expansion.toLowerCase();
    
    // Generar la clase CSS correcta para cada expansión
    let badgeClass;
    if (c.expansion === 'Lluvia Torrencial') {
      badgeClass = 'lluvia-torrencial';
    } else if (c.expansion === 'Visión de Túnel') {
      badgeClass = 'vision-de-tunel';
    } else if (c.expansion === 'Terreno Inestable') {
      badgeClass = 'terreno-inestable';
    } else {
      badgeClass = expansionKey.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
    }
    
    badgeHtml = `<div class="diff-badge ${badgeClass}">${i18n.t('data.expansions.' + expansionKey)}</div>`;
  }
  
  return `<div class="circuit-card" data-circuit-id="${c.id}">
    <div class="circuit-flag">${country ? country.flag : '🏁'}</div>
    <div class="circuit-country">${country ? i18n.t('data.countries.' + country.id) : ''}</div>
    <div class="circuit-name">${escHtml(c.name) || '---'}</div>
    ${badgeHtml}
    <div class="circuit-details">
      ${c.spaces ? `<div>📏 ${c.spaces}</div>` : ''}
      ${c.curves ? `<div>⤵ ${c.curves}</div>` : ''}
      ${c.laps ? `<div>🏁 ${c.laps}</div>` : ''}
    </div>
  </div>`;
}

// ---- CIRCUIT MODAL FUNCTIONS ----
function openCircuitMapModal(circuitId) {
  // Solo circuitos oficiales
  const circuit = (window.CIRCUITS || []).find(c => c.id === circuitId);
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

// ---- CIRCUIT EVENT LISTENERS ----
function bindCircuitEventListeners() {
  // Circuit card click (delegated) - show map modal
  document.addEventListener('click', (e) => {
    const circuitCard = e.target.closest('.circuit-card');
    if (circuitCard && !e.target.closest('.circuit-card-actions')) {
      const circuitId = circuitCard.dataset.circuitId;
      openCircuitMapModal(circuitId);
      return;
    }
  });
}

// Initialize circuit event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', bindCircuitEventListeners);

// Initialize circuit event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', bindCircuitEventListeners);
