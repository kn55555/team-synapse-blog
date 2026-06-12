/**
 * projects.js — Nova / Frontend Engineer
 * ─────────────────────────────────────────────────────────────
 * Fetches data/projects.json and dynamically renders a clickable
 * project folder grid. Clicking a folder expands a detail pane
 * below showing the full bilingual update timeline.
 * Supports bilingual rendering and languageChanged events.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  const DATA_URL       = 'data/projects.json';
  const CONTAINER_ID   = 'projects-timeline';
  const DETAIL_PANE_ID = 'project-details-pane';

  let allProjects = [];
  let activeProjectId = null;

  /* ── Load ────────────────────────────────────────────────── */
  async function loadProjects() {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    const lang = localStorage.getItem('lang') || 'en';

    container.innerHTML = `
      <div style="text-align:center;padding:var(--sp-16);color:var(--clr-text-muted);font-family:var(--font-mono);font-size:0.85rem;">
        ${lang === 'en' ? 'Loading projects…' : 'プロジェクトを読み込み中…'}
      </div>`;

    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      allProjects = data.projects || [];

      if (!allProjects.length) {
        container.innerHTML = `
          <div class="glass-card" style="padding:var(--sp-12) var(--sp-10); text-align:center; border: 1px solid var(--clr-border);">
            <p style="font-size:2.5rem; margin-bottom:var(--sp-4);">📁</p>
            <h3 style="font-size:1.25rem; color:var(--clr-text-primary);">
              ${lang === 'en' ? 'No projects active yet' : 'アクティブなプロジェクトはまだありません'}
            </h3>
            <p style="color:var(--clr-text-secondary); font-size:0.9rem; margin-top:var(--sp-3); max-width:500px; margin-inline:auto; line-height:1.6;">
              ${lang === 'en'
                ? 'Once we begin our first engineering project, it will appear here with log updates from Robin.'
                : '最初のエンジニアリングプロジェクトを開始すると、ロビンからの更新ログとともにここに表示されます。'}
            </p>
          </div>`;
        return;
      }

      renderGrid(lang);

      // Auto-open first project on load
      if (allProjects.length > 0) {
        openProject(allProjects[0].id, lang);
      }

    } catch (err) {
      console.warn('[projects.js] Could not load projects data:', err);
      renderError(container, lang);
    }
  }

  /* ── Render clickable folder grid ────────────────────────── */
  function renderGrid(lang) {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    const gridHtml = allProjects.map((project, index) => {
      const title   = project['title_' + lang]  || project.title_en  || '';
      const status  = project['status_' + lang] || project.status_en || '';
      const desc    = project['desc_'   + lang] || project.desc_en   || '';
      const snippet = desc.length > 110 ? desc.substring(0, 110) + '…' : desc;
      const delay   = `animation-delay: ${0.1 + index * 0.15}s`;
      const updateCount = (project.updates || []).length;
      const updateLabel = lang === 'en'
        ? `${updateCount} log entr${updateCount === 1 ? 'y' : 'ies'}`
        : `${updateCount}件のログ`;

      return `
        <button class="project-folder-card glass-card anim-reveal"
                data-project-id="${project.id}"
                style="${delay}"
                aria-expanded="false"
                aria-controls="${DETAIL_PANE_ID}"
                id="folder-btn-${project.id}">
          <div class="project-folder-card__icon">📁</div>
          <div class="project-folder-card__body">
            <h3 class="project-folder-card__title">${escapeHtml(title)}</h3>
            <span class="project-folder-card__status badge badge--update">${escapeHtml(status)}</span>
            <p class="project-folder-card__desc">${escapeHtml(snippet)}</p>
            <span class="project-folder-card__count">${escapeHtml(updateLabel)}</span>
          </div>
          <div class="project-folder-card__chevron" aria-hidden="true">›</div>
        </button>`;
    }).join('');

    container.innerHTML = `
      <div class="projects-folder-grid">${gridHtml}</div>
      <div id="${DETAIL_PANE_ID}" class="project-detail-pane" role="region" aria-label="Project details" aria-live="polite"></div>`;

    // Wire click handlers
    container.querySelectorAll('.project-folder-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = localStorage.getItem('lang') || 'en';
        openProject(btn.dataset.projectId, lang);
      });
    });
  }

  /* ── Open / toggle project detail pane ──────────────────── */
  function openProject(projectId, lang) {
    const pane = document.getElementById(DETAIL_PANE_ID);
    if (!pane) return;

    // If clicking same project, collapse it
    if (activeProjectId === projectId && pane.style.display !== 'none') {
      pane.style.display = 'none';
      pane.innerHTML = '';
      activeProjectId = null;
      // Update aria-expanded on all buttons
      document.querySelectorAll('.project-folder-card').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.classList.remove('is-active');
      });
      return;
    }

    activeProjectId = projectId;

    // Update button states
    document.querySelectorAll('.project-folder-card').forEach(b => {
      const isActive = b.dataset.projectId === projectId;
      b.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      b.classList.toggle('is-active', isActive);
    });

    const project = allProjects.find(p => String(p.id) === String(projectId));
    if (!project) return;

    pane.style.display = 'block';
    pane.innerHTML = renderDetailPane(project, lang);

    // Smooth scroll to pane
    setTimeout(() => pane.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }

  /* ── Render full detail pane with timeline ───────────────── */
  function renderDetailPane(project, lang) {
    const title   = project['title_' + lang]  || project.title_en  || '';
    const desc    = project['desc_'   + lang]  || project.desc_en   || '';
    const status  = project['status_' + lang] || project.status_en || '';
    const updates = project.updates || [];

    const timelineHtml = updates.length
      ? updates.map(u => renderUpdateEntry(u, lang)).join('')
      : `<p style="color:var(--clr-text-muted);font-size:0.85rem;font-style:italic;">
           ${lang === 'en' ? 'No logs reported yet.' : 'ログはまだありません。'}
         </p>`;

    const robinLabel = lang === 'en' ? "Robin's Log Updates" : 'ロビンの更新ログ';

    return `
      <div class="glass-card project-detail-card" style="padding:var(--sp-8); border:1px solid var(--clr-border);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:var(--sp-3); border-bottom:1px solid var(--clr-border); padding-bottom:var(--sp-4); margin-bottom:var(--sp-6);">
          <div style="display:flex; align-items:center; gap:var(--sp-3);">
            <span style="font-size:2rem;">📂</span>
            <h2 style="font-size:1.3rem; color:var(--clr-text-primary); margin:0;">${escapeHtml(title)}</h2>
          </div>
          <span class="badge badge--update" style="font-family:var(--font-mono);font-size:0.75rem;text-transform:uppercase;">${escapeHtml(status)}</span>
        </div>

        <p style="color:var(--clr-text-secondary);font-size:0.95rem;line-height:1.7;margin-bottom:var(--sp-6);">${escapeHtml(desc)}</p>

        <h4 style="font-size:0.82rem;color:var(--clr-text-muted);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--sp-4);">
          ${escapeHtml(robinLabel)}
        </h4>

        <div class="project-timeline" style="border-left:2px solid var(--clr-border); padding-left:var(--sp-6); margin-left:var(--sp-2);">
          ${timelineHtml}
        </div>
      </div>`;
  }

  /* ── Single update entry ─────────────────────────────────── */
  function renderUpdateEntry(update, lang) {
    const title   = update['title_'   + lang] || update.title_en   || '';
    const content = update['content_' + lang] || update.content_en || '';

    let dateDisplay = '';
    if (update.timestamp) {
      try {
        const d = new Date(update.timestamp);
        dateDisplay = d.toLocaleString(lang === 'en' ? 'en-US' : 'ja-JP', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
      } catch (_) {
        dateDisplay = update.timestamp;
      }
    }

    const bodyHtml = escapeHtml(content)
      .split(/\n{2,}/)
      .map(p => `<p style="margin-bottom:var(--sp-2);">${p.replace(/\n/g, '<br />')}</p>`)
      .join('');

    return `
      <div class="project-update-item" style="position:relative; margin-bottom:var(--sp-6);">
        <div style="position:absolute; left:calc(-1 * var(--sp-6) - 7px); top:6px; width:12px; height:12px; border-radius:50%; background:var(--clr-cyan); border:2px solid var(--clr-surface);"></div>
        <div style="font-size:0.72rem;color:var(--clr-text-muted);font-family:var(--font-mono);margin-bottom:3px;">${escapeHtml(dateDisplay)}</div>
        <h3 style="font-size:1.05rem;color:var(--clr-text-primary);margin-bottom:var(--sp-2);">${escapeHtml(title)}</h3>
        <div style="font-size:0.88rem;color:var(--clr-text-secondary);line-height:1.65;">${bodyHtml}</div>
      </div>`;
  }

  /* ── Error state ─────────────────────────────────────────── */
  function renderError(container, lang) {
    container.innerHTML = `
      <div class="glass-card" style="padding:var(--sp-10);text-align:center;border:1px solid var(--clr-border);">
        <p style="font-size:1.5rem;margin-bottom:var(--sp-4);">⚠️</p>
        <p style="color:var(--clr-text-secondary);font-size:0.9rem;">
          ${lang === 'en'
            ? 'Could not load projects data. Verify server.py is running.'
            : 'プロジェクトデータを読み込めませんでした。server.py が起動しているか確認してください。'}
        </p>
      </div>`;
  }

  /* ── XSS helper ──────────────────────────────────────────── */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Language change: re-render grid + reopen active pane ── */
  window.addEventListener('languageChanged', () => {
    const lang = localStorage.getItem('lang') || 'en';
    const prevActive = activeProjectId;
    activeProjectId = null;
    renderGrid(lang);
    if (prevActive) openProject(prevActive, lang);
  });

  /* ── Public API ──────────────────────────────────────────── */

  /**
   * window.saveProjectUpdate(projectId, updateObj)
   * ─────────────────────────────────────────────────────────
   * Appends a new update log entry to an existing project in
   * projects.json via the server API (with localStorage fallback).
   *
   * projectId  {string|number}  The project's id field
   * updateObj fields:
   *   title_en   {string}  Entry title (English)
   *   title_ja   {string}  Entry title (Japanese — optional, server auto-translates)
   *   content_en {string}  Entry body (English)
   *   content_ja {string}  Entry body (Japanese — optional, server auto-translates)
   *   timestamp  {string}  ISO 8601 (optional — defaults to now)
   *
   * Returns a Promise resolving with { ok: true, source: 'server'|'localStorage' }.
   */
  window.saveProjectUpdate = async function (projectId, updateObj) {
    const timestamp = updateObj.timestamp || new Date().toISOString();
    const payload = {
      project_id: String(projectId),
      update: {
        title_en:   updateObj.title_en   || '',
        title_ja:   updateObj.title_ja   || '',
        content_en: updateObj.content_en || '',
        content_ja: updateObj.content_ja || '',
        timestamp
      }
    };

    // Try server first
    try {
      const res = await fetch('/api/save-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === 'success') {
        console.log(`[projects.js] Project update saved via server.`);
        // Reload data and re-render
        await loadProjects();
        return { ok: true, source: 'server' };
      }
    } catch (_) {
      // Server not running — fall back to in-memory + localStorage
    }

    // localStorage fallback: update the in-memory allProjects array
    const project = allProjects.find(p => String(p.id) === String(projectId));
    if (project) {
      const updates = project.updates || [];
      const nextId = Math.max(0, ...updates.map(u => u.id || 0)) + 1;
      updates.push({ id: nextId, ...payload.update });
      project.updates = updates;

      // Persist full projects array to localStorage as draft
      localStorage.setItem('projects_draft', JSON.stringify({ projects: allProjects }));
      console.warn('[projects.js] Server unavailable — update saved to localStorage draft.');

      // Re-render immediately
      const lang = localStorage.getItem('lang') || 'en';
      renderGrid(lang);
      openProject(String(projectId), lang);
      return { ok: true, source: 'localStorage' };
    }

    return { ok: false, source: 'none', error: 'Project not found in loaded data.' };
  };

  /**
   * window.reloadProjects()
   * Force a fresh fetch and full re-render of the projects page.
   */
  window.reloadProjects = loadProjects;

  /* ── Auto-run ────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProjects);
  } else {
    loadProjects();
  }

})();
