// ============================================================
//  HEAT: PEDAL TO THE METAL — COMPANION APP  v2
//  Manual/Reference Management Functions
// ============================================================

// ---- MANUAL RENDER FUNCTIONS ----
function renderManual() {
  const basicsList = document.getElementById('manual-basics-list');
  const weatherList = document.getElementById('manual-weather-list');

  // Render Basics - siempre renderizar
  if (window.GAME_BASICS && Object.keys(window.GAME_BASICS).length > 0) {
    basicsList.innerHTML = Object.values(window.GAME_BASICS).map(b => `
      <div class="manual-item">
        <div class="manual-item-header">
          <span class="manual-item-icon">${b.emoji}</span>
          <span class="manual-item-name">${b.name}</span>
        </div>
        <div class="manual-item-description">${b.description}</div>
      </div>
    `).join('');
  } else {
    basicsList.innerHTML = '<div style="color:var(--text-dim);text-align:center;padding:20px">Cargando datos básicos...</div>';
  }

  // Render Weather - siempre renderizar
  if (window.WEATHER_OPTIONS && window.WEATHER_OPTIONS.length > 0) {
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
  } else {
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
}

// ---- MANUAL EVENT LISTENERS ----
function bindManualEventListeners() {
  // No necesitamos event listener delegado porque el HTML ya tiene onclick="toggleSection(this)"
  // Esto evita conflictos entre el onclick inline y el event listener
}

// ---- MANUAL HELPER FUNCTIONS ----
function toggleSection(header) {
  const sectionCard = header.parentElement;
  const isCollapsed = sectionCard.classList.contains('collapsed');
  
  // Obtener el contenido para verificar si se está mostrando
  const content = sectionCard.querySelector('.section-content');
  
  if (isCollapsed) {
    // Quitar la clase collapsed para mostrar el contenido
    sectionCard.classList.remove('collapsed');
    const toggle = header.querySelector('.section-toggle');
    if (toggle) toggle.textContent = '▲';
  } else {
    // Añadir la clase collapsed para ocultar el contenido
    sectionCard.classList.add('collapsed');
    const toggle = header.querySelector('.section-toggle');
    if (toggle) toggle.textContent = '▼';
  }
}

// Función para forzar la recarga del manual
function refreshManual() {
  renderManual();
}

// Hacer la función disponible globalmente para pruebas
window.refreshManual = refreshManual;

// Initialize manual event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  bindManualEventListeners();
  
  // Verificar si ya estamos en la vista manual y renderizar si es necesario
  setTimeout(() => {
    const manualView = document.getElementById('view-manual');
    if (manualView && manualView.classList.contains('active')) {
      renderManual();
    }
  }, 100);
});

// Global click listener for manual navigation
document.addEventListener('click', (e) => {
  const navLink = e.target.closest('.nav-link[data-view="manual"], .mobile-nav-item[data-view="manual"]');
  if (navLink) {
    // Pequeño retraso para asegurar que la vista esté activa
    setTimeout(() => {
      renderManual();
    }, 50);
  }
});
