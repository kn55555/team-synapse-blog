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
(function initScrollNav() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const handler = () => {
    navbar.style.background = window.scrollY > 40
      ? 'hsl(230,22%,6%,0.95)'
      : 'hsl(230,22%,6%,0.75)';
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
