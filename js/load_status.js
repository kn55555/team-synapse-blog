/**
 * load_status.js — JB / Backend Engineer
 * ─────────────────────────────────────────────────────────────
 * Fetches agent_status.json and updates the team member cards
 * on the homepage (index.html) with each person's live status,
 * current task, and completed task count.
 *
 * NOVA — HOW TO CONNECT:
 *   1. Give each team member card a data attribute matching the
 *      agent's name (case-sensitive, must match agent_status.json):
 *
 *        <div class="team-card" data-agent="Oli">
 *          <!-- existing card content -->
 *          <!-- The script will inject a .agent-status-block here -->
 *        </div>
 *
 *   2. Drop this script tag at the bottom of <body> in index.html:
 *        <script src="js/load_status.js"></script>
 *
 *   The script will find every [data-agent] card and inject a
 *   status block showing the current task and a live status dot.
 *   No other changes needed on your side.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  "use strict";

  const DATA_PATH = "data/agent_status.json";

  /**
   * Maps status strings to display properties.
   */
  const STATUS_CONFIG = {
    active: { label: "Active", color: "#10b981", dot: "🟢" },
    idle: { label: "Idle", color: "#f59e0b", dot: "🟡" },
    blocked: { label: "Blocked", color: "#ef4444", dot: "🔴" },
    done: { label: "Done", color: "#8b5cf6", dot: "🟣" },
  };

  /**
   * Builds the HTML block to inject into a team card.
   */
  function buildStatusBlock(agent) {
    const statusCfg = STATUS_CONFIG[agent.status] || { label: agent.status, color: "#94a3b8", dot: "⚪" };
    const completedCount = (agent.completed_tasks || []).length;

    // Completed tasks list (collapsed to save space; show up to 3)
    const taskListHtml = (agent.completed_tasks || [])
      .slice(0, 3)
      .map((t) => `<li class="completed-task-item">✓ ${t}</li>`)
      .join("");
    const moreCount = completedCount > 3 ? `<li class="task-more">+${completedCount - 3} more</li>` : "";

    return `
      <div class="agent-status-block" data-status="${agent.status}">
        <div class="status-header">
          <span class="status-indicator" style="background:${statusCfg.color};box-shadow:0 0 8px ${statusCfg.color}80;">
          </span>
          <span class="status-label" style="color:${statusCfg.color};">${statusCfg.label}</span>
        </div>
        <div class="current-task">
          <span class="current-task-label">Currently:</span>
          <span class="current-task-text">${agent.current_task}</span>
        </div>
        ${
          completedCount > 0
            ? `<details class="completed-tasks-details">
                <summary class="completed-tasks-summary">${completedCount} task${completedCount !== 1 ? "s" : ""} completed</summary>
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
  function injectAgentStatuses(agents) {
    let injected = 0;

    agents.forEach((agent) => {
      const card = document.querySelector(`[data-agent="${agent.name}"]`);
      if (!card) {
        console.warn(`[load_status.js] No card found for agent "${agent.name}". Add data-agent="${agent.name}" to the card element.`);
        return;
      }

      // Remove any previously injected block (useful for refresh)
      const existing = card.querySelector(".agent-status-block");
      if (existing) existing.remove();

      // Apply accent border colour from JSON
      if (agent.accent_color) {
        card.style.setProperty("--agent-accent", agent.accent_color);
        card.style.borderColor = `${agent.accent_color}50`;
      }

      card.insertAdjacentHTML("beforeend", buildStatusBlock(agent));
      injected++;
    });

    if (injected > 0) {
      console.log(`[load_status.js] ✓ Updated ${injected} agent card(s).`);
    }
  }

  /**
   * Optional: also populate a compact status bar if present.
   * Looks for #team-status-bar and renders a row of agent chips.
   */
  function populateStatusBar(agents) {
    const bar = document.getElementById("team-status-bar");
    if (!bar) return;

    bar.innerHTML = agents
      .map((agent) => {
        const cfg = STATUS_CONFIG[agent.status] || { color: "#94a3b8" };
        return `
        <div class="status-bar-chip" title="${agent.current_task}">
          <span class="status-bar-dot" style="background:${cfg.color};"></span>
          <span class="status-bar-name">${agent.name}</span>
          <span class="status-bar-role">${agent.role}</span>
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
    let data;
    try {
      const response = await fetch(DATA_PATH);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data = await response.json();
    } catch (err) {
      console.error("[load_status.js] Failed to load agent_status.json:", err);
      renderError("Could not load agent status.");
      return;
    }

    const agents = data.agents;
    if (!Array.isArray(agents) || agents.length === 0) {
      console.warn("[load_status.js] No agents found in agent_status.json.");
      return;
    }

    injectAgentStatuses(agents);
    populateStatusBar(agents);
    loadLatestUpdates();
  }

  /**
   * Fetches blog_entries.json and renders the latest 3 updates in #updates-feed.
   */
  async function loadLatestUpdates() {
    const feed = document.getElementById("updates-feed");
    if (!feed) return;

    const BLOG_DATA_PATH = "data/blog_entries.json";
    const AGENT_META = {
      oli:   { emoji: '🧠', colorClass: 'update-card--oli' },
      nova:  { emoji: '✨', colorClass: 'update-card--nova' },
      jb:    { emoji: '⚙️', colorClass: 'update-card--jb' },
      robin: { emoji: '🔍', colorClass: 'update-card--robin' },
    };

    const TYPE_BADGE = {
      update:   'badge--update',
      decision: 'badge--decision',
      question: 'badge--question',
      blocker:  'badge--blocker',
      blog:     'badge--decision',
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
        const meta     = AGENT_META[agentKey] || { emoji: '👤', colorClass: '' };
        const badgeCls = TYPE_BADGE[typeKey]  || 'badge--update';

        // Format date and time
        let timeDisplay = entry.date;
        if (entry.timestamp) {
          try {
            const d = new Date(entry.timestamp);
            const dateStr = d.toISOString().split('T')[0];
            const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            timeDisplay = `${dateStr} · ${timeStr}`;
          } catch (_) {}
        }

        // Clean up markdown style markers in content if any, and convert newlines to br
        const cleanContent = entry.content
          .replace(/\\n/g, '\n')
          .replace(/\n/g, '<br />');

        return `
          <article class="glass-card update-card ${meta.colorClass}" data-reveal id="update-${entry.id}">
            <div class="update-card__indicator" aria-hidden="true">${meta.emoji}</div>
            <div>
              <div class="update-card__meta">
                <span class="update-card__agent">${entry.author}</span>
                <span class="update-card__type ${badgeCls}">${entry.type || 'Update'}</span>
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

  // Auto-run when the DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadStatus);
  } else {
    loadStatus();
  }
})();
