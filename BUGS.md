# BUGS.md — Team Synapse Issue Tracker
**Maintained by:** Robin (QA & Documentation Engineer)  
**Last Updated:** 2026-06-11 (Phase 4 — Projects Catalog + Server Backend)

> **QA AUDIT NOTE:** All prior bugs resolved or acknowledged. This document now tracks Phase 4 findings. Phase 4 introduced: `projects.html` (Projects Catalog), `data/projects.json`, `js/projects.js`, and `server.py` (Python HTTP server with write-back API and auto git-push pipeline).

---

## Active Bugs

---

### BUG-011 (Reclassified — Resolved by Architecture)
**Page:** `author.html` — Editor / Login Portal  
**Description:** Password was hardcoded as plaintext. JB has now moved to a SHA-256 hash stored in `site_config.json` (`password_hash` field). The password is no longer a plaintext string in source.

**Severity:** Reclassified ✅ Resolved  
**Status:** ✅ Closed — hash-based auth implemented. Password `12131415` → SHA-256 hash in `site_config.json`. No plaintext password remains in source.

---

### BUG-012 (Resolved by server.py)
**Page:** `author.html` — Thoughts Editor / Site Config Editor  
**Description:** Editor saved to `localStorage` only — changes did not persist to JSON files or across browsers.

**Status:** ✅ Resolved — `server.py` provides `/api/save-config` and `/api/save-thoughts` endpoints that write directly to `data/site_config.json` and `data/author_thoughts.json`. Auto-triggers `git push` after save, deploying changes to Netlify immediately.

---

## Active — Open

---

### BUG-021 ← NEW
**Page:** `server.py` — Static File Serving  
**Description:** `server.py` serves static files from the project directory (using `SimpleHTTPRequestHandler`). When running locally, all HTML, CSS, and JS files are served correctly. However, `server.py` does not check whether git is configured on the machine before calling `trigger_git_deploy()`. If git is not configured (no `user.name`, `user.email`, or no remote set), the git subprocess will fail silently — the deploy thread logs the error to stdout but the HTTP response has already been sent as `{"status": "success"}`. The author will believe their config was saved to GitHub when it was not.

**Severity:** 🟡 Medium  
**Assigned to:** JB  
**Status:** Open — recommend `trigger_git_deploy()` returns a status; and the `/api/save-config` response should reflect whether git push succeeded.  
**Discovered:** 2026-06-11 during Phase 4 QA audit

---

### BUG-022 ← NEW
**Page:** `server.py` — Auto-Translation  
**Description:** `translate_en_to_ja()` calls `translate.googleapis.com` using an unofficial client parameter (`client=gtx`). This is an undocumented API endpoint used by the Google Translate web UI — it is not a public API and has no SLA. It can break at any time with no warning. If it fails, the function falls back to returning the English text as the Japanese translation — meaning Japanese users would silently see English content.

**Severity:** 🟡 Medium  
**Assigned to:** JB  
**Status:** Open — acceptable for a research prototype; should be documented. Recommend adding a visible warning in the server startup log.  
**Discovered:** 2026-06-11 during Phase 4 QA audit

---

### BUG-023 ← NEW
**Page:** `projects.js` — Empty State Language  
**Description:** The empty state message in `projects.js` (rendered when `projects.json` has no entries) uses inline string literals rather than `data-en`/`data-ja` attributes. When the language is switched after the empty state has rendered, the empty state text will not update. (This was the case before Robin populated `projects.json` — it will only affect a future state if the projects array is emptied.)

**Severity:** 🟢 Low  
**Assigned to:** Nova  
**Status:** Open — low impact now that `projects.json` has content. Worth fixing for consistency.  
**Discovered:** 2026-06-11 during Phase 4 QA audit

---

## Resolved Bugs — Full History

### Phase 4 — 2026-06-11

| ID | Description | Resolved By |
|---|---|---|
| BUG-011 | Password plaintext in source | JB — SHA-256 hash in `site_config.json` |
| BUG-012 | localStorage-only persistence | JB — `server.py` write-back API + git push |
| BUG-020 | Duplicate `id="site-config-container"` | Robin (QA fix during verification) |

### Phase 3 Sponsor Sprint — 2026-06-11

| ID | Description | Resolved By |
|---|---|---|
| BUG-017 | Hero stat bar still in `index.html` | Nova |
| BUG-018 | Text contrast below WCAG AA | Nova |
| BUG-019 | `site_config.json` + `load_config.js` not created | JB |

### Phase 2 Bug-Fix Sprint — 2026-06-11

| ID | Description | Resolved By |
|---|---|---|
| BUG-010 | Navbar scroll handler dark HSL | Nova |
| BUG-013 | Login error language mismatch | JB |
| BUG-014 | Bilingual schema in loaders | JB |
| BUG-015 | Lang toggle button flash | Nova |
| BUG-016 | Author not in footer nav | Nova |

### Phase 1 Integration Sprint — 2026-06-07

| ID | Description | Resolved By |
|---|---|---|
| BUG-001 | `#journey-feed` vs `#journey-timeline` ID mismatch | Nova |
| BUG-002 | `load_status.js` not in `index.html` | Nova |
| BUG-003 | Team cards missing `data-agent` | Nova |
| BUG-004 | `load_blog.js` not in `journey.html` | Nova |
| BUG-005 | Static + dynamic duplication | Nova |
| BUG-006 | Filter API mismatch | Nova + JB |
| BUG-007 | No `assets/` directory | Nova |
| BUG-008 | Homepage updates feed static | JB + Nova |
| BUG-009 | `\n\n` newlines not rendering | JB |

---

## Bug Summary

| ID | Severity | Status |
|---|---|---|
| BUG-021 | 🟡 Medium | Open — git deploy silent failure on error |
| BUG-022 | 🟡 Medium | Open — unofficial translation API |
| BUG-023 | 🟢 Low | Open — empty state language switch |
| All others BUG-001–020 | ✅ Resolved | — |

**Total Open:** 3 (all medium/low, no critical blockers)  
**Total Resolved:** 20
