/* ============================================================
   TEAM SYNAPSE — main.js
   Nova (Frontend Engineer) — Phase 1
   Global interactions: navbar, mobile menu, scroll animations
   ============================================================ */

'use strict';

/* ── Navbar: active link ──────────────────────────────────── */
(function markActiveLink() {
  const links = document.querySelectorAll('.navbar__link');
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── Navbar: mobile hamburger ─────────────────────────────── */
(function initMobileMenu() {
  const btn = document.getElementById('nav-hamburger');
  const nav = document.getElementById('nav-menu');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    // Animate hamburger lines
    const spans = btn.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close on link click
  nav.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ── Navbar: scroll opacity ───────────────────────────────── */
/* BUG-010 FIX: Updated from dark hsl(230,22%,6%) to light pastel beige values */
(function initScrollNav() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const handler = () => {
    navbar.style.background = window.scrollY > 40
      ? 'hsl(35,30%,90%,0.97)'
      : 'hsl(35,30%,94%,0.85)';
  };
  window.addEventListener('scroll', handler, { passive: true });
})();

/* ── Intersection Observer: reveal animations ─────────────── */
(function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();

/* ── Translation Switcher ───────────────────────────────────── */
(function initTranslation() {
  const toggleBtn = document.getElementById('lang-toggle');
  if (!toggleBtn) return;

  // Set default language or retrieve from localStorage
  let currentLang = localStorage.getItem('lang') || 'en';

  function applyTranslations(lang) {
    document.querySelectorAll('[data-en][data-ja]').forEach(el => {
      const translation = el.getAttribute('data-' + lang);
      if (translation !== null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.hasAttribute('placeholder')) {
            el.setAttribute('placeholder', translation);
          }
        } else {
          el.innerHTML = translation;
        }
      }
    });

    // Update lang attribute on html tag
    document.documentElement.setAttribute('lang', lang);

    // Update toggle button text
    toggleBtn.innerHTML = lang === 'en' ? 'JP' : 'EN';
    toggleBtn.setAttribute('aria-label', lang === 'en' ? 'Switch to Japanese' : 'Switch to English');

    // Store in localStorage
    localStorage.setItem('lang', lang);

    // Dispatch global custom event for other scripts to handle dynamic data translations
    const event = new CustomEvent('languageChanged', { detail: { lang: lang } });
    window.dispatchEvent(event);
  }

  // Hook up click handler
  toggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ja' : 'en';
    applyTranslations(currentLang);
  });

  // Apply on initial load
  applyTranslations(currentLang);
})();

/* ── Site Config Engine: dynamic import ────────────────────── */
/* load_config.js must be present in js/ for this to work.     */
/* It reads data/site_config.json, merges localStorage         */
/* overrides, and applies values to [data-config-key] elements */
(function initSiteConfig() {
  // load_config.js self-initialises via DOMContentLoaded —
  // it is loaded as a separate <script> tag on each page.
  // This block is reserved for any main.js-level coordination
  // needed after config is applied (e.g. re-triggering reveal
  // animations if config changes visible element heights).
  window.addEventListener('configLoaded', () => {
    // Re-observe any newly visible [data-reveal] elements
    // in case config text injection changed layout.
    const items = document.querySelectorAll('[data-reveal]:not(.revealed)');
    if (!items.length || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => observer.observe(el));
  });
})();

