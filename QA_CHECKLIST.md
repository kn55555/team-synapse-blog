# QA Checklist — Team Synapse Blog Website
**Prepared by:** Robin (QA & Documentation Engineer)  
**Last Updated:** 2026-06-12 (v5.0 — Phase 2: Virtual Meeting Room)  
**Version:** 5.0

---

## File Presence

- [x] `index.html`
- [x] `meeting-room.html` ← updated (Phase 2)
- [x] `projects.html`
- [x] `author.html`
- [x] `css/style.css` ← updated (Phase 2 animations)
- [x] `js/main.js`
- [x] `js/meeting_room.js` ✅ NEW
- [x] `js/projects.js`
- [x] `js/load_config.js`
- [x] `js/load_status.js`
- [x] `data/meeting_notes.json` ✅ NEW — 25-message bilingual session
- [x] `data/projects.json`
- [x] `data/site_config.json`
- [x] `data/agent_status.json`
- [x] `data/author_thoughts.json`
- [x] `server.py`

---

## Phase 2: Virtual Meeting Room

### `meeting-room.html` — Structure

- [x] Page loads with correct `<title>` tag
- [x] Meta description updated to Phase 2 description
- [x] Single `<h1 id="meeting-heading">` present
- [x] Navbar: Home | Projects | Meeting Room | About Author (all 4 links correct)
- [x] Lang toggle pre-populated "JP"
- [x] Footer with all 4 page links
- [x] `js/main.js` loaded (language switcher)
- [x] `js/load_config.js` loaded (config IDs)
- [x] `js/meeting_room.js` loaded (meeting renderer)

### SVG Cartoon Avatars

- [x] Oli — sage-green shirt, round glasses, thinker pose, ear detail, eye shine
- [x] Nova — peach-orange top, long dark hair, wide smile, cheek blush, eye shine
- [x] JB — steel-blue hoodie, kangaroo pocket, short cropped hair, neutral expression
- [x] Robin — lavender cardigan, curly hair, holding clipboard
- [x] All 4 avatars inline SVG — no external images
- [x] All avatars in `viewBox="0 0 120 150"` — consistent coordinate system
- [x] Skin tones, ears, eye highlights present on all

### CSS Animations (`style.css`)

- [x] `idleSway` — gentle body rotation, 5s cycle
- [x] `headTilt` — slow head tilt oscillation, 7s cycle
- [x] `blink` — scaleY collapse on `.avatar-eye-l`/`.avatar-eye-r`, 4.5s cycle
- [x] `breathe` — belly ellipse scale, 3.5s cycle
- [x] `speakingLean` — applied via `.is-speaking` class: body lean + panel glow border
- [x] `soundBar` — alternating bar heights on `.soundwave__bar`, 0.8s cycle
- [x] `pulse-dot` — live indicator, 2s cycle
- [x] `chatMsgIn` — slide-up for incoming messages, 0.35s

### Chat Panel

- [x] `id="meeting-chat"` container present ← **matches `meeting_room.js` `CHAT_ID`**
- [x] `id="meeting-session-info"` container present ← **matches `meeting_room.js` `SESSION_ID`**
- [x] `aria-live="polite"` on chat container (accessibility)
- [x] Panel IDs: `id="panel-oli"`, `id="panel-nova"`, `id="panel-jb"`, `id="panel-robin"` ← match `AGENT_META` keys (JS uses `.toLowerCase()`)

### `js/meeting_room.js`

- [x] Async fetch from `data/meeting_notes.json`
- [x] Reads `data.session` (object) and `data.messages` (array) — matches JSON schema
- [x] `renderSessionInfo()` reads `session.title_en/ja`, `session.date`, `session.status`
- [x] `renderMessages()` reads `msg.content_en/ja`, `msg.role_en/ja`, `msg.agent`, `msg.type`, `msg.timestamp`
- [x] Messages sorted by `id` ascending (chronological)
- [x] Latest message (last in sorted array) receives `.chat-message--latest` class
- [x] Auto-scroll to `.chat-message--latest` on load via `scrollIntoView({ behavior: 'smooth' })`
- [x] `highlightActiveSpeaker()` reads last message agent → adds `.is-speaking` to their panel
- [x] XSS protection via `escapeHtml()` on all message content
- [x] `languageChanged` event listener — re-renders on language switch
- [x] Graceful error state if JSON fetch fails
- [x] Graceful empty state if `messages.length === 0`

