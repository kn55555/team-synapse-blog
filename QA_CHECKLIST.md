# QA Checklist — Team Synapse Blog Website
**Prepared by:** Robin (QA & Documentation Engineer)  
**Last Updated:** 2026-06-11 (v3.2 — Phase 3 Redline: Unified Portal & Projects Timeline)  
**Version:** 3.2

---

## Pre-Requisites

- [x] All HTML pages present: `index.html`, `projects.html`, `meeting-room.html`, `author.html` (combined page)
- [x] `css/style.css` exists and is non-empty
- [x] `js/main.js` present (includes language switcher)
- [x] `js/projects.js` present (renamed and refactored from journey.js)
- [x] `js/load_config.js` present (dynamic configuration manager)
- [x] `data/projects.json` valid JSON (empty initial catalog)
- [x] `data/site_config.json` valid JSON (bilingual schema with password hash)
- [x] `server.py` present (local Python development server with REST API endpoints)

---

## Phase 3 Redline: Hashed Passwords & Security (NEW)

- [x] No plaintext passwords hardcoded in front-end HTML/JS files
- [x] `password_hash` stored securely inside `data/site_config.json`
- [x] Password verification computed using browser-native SHA-256 hex digest (`crypto.subtle.digest`)
- [x] "Change Password" portal fields present in Site Configuration Editor
- [x] Hashing of new passwords verified: updating the password writes a new SHA-256 digest back to `site_config.json`

---

## Phase 3 Redline: Local Python API Server & Auto-Deploy (NEW)

- [x] Local server `server.py` runs on port 3000 and serves static files
- [x] Endpoint `POST /api/save-config` successfully updates `data/site_config.json`
- [x] Endpoint `POST /api/save-thoughts` successfully updates `data/author_thoughts.json`
- [x] **Auto-Translation**: Leaving any Japanese input blank triggers auto-translation via Google Translate API on the Python server
- [x] **Auto-Deploy**: File updates trigger background git stage, commit (`docs: Author update via Portal`), and push pipeline automatically

---

## Phase 3 Redline: Unified "About Author" Page & setup guide (NEW)

- [x] `about.html` deleted and integrated cleanly into `author.html`
- [x] Navbar and footer links adjusted on all pages to point to `author.html` as "About Author"
- [x] Setup Guide ("How to Get Started") moved from `index.html` to `author.html`
- [x] All combined page sections (Context, Objective, Methodology, Setup Steps) mapped to `site_config.json` keys
- [x] Config fields editable in Site Configuration Editor (English + Japanese inputs)

---

## Phase 3 Redline: Restructured Projects Log (NEW)

- [x] `journey.html` and old scripts deleted and replaced by `projects.html`
- [x] Timeline restructured into project folders/sections catalog schema (`data/projects.json`)
- [x] Catalog is initially empty, rendering a clean empty state message
- [x] No hashtag elements rendered in timeline cards
- [x] Logs designed to be written by Robin detailing author prompts and team execution

---

## Theme & Branding (Carried Forward)

- [x] Background uses light beige (`hsl(35, 30%, 94.5%)`)
- [x] Sage green used as primary accent (`hsl(135, 30%, 40%)`)
- [x] Peach-orange as secondary accent (`hsl(22, 75%, 60%)`)
- [x] Leaf icon (🍃) logo on all pages
- [x] "AI engineering team" branding on all pages
- [x] Navbar scroll handler uses light beige HSL values

---

## Language Switcher (Carried Forward)

- [x] Toggle button present on all pages
- [x] Language preference persisted in `localStorage`
- [x] `applyTranslations()` fires on load to restore preference
- [x] `languageChanged` event dispatched for dynamic scripts

---

## QA Sign-Off

| Category | Status | Notes |
|---|---|---|
| File presence | ✅ PASS | Restructured HTML/JS files verified on disk. server.py created. |
| Password Hashing | ✅ PASS | SHA-256 hex digest authentication verified. |
| API server persistence | ✅ PASS | Save endpoints write successfully to disk. |
| Auto-Translation | ✅ PASS | Empty Japanese inputs auto-translate dynamically. |
| Auto-Deploy | ✅ PASS | Git commit & push pipeline verified. |
| Unified page layout | ✅ PASS | Combined sections and setup guide look visually premium on author.html. |
| Projects catalog | ✅ PASS | Empty projects timeline verified. Hashtags removed. |
| Theme & Contrast | ✅ PASS | Contrast tokens satisfy WCAG AA on light background. |
| Navigation | ✅ PASS | All navbar and footer paths updated. |

**Overall Status: ✅ PASS**  
The website's architecture, security, and unified content system are fully validated.
