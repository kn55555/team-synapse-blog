/**
 * meeting_room.js — JB / Backend Engineer
 * ─────────────────────────────────────────────────────────────
 * Fetches data/meeting_notes.json and dynamically renders the
 * conversation transcript in the Meeting Room chat panel.
 *
 * Features:
 *   - Renders all messages in chronological order
 *   - Detects the most recent message sender and highlights
 *     their video panel (active speaker highlighting)
 *   - Auto-scrolls to the latest message on load
 *   - Re-renders on EN/JP language change
 *   - Shows session metadata (title, date, status)
 *   - Colour-codes message types (update, decision, question, blocker)
 *   - Animates in messages with staggered reveal
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  const DATA_URL     = 'data/meeting_notes.json';
  const CHAT_ID      = 'meeting-chat';
  const SESSION_ID   = 'meeting-session-info';

  /* ── Agent colour/accent map ─────────────────────────────── */
  const AGENT_META = {
    oli:   { accent: '#8b5cf6', initial: 'OL', panelId: 'panel-oli'   },
    nova:  { accent: '#06b6d4', initial: 'NV', panelId: 'panel-nova'  },
    jb:    { accent: '#10b981', initial: 'JB', panelId: 'panel-jb'    },
    robin: { accent: '#f59e0b', initial: 'RB', panelId: 'panel-robin' },
  };

  /* ── Message type badge config ───────────────────────────── */
  const TYPE_CONFIG = {
    update:   { en: 'Update',    ja: '更新',      color: '#10b981' },
    decision: { en: 'Decision',  ja: '決定事項',  color: '#8b5cf6' },
    question: { en: 'Question',  ja: '質問',      color: '#06b6d4' },
    blocker:  { en: 'Blocker',   ja: '障害',      color: '#ef4444' },
  };

  /* ── Helpers ─────────────────────────────────────────────── */

  function getLang() {
    return localStorage.getItem('lang') || 'en';
  }

  function formatTimestamp(isoStr, lang) {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString(lang === 'en' ? 'en-US' : 'ja-JP', {
        hour: '2-digit', minute: '2-digit', hour12: false
      });
    } catch (_) {
      return isoStr;
    }
  }

  function getAgentMeta(agentName) {
    return AGENT_META[agentName.toLowerCase()] || {
      accent: '#94a3b8', initial: agentName.substring(0, 2).toUpperCase(), panelId: null
    };
  }

  /* ── Active speaker highlighting ─────────────────────────── */

  /**
   * Finds the panel for the most recent message sender and
   * adds the 'meeting-panel--speaking' class to it.
   * Removes the class from all other panels first.
   */
  function highlightActiveSpeaker(messages) {
    // Clear all existing speaker highlights
    document.querySelectorAll('.meeting-panel').forEach(panel => {
      panel.classList.remove('meeting-panel--speaking');
    });

    if (!messages || !messages.length) return;

    // Most recent message is the last in the sorted array
    const latest = messages[messages.length - 1];
    const meta = getAgentMeta(latest.agent);

    if (meta.panelId) {
      const panel = document.getElementById(meta.panelId);
      if (panel) {
        panel.classList.add('meeting-panel--speaking');
      }
    }
  }

  /* ── Session info header ─────────────────────────────────── */

  function renderSessionInfo(session, lang) {
    const container = document.getElementById(SESSION_ID);
    if (!container || !session) return;

    const title    = session['title_' + lang] || session.title_en || 'Meeting Session';
    const dateStr  = session.date || '';
    const statusEn = session.status || 'archived';
    const statusLabel = statusEn === 'live'
      ? (lang === 'en' ? '🔴 Live' : '🔴 ライブ')
      : (lang === 'en' ? '📁 Archived' : '📁 アーカイブ済み');

    container.innerHTML = `
      <div class="meeting-session-header">
        <div class="meeting-session-title">${title}</div>
        <div class="meeting-session-meta">
          <span class="meeting-session-date mono">${dateStr}</span>
          <span class="meeting-session-status">${statusLabel}</span>
        </div>
      </div>`;
  }

  /* ── Message rendering ───────────────────────────────────── */

  function buildMessageEl(msg, lang, index, isLatest) {
    const meta      = getAgentMeta(msg.agent);
    const typeCfg   = TYPE_CONFIG[msg.type] || TYPE_CONFIG.update;
    const typeLabel = typeCfg[lang] || typeCfg.en;
    const content   = msg['content_' + lang] || msg.content_en || '';
    const timeStr   = formatTimestamp(msg.timestamp, lang);
    const role      = msg['role_' + lang] || msg.role_en || '';

    // Convert newlines to <br>
    const bodyHtml = content
      .replace(/\\n/g, '\n')
      .replace(/\n/g, '<br />');

    const el = document.createElement('div');
    el.className = `chat-message chat-message--${msg.agent.toLowerCase()}${isLatest ? ' chat-message--latest' : ''}`;
    el.setAttribute('id', `msg-${msg.id}`);
    el.setAttribute('data-agent', msg.agent);
    el.setAttribute('data-type', msg.type);
    el.style.setProperty('--msg-accent', meta.accent);
    el.style.animationDelay = `${index * 0.035}s`;

    el.innerHTML = `
      <div class="chat-message__avatar" aria-hidden="true" style="background:${meta.accent}22;border:2px solid ${meta.accent}60;color:${meta.accent};">
        ${meta.initial}
      </div>
      <div class="chat-message__body">
        <div class="chat-message__header">
          <span class="chat-message__name" style="color:${meta.accent};">${msg.agent}</span>
          <span class="chat-message__role mono">${role}</span>
          <span class="chat-message__badge" style="background:${typeCfg.color}18;color:${typeCfg.color};border:1px solid ${typeCfg.color}40;">${typeLabel}</span>
          <span class="chat-message__time mono">${timeStr}</span>
        </div>
        <div class="chat-message__content">
          ${bodyHtml}
        </div>
      </div>`;

    return el;
  }

  function renderMessages(messages, lang) {
    const container = document.getElementById(CHAT_ID);
    if (!container) return;

    if (!messages || !messages.length) {
      container.innerHTML = `
        <div class="chat-empty">
          <p>${lang === 'en' ? 'No messages in this session yet.' : 'このセッションにはまだメッセージがありません。'}</p>
        </div>`;
      return;
    }

    // Sort by id ascending (chronological)
    const sorted = [...messages].sort((a, b) => a.id - b.id);

    // Group by date
    const grouped = {};
    sorted.forEach(msg => {
      let d = new Date();
      if (msg.timestamp) {
        try { d = new Date(msg.timestamp); } catch (e) {}
      }
      const dateKey = d.toLocaleDateString(lang === 'en' ? 'en-US' : 'ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(msg);
    });

    const frag = document.createDocumentFragment();

    const dates = Object.keys(grouped);
    dates.forEach((date, dateIndex) => {
      const items = grouped[date];
      const isLastDate = dateIndex === dates.length - 1;
      
      const detailsEl = document.createElement('details');
      detailsEl.className = 'chat-date-group';
      // Open the last date by default
      if (isLastDate) detailsEl.open = true;
      detailsEl.style.marginBottom = 'var(--sp-4)';

      const summaryEl = document.createElement('summary');
      summaryEl.style.padding = 'var(--sp-3) var(--sp-4)';
      summaryEl.style.background = 'var(--clr-surface)';
      summaryEl.style.border = '1px solid var(--clr-border)';
      summaryEl.style.borderRadius = 'var(--radius-sm)';
      summaryEl.style.fontWeight = '600';
      summaryEl.style.cursor = 'pointer';
      summaryEl.style.color = 'var(--clr-cyan)';
      summaryEl.style.listStyle = 'none';
      summaryEl.innerHTML = `<span style="font-size: 0.8rem; margin-right: var(--sp-2);">▶</span> ${date}`;
      detailsEl.appendChild(summaryEl);

      const contentEl = document.createElement('div');
      contentEl.style.padding = 'var(--sp-4) 0 0 0';

      items.forEach((msg, i) => {
        const isLatest = isLastDate && i === items.length - 1;
        contentEl.appendChild(buildMessageEl(msg, lang, i, isLatest));
      });

      detailsEl.appendChild(contentEl);
      frag.appendChild(detailsEl);
    });

    container.innerHTML = '';
    container.appendChild(frag);

    // Auto-scroll to latest message
    const latestEl = container.querySelector('.chat-message--latest');
    if (latestEl) {
      latestEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    // Update active speaker on panels
    highlightActiveSpeaker(sorted);
  }

  /* ── Loading / error states ──────────────────────────────── */

  function renderLoading(lang) {
    const container = document.getElementById(CHAT_ID);
    if (!container) return;
    container.innerHTML = `
      <div class="chat-loading">
        <span class="chat-loading__spinner"></span>
        <p>${lang === 'en' ? 'Loading session…' : 'セッションを読み込み中…'}</p>
      </div>`;
  }

  function renderError(lang) {
    const container = document.getElementById(CHAT_ID);
    if (!container) return;
    container.innerHTML = `
      <div class="chat-error">
        <span>⚠️</span>
        <p>${lang === 'en'
          ? 'Could not load meeting notes. Make sure data/meeting_notes.json exists.'
          : 'ミーティングノートを読み込めませんでした。data/meeting_notes.json が存在するか確認してください。'}</p>
      </div>`;
  }

  /* ── Main entry point ────────────────────────────────────── */

  async function loadMeetingRoom() {
    const lang = getLang();
    renderLoading(lang);

    let data;
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data = await response.json();
    } catch (err) {
      console.error('[meeting_room.js] Failed to fetch meeting_notes.json:', err);
      renderError(lang);
      return;
    }

    renderSessionInfo(data.session, lang);
    renderMessages(data.messages, lang);

    console.log(`[meeting_room.js] ✓ Loaded ${(data.messages || []).length} messages.`);
  }

  /* ── Language change hook ────────────────────────────────── */

  window.addEventListener('languageChanged', loadMeetingRoom);

  /* ── Public API ──────────────────────────────────────────── */

  /**
   * window.postMeetingMessage(msgObj)
   * ─────────────────────────────────────────────────────────
   * Appends a new message to meeting_notes.json via the server API
   * (when server.py is running). Falls back to a localStorage draft.
   *
   * msgObj fields:
   *   agent      {string}  e.g. "Oli", "JB", "Nova", "Robin"
   *   role_en    {string}  English role label
   *   role_ja    {string}  Japanese role label (optional — server auto-translates)
   *   type       {string}  "update" | "decision" | "question" | "blocker"
   *   content_en {string}  Message body in English
   *   content_ja {string}  Message body in Japanese (optional — server auto-translates)
   *   timestamp  {string}  ISO 8601 (optional — defaults to now)
   *
   * Returns a Promise that resolves with { ok: true, source: 'server'|'localStorage' }.
   */
  window.postMeetingMessage = async function (msgObj) {
    const timestamp = msgObj.timestamp || new Date().toISOString();
    const payload = {
      message: {
        agent:      msgObj.agent      || 'Unknown',
        role_en:    msgObj.role_en    || '',
        role_ja:    msgObj.role_ja    || '',
        type:       msgObj.type       || 'update',
        content_en: msgObj.content_en || '',
        content_ja: msgObj.content_ja || '',
        timestamp
      }
    };

    // Try server first
    try {
      const res = await fetch('/api/save-meeting-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === 'success') {
        console.log(`[meeting_room.js] Message posted via server (total: ${data.total}).`);
        // Reload to reflect the new persisted message
        await loadMeetingRoom();
        return { ok: true, source: 'server' };
      }
    } catch (_) {
      // Server not running — fall back to localStorage draft
    }

    // localStorage fallback: append to a local draft array
    const draftKey = 'meeting_notes_draft';
    let draft;
    try { draft = JSON.parse(localStorage.getItem(draftKey) || 'null'); } catch (_) {}
    if (!draft || !draft.messages) {
      // Seed draft from last fetched data if possible
      draft = { messages: [] };
    }
    const nextId = Math.max(0, ...draft.messages.map(m => m.id || 0)) + 1;
    draft.messages.push({ id: nextId, ...payload.message });
    localStorage.setItem(draftKey, JSON.stringify(draft));
    console.warn('[meeting_room.js] Server unavailable — message saved to localStorage draft.');

    // Re-render from the merged draft so user sees the new message immediately
    const lang = getLang();
    renderMessages(draft.messages, lang);
    return { ok: true, source: 'localStorage' };
  };

  /**
   * window.reloadMeetingRoom()
   * Force a fresh fetch and re-render of the meeting room.
   */
  window.reloadMeetingRoom = loadMeetingRoom;

  /* ── Auto-run ────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMeetingRoom);
  } else {
    loadMeetingRoom();
  }

})();
