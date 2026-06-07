/* ============================================================
   TEAM SYNAPSE — journey.js
   Nova (Frontend Engineer) — Phase 1 (updated)
   Dynamically loads blog_entries.json and renders the timeline.
   Also handles multi-select filter by agent and entry type.
   ============================================================ */

'use strict';

/* ── Config ───────────────────────────────────────────────── */
const DATA_URL = 'data/blog_entries.json';

const AGENT_META = {
  oli:   { emoji: '🧠', colorClass: 'update-card--oli',   badgeAgent: 'Oli'   },
  nova:  { emoji: '✨', colorClass: 'update-card--nova',  badgeAgent: 'Nova'  },
  jb:    { emoji: '⚙️', colorClass: 'update-card--jb',    badgeAgent: 'JB'    },
  robin: { emoji: '🔍', colorClass: 'update-card--robin', badgeAgent: 'Robin' },
};

const TYPE_BADGE = {
  update:   'badge--update',
  decision: 'badge--decision',
  question: 'badge--question',
  blocker:  'badge--blocker',
  blog:     'badge--decision',   // fallback styling for blog narrative posts
};

/* ── Helpers ──────────────────────────────────────────────── */
function formatTimestamp(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  } catch (_) {
    return iso;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderEntry(entry, index) {
  const agentKey = (entry.author || '').toLowerCase();
  const typeKey  = (entry.type  || '').toLowerCase();
  const meta     = AGENT_META[agentKey] || { emoji: '👤', colorClass: '', badgeAgent: entry.author };
  const badgeCls = TYPE_BADGE[typeKey]  || 'badge--update';

  // Convert newlines to paragraph breaks
  const bodyHtml = escapeHtml(entry.content || '')
    .split(/\n{2,}/)
    .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('');

  const delayStyle = `animation-delay: ${0.1 + index * 0.1}s`;

  return `
    <article class="timeline-entry glass-card timeline-entry__inner"
             id="entry-${escapeHtml(String(entry.id))}"
             data-agent="${escapeHtml(agentKey)}"
             data-type="${escapeHtml(typeKey)}"
             style="${delayStyle}">
      <div class="timeline-entry__dot" aria-hidden="true"></div>
      <div class="timeline-entry__header">
        <time class="timeline-entry__day" datetime="${escapeHtml(entry.timestamp || '')}">
          ${escapeHtml(entry.date || 'Day 1')}
        </time>
        <span class="update-card__type ${badgeCls}">${escapeHtml(entry.type || 'Update')}</span>
        <span style="font-size:0.75rem;color:var(--clr-text-muted);font-family:var(--font-mono);">
          ${meta.emoji} ${escapeHtml(meta.badgeAgent)}
        </span>
        <span class="update-card__time">${formatTimestamp(entry.timestamp)}</span>
      </div>
      <h2 class="timeline-entry__title">${escapeHtml(entry.title || '')}</h2>
      <div class="timeline-entry__body">${bodyHtml}</div>
      ${entry.tags && entry.tags.length ? `
        <div style="margin-top:var(--sp-4);display:flex;flex-wrap:wrap;gap:var(--sp-2);">
          ${entry.tags.map(t => `<span style="font-family:var(--font-mono);font-size:0.68rem;padding:2px 8px;border-radius:var(--radius-full);background:hsl(230,18%,18%);color:var(--clr-text-muted);border:1px solid var(--clr-border);">#${escapeHtml(t)}</span>`).join('')}
        </div>
      ` : ''}
    </article>`;
}

/* ── Filter Logic ─────────────────────────────────────────── */
function initFilters(entries, timeline) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  let activeFilters = new Set(['all']);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.filter;

      if (value === 'all') {
        activeFilters = new Set(['all']);
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
      } else {
        activeFilters.delete('all');
        activeFilters.has(value) ? activeFilters.delete(value) : activeFilters.add(value);
        if (activeFilters.size === 0) activeFilters.add('all');
        filterBtns.forEach(b => {
          b.classList.toggle('active',
            b.dataset.filter === 'all' ? activeFilters.has('all') : activeFilters.has(b.dataset.filter)
          );
        });
      }

      applyFilter();
    });
  });

  function applyFilter() {
    const entryEls = timeline.querySelectorAll('.timeline-entry');
    entryEls.forEach(el => {
      const agent = el.dataset.agent || '';
      const type  = el.dataset.type  || '';
      const show = activeFilters.has('all') || activeFilters.has(agent) || activeFilters.has(type);
      el.style.display = show ? '' : 'none';
    });
  }
}

/* ── Error State ──────────────────────────────────────────── */
function renderError(timeline) {
  timeline.innerHTML = `
    <div class="glass-card" style="padding:var(--sp-10);text-align:center;">
      <p style="font-size:1.5rem;margin-bottom:var(--sp-4);">⚠️</p>
      <p style="color:var(--clr-text-secondary);font-size:0.9rem;">
        Could not load journey entries. Open this page from a local web server
        (e.g. <span class="mono" style="color:var(--clr-cyan);">npx serve .</span>) so fetch() can read JSON files.
      </p>
    </div>`;
}

/* ── Main ─────────────────────────────────────────────────── */
async function initJourney() {
  const timeline = document.getElementById('journey-timeline');
  if (!timeline) return;

  // Show loading state
  timeline.innerHTML = `
    <div style="text-align:center;padding:var(--sp-16);color:var(--clr-text-muted);font-family:var(--font-mono);font-size:0.85rem;">
      Loading entries…
    </div>`;

  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const entries = data.entries || [];

    if (!entries.length) {
      timeline.innerHTML = `
        <div class="glass-card timeline-entry__inner">
          <p style="color:var(--clr-text-muted);">No entries yet. Check back soon.</p>
        </div>`;
      return;
    }

    timeline.innerHTML = entries.map((e, i) => renderEntry(e, i)).join('');
    initFilters(entries, timeline);

  } catch (err) {
    console.warn('[journey.js] Could not load data:', err);
    renderError(timeline);
  }
}

document.addEventListener('DOMContentLoaded', initJourney);
