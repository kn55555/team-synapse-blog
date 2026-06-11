/**
 * load_config.js — JB / Backend Engineer
 * ─────────────────────────────────────────────────────────────
 * Site Configuration Engine.
 *
 * Fetches data/site_config.json, checks localStorage for any
 * author-overridden values, then applies the active config to
 * all elements that carry a data-config-key attribute.
 *
 * HOW IT WORKS:
 *   1. Elements declare which config key they display via:
 *        <h1 data-config-key="hero_title"></h1>
 *   2. On load, this script fetches site_config.json and resolves
 *      the correct locale (EN or JP from localStorage 'lang').
 *   3. Any key overridden in localStorage ('site_config_overrides')
 *      takes precedence over the JSON file values.
 *   4. Dispatches a global 'configLoaded' event when done, so
 *      other scripts can react.
 *
 * AUTHOR PORTAL INTEGRATION (author.html):
 *   - Call saveConfigOverride(key, en_value, ja_value) to persist
 *     an override to localStorage.
 *   - Call clearConfigOverrides() to reset all overrides.
 *   - Call window.__siteConfig to inspect the merged config object.
 *
 * HOW TO CONNECT (add to any page):
 *   <script src="js/load_config.js" defer></script>
 *   (Must be included after main.js so lang localStorage is set)
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  const DATA_PATH        = 'data/site_config.json';
  const STORAGE_KEY      = 'site_config_overrides';
  const CONFIG_ATTR      = 'data-config-key';

  /* ── Public API exposed on window ─────────────────────────── */

  /**
   * Saves an author override for a single config key.
   * @param {string} key       - e.g. "hero_title"
   * @param {string} enValue   - English text
   * @param {string} jaValue   - Japanese text
   */
  window.saveConfigOverride = function (key, enValue, jaValue) {
    const overrides = loadOverrides();
    overrides[key] = { en: enValue, ja: jaValue };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    applyConfig(window.__siteConfig || {}, loadOverrides());
    console.log(`[load_config.js] ✓ Override saved for key "${key}".`);
  };

  /**
   * Clears all localStorage overrides and re-applies base config.
   */
  window.clearConfigOverrides = function () {
    localStorage.removeItem(STORAGE_KEY);
    applyConfig(window.__siteConfig || {}, {});
    console.log('[load_config.js] ✓ All overrides cleared.');
  };

  /**
   * Returns the merged config for a specific key in the current locale.
   * @param {string} key
   * @returns {string}
   */
  window.getConfigValue = function (key) {
    const lang      = localStorage.getItem('lang') || 'en';
    const overrides = loadOverrides();
    const base      = window.__siteConfig || {};

    if (overrides[key] && overrides[key][lang] !== undefined) {
      return overrides[key][lang];
    }
    if (base[key] && base[key][lang] !== undefined) {
      return base[key][lang];
    }
    return '';
  };

  /* ── Internal helpers ──────────────────────────────────────── */

  function loadOverrides() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  /**
   * Merges base config with localStorage overrides and applies
   * values to all [data-config-key] elements on the page.
   */
  function applyConfig(baseConfig, overrides) {
    const lang = localStorage.getItem('lang') || 'en';

    // Build merged config — overrides win
    const merged = {};
    Object.keys(baseConfig).forEach(key => {
      merged[key] = { ...baseConfig[key] };
    });
    Object.keys(overrides).forEach(key => {
      merged[key] = { ...(merged[key] || {}), ...overrides[key] };
    });

    // Apply to DOM
    document.querySelectorAll(`[${CONFIG_ATTR}]`).forEach(el => {
      const key = el.getAttribute(CONFIG_ATTR);
      if (!merged[key]) return;
      const val = merged[key][lang] !== undefined ? merged[key][lang] : (merged[key]['en'] || '');
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = val;
      } else {
        el.textContent = val;
      }
    });

    // Expose merged config for author portal to inspect
    window.__siteConfigMerged = merged;

    console.log(`[load_config.js] ✓ Config applied (lang: ${lang}, ${Object.keys(merged).length} keys, ${Object.keys(overrides).length} override(s)).`);
  }

  /* ── Main ──────────────────────────────────────────────────── */

  async function loadConfig() {
    let baseConfig = {};

    // 1. Fetch the JSON file
    try {
      const response = await fetch(DATA_PATH);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      baseConfig = data.config || {};
      window.__siteConfig = baseConfig;
    } catch (err) {
      console.warn('[load_config.js] Could not fetch site_config.json:', err.message,
        '— Using localStorage overrides only (if any).');
    }

    // 2. Load overrides from localStorage
    const overrides = loadOverrides();

    // 3. Apply merged config to DOM
    applyConfig(baseConfig, overrides);

    // 4. Notify other scripts
    window.dispatchEvent(new CustomEvent('configLoaded', {
      detail: { baseConfig, overrides }
    }));
  }

  // Re-apply config when language changes
  window.addEventListener('languageChanged', () => {
    applyConfig(window.__siteConfig || {}, loadOverrides());
  });

  // Auto-run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadConfig);
  } else {
    loadConfig();
  }

})();
