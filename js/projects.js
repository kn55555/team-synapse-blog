/**
 * projects.js — Nova / Frontend Engineer
 * ─────────────────────────────────────────────────────────────
 * Fetches data/projects.json and dynamically renders projects
 * catalog folders and updates list.
 * Supports bilingual rendering and languageChanged events.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  const DATA_URL = 'data/projects.json';
  const CONTAINER_ID = 'projects-timeline';

  async function loadProjects() {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    const lang = localStorage.getItem('lang') || 'en';

    // Show loading state
    container.innerHTML = `
      <div style="text-align:center;padding:var(--sp-16);color:var(--clr-text-muted);font-family:var(--font-mono);font-size:0.85rem;">
        ${lang === 'en' ? 'Loading projects…' : 'プロジェクトを読み込み中…'}
      </div>`;

    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const projects = data.projects || [];

      if (!projects.length) {
        // Render empty state
        container.innerHTML = `
          <div class="glass-card" style="padding:var(--sp-12) var(--sp-10); text-align:center; border: 1px solid var(--clr-border);">
            <p style="font-size:2.5rem; margin-bottom:var(--sp-4);">📁</p>
            <h3 style="font-size:1.25rem; color:var(--clr-text-primary);" data-en="No projects active yet" data-ja="アクティブなプロジェクトはまだありません">
              ${lang === 'en' ? 'No projects active yet' : 'アクティブなプロジェクトはまだありません'}
            </h3>
            <p style="color:var(--clr-text-secondary); font-size:0.9rem; margin-top:var(--sp-3); max-width: 500px; margin-inline: auto; line-height: 1.6;"
               data-en="Once we begin our first engineering project, it will appear here with log updates from Robin."
               data-ja="最初のエンジニアリングプロジェクトを開始すると、ロビンからの更新ログとともにここに表示されます。">
              ${lang === 'en' ? 'Once we begin our first engineering project, it will appear here with log updates from Robin.' : '最初のエンジニアリングプロジェクトを開始すると、ロビンからの更新ログとともにここに表示されます。'}
            </p>
          </div>`;
        return;
      }

      // Render projects catalog
      container.innerHTML = projects.map((project, index) => renderProjectFolder(project, index, lang)).join('');

    } catch (err) {
      console.warn('[projects.js] Could not load projects data:', err);
      renderError(container, lang);
    }
  }

  function renderProjectFolder(project, index, lang) {
    const title = project['title_' + lang] || project.title_en || '';
    const status = project['status_' + lang] || project.status_en || '';
    const desc = project['desc_' + lang] || project.desc_en || '';
    const updates = project.updates || [];

    const delayStyle = `animation-delay: ${0.1 + index * 0.15}s`;

    return `
      <div class="glass-card project-folder anim-reveal" style="${delayStyle}; margin-bottom: var(--sp-6); padding: var(--sp-8); border: 1px solid var(--clr-border);">
        <div class="project-folder__header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--sp-3); border-bottom: 1px solid var(--clr-border); padding-bottom: var(--sp-4); margin-bottom: var(--sp-4);">
          <div style="display:flex; align-items:center; gap:var(--sp-3);">
            <span style="font-size:1.8rem;">📁</span>
            <h2 class="project-folder__title" style="font-size:1.4rem; color:var(--clr-text-primary); margin:0;">${escapeHtml(title)}</h2>
          </div>
          <span class="project-folder__status badge badge--update" style="font-family:var(--font-mono); font-size:0.75rem; text-transform:uppercase;">
            ${escapeHtml(status)}
          </span>
        </div>
        <p style="color:var(--clr-text-secondary); margin-bottom:var(--sp-6); font-size:0.95rem; line-height:1.7;">${escapeHtml(desc)}</p>
        
        <div class="project-folder__updates">
          <h4 style="font-size:0.9rem; color:var(--clr-text-muted); font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:var(--sp-4);" data-en="Robin's Log Updates" data-ja="ロビンの更新ログ">
            ${lang === 'en' ? "Robin's Log Updates" : 'ロビンの更新ログ'}
          </h4>
          ${updates.length ? `
            <div class="project-timeline" style="border-left: 2px solid var(--clr-border); padding-left: var(--sp-6); margin-left: var(--sp-2);">
              ${updates.map(u => renderUpdateEntry(u, lang)).join('')}
            </div>
          ` : `
            <p style="color:var(--clr-text-muted); font-size:0.85rem; font-style:italic;">
              ${lang === 'en' ? 'No logs reported for this project yet.' : 'このプロジェクトのログはまだありません。'}
            </p>
          `}
        </div>
      </div>
    `;
  }

  function renderUpdateEntry(update, lang) {
    const title = update['title_' + lang] || update.title_en || '';
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
      <div class="project-update-item" style="position:relative; margin-bottom:var(--sp-4);">
        <div class="project-update-dot" style="position:absolute; left:calc(-1 * var(--sp-6) - 7px); top:6px; width:12px; height:12px; border-radius:50%; background:var(--clr-cyan); border:2px solid var(--clr-surface);"></div>
        <div style="font-size:0.72rem; color:var(--clr-text-muted); font-family:var(--font-mono); margin-bottom:2px;">
          ${escapeHtml(dateDisplay)}
        </div>
        <h3 style="font-size:1.05rem; color:var(--clr-text-primary); margin-bottom:var(--sp-2);">${escapeHtml(title)}</h3>
        <div style="font-size:0.88rem; color:var(--clr-text-secondary); line-height:1.6;">
          ${bodyHtml}
        </div>
      </div>
    `;
  }

  function renderError(container, lang) {
    const msg = lang === 'en'
      ? 'Could not load projects data. Verify server.py is running.'
      : 'プロジェクトデータを読み込めませんでした。server.py が起動しているか確認してください。';
    container.innerHTML = `
      <div class="glass-card" style="padding:var(--sp-10);text-align:center;border:1px solid var(--clr-border);">
        <p style="font-size:1.5rem;margin-bottom:var(--sp-4);">⚠️</p>
        <p style="color:var(--clr-text-secondary);font-size:0.9rem;">${msg}</p>
      </div>`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Hook language switches
  window.addEventListener('languageChanged', loadProjects);

  // Run on ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProjects);
  } else {
    loadProjects();
  }

})();
