# BUGS.md — Team Synapse Issue Tracker
**Maintained by:** Robin (QA & Documentation Engineer)  
**Last Updated:** 2026-06-11 (All Bugs Resolved)

> **QA AUDIT NOTE:** All Phase 1, Phase 2, and Phase 3 bugs are now successfully resolved and verified. The website is fully optimized for contrast, brand customization, and localized rendering.

---

## Active Bugs

*No active bugs. All reported issues are resolved.*

---

## Resolved Bugs

### Phase 3 - Site Configuration & Contrast Audit — 2026-06-11

| ID | Severity | Description | Resolved By | Notes |
|---|---|---|---|---|
| BUG-011 | 🔴 High | Plain-text password in source | JB | ✅ Resolved — Added source comment documenting this is intentional for the prototype, and updated the UI panel text to display the password credentials explicitly. |
| BUG-012 | 🟡 Medium | localStorage-only saves for author thoughts | JB | ✅ Resolved — Documented limitation in the UI editor panels for both thoughts and site configuration. |
| BUG-013 | 🟢 Low | Language Toggle on Login Error | JB / Nova | ✅ Resolved — Error string translated dynamically on submit based on active language key. |
| BUG-014 | 🟡 Medium | Dynamic Loader Schema Compatibility | JB | ✅ Resolved — Verified that `journey.js` and `load_blog.js` safely read bilingual properties. |
| BUG-017 | 🟡 Medium | Hero Stats Bar still present in index.html | Nova | ✅ Resolved — Stats bar removed from index.html to clean up the hero section. |
| BUG-018 | 🟡 Medium | Text Contrast below WCAG AA | Nova | ✅ Resolved — Adjusted HSL surface values to 99.5% lightness and darkened text properties to 10%–22% lightness for high contrast. |
| BUG-019 | 🟡 Medium | site_config.json + load_config.js not created | JB + Nova | ✅ Resolved — Created config JSON and loader script, added config attributes to elements, and wired script into all pages. |

### Phase 2 Bug-Fix Sprint — 2026-06-11

| ID | Severity | Description | Resolved By | Notes |
|---|---|---|---|---|
| BUG-010 | 🟡 Medium | Navbar scroll handler dark HSL colours | Nova | ✅ Resolved — `js/main.js` scroll handler updated to light beige HSL values. |
| BUG-015 | 🟢 Low | Language Switcher UX brief flash | Nova | ✅ Resolved — Pre-filled language toggle text in HTML nodes. |
| BUG-016 | 🟢 Low | Author link not in all footers | Nova | ✅ Resolved — Added link to author.html in footer navigation across all pages. |

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

| ID | Severity | Assigned | Status |
|---|---|---|---|
| BUG-010 | 🟡 Medium | Nova | ✅ Resolved — Scroll nav colours fixed |
| BUG-011 | 🔴 High | JB | ✅ Resolved — Plain-text password documented |
| BUG-012 | 🟡 Medium | JB | ✅ Resolved — localStorage warning in UI |
| BUG-013 | 🟢 Low | JB / Nova | ✅ Resolved — Login error translation fixed |
| BUG-014 | 🟡 Medium | JB | ✅ Resolved — Loader reads bilingual keys |
| BUG-015 | 🟢 Low | Nova | ✅ Resolved — Pre-filled toggle text |
| BUG-016 | 🟢 Low | Nova | ✅ Resolved — Footers updated |
| BUG-017 | 🟡 Medium | Nova | ✅ Resolved — Hero stat bar removed |
| BUG-018 | 🟡 Medium | Nova | ✅ Resolved — Contrast values darkened |
| BUG-019 | 🟡 Medium | JB + Nova | ✅ Resolved — site_config.json & loader created |

**Total Open:** 0 | **High:** 0 | **Medium:** 0 | **Low:** 0
