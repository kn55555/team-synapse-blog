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

    // Build fragment for performance
    const frag = document.createDocumentFragment();
    sorted.forEach((msg, i) => {
      const isLatest = i === sorted.length - 1;
      frag.appendChild(buildMessageEl(msg, lang, i, isLatest));
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

  /* ── Auto-run ────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMeetingRoom);
  } else {
    loadMeetingRoom();
  }

})();
