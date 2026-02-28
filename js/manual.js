// ============================================================
//  HEAT: PEDAL TO THE METAL — COMPANION APP  v2
//  Manual/Reference Management Functions
// ============================================================

// ---- MANUAL RENDER FUNCTIONS ----
function renderManual() {
  console.log('=== renderManual START ===');
  const basicsList = document.getElementById('manual-basics-list');
  const weatherList = document.getElementById('manual-weather-list');

  console.log('Elements found:', {
    basicsList: !!basicsList,
    weatherList: !!weatherList
  });

  // Debug: verificar si los datos están disponibles
  console.log('Data availability:', {
    GAME_BASICS: window.GAME_BASICS,
    GAME_BASICS_keys: window.GAME_BASICS ? Object.keys(window.GAME_BASICS) : 'undefined',
    WEATHER_OPTIONS: window.WEATHER_OPTIONS,
    WEATHER_OPTIONS_length: window.WEATHER_OPTIONS ? window.WEATHER_OPTIONS.length : 'undefined'
  });

  // Render Basics - siempre renderizar
  if (window.GAME_BASICS && Object.keys(window.GAME_BASICS).length > 0) {
    console.log('Rendering basics with', Object.keys(window.GAME_BASICS).length, 'items');
    basicsList.innerHTML = Object.values(window.GAME_BASICS).map(b => `
      <div class="manual-item">
        <div class="manual-item-header">
          <span class="manual-item-icon">${b.emoji}</span>
          <span class="manual-item-name">${b.name}</span>
        </div>
        <div class="manual-item-description">${b.description}</div>
      </div>
    `).join('');
    console.log('Basics rendered successfully');
  } else {
    console.log('No basics data available, showing loading message');
    basicsList.innerHTML = '<div style="color:var(--text-dim);text-align:center;padding:20px">Cargando datos básicos...</div>';
  }

  // Render Weather - siempre renderizar
  if (window.WEATHER_OPTIONS && window.WEATHER_OPTIONS.length > 0) {
    console.log('Rendering weather with', window.WEATHER_OPTIONS.length, 'items');
    weatherList.innerHTML = window.WEATHER_OPTIONS.map(w => `
      <div class="manual-item">
        <div class="manual-item-header">
          <span class="manual-item-icon">${w.emoji}</span>
          <span class="manual-item-name">${w.name}</span>
        </div>
        <div class="manual-item-description">${w.description}</div>
        ${w.effects ? `<div class="manual-effects"><strong>Efectos:</strong> ${w.effects}</div>` : ''}
      </div>
    `).join('');
    console.log('Weather rendered successfully');
  } else {
    console.log('No weather data available, showing loading message');
    weatherList.innerHTML = '<div style="color:var(--text-dim);text-align:center;padding:20px">Cargando datos de clima...</div>';
  }

  // Forzar que las secciones estén colapsadas inicialmente
  setTimeout(() => {
    document.querySelectorAll('.section-card.collapsible').forEach(card => {
      if (!card.classList.contains('collapsed')) {
        card.classList.add('collapsed');
        const toggle = card.querySelector('.section-toggle');
        if (toggle) toggle.textContent = '▼';
      }
    });
  }, 100);
  
  console.log('=== renderManual END ===');
}

// ---- MANUAL EVENT LISTENERS ----
function bindManualEventListeners() {
  // No necesitamos event listener delegado porque el HTML ya tiene onclick="toggleSection(this)"
  // Esto evita conflictos entre el onclick inline y el event listener
}

// ---- MANUAL HELPER FUNCTIONS ----
function toggleSection(header) {
  console.log('toggleSection called with:', header);
  const sectionCard = header.parentElement;
  const isCollapsed = sectionCard.classList.contains('collapsed');
  console.log('isCollapsed:', isCollapsed);
  console.log('Current classes:', sectionCard.className);
  
  // Obtener el contenido para verificar si se está mostrando
  const content = sectionCard.querySelector('.section-content');
  console.log('Content element:', content);
  if (content) {
    const computedStyle = window.getComputedStyle(content);
    console.log('Content max-height:', computedStyle.maxHeight);
    console.log('Content display:', computedStyle.display);
    
    // Si el contenido está vacío, solo mostrar un mensaje (no recargar aquí)
    if (content.innerHTML.trim() === '') {
      console.log('Content is empty, but data should be loaded by renderView');
    }
  }
  
  if (isCollapsed) {
    // Quitar la clase collapsed para mostrar el contenido
    sectionCard.classList.remove('collapsed');
    const toggle = header.querySelector('.section-toggle');
    if (toggle) toggle.textContent = '▲';
    console.log('Removing collapsed class');
  } else {
    // Añadir la clase collapsed para ocultar el contenido
    sectionCard.classList.add('collapsed');
    const toggle = header.querySelector('.section-toggle');
    if (toggle) toggle.textContent = '▼';
    console.log('Adding collapsed class');
  }
  
  console.log('Classes after toggle:', sectionCard.className);
  
  // Verificar el estado después del cambio
  setTimeout(() => {
    if (content) {
      const computedStyle = window.getComputedStyle(content);
      console.log('Content max-height after toggle:', computedStyle.maxHeight);
      console.log('Content display after toggle:', computedStyle.display);
    }
  }, 50);
}

// Función para forzar la recarga del manual
function refreshManual() {
  console.log('refreshManual() called');
  renderManual();
}

// Hacer la función disponible globalmente para pruebas
window.refreshManual = refreshManual;

// Initialize manual event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Manual.js: DOMContentLoaded fired');
  bindManualEventListeners();
  
  // Verificar si ya estamos en la vista manual y renderizar si es necesario
  setTimeout(() => {
    const manualView = document.getElementById('view-manual');
    if (manualView && manualView.classList.contains('active')) {
      console.log('Manual.js: Already in manual view, calling renderManual()');
      renderManual();
    }
  }, 100);
});

// También escuchar cambios en la navegación para asegurar que los datos se carguen
document.addEventListener('click', (e) => {
  const navLink = e.target.closest('.nav-link[data-view="manual"], .mobile-nav-item[data-view="manual"]');
  if (navLink) {
    console.log('Manual.js: Navigation to manual detected');
    // Pequeño retraso para asegurar que la vista esté activa
    setTimeout(() => {
      renderManual();
    }, 50);
  }
});
