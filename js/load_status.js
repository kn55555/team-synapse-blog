/**
 * load_status.js — JB / Backend Engineer
 * ─────────────────────────────────────────────────────────────
 * Fetches agent_status.json and updates the team member cards
 * on the homepage (index.html) with each person's live status,
 * current task, and completed task count.
 * Also dynamically loads the latest updates feed.
 * Supports bilingual English/Japanese rendering.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  "use strict";

  const DATA_PATH = "data/agent_status.json";

  /**
   * Maps status strings to display properties.
   */
  const STATUS_CONFIG = {
    en: {
      active: { label: "Active", color: "var(--clr-cyan)", dot: "🟢" },
      idle: { label: "Idle", color: "var(--clr-purple)", dot: "🟡" },
      blocked: { label: "Blocked", color: "#ef4444", dot: "🔴" },
      done: { label: "Done", color: "#8b5cf6", dot: "🟣" },
    },
    ja: {
      active: { label: "活動中", color: "var(--clr-cyan)", dot: "🟢" },
      idle: { label: "待機中", color: "var(--clr-purple)", dot: "🟡" },
      blocked: { label: "ブロック", color: "#ef4444", dot: "🔴" },
      done: { label: "完了", color: "#8b5cf6", dot: "🟣" },
    }
  };

  /**
   * Builds the HTML block to inject into a team card.
   */
  function buildStatusBlock(agent, lang) {
    const cfg = STATUS_CONFIG[lang] || STATUS_CONFIG.en;
    const statusCfg = cfg[agent.status] || { label: agent.status, color: "#94a3b8", dot: "⚪" };

    const completedTasks = agent['completed_tasks_' + lang] || agent.completed_tasks || [];
    const completedCount = completedTasks.length;
    const currentTask = agent['current_task_' + lang] || agent.current_task || '';

    // Completed tasks list (collapsed to save space; show up to 3)
    const taskListHtml = completedTasks
      .slice(0, 3)
      .map((t) => `<li class="completed-task-item">✓ ${t}</li>`)
      .join("");

    const moreLabel = lang === 'en' ? 'more' : '件以上';
    const moreCount = completedCount > 3 ? `<li class="task-more">+${completedCount - 3} ${moreLabel}</li>` : "";

    const currentlyLabel = lang === 'en' ? 'Currently:' : '現在:';
    const completedLabel = lang === 'en' 
      ? `${completedCount} task${completedCount !== 1 ? "s" : ""} completed`
      : `${completedCount} 件のタスク完了`;

    return `
      <div class="agent-status-block" data-status="${agent.status}">
        <div class="status-header">
          <span class="status-indicator" style="background:${statusCfg.color};box-shadow:0 0 8px ${statusCfg.color}80;">
          </span>
          <span class="status-label" style="color:${statusCfg.color};">${statusCfg.label}</span>
        </div>
        <div class="current-task">
          <span class="current-task-label">${currentlyLabel}</span>
          <span class="current-task-text">${currentTask}</span>
        </div>
        ${
          completedCount > 0
            ? `<details class="completed-tasks-details">
                <summary class="completed-tasks-summary">${completedLabel}</summary>
                <ul class="completed-tasks-list">
                  ${taskListHtml}
                  ${moreCount}
                </ul>
              </details>`
            : ""
        }
      </div>`;
  }

  /**
   * Injects status data into cards on the page.
   * Finds elements via [data-agent="Name"] attribute.
   */
  function injectAgentStatuses(agents, lang) {
    let injected = 0;

    agents.forEach((agent) => {
      const card = document.querySelector(`[data-agent="${agent.name}"]`);
      if (!card) {
        return;
      }

      // Remove any previously injected block (useful for refresh)
      const existing = card.querySelector(".agent-status-block");
      if (existing) existing.remove();

      // Dynamically update card role language
      const roleSpan = card.querySelector('.team-card__role');
      if (roleSpan) {
        roleSpan.innerHTML = agent['role_' + lang] || agent.role_en || agent.role;
      }

      // Apply accent border colour from JSON
      if (agent.accent_color) {
        card.style.setProperty("--agent-accent", agent.accent_color);
        card.style.borderColor = `${agent.accent_color}50`;
      }

      card.insertAdjacentHTML("beforeend", buildStatusBlock(agent, lang));
      injected++;
    });
  }

  /**
   * Optional: also populate a compact status bar if present.
   * Looks for #team-status-bar and renders a row of agent chips.
   */
  function populateStatusBar(agents, lang) {
    const bar = document.getElementById("team-status-bar");
    if (!bar) return;

    const cfgMap = STATUS_CONFIG[lang] || STATUS_CONFIG.en;

    bar.innerHTML = agents
      .map((agent) => {
        const cfg = cfgMap[agent.status] || { color: "#94a3b8" };
        const currentTask = agent['current_task_' + lang] || agent.current_task || '';
        const role = agent['role_' + lang] || agent.role_en || agent.role;
        return `
        <div class="status-bar-chip" title="${currentTask}">
          <span class="status-bar-dot" style="background:${cfg.color};"></span>
          <span class="status-bar-name">${agent.name}</span>
          <span class="status-bar-role">${role}</span>
        </div>`;
      })
      .join("");
  }

  /**
   * Renders an error notice into all agent cards.
   */
  function renderError(message) {
    document.querySelectorAll("[data-agent]").forEach((card) => {
      card.insertAdjacentHTML(
        "beforeend",
        `<div class="agent-status-error">⚠ ${message}</div>`
      );
    });
  }

  /**
   * Main entry point — fetches JSON and updates the page.
   */
  async function loadStatus() {
    const lang = localStorage.getItem('lang') || 'en';
    let data;
    try {
      const response = await fetch(DATA_PATH);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data = await response.json();
    } catch (err) {
      console.error("[load_status.js] Failed to load agent_status.json:", err);
      renderError(lang === 'en' ? "Could not load agent status." : "ステータスを読み込めませんでした。");
      return;
    }

    const agents = data.agents;
    if (!Array.isArray(agents) || agents.length === 0) {
      console.warn("[load_status.js] No agents found in agent_status.json.");
      return;
    }

    injectAgentStatuses(agents, lang);
    populateStatusBar(agents, lang);
    loadLatestUpdates(lang);
  }

  /**
   * Fetches projects.json and renders the latest 3 project update entries in #updates-feed.
   * Flattens all updates across all projects, sorts by timestamp (newest first).
   */
  async function loadLatestUpdates(lang) {
    const feed = document.getElementById("updates-feed");
    if (!feed) return;

    const PROJECTS_DATA_PATH = "data/projects.json";

    try {
      const response = await fetch(PROJECTS_DATA_PATH);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const projects = data.projects || [];

      // Flatten all updates across all projects
      const allUpdates = [];
      projects.forEach(project => {
        (project.updates || []).forEach(u => {
          allUpdates.push({
            ...u,
            project_title: project['title_' + lang] || project.title_en || ''
          });
        });
      });

      if (!allUpdates.length) return;

      // Sort by timestamp descending, take top 3
      const latest = allUpdates
        .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
        .slice(0, 3);

      feed.innerHTML = latest.map((update, idx) => {
        const title   = update['title_'   + lang] || update.title_en   || '';
        const content = update['content_' + lang] || update.content_en || '';

        let timeDisplay = '';
        if (update.timestamp) {
          try {
            const d = new Date(update.timestamp);
            timeDisplay = d.toLocaleDateString(lang === 'en' ? 'en-US' : 'ja-JP', {
              month: 'short', day: 'numeric', year: 'numeric'
            });
          } catch (_) { timeDisplay = update.timestamp; }
        }

        const cleanContent = String(content)
          .split(/\n{2,}/)[0]           // show only first paragraph for brevity
          .replace(/\n/g, '<br />')
          .replace(/•/g, '→');

        return `
          <article class="glass-card update-card update-card--project" data-reveal id="update-proj-${idx}">
            <div class="update-card__indicator" aria-hidden="true">📋</div>
            <div>
              <div class="update-card__meta">
                <span class="update-card__agent">${escapeHtml(update.project_title)}</span>
                <span class="update-card__type badge--update">${lang === 'en' ? 'Project Log' : 'プロジェクトログ'}</span>
                <span class="update-card__time mono">${escapeHtml(timeDisplay)}</span>
              </div>
              <p class="update-card__title" style="font-weight:600; color:var(--clr-text-primary); margin-bottom:var(--sp-2);">${escapeHtml(title)}</p>
              <p class="update-card__text">${cleanContent}</p>
            </div>
          </article>
        `;
      }).join('');

      // Re-trigger scroll animations for dynamically injected cards
      if (window.IntersectionObserver) {
        const items = feed.querySelectorAll('[data-reveal]');
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        items.forEach(el => observer.observe(el));
      }

    } catch (err) {
      console.warn("[load_status.js] Could not load project updates for homepage feed:", err);
    }
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
    const AGENT_META = {
      oli:   { emoji: '🧠', colorClass: 'update-card--oli', badgeAgent_en: 'Oli', badgeAgent_ja: 'オリ' },
      nova:  { emoji: '✨', colorClass: 'update-card--nova', badgeAgent_en: 'Nova', badgeAgent_ja: 'ノバ' },
      jb:    { emoji: '⚙️', colorClass: 'update-card--jb', badgeAgent_en: 'JB', badgeAgent_ja: 'ジェービー' },
      robin: { emoji: '🔍', colorClass: 'update-card--robin', badgeAgent_en: 'Robin', badgeAgent_ja: 'ロビン' },
    };

    const TYPE_BADGE = {
      update:   'badge--update',
      decision: 'badge--decision',
      question: 'badge--question',
      blocker:  'badge--blocker',
      blog:     'badge--decision',
    };

    const TYPE_LABEL = {
      en: { update: 'Update', decision: 'Decision', question: 'Question', blocker: 'Blocker', blog: 'Blog' },
      ja: { update: '更新', decision: '決定事項', question: '質問', blocker: '障害', blog: 'ブログ' }
    };

    try {
      const response = await fetch(BLOG_DATA_PATH);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const entries = data.entries || [];
      if (!entries.length) return;

      // Sort entries by id descending (newest first)
      const sorted = [...entries].sort((a, b) => b.id - a.id);
      // Take the top 3
      const latest = sorted.slice(0, 3);

      feed.innerHTML = latest.map(entry => {
        const agentKey = (entry.author || '').toLowerCase();
        const typeKey  = (entry.type  || '').toLowerCase();
        const meta     = AGENT_META[agentKey] || { emoji: '👤', colorClass: '', badgeAgent_en: entry.author, badgeAgent_ja: entry.author };
        const badgeCls = TYPE_BADGE[typeKey]  || 'badge--update';
        const typeLabel = (TYPE_LABEL[lang] && TYPE_LABEL[lang][typeKey]) || entry.type || 'Update';

        const contentVal = entry['content_' + lang] || entry.content || '';
        const dateVal = entry['date_' + lang] || entry.date || '';
        const agentNameVal = meta['badgeAgent_' + lang] || meta.badgeAgent_en;

        // Format date and time
        let timeDisplay = dateVal;
        if (entry.timestamp) {
          try {
            const d = new Date(entry.timestamp);
            const dateStr = d.toISOString().split('T')[0];
            const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            timeDisplay = `${dateStr} · ${timeStr}`;
          } catch (_) {}
        }

        // Clean up markdown style markers in content if any, and convert newlines to br
        const cleanContent = contentVal
          .replace(/\\n/g, '\n')
          .replace(/\n/g, '<br />');

        return `
          <article class="glass-card update-card ${meta.colorClass}" data-reveal id="update-${entry.id}">
            <div class="update-card__indicator" aria-hidden="true">${meta.emoji}</div>
            <div>
              <div class="update-card__meta">
                <span class="update-card__agent">${agentNameVal}</span>
                <span class="update-card__type ${badgeCls}">${typeLabel}</span>
                <span class="update-card__time mono">${timeDisplay}</span>
              </div>
              <p class="update-card__text">
                ${cleanContent}
              </p>
            </div>
          </article>
        `;
      }).join('');

      // Re-trigger scroll animations for dynamically injected cards if reveal observer exists
      if (window.IntersectionObserver) {
        const items = feed.querySelectorAll('[data-reveal]');
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        items.forEach(el => observer.observe(el));
      }

    } catch (err) {
      console.error("[load_status.js] Failed to load latest updates:", err);
    }
  }

  // Hook language changes
  window.addEventListener('languageChanged', () => {
    loadStatus();
  });

  // Auto-run when the DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadStatus);
  } else {
    loadStatus();
  }
})();
