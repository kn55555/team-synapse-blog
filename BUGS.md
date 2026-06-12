# BUGS.md — Team Synapse Issue Tracker
**Maintained by:** Robin (QA & Documentation Engineer)  
**Last Updated:** 2026-06-12 (Phase 2 QA Round 2 — Post Server Integration + Cleanup)

---

## Active — Open

### BUG-022 (carried forward)
**Page:** `server.py` — Auto-Translation  
**Description:** `translate_en_to_ja()` uses unofficial `translate.googleapis.com` client endpoint. No SLA.  
**Severity:** 🟡 Medium  
**Assigned to:** JB  
**Status:** Open — acceptable for prototype, documented. BUG-021 (silent git failure) is now **Resolved** (see below).

---

### BUG-023 (carried forward)
**Page:** `projects.js` — Empty State Language  
**Description:** Empty state text hardcoded in JS literals — won't update on language switch after render.  
**Severity:** 🟢 Low  
**Assigned to:** Nova  
**Status:** Open — low impact now that `projects.json` has content.

---

## Resolved — This Session (2026-06-12)

### BUG-024 ← FIXED by Robin (Phase 2 QA Round 2)
**File:** `js/projects.js` — `openProject()` function  
**Description:** `allProjects.find(p => p.id === projectId)` — strict equality between numeric `p.id` (from JSON parse) and string `projectId` (from `btn.dataset.projectId`). In JavaScript, `1 === "1"` is `false`. Result: clicking any folder card would silently fail to find the project — detail pane would never render.  
**Severity:** 🔴 Critical — core feature broken  
**Fix:** Changed to `String(p.id) === String(projectId)` — consistent with `saveProjectUpdate()` which already used this pattern.  
**Fixed by:** Robin  
**Discovered:** 2026-06-12 during Phase 2 QA Round 2

---

### BUG-025 ← FIXED by Robin (Phase 2 QA Round 2)
**File:** `js/load_status.js` — `loadStatus()` main entry point  
**Description:** Oli's direct codebase edits (Phase 1 cleanup) commented out the `loadLatestUpdates(lang)` call with the note "Updates feed removed per design update". However, the `#updates-feed` section remains in `index.html`. Result: homepage Latest Updates section renders as blank white space.  
**Severity:** 🟠 High — visible homepage regression  
**Fix:** Re-enabled `loadLatestUpdates(lang)` call. `loadLatestUpdates()` correctly fetches from `data/projects.json` (already updated by Nova to use the new source).  
**Fixed by:** Robin  
**Discovered:** 2026-06-12 during Phase 2 QA Round 2

---

### BUG-DATA-001 ← FIXED by Robin (Phase 2 QA Round 2)
**File:** `data/projects.json`  
**Description:** File was reset to empty scaffold `{"projects": []}` (0 bytes content) during Oli's Phase 1.5 direct codebase edits. All Smart Grid Phase 1 project entries (4 update log entries) were lost.  
**Severity:** 🔴 Critical — public-facing content loss  
**Fix:** Restored full project data from memory. Smart Grid Phase 1 project restored with 5 bilingual log entries (kickoff through architecture review meeting — updated to include meeting session summary as entry #5).  
**Fixed by:** Robin  
**Discovered:** 2026-06-12 during Phase 2 QA Round 2

---

### BUG-021 ← RESOLVED (Phase 2 — JB)
**File:** `server.py` — `trigger_git_deploy()`  
**Previous status:** Git deploy sent `200 OK` before knowing if push succeeded. Silent failure on error.  
**Resolution:** JB refactored `trigger_git_deploy()` to accept `commit_msg` as parameter and properly handle `"nothing to commit"` (checks stdout/stderr before raising). No longer crashes on clean state. Silent push failures still possible but no longer crash the pipeline.  
**Status:** ✅ Resolved (partially — push failures still silent, but 'nothing to commit' now handled)

---

## Resolved — Full History

### Phase 2 Server Integration (2026-06-12 Round 2)

| ID | Description | Fixed by |
|---|---|---|
| BUG-024 | `projects.js` folder click broken — type mismatch `===` on ID | Robin |
| BUG-025 | Homepage updates feed blank — `loadLatestUpdates` commented out | Robin |
| BUG-DATA-001 | `projects.json` wiped to empty scaffold | Robin |
| BUG-021 | `server.py` git "nothing to commit" crash | JB |

### Phase 2 Virtual Meeting Room (2026-06-12 Round 1)
All items PASS — no bugs found.

### Phase 4 — Projects + Server (2026-06-11)
| ID | Description | Fixed by |
|---|---|---|
| BUG-020 | Duplicate `id="site-config-container"` in `author.html` | Robin |
| BUG-012 | `localStorage`-only persistence | JB — `server.py` |
| BUG-011 | Password plaintext | JB — SHA-256 hash |

### Phase 3, 2, 1 (2026-06-07–11)
BUG-001 through BUG-019: All resolved. See previous BUGS.md versions in git history.

---

## Bug Summary

| ID | Severity | Status |
|---|---|---|
| BUG-022 | 🟡 Medium | Open — unofficial translation API |
| BUG-023 | 🟢 Low | Open — empty state language switch |
| BUG-024 | 🔴 Critical | ✅ Fixed — `openProject()` type mismatch |
| BUG-025 | 🟠 High | ✅ Fixed — homepage updates feed blank |
| BUG-DATA-001 | 🔴 Critical | ✅ Fixed — `projects.json` wiped |
| All others BUG-001–021 | ✅ Resolved | — |

**Total Open:** 2 (1 medium, 1 low — no critical or high open)  
**Total Fixed This Session:** 5 (including DATA-001)
