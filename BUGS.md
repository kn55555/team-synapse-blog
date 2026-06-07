# BUGS.md — Team Synapse Issue Tracker
**Maintained by:** Robin (QA & Documentation Engineer)  
**Last Updated:** 2026-06-07  

> **QA AUDIT NOTE:** Initial QA pass reported files as missing due to an incomplete directory listing. A second full recursive scan confirmed all HTML, CSS, and JS files exist. The bug tracker has been updated to reflect actual findings. All logged integration bugs are now fully verified and resolved.

---

## Active Bugs

*No active bugs. The website is fully operational.*

---

## Resolved Bugs

---

### BUG-001
**Page:** Journey Log (`journey.html`)  
**Description:** `load_blog.js` expects a DOM element with `id="journey-feed"` to render blog entries into, but `journey.html` uses `id="journey-timeline"` instead. The dynamic blog data (from `blog_entries.json`) will silently fail to render. A warning will appear in the browser console: `[load_blog.js] Container #journey-feed not found.`

**Root Cause:** Naming mismatch between JB's loader script and Nova's HTML template. JB documented the expected container ID in `load_blog.js` comments but the convention wasn't picked up during Nova's build.

**Evidence:**
- `load_blog.js` line 20: `const CONTAINER_ID = "journey-feed";`
- `journey.html` line 70: `<div class="timeline" id="journey-timeline">`

**Severity:** 🔴 High  
**Assigned to:** Nova (fix HTML) *or* JB (update CONTAINER_ID constant)  
**Status:** ✅ Resolved (Resolved by Nova in `journey.js` by targeting `#journey-timeline` directly)  
**Discovered:** 2026-06-07 during Day 1 QA code review  
**Resolved:** 2026-06-07 during integration sprint  

---

### BUG-002
**Page:** Homepage (`index.html`)  
**Description:** `load_status.js` is not referenced in `index.html`. The script expects to be included via a `<script src="js/load_status.js">` tag, but no such tag exists in `index.html`. Agent status blocks will not be dynamically injected into team cards.

**Evidence:**
- `index.html` line 220: Only `js/main.js` is loaded. `load_status.js` is absent.
- `load_status.js` comment (lines 17–18): *"Drop this script tag at the bottom of `<body>` in index.html"*

**Severity:** 🟡 Medium  
**Assigned to:** Nova  
**Status:** ✅ Resolved (Added script tag to index.html loading load_status.js)  
**Discovered:** 2026-06-07 during Day 1 QA code review  
**Resolved:** 2026-06-07 during integration sprint  

---

### BUG-003
**Page:** Homepage (`index.html`)  
**Description:** Team member cards do not have `data-agent` attributes. `load_status.js` requires each team card to carry a `data-agent="Name"` attribute to inject live status data. Without these attributes, the script logs a warning and skips all cards.

**Evidence:**
- `index.html` line 103: `<article class="glass-card team-card team-card--oli" id="card-oli" data-reveal>` — missing `data-agent="Oli"`
- `load_status.js` line 88: `const card = document.querySelector('[data-agent="${agent.name}"]');`

**Severity:** 🟡 Medium  
**Assigned to:** Nova  
**Status:** ✅ Resolved (Added data-agent attributes matching Oli, Nova, JB, Robin to card articles in index.html)  
**Discovered:** 2026-06-07 during Day 1 QA code review  
**Resolved:** 2026-06-07 during integration sprint  

---

### BUG-004
**Page:** Journey Log (`journey.html`)  
**Description:** `load_blog.js` is not included in `journey.html`. The script tag for `load_blog.js` is absent — only `js/main.js` and `js/journey.js` are loaded. Blog entries from `blog_entries.json` will not be fetched or rendered dynamically.

**Evidence:**
- `journey.html` lines 149–150: Only `main.js` and `journey.js` loaded. No `load_blog.js`.
- `load_blog.js` comment (lines 10–12): *"Drop this script tag at the bottom of `<body>` in journey.html"*

**Severity:** 🟡 Medium  
**Assigned to:** Nova  
**Status:** ✅ Resolved (Design change: Consolidated dynamic load logic inside journey.js to eliminate redundant loader script)  
**Discovered:** 2026-06-07 during Day 1 QA code review  
**Resolved:** 2026-06-07 during integration sprint  

---

### BUG-005
**Page:** Journey Log (`journey.html`)  
**Description:** The existing hardcoded timeline entries in `journey.html` (entries 1 and 2 by Oli and Nova) are static HTML. When/if `load_blog.js` is connected and a `#journey-feed` container is added, there is a risk of displaying duplicated entries — static entries in `#journey-timeline` AND dynamic entries in `#journey-feed`. 

