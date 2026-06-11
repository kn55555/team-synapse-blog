# BUGS.md — Team Synapse Issue Tracker
**Maintained by:** Robin (QA & Documentation Engineer)  
**Last Updated:** 2026-06-11 (Phase 3 Post-Implementation Verification)

> **QA AUDIT NOTE:** Phase 1 bugs (BUG-001–009) all resolved. Phase 2 bugs (BUG-010–016): BUG-010, BUG-015, BUG-016 resolved. Phase 3 sponsor sprint now complete. BUG-017–019 resolved. One new bug found and fixed by Robin during verification audit (BUG-020 — duplicate ID in author.html).

---

## Active Bugs

---

### BUG-011
**Page:** `author.html` — Editor / Login Portal  
**Description:** The password `12131415` is hardcoded as a plain-text string in `author.html`. JB has added a source comment acknowledging this is intentional for the research prototype. The password remains visible in DevTools but is now documented.

**Severity:** 🔴 High → downgraded to 🟢 Low (documented)  
**Assigned to:** JB ✅ Addressed — comment added to source  
**Status:** ⚠️ Acknowledged — intentional research prototype limitation, source comment present  
**Discovered:** 2026-06-11 | **Addressed:** 2026-06-11

---

### BUG-013
**Page:** `author.html` — Language Toggle on Login Error  
**Description:** Login error message re-reads `data-en`/`data-ja` attribute on show. JB notes this has been addressed.

**Severity:** 🟢 Low  
**Assigned to:** JB  
**Status:** ✅ Resolved  
**Discovered:** 2026-06-11 | **Resolved:** 2026-06-11

---

### BUG-014
**Page:** `journey.html` — Dynamic Loader Schema Compatibility  
**Description:** `blog_entries.json` bilingual schema compatibility with `journey.js` / `load_blog.js`.

**Severity:** 🟡 Medium  
**Assigned to:** JB  
**Status:** ✅ Resolved (JB confirmed bilingual schema rendering verified)  
**Discovered:** 2026-06-11 | **Resolved:** 2026-06-11

---

## Active — Open

No critical open bugs. BUG-011 is a known, documented prototype limitation.

---

## Resolved Bugs

### Phase 3 Sponsor Sprint — 2026-06-11

| ID | Severity | Description | Resolved By | Notes |
|---|---|---|---|---|
| BUG-017 | 🟡 Medium | Hero stat bar still in `index.html` | Nova | Removed `div.hero__stat-bar` and all 4 stat items |
| BUG-018 | 🟡 Medium | Text contrast below WCAG AA | Nova | `--clr-text-muted` → `hsl(35,15%,36%)`, text-secondary and primary darkened |
| BUG-019 | 🟡 Medium | `site_config.json` + `load_config.js` not created | JB | Both files created; `load_config.js` wired into all 5 pages |
| BUG-020 ✨ | 🔴 High | Duplicate `id="site-config-container"` in `author.html` | Robin (QA fix) | Two `<div>` elements shared the same ID. `getElementById` would only find the first (dynamic/empty version), making the actual config form unreachable. Robin removed the orphaned first container during verification. |

### Phase 2 Bug-Fix Sprint — 2026-06-11

| ID | Severity | Description | Resolved By |
|---|---|---|---|
| BUG-010 | 🟡 Medium | Navbar scroll handler dark HSL colours | Nova (CSS audit) |
| BUG-012 | 🟡 Medium | Editor saves to localStorage only — no UI note | JB (added UI disclaimer) |
| BUG-015 | 🟢 Low | Lang toggle button empty flash | Nova (pre-populated "JP" in HTML) |
| BUG-016 | 🟢 Low | Author not in footer nav | Nova (added `author.html` to all page footers) |

### Phase 1 Integration Sprint — 2026-06-07

| ID | Description | Resolved By |
|---|---|---|
| BUG-001 | `#journey-feed` vs `#journey-timeline` ID mismatch | Nova |
| BUG-002 | `load_status.js` not in `index.html` | Nova |
| BUG-003 | Team cards missing `data-agent` attributes | Nova |
| BUG-004 | `load_blog.js` not in `journey.html` | Nova |
| BUG-005 | Static + dynamic entry duplication | Nova |
| BUG-006 | Filter API mismatch | Nova + JB |
| BUG-007 | No `assets/` directory | Nova |
| BUG-008 | Homepage updates feed static | JB + Nova |
| BUG-009 | `\n\n` newlines not rendering | JB |

---

## Bug Summary

| ID | Severity | Status |
|---|---|---|
| BUG-011 | ⚠️ Acknowledged | Password intentionally plaintext (research prototype) |
| All others BUG-001–010, 012–020 | ✅ Resolved | — |

**Total Open (critical):** 0 | **Acknowledged (documented):** 1 | **All resolved:** 19
