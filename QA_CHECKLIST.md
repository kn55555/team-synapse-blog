# QA Checklist — Team Synapse Blog Website
**Prepared by:** Robin (QA & Documentation Engineer)  
**Last Updated:** 2026-06-11 (v3.0 — Phase 3: Contrast + Site Config Portal)  
**Version:** 3.0

---

## Pre-Requisites

- [x] All HTML pages present: `index.html`, `about.html`, `journey.html`, `meeting-room.html`, `author.html`
- [x] `css/style.css` exists and is non-empty
- [x] `js/main.js` present (includes language switcher + config integration point)
- [x] `js/journey.js` present
- [x] `js/load_blog.js` present
- [x] `js/load_status.js` present
- [ ] `js/load_config.js` — **PENDING** (Phase 3, assigned to JB)
- [x] `data/blog_entries.json` valid JSON (bilingual schema)
- [x] `data/agent_status.json` valid JSON (bilingual schema)
- [x] `data/author_thoughts.json` valid JSON
- [ ] `data/site_config.json` — **PENDING** (Phase 3, assigned to JB)
- [x] `assets/` directory with `.gitkeep`

---

## Phase 3: Text Contrast & Readability (NEW)

### WCAG AA Acceptance Criteria
Normal body text must achieve ≥ 4.5:1 contrast ratio against its background. Large text (≥18pt / ≥14pt bold) must achieve ≥ 3:1.

| Element | Token | Background Token | Target Ratio | Status |
|---|---|---|---|---|
| Body text | `--clr-text-primary: hsl(35,25%,15%)` | `--clr-bg-0: hsl(35,35%,94%)` | ≥ 4.5:1 | ✅ ~10:1 est. |
| Secondary text | `--clr-text-secondary: hsl(35,15%,38%)` | `--clr-bg-0` | ≥ 4.5:1 | ⚠️ ~5.2:1 borderline |
| Muted / label text | `--clr-text-muted: hsl(35,10%,52%)` | `--clr-bg-0` | ≥ 4.5:1 | ❌ ~3.2:1 est. |
| Card text | `--clr-text-secondary` | `--clr-surface: hsl(35,45%,98%)` | ≥ 4.5:1 | ⚠️ needs verification |

### Contrast Overhaul Checklist (assigned to Nova)
- [ ] `--clr-text-muted` darkened to achieve ≥ 4.5:1 on `--clr-bg-0`
- [ ] `--clr-text-secondary` verified or darkened to achieve ≥ 4.5:1
- [ ] `--clr-surface` lightened (toward pure white) to increase card surface contrast vs. background
- [ ] Section labels (`span.section-label`) — verify these use `--clr-text-muted`; check if darkening applies
- [ ] Filter bar button labels — verify contrast in both default and active states
- [ ] Timeline/blog card body text — verify contrast of `--clr-text-secondary` on `--clr-surface`
- [ ] Author portal thought items — `color:var(--clr-text-secondary)` on `--clr-bg-0` — verify
- [ ] Journey filter bar `--filter-btn-active` text readable on sage green background

---

## Phase 3: Hero Stats Bar Removal (NEW)

- [ ] `div.hero__stat-bar` and all child `.stat-item` elements removed from `index.html`
- [ ] No leftover CSS classes (`.hero__stat-bar`, `.stat-item`, `.stat-item__value`, `.stat-item__label`) producing empty space
- [ ] Hero section layout reflows cleanly without the stat bar — CTA buttons remain visually balanced
- [ ] No broken `anim-fade-up--d5` animation class orphaned in HTML

---

## Phase 3: Site Configuration Portal (NEW)

### `data/site_config.json`
- [ ] File exists and parses without errors
- [ ] Contains bilingual fields for all configurable strings: `brand_name_en`, `brand_name_ja`, `site_tagline_en`, `site_tagline_ja`, `hero_title_en`, `hero_title_ja`, `hero_desc_en`, `hero_desc_ja`, and key section headings
- [ ] Schema documented — each field has a clear purpose
- [ ] Default values match current live site content

### `js/load_config.js`
- [ ] File exists and is loadable
- [ ] Async fetch reads `site_config.json` on page load
- [ ] Before fetch, checks `localStorage` for `site_config_overrides` — applies overrides if present
- [ ] Config values injected into DOM elements by matching `id` attribute (e.g., `id="config-brand-name"`)
- [ ] `languageChanged` event handled — re-injects the correct locale's config values on toggle
- [ ] Graceful error handling — if fetch fails, falls back to static HTML (no broken IDs)
- [ ] Script included in `main.js` or loaded via `<script>` tag on all relevant pages

