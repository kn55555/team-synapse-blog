/**
 * load_blog.js — JB / Backend Engineer
 * ─────────────────────────────────────────────────────────────
 * Fetches blog_entries.json and dynamically renders blog post
 * cards into the Journey Log timeline on journey.html.
 * Supports bilingual EN/JP rendering and re-renders on languageChanged.
 * BUG-014 FIX: Now reads bilingual fields (title_en/ja, content_en/ja,
 * date_en/ja, role_en/ja) instead of legacy single-language fields.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  "use strict";

  const DATA_PATH = "data/blog_entries.json";
  const CONTAINER_ID = "journey-feed";

  // Tag colour palette — cycles through these for visual variety
  const TAG_COLORS = [
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ec4899", // pink
    "#3b82f6", // blue
  ];

  /**
   * Returns an HSL-consistent colour for a given tag string.
   * Same tag always gets the same colour within a session.
   */
  function tagColor(tag) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = (hash * 31 + tag.charCodeAt(i)) & 0xffffffff;
    }
    return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
  }

  /**
   * Maps entry type strings to badge labels and colours.
   */
  const TYPE_BADGE = {
    UPDATE: { label: "UPDATE", color: "#10b981" },
    DECISION: { label: "DECISION", color: "#8b5cf6" },
    QUESTION: { label: "QUESTION", color: "#06b6d4" },
    BLOCKER: { label: "BLOCKER", color: "#ef4444" },
  };

  /**
   * Builds the HTML string for a single blog entry card.
   * BUG-014 FIX: Reads bilingual fields using active lang from localStorage.
   */
  function buildEntryCard(entry) {
    const lang = localStorage.getItem('lang') || 'en';

    // Resolve bilingual fields — fall back to legacy single-key fields
    const title   = entry['title_'   + lang] || entry.title   || '';
    const content = entry['content_' + lang] || entry.content || '';
    const dateStr = entry['date_'    + lang] || entry.date    || '';
    const role    = entry['role_'    + lang] || entry.role    || '';

    // Type badge
    const typeMeta = TYPE_BADGE[entry.type] || { label: entry.type, color: "#94a3b8" };
    const typeBadge = `<span class="entry-type-badge" style="background:${typeMeta.color}20;color:${typeMeta.color};border:1px solid ${typeMeta.color}40;">${typeMeta.label}</span>`;

    // Tags
    const tagsHtml = (entry.tags || [])
      .map((tag) => {
        const c = tagColor(tag);
        return `<span class="entry-tag" style="background:${c}18;color:${c};border:1px solid ${c}35;">#${tag}</span>`;
      })
      .join("");

    // Format timestamp
    let dateDisplay = dateStr;
    if (entry.timestamp) {
      try {
        const d = new Date(entry.timestamp);
        const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        dateDisplay = `${dateStr} &middot; ${timeStr}`;
      } catch (_) {}
    }

    // Convert newlines to HTML breaks
    const bodyHtml = content.replace(/\\n/g, '\n').replace(/\n/g, '<br />');

    return `
      <article class="journey-entry-card" id="entry-${entry.id}" data-author="${entry.author}" data-type="${entry.type || ''}">
        <div class="entry-timeline-dot"></div>
        <div class="entry-card-inner">
          <header class="entry-card-header">
            <div class="entry-meta-row">
              <span class="entry-date">${dateDisplay}</span>
              ${typeBadge}
            </div>
            <h2 class="entry-title">${title}</h2>
            <div class="entry-author-row">
              <span class="entry-author-chip">
                <span class="entry-author-avatar">${entry.author.substring(0, 2).toUpperCase()}</span>
                <span class="entry-author-name">${entry.author}</span>
                <span class="entry-author-role">${role}</span>
              </span>
            </div>
          </header>
          <div class="entry-content">${bodyHtml}</div>
          <footer class="entry-card-footer">
            <div class="entry-tags">${tagsHtml}</div>
          </footer>
        </div>
      </article>`;
  }

  /**
   * Renders a full error state into the container.
   */
  function renderError(container, message) {
    container.innerHTML = `
      <div class="blog-load-error">
        <span class="error-icon">⚠</span>
        <p>${message}</p>
        <small>Make sure data/blog_entries.json is present and the page is served over HTTP.</small>
      </div>`;
  }

  /**
   * Renders an empty state when there are no entries.
   */
  function renderEmpty(container) {
    container.innerHTML = `
      <div class="blog-load-empty">
        <span class="empty-icon">📋</span>
        <p>No journey entries yet. Check back soon!</p>
      </div>`;
  }

  /**
   * Sets up filter buttons (if present) so viewers can filter by
   * author or entry type.  Filter buttons should carry data attributes:
   *   data-filter-author="JB"   or   data-filter-type="UPDATE"
   * A button with data-filter-author="all" resets the filter.
   */
  function setupFilters(entries) {
    document.querySelectorAll("[data-filter-author]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const author = btn.dataset.filterAuthor;
        document.querySelectorAll(".journey-entry-card").forEach((card) => {
          if (author === "all" || card.dataset.author === author) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
        // active state toggle
        document.querySelectorAll("[data-filter-author]").forEach((b) => b.classList.remove("filter-active"));
        btn.classList.add("filter-active");
      });
    });

    document.querySelectorAll("[data-filter-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.filterType;
        document.querySelectorAll(".journey-entry-card").forEach((card) => {
          if (type === "all" || card.dataset.type === type) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
        document.querySelectorAll("[data-filter-type]").forEach((b) => b.classList.remove("filter-active"));
        btn.classList.add("filter-active");
      });
    });
  }

  /**
   * Main entry point — fetches JSON and renders the feed.
   */
  async function loadBlog() {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) {
      console.warn(`[load_blog.js] Container #${CONTAINER_ID} not found. Add <section id="journey-feed"> to journey.html.`);
      return;
    }

    // Show loading skeleton
    container.innerHTML = `<div class="blog-loading"><span class="loading-spinner"></span><p>Loading journey entries…</p></div>`;

    let data;
    try {
      const response = await fetch(DATA_PATH);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data = await response.json();
    } catch (err) {
      console.error("[load_blog.js] Failed to load blog_entries.json:", err);
      renderError(container, "Could not load blog entries. Please ensure the data file exists.");
      return;
    }

    const entries = data.entries;
    if (!Array.isArray(entries) || entries.length === 0) {
      renderEmpty(container);
      return;
    }

    // Sort entries newest-first (by id descending)
    const sorted = [...entries].sort((a, b) => b.id - a.id);

    container.innerHTML = sorted.map(buildEntryCard).join("");
    setupFilters(entries);

    console.log(`[load_blog.js] ✓ Rendered ${entries.length} blog entries.`);
  }

  // Re-render on language change (BUG-014 fix)
  window.addEventListener('languageChanged', loadBlog);

  // Auto-run when the DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadBlog);
  } else {
    loadBlog();
  }
})();