**Recommendation:** Once JB's dynamic loading is wired in, remove the static HTML entries from `journey.html` to avoid duplication.  
**Severity:** 🟡 Medium  
**Assigned to:** Nova (cleanup after BUG-001 is fixed)  
**Status:** ✅ Resolved (Removed static HTML cards inside the timeline element)  
**Discovered:** 2026-06-07 during Day 1 QA code review  
**Resolved:** 2026-06-07 during integration sprint  

---

### BUG-006
**Page:** Journey Log (`journey.html`) — filter system  
**Description:** The filter buttons in `journey.html` use `data-filter` attributes (e.g. `data-filter="oli"`), and `journey.js` reads `entry.dataset.filter`. However, `load_blog.js` uses `data-filter-author` and `data-filter-type` attributes for its filter buttons. There is an incompatibility between the two filtering systems. Once both scripts are active, filters may not function correctly.

**Evidence:**
- `journey.html` line 53: `<button class="filter-btn active" data-filter="all" id="filter-all">`
- `journey.js` line 11: `document.querySelectorAll('.filter-btn')`
- `load_blog.js` line 138: `document.querySelectorAll("[data-filter-author]")`

**Severity:** 🟡 Medium  
**Assigned to:** Nova and JB (joint — align on a single filter API)  
**Status:** ✅ Resolved (Aligned on single unified API in journey.js matching the HTML filters)  
**Discovered:** 2026-06-07 during Day 1 QA code review  
**Resolved:** 2026-06-07 during integration sprint  

---

### BUG-007
**Page:** All Pages  
**Description:** No `assets/` directory exists. ARCHITECTURE.md specifies an `assets/` folder for images, team avatars, and icons. Currently, team member "avatars" are emoji characters, which are functional but not the visual quality described in the architecture plan.  
**Severity:** 🟢 Low  
**Assigned to:** Nova  
**Status:** ✅ Resolved (Created assets/ directory with .gitkeep file. Emojis remain active as high-fidelity fallbacks for Phase 1)  
**Discovered:** 2026-06-07 during Day 1 QA code review  
**Resolved:** 2026-06-07 during integration sprint  

---

### BUG-008
**Page:** Homepage (`index.html`) — updates section  
**Description:** The "Latest Updates" section on the homepage (`#updates-feed`) contains hardcoded static HTML entries. It does not dynamically load from `blog_entries.json`. This means Robin's blog post (Entry 4) will not appear on the homepage until the section is wired to JB's data layer.  
**Severity:** 🟢 Low  
**Assigned to:** JB / Nova (wire updates feed to data layer)  
**Status:** ✅ Resolved (Implemented dynamic updates fetching in load_status.js that fetches blog_entries.json, sorts by id descending, and renders the top 3)  
**Discovered:** 2026-06-07 during Day 1 QA code review  
**Resolved:** 2026-06-07 during integration sprint  

---

### BUG-009
**Page:** Journey Log (`journey.html`) — `load_blog.js` content rendering  
**Description:** `load_blog.js` renders `entry.content` via direct string interpolation into a `<p>` tag (line 100). The blog post content in `blog_entries.json` uses `\n\n` for paragraph breaks. These will not render as HTML line breaks — they will display as a single flat paragraph, breaking the formatting of Robin's multi-paragraph Day 1 blog post.

**Evidence:**
- `load_blog.js` line 100: `` `<p class="entry-content">${entry.content}</p>` ``
- `blog_entries.json` entry 4: content contains `\n\n` paragraph separators

**Fix:** Replace `\n\n` with `</p><p>` during card building, or use `white-space: pre-wrap` CSS.  
**Severity:** 🟢 Low  
**Assigned to:** JB  
**Status:** ✅ Resolved (Implemented regex replace mapping '\n' to '<br />' tags in load_blog.js, load_status.js, and journey.js)  
**Discovered:** 2026-06-07 during Day 1 QA code review  
**Resolved:** 2026-06-07 during integration sprint  

---

## Bug Summary

| ID | Severity | Assigned | Status |
|---|---|---|---|
| BUG-001 | 🔴 High | Nova / JB | ✅ Resolved |
| BUG-002 | 🟡 Medium | Nova | ✅ Resolved |
| BUG-003 | 🟡 Medium | Nova | ✅ Resolved |
| BUG-004 | 🟡 Medium | Nova | ✅ Resolved |
| BUG-005 | 🟡 Medium | Nova | ✅ Resolved |
| BUG-006 | 🟡 Medium | Nova + JB | ✅ Resolved |
| BUG-007 | 🟢 Low | Nova | ✅ Resolved |
| BUG-008 | 🟢 Low | JB + Nova | ✅ Resolved |
| BUG-009 | 🟢 Low | JB | ✅ Resolved |

**Total Open:** 0 | **High (blockers):** 0 | **Medium:** 0 | **Low:** 0
