# QA Checklist — Team Synapse Blog Website
**Prepared by:** Robin (QA & Documentation Engineer)  
**Last Updated:** 2026-06-12 (v6.0 — Phase 2 Round 2: Server Integration + Cleanup QA)  
**Version:** 6.0

---

## File Presence

- [x] `index.html` ← encoding fixed by Nova; structure updated by Oli
- [x] `meeting-room.html` ← SVG avatars + chat panel (Nova, Phase 2)
- [x] `projects.html`
- [x] `author.html`
- [x] `css/style.css` ← meeting room animations added
- [x] `js/main.js`
- [x] `js/meeting_room.js` ← `postMeetingMessage` + `reloadMeetingRoom` public APIs (JB)
- [x] `js/projects.js` ← clickable folder grid, `saveProjectUpdate` + `reloadProjects` public APIs (Nova/JB)
- [x] `js/load_status.js` ← `loadLatestUpdates` re-enabled (BUG-025 fix)
- [x] `js/load_config.js`
- [x] `data/meeting_notes.json` — 25-message bilingual session
- [x] `data/projects.json` ← RESTORED (BUG-DATA-001 fix) — Smart Grid Phase 1, 5 entries
- [x] `data/site_config.json`
- [x] `data/agent_status.json`
- [x] `data/author_thoughts.json`
- [x] `server.py` ← 4 endpoints, hardened git deploy

---

## Phase 2 Round 2: Server Integration

### `server.py` — New Endpoints

#### POST `/api/save-meeting-notes`
- [x] Supports single-message append: `{ message: {...} }`
- [x] Supports full replace: `{ session: {...}, messages: [...] }`
- [x] Single append: auto-assigns next `id` (max existing + 1)
- [x] Auto-translates `content_ja` if empty
- [x] Saves to `data/meeting_notes.json`
- [x] Triggers git push in background thread with commit_msg `'data: Append meeting message via Portal'`
- [x] Returns `{ status, message, total }` — message count included

#### POST `/api/save-projects`
- [x] Supports single update append: `{ project_id, update: {...} }`
- [x] Supports full replace: `{ projects: [...] }`
- [x] Single append: finds project by `str(project.get('id')) == str(project_id)` — string-coerced comparison
- [x] Auto-assigns `id` and `timestamp` to appended update
- [x] Auto-translates `title_ja` and `content_ja` if empty
- [x] Saves to `data/projects.json`
- [x] Triggers git push with commit_msg `'data: Add project update via Portal'`

#### `trigger_git_deploy()` hardening
- [x] Accepts `commit_msg` parameter (no longer hardcoded)
- [x] Handles `"nothing to commit"` gracefully — checks stderr before raising
- [x] BUG-021 partially resolved ✅

### `js/meeting_room.js` — Public API
- [x] `window.postMeetingMessage(msgObj)` → `Promise<{ok, source}>`
- [x] POSTs `{ message: {...} }` to `/api/save-meeting-notes`
- [x] On success: reloads full session from server (fresh fetch + re-render)
- [x] On server failure: appends to `localStorage['meeting_notes_draft']`, re-renders
- [x] `window.reloadMeetingRoom()` — force fresh fetch + re-render
- [x] Both APIs exposed on `window` — accessible from author portal and browser console

### `js/projects.js` — Public API
- [x] `window.saveProjectUpdate(projectId, updateObj)` → `Promise<{ok, source}>`
- [x] POSTs `{ project_id: String(projectId), update: {...} }` to `/api/save-projects`
- [x] On success: reloads full project list + re-opens active folder
- [x] On server failure: updates in-memory `allProjects` + writes to `localStorage['projects_draft']`
- [x] `window.reloadProjects()` — force fetch + full re-render
- [x] **BUG-024 FIXED**: `openProject()` now uses `String(p.id) === String(projectId)` (was `===` strict, causing permanent render failure)

---

## Phase 2 Round 2: Cleanup Fixes

### `index.html` — Nova Re-encoding
- [x] UTF-8 encoding verified — Katakana and non-ASCII present in file ✅
- [x] All 4 navbar links present
- [x] `data-config-key` attributes on hero title and subtitle
- [x] All 4 team cards with `data-agent`, `data-en`, `data-ja`
- [x] `#updates-feed` container present

### `js/load_status.js` — Updates Feed
- [x] `loadLatestUpdates(lang)` now ENABLED — **BUG-025 FIXED**
- [x] Fetches from `data/projects.json`
- [x] Flattens all project updates, sorts by timestamp desc
- [x] Renders top 3 in `#updates-feed`
- [x] Bilingual (lang-aware date format, content_en/ja)
- [x] Graceful error handling if fetch fails

### `data/projects.json` — Restored
- [x] **BUG-DATA-001 FIXED** — file was 0-byte empty scaffold
- [x] Smart Grid Phase 1 project restored — 5 bilingual update entries
  - Entry 1: Project Kickoff (2026-06-07)
  - Entry 2: Requirements Spec v1.0 (2026-06-08)
  - Entry 3: First engine run — 9/18 tests (2026-06-10)
  - Entry 4: Post-fix retest — 15/18 tests (2026-06-11)
  - Entry 5: Architecture review meeting — 9-point decision log (2026-06-12)

---

## Navigation Consistency (All 4 Pages)

| Page | Navbar (4 links) | Footer (4 links) |
|---|---|---|
| `index.html` | ✅ | ✅ |
| `meeting-room.html` | ✅ | ✅ |
| `projects.html` | ✅ | ✅ |
| `author.html` | ✅ | ✅ |

---

## Open Bugs

| ID | Severity | Description |
|---|---|---|
| BUG-022 | 🟡 Medium | `server.py` unofficial translation API |
| BUG-023 | 🟢 Low | `projects.js` empty state language switch |

**No critical or high severity bugs remain open.**

---

## Phase 2 Round 2 QA Sign-Off

| Category | Status |
|---|---|
| `/api/save-meeting-notes` endpoint | ✅ PASS |
| `/api/save-projects` endpoint | ✅ PASS |
| `trigger_git_deploy()` hardening | ✅ PASS (BUG-021 resolved) |
| `window.postMeetingMessage` API | ✅ PASS |
| `window.saveProjectUpdate` API | ✅ PASS |
| `window.reloadMeetingRoom` / `reloadProjects` | ✅ PASS |
| `openProject()` type mismatch (BUG-024) | ✅ FIXED |
| Homepage updates feed (BUG-025) | ✅ FIXED |
| `projects.json` data restore (BUG-DATA-001) | ✅ FIXED |
| `index.html` UTF-8 encoding | ✅ PASS |
| Navigation (4 pages) | ✅ PASS |

**Overall Phase 2 Round 2 Status: ✅ PASS**  
3 critical/high bugs found and fixed by Robin. All server API endpoints verified. No critical or high bugs remain open.
