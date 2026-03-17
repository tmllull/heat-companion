// ============================================================
//  HEAT: PEDAL TO THE METAL — COMPANION APP  v2
//  Manual/Reference Management Functions
// ============================================================

// ---- MANUAL RENDER FUNCTIONS ----
function renderManualDownloads() {
  const container = document.getElementById('manual-downloads');
  if (!container) return;
  
  const currentLang = localStorage.getItem('heat-companion-lang') || 'es';
  
  const manuals = {
    es: [
      { file: 'Reglas-basicas.pdf', name: 'Manual Básico', i18n: 'manual.downloadBasic', section: 'basic' },
      { file: 'Reglas-avanzadas.pdf', name: 'Manual Avanzado', i18n: 'manual.downloadAdvanced', section: 'basic' },
      { file: 'Lluvia-torrencial.pdf', name: 'Lluvia Torrencial', section: 'expansions' },
      { file: 'Vision-de-tunel.pdf', name: 'Visión de Túnel', section: 'expansions' },
      { file: 'Terreno-inestable.pdf', name: 'Terreno Inestable', section: 'expansions' },
      { file: 'Leyendas.pdf', name: 'Leyendas', section: 'expansions' }
    ],
    en: [
      { file: 'Rules-basic.pdf', name: 'Basic Rules', i18n: 'manual.downloadBasic', section: 'basic' },
      { file: 'Rules-advanced.pdf', name: 'Advanced Rules', i18n: 'manual.downloadAdvanced', section: 'basic' },
      { file: 'Heavy-rain.pdf', name: 'Heavy Rain', section: 'expansions' },
      { file: 'Tunnel-vision.pdf', name: 'Tunnel Vision', section: 'expansions' },
      { file: 'Rocky-roads.pdf', name: 'Rocky Roads', section: 'expansions' },
      { file: 'Legends.pdf', name: 'Legends', section: 'expansions' }
    ]
  };
  
  const currentManuals = manuals[currentLang] || manuals.es;
  
  // Group manuals by section
  const groupedManuals = {
    basic: currentManuals.filter(m => m.section === 'basic'),
    expansions: currentManuals.filter(m => m.section === 'expansions')
  };
  
  // Generate HTML with grouped sections
  let html = '<div class="manual-downloads-sections">';
  
  // Basic Rules Section
  if (groupedManuals.basic.length > 0) {
    html += `
      <div class="download-section">
        <h3 class="download-section-title">${i18n.t('manual.basicRules')}</h3>
        <div class="download-section-items">
          ${groupedManuals.basic.map(manual => {
            const text = manual.i18n ? i18n.t(manual.i18n) : manual.name;
            return `<a href="files/rules/${currentLang}/${manual.file}" download class="btn btn-secondary btn-small" target="_blank">${text}</a>`;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  // Expansions Section
  if (groupedManuals.expansions.length > 0) {
    html += `
      <div class="download-section">
        <h3 class="download-section-title">${i18n.t('manual.expansions')}</h3>
        <div class="download-section-items">
          ${groupedManuals.expansions.map(manual => {
            const text = manual.i18n ? i18n.t(manual.i18n) : manual.name;
            return `<a href="files/rules/${currentLang}/${manual.file}" download class="btn btn-secondary btn-small" target="_blank">${text}</a>`;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  html += '</div>';
  container.innerHTML = html;
}

function renderManual() {
  // Render manual downloads first
  renderManualDownloads();
  
  const basicsList = document.getElementById('manual-basics-list');
  const weatherList = document.getElementById('manual-weather-list');

  // Render Basics - siempre renderizar
  if (window.GAME_BASICS && Object.keys(window.GAME_BASICS).length > 0) {
    basicsList.innerHTML = Object.entries(window.GAME_BASICS).map(([id, b]) => `
      <div class="manual-item">
        <div class="manual-item-header">
          <span class="manual-item-icon">${b.emoji}</span>
          <span class="manual-item-name">${i18n.t('manual.' + id + 'Title', { defaultValue: b.name })}</span>
        </div>
        <div class="manual-item-desc">${i18n.t('manual.' + id + 'Description', { defaultValue: b.description })}</div>
        ${(() => {
          const transEffects = i18n.getRaw('manual.' + id + 'Effects');
          const effects = (transEffects && Array.isArray(transEffects)) ? transEffects : b.effects;
          if (!effects || !effects.length) return '';
          return `<div class="manual-item-effects">
            <strong>${i18n.t('manual.effectsTitle') || 'Effects:'}</strong>
            <ul class="manual-item-rules">${effects.map(effect => '<li>' + effect + '</li>').join('')}</ul>
          </div>`;
        })()}
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
          <span class="manual-item-name">${i18n.t('data.weather.' + w.id + '.name', { defaultValue: w.name })}</span>
        </div>
        <div class="manual-item-description">
          <div><strong>Prep:</strong> ${i18n.t('data.weather.' + w.id + '.prep', { defaultValue: w.effect.preparation })}</div>
          <div><strong>${i18n.t('modals.championshipTemplates.trackEffect')}:</strong> ${i18n.t('data.weather.' + w.id + '.track', { defaultValue: w.effect.trackEffect })}</div>
        </div>
      </div>
    `).join('');
  } else {
    weatherList.innerHTML = '<div style="color:var(--text-dim);text-align:center;padding:20px">Cargando datos de clima...</div>';
  }

  // Render Expansions - Lluvia Torrencial
  const heavyRainList = document.getElementById('manual-heavy-rain-list');
  if (heavyRainList && window.EXPANSION_RULES && window.EXPANSION_RULES.heavy_rain) {
    const hr = window.EXPANSION_RULES.heavy_rain;
    heavyRainList.innerHTML = Object.entries(hr.items).map(([id, b]) => `
      <div class="manual-item">
        <div class="manual-item-header">
          <span class="manual-item-name">${i18n.t('manual.' + id + 'Title', { defaultValue: b.name })}</span>
        </div>
        <div class="manual-item-desc">${i18n.t('manual.' + id + 'Description', { defaultValue: b.description })}</div>
        ${(() => {
          const transEffects = i18n.getRaw('manual.' + id + 'Effects');
          const effects = (transEffects && Array.isArray(transEffects)) ? transEffects : b.effects;
          if (!effects || !effects.length) return '';
          return `<div class="manual-item-effects">
            <strong>${i18n.t('manual.effectsTitle') || 'Effects:'}</strong>
            <ul class="manual-item-rules">${effects.map(effect => '<li>' + effect + '</li>').join('')}</ul>
          </div>`;
        })()}
      </div>
    `).join('');
  }

  // Render Expansions - Visión de Túnel
  const tunnelVisionList = document.getElementById('manual-tunnel-vision-list');
  if (tunnelVisionList && window.EXPANSION_RULES && window.EXPANSION_RULES.tunnel_vision) {
    const tv = window.EXPANSION_RULES.tunnel_vision;
    tunnelVisionList.innerHTML = Object.entries(tv.items).map(([id, b]) => `
      <div class="manual-item">
        <div class="manual-item-header">
          <span class="manual-item-name">${i18n.t('manual.' + id + 'Title', { defaultValue: b.name })}</span>
        </div>
        <div class="manual-item-desc">${i18n.t('manual.' + id + 'Description', { defaultValue: b.description })}</div>
        ${(() => {
          const transEffects = i18n.getRaw('manual.' + id + 'Effects');
          const effects = (transEffects && Array.isArray(transEffects)) ? transEffects : b.effects;
          if (!effects || !effects.length) return '';
          return `<div class="manual-item-effects">
            <strong>${i18n.t('manual.effectsTitle') || 'Effects:'}</strong>
            <ul class="manual-item-rules">${effects.map(effect => '<li>' + effect + '</li>').join('')}</ul>
          </div>`;
        })()}
      </div>
    `).join('');
  }

  // Render Expansions - Terreno Inestable
  const rockyRoadsList = document.getElementById('manual-rocky-roads-list');
  if (rockyRoadsList && window.EXPANSION_RULES && window.EXPANSION_RULES.rocky_roads) {
    const rr = window.EXPANSION_RULES.rocky_roads;
    rockyRoadsList.innerHTML = Object.entries(rr.items).map(([id, b]) => `
      <div class="manual-item">
        <div class="manual-item-header">
          <span class="manual-item-name">${i18n.t('manual.' + id + 'Title', { defaultValue: b.name })}</span>
        </div>
        <div class="manual-item-desc">${i18n.t('manual.' + id + 'Description', { defaultValue: b.description })}</div>
        ${(() => {
          const transEffects = i18n.getRaw('manual.' + id + 'Effects');
          const effects = (transEffects && Array.isArray(transEffects)) ? transEffects : b.effects;
          if (!effects || !effects.length) return '';
          return `<div class="manual-item-effects">
            <strong>${i18n.t('manual.effectsTitle') || 'Effects:'}</strong>
            <ul class="manual-item-rules">${effects.map(effect => '<li>' + effect + '</li>').join('')}</ul>
          </div>`;
        })()}
      </div>
    `).join('');
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
  
  // Listen for language changes
  window.addEventListener('languageChanged', () => {
    renderManualDownloads();
  });
  
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
