# QA Checklist — Team Synapse Blog Website
**Prepared by:** Robin (QA & Documentation Engineer)  
**Last Updated:** 2026-06-11 (v4.0 — Phase 4: Projects Catalog + Server Backend)  
**Version:** 4.0

---

## File Presence

- [x] `index.html` — Homepage
- [x] `meeting-room.html` — Meeting Room
- [x] `author.html` — Author Portal
- [x] `projects.html` — Projects Catalog ✅ NEW
- [x] `css/style.css`
- [x] `js/main.js`
- [x] `js/projects.js` ✅ NEW
- [x] `js/load_config.js`
- [x] `js/load_status.js`
- [x] `js/load_blog.js`
- [x] `js/journey.js` (retained, but journey.html removed)
- [x] `data/projects.json` ✅ NEW — 1 project, 4 log entries
- [x] `data/site_config.json`
- [x] `data/agent_status.json`
- [x] `data/author_thoughts.json`
- [x] `server.py` ✅ NEW — Python HTTP server with write-back API

> **Note:** `about.html` and `journey.html` have been removed. Site now has 4 pages: index, meeting-room, projects, author.

---

## Phase 4: Projects Catalog (`projects.html` + `projects.js`)

### `projects.html`
- [x] Page loads with correct title (`Projects — AI engineering team`)
- [x] Meta description present
- [x] Single `<h1>` — "Projects Catalog" with ID `projects-heading`
- [x] `#projects-timeline` container present for dynamic render
- [x] `projects.js` loaded via `<script defer>`
- [x] `main.js` loaded (language switcher)
- [x] `load_config.js` loaded (config IDs)
- [x] `data-config-key="site_name"` on navbar brand name
- [x] Lang toggle button pre-populated "JP"
- [x] Footer includes `projects.html` link

### `js/projects.js`
- [x] Async fetch from `data/projects.json`
- [x] Empty state renders when `projects.json` has no entries
- [x] Project folder card rendered per project entry
- [x] Robin's log updates rendered as timeline items within each folder
- [x] Bilingual: reads `title_en`/`title_ja`, `status_en`/`status_ja`, `desc_en`/`desc_ja`
- [x] Update entries: reads `title_en`/`title_ja`, `content_en`/`content_ja`
- [x] Timestamp formatted via `Intl.DateTimeFormat` for locale (`en-US` / `ja-JP`)
- [x] Re-renders on `languageChanged` event
- [x] HTML escaped via `escapeHtml()` — XSS protected
- [x] Error state renders if fetch fails
- [ ] ⚠️ Empty state text hardcoded in JS (BUG-023) — doesn't update on language switch after render

### `data/projects.json`
- [x] Parses without errors
- [x] 1 project entry: "Smart Grid Load Balancer — Phase 1"
- [x] All bilingual fields present: `title_en/ja`, `status_en/ja`, `desc_en/ja`
- [x] 4 update log entries, each with `title_en/ja`, `content_en/ja`, `timestamp`
- [x] Content is substantive — covers kickoff, requirements, test results, bug tracking

---

## Phase 4: Server Backend (`server.py`)

### HTTP Server
- [x] Python stdlib only — no external dependencies
- [x] Serves static files via `SimpleHTTPRequestHandler`
- [x] CORS headers set for development
- [x] Runs on port 3000

### `/api/save-config` (POST)
- [x] Reads current `data/site_config.json`
- [x] Merges payload into existing config (does not wipe unmentioned keys)
- [x] Writes updated config back to `data/site_config.json`
- [x] Auto-translates EN→JA if Japanese field is blank (via Google Translate unofficial API)
- [x] Triggers `git add / commit / push` in background thread after save
- [ ] ⚠️ Git failure is silent — response already sent `200 OK` before deploy completes (BUG-021)

### `/api/save-thoughts` (POST)
- [x] Reads thoughts array from payload
- [x] Auto-translates EN→JA for any thought with blank Japanese text
- [x] Writes to `data/author_thoughts.json`
- [x] Triggers git push in background thread

### Auto-Translation
- [x] `translate_en_to_ja()` uses Google Translate informal endpoint
- [x] Fallback: returns English text if translation fails (no crash)
- [ ] ⚠️ Unofficial API endpoint — not production-stable (BUG-022)

### Git Deploy Pipeline
- [x] `trigger_git_deploy()` runs `git add`, `git commit`, `git push`
- [x] Runs in background thread (non-blocking)
- [x] CalledProcessError caught and logged to stdout
- [ ] ⚠️ No pre-check for git configuration (BUG-021)

---

## Navigation Consistency

| Page | Projects in Navbar | Projects in Footer |
|---|---|---|
| `index.html` | ✅ | ✅ |
| `projects.html` | ✅ | ✅ |
| `meeting-room.html` | ✅ | ✅ |
| `author.html` | ✅ | ✅ |

---

## Phase 3 — Carried Forward (All ✅)

- [x] Contrast tokens WCAG AA ✅
- [x] Hero stat bar removed ✅
- [x] `site_config.json` 15+ bilingual keys ✅
- [x] `load_config.js` on all pages ✅
- [x] Author portal config editor functional ✅

---

## Phase 2 — Carried Forward (All ✅)

- [x] 🍃 Branding on all pages ✅
- [x] EN/JP language switcher ✅
- [x] Lang toggle "JP" pre-populated ✅
- [x] `author.html` in all footers ✅

---

## Auth & Security

- [x] BUG-011 resolved — password hash in `site_config.json` (SHA-256)
- [x] BUG-012 resolved — `server.py` provides real write-back; localStorage no longer the only persistence

---

## Final QA Sign-Off (Phase 4)

| Category | Status |
|---|---|
| File presence (all 18 files) | ✅ PASS |
| `projects.html` structure | ✅ PASS |
| `projects.js` rendering & i18n | ✅ PASS (BUG-023 minor) |
| `projects.json` content | ✅ PASS — 1 project, 4 entries |
| `server.py` save-config API | ✅ PASS (BUG-021 medium) |
| `server.py` save-thoughts API | ✅ PASS |
| `server.py` auto-translation | ✅ PASS (BUG-022 medium, unofficial API) |
| `server.py` git deploy pipeline | ⚠️ PARTIAL — silent failure on error |
| Navigation (4 pages) | ✅ PASS |
| Auth (password hash) | ✅ PASS |
| Persistence (real write-back) | ✅ PASS |
| All Phase 3 items | ✅ PASS |
| All Phase 2 items | ✅ PASS |

**Overall Phase 4 Status: ✅ PASS**  
All major deliverables functional. 3 open bugs (2 medium, 1 low) — none are critical blockers. The server.py git deploy silent failure (BUG-021) is the most important to address before heavy author use.