### Author Portal Config Editor (in `author.html`)
- [ ] Config editor form present inside `#editor-container` (visible only when logged in)
- [ ] Fields for all `site_config.json` configurable strings (English + Japanese per field)
- [ ] Save button writes form values to `localStorage` as `site_config_overrides`
- [ ] On save, `load_config.js` re-applies values to DOM without page reload
- [ ] Reset button clears `site_config_overrides` from `localStorage` and reverts to JSON defaults
- [ ] Form is bilingual — labels have `data-en`/`data-ja` attributes

### Config ID Targets in HTML
- [ ] `index.html` — brand name heading, hero title, hero description, team section heading all have `id="config-*"` attributes
- [ ] `journey.html` — page title, section heading has config ID
- [ ] `about.html` — page title, intro text has config ID
- [ ] `meeting-room.html` — page title has config ID
- [ ] `author.html` — page title, profile card bio has config ID

---

## Theme & Branding (Phase 2 — Carried Forward)

- [x] Background uses light beige (`hsl(35, 35%, 94%)`)
- [x] Sage green used as primary accent
- [x] Peach-orange as secondary accent
- [x] No gradient backgrounds (solid overrides in `:root`)
- [x] 🍃 logo on all pages
- [x] "AI engineering team" branding on all pages
- [x] ~~Navbar scroll handler dark HSL~~ **BUG-010 RESOLVED** — fixed to light beige by Nova (15:43 entry)

---

## Language Switcher (Phase 2 — Carried Forward)

- [x] Toggle button present on all pages
- [x] Language preference persisted in `localStorage`
- [x] `applyTranslations()` fires on load to restore preference
- [x] `languageChanged` event dispatched for dynamic scripts
- [ ] BUG-013 (login error language) — Open
- [ ] BUG-014 (bilingual schema in loaders) — Open, pending HTTP test
- [ ] BUG-015 (empty toggle button flash) — Open

---

## Author Portal (Phase 2 — Carried Forward)

- [x] Login flow functional
- [x] Editor hidden until authenticated
- [x] Logout clears session
- [ ] BUG-011 (password in source) — Open, JB to add disclaimer comment
- [ ] BUG-012 (localStorage-only saves) — Open, JB to add UI note
- [ ] BUG-016 (author not in footer) — Open, Nova to add footer link

---

## Navigation Tests

- [x] Nav bar on all 5 pages with correct links
- [x] Active page highlight working (via `main.js`)
- [x] Mobile hamburger present
- [x] Logo links to homepage

---

## Data Integrity

- [x] `blog_entries.json` — bilingual schema, 4 Phase 2 simulation entries
- [x] `agent_status.json` — bilingual, all 4 agents, Phase 3 tasks updated
- [x] `author_thoughts.json` — 2 entries (researcher + Robin editorial)
- [ ] `site_config.json` — **PENDING** (not yet created)

---

## QA Sign-Off

| Category | Status | Notes |
|---|---|---|
| File presence | ⚠️ PARTIAL | `site_config.json` + `load_config.js` not yet created |
| Text contrast (WCAG AA) | ❌ OPEN | `--clr-text-muted` fails AA; Nova assigned Phase 3 fix |
| Hero stat bar removal | ❌ OPEN | Still present in `index.html` — BUG-017 |
| Site config portal | ❌ OPEN | Not yet built — BUG-019 |
| Navbar scroll colour | ✅ RESOLVED | BUG-010 fixed by Nova |
| Theme tokens | ✅ PASS | Pastel palette applied |
| Branding | ✅ PASS | 🍃 + "AI engineering team" on all pages |
| Language switcher | ⚠️ PARTIAL | Functional; 3 bugs open |
| Author portal | ⚠️ PARTIAL | Functional; security/persistence notes open |
| Navigation | ✅ PASS | All links verified |
| Data integrity | ⚠️ PARTIAL | site_config.json pending |

**Overall Phase 3 Status: 🔴 IN PROGRESS**  
Phase 3 sponsor deliverables (contrast, stat bar removal, site config portal) are not yet complete — Nova and JB are implementing now. This checklist defines acceptance criteria. Re-audit required after their implementations land.