### `data/meeting_notes.json`

- [x] Valid JSON — parses without errors
- [x] Top-level `"session"` object with `id`, `title_en`, `title_ja`, `date`, `status`
- [x] Top-level `"messages"` array with 25 entries
- [x] All messages have: `id`, `agent`, `timestamp`, `type`, `role_en`, `role_ja`, `content_en`, `content_ja`
- [x] `agent` values: Oli, JB, Nova, Robin (all present, mixed distribution)
- [x] `type` values used: `update`, `decision`, `question` (3 of 4 types present; `blocker` type unused but handled by JS)
- [x] Messages cover: standups, architectural decisions, QA expansion, API design, latency testing, sign-off criteria
- [x] 25 messages (exceeds minimum of 20 required by Oli's brief)
- [x] Full bilingual content — all `content_en` and `content_ja` fields populated with substantive text
- [x] Timestamps in ISO 8601 format with UTC offset (`-04:00`)
- [x] Chronological by `id` (msgs 1→25, 09:00→09:42)

---

## Phase 1: Smart Grid Project — QA Sign-Off Criteria

As agreed in meeting session (msg 22, Oli's decision):

- [ ] All 24 test cases pass in both parallel and sequential mode where expected
- [ ] Latency tests 23 and 24 pass on at least 3 consecutive runs
- [ ] Event emitter schema matches agreed JSON contract exactly (see msg 6)
- [ ] Processing mode toggle functional in UI (visual difference verified by Robin)
- [ ] Robin signs off in TEAM_LOG

**Status: ⏳ Awaiting JB's redistribution PR implementation**

---

## Phase 2: Navigation Consistency

| Page | All 4 links in Navbar | All 4 links in Footer |
|---|---|---|
| `index.html` | ✅ | ✅ |
| `meeting-room.html` | ✅ | ✅ |
| `projects.html` | ✅ | ✅ |
| `author.html` | ✅ | ✅ |

---

## Carried Forward: All Phase 3–4 Items ✅

- [x] Contrast tokens WCAG AA ✅
- [x] `site_config.json` + `load_config.js` on all pages ✅
- [x] `server.py` write-back API ✅
- [x] Auth — SHA-256 hash ✅
- [x] Projects catalog with Robin's log updates ✅

---

## Open Bugs (from BUGS.md)

| ID | Severity | Description |
|---|---|---|
| BUG-021 | 🟡 Medium | `server.py` git deploy silent failure |
| BUG-022 | 🟡 Medium | Unofficial translation API |
| BUG-023 | 🟢 Low | `projects.js` empty state language switch |

---

## Phase 2 QA Sign-Off

| Category | Status |
|---|---|
| `meeting-room.html` structure | ✅ PASS |
| SVG avatars (all 4) | ✅ PASS |
| CSS animations (all 8) | ✅ PASS |
| Chat container ID alignment | ✅ PASS — `meeting-chat` / `meeting-session-info` match JS constants |
| Panel ID alignment | ✅ PASS — `panel-{agent}` IDs match `AGENT_META` keys |
| `meeting_room.js` | ✅ PASS |
| JSON schema alignment | ✅ PASS — `session`/`messages` structure matches JS reads |
| `meeting_notes.json` content | ✅ PASS — 25 messages, fully bilingual, all types |
| Auto-scroll | ✅ PASS |
| Active speaker highlighting | ✅ PASS |
| Language switch re-render | ✅ PASS |
| Navigation (4 pages) | ✅ PASS |

**Overall Phase 2 Status: ✅ PASS**  
All Virtual Meeting Room deliverables functional. Schema alignment confirmed. 25-message bilingual session complete. Smart Grid Phase 1 sign-off criteria documented and awaiting JB's redistribution PR.
