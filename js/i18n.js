/**
 * HEAT Companion — Core i18n module
 * Scalable and professional multi-language support for Vanilla JS
 */

const i18n = {
  currentLocale: 'es',
  locales: {},
  defaultLocale: 'es',

  /**
   * Initializes the i18n system
   * @param {string} initialLocale - The locale to start with (e.g. 'es', 'en')
   */
  async init(initialLocale) {
    // Determine the starting locale: 
    // 1. Provided parameter
    // 2. Saved preference in localStorage
    // 3. Browser language
    // 4. Fallback to defaultLocale
    
    let lang = initialLocale || 
               localStorage.getItem('heat-companion-lang') || 
               navigator.language.split('-')[0];
    
    if (!['es', 'en'].includes(lang)) {
      lang = this.defaultLocale;
    }

    await this.setLanguage(lang);
  },

  /**
   * Sets the current language and updates the UI
   * @param {string} lang 
   */
  async setLanguage(lang) {
    if (!['es', 'en'].includes(lang)) {
      console.warn(`Language ${lang} not supported. Falling back to ${this.defaultLocale}`);
      lang = this.defaultLocale;
    }

    this.currentLocale = lang;
    localStorage.setItem('heat-companion-lang', lang);
    
    // Set the <html> lang attribute
    document.documentElement.lang = lang;

    // Update the entire page
    this.updatePage();
    
    // Trigger a custom event for other modules
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  },

  /**
   * Returns a translation for a given key
   * @param {string} key - The translation key (e.g. 'dashboard.title')
   * @param {Object} params - Placeholders to replace in the string (e.g. { name: 'Carlos' })
   * @returns {string} - The translated string
   */
  t(key, params = {}) {
    const localeData = window[`LOCALE_${this.currentLocale.toUpperCase()}`];
    if (!localeData) {
      console.warn(`Locale data for ${this.currentLocale} not found!`);
      return key;
    }

    // Traverse the object using dot notation (e.g. 'dashboard.title')
    let value = key.split('.').reduce((obj, i) => (obj ? obj[i] : undefined), localeData);

    if (value === undefined) {
      // Fallback: search in default locale if current is different
      if (this.currentLocale !== this.defaultLocale) {
        const defaultData = window[`LOCALE_${this.defaultLocale.toUpperCase()}`];
        value = key.split('.').reduce((obj, i) => (obj ? obj[i] : undefined), defaultData);
      }
      
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    // Replace placeholders: {{name}} -> Carlos
    Object.keys(params).forEach(param => {
      value = value.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
    });

    return value;
  },

  /**
   * Scans the DOM for [data-i18n] attributes and updates their content
   */
  updatePage() {
    // Translate textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });

    // Translate titles (tooltips)
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });
    
    // Special case for buttons or elements that might need specific translations
    // like aria-labels if needed.
  }
};
