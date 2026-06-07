# QA Checklist — Team Synapse Blog Website
**Prepared by:** Robin (QA & Documentation Engineer)  
**Date:** 2026-06-07  
**Version:** 1.0  

---

## Pre-Requisites

- [ ] All HTML pages present in root directory
- [ ] `css/style.css` exists and is non-empty
- [ ] `js/main.js` exists and is non-empty
- [ ] `js/journey.js` (or equivalent) exists
- [ ] `js/load_blog.js` exists
- [ ] `js/load_status.js` exists
- [ ] `data/blog_entries.json` is valid JSON
- [ ] `data/agent_status.json` is valid JSON

---

## Page Load Tests

### 1. Homepage (`index.html`)
- [ ] Page loads without console errors
- [ ] Page title is set (`<title>` tag present)
- [ ] Meta description present (SEO)
- [ ] Hero section renders with headline and subtext
- [ ] Team member cards section is visible
- [ ] All 4 team members shown (Oli, Nova, JB, Robin)
- [ ] Call-to-action buttons/links are clickable
- [ ] Footer is present

### 2. About Page (`about.html`)
- [ ] Page loads without console errors
- [ ] Research context section rendered
- [ ] Methodology section present
- [ ] Navigation links active

### 3. Journey Log (`journey.html`)
- [ ] Page loads without console errors
- [ ] At least 1 journey log entry rendered
- [ ] Log entries loaded from `blog_entries.json` (not hardcoded)
- [ ] Entry cards show: date, author, role, title, content, tags
- [ ] Filter controls present (filter by agent / type)
- [ ] Filters function correctly (clicking "Nova" shows only Nova's entries)

### 4. Meeting Room (`meeting-room.html`)
- [ ] Page loads without console errors
- [ ] "Coming Soon" / Phase 2 placeholder message visible
- [ ] Premium design consistent with rest of site
- [ ] No broken UI elements

---

## Navigation Tests

- [ ] Nav bar present on all pages
- [ ] All nav links resolve to correct pages (no 404s)
- [ ] Active page is highlighted in nav
- [ ] Logo/site name in nav links back to homepage
- [ ] Nav is responsive (mobile hamburger or collapses correctly on small screens)

---

## Team Member Cards (Homepage)

- [ ] Card for **Oli** — name, role, description visible
- [ ] Card for **Nova** — name, role, description visible
- [ ] Card for **JB** — name, role, description visible
- [ ] Card for **Robin** — name, role, description visible
- [ ] Cards use accent colours from `agent_status.json`
- [ ] Cards have avatar/initials rendered
- [ ] Cards have hover micro-animation

---

## Journey Log Content

- [ ] Entry 1 ("The Team Assembles" by Oli) displayed
- [ ] Entry 2 ("Frontend Foundation Laid" by Nova) displayed
- [ ] Entry 3 ("Data Layer Complete" by JB) displayed
- [ ] Tags rendered per entry
- [ ] Timestamps formatted readably (not raw ISO string)

---

## Design & Aesthetics Checks

- [ ] Dark mode / deep space background applied globally
- [ ] Electric cyan/violet accent colours used throughout
- [ ] Glassmorphism card effect present (backdrop-filter or equivalent)
- [ ] Google Font loaded (Inter, Outfit, or similar)
- [ ] Smooth hover transitions on interactive elements
- [ ] No raw Times New Roman / browser default fonts visible
- [ ] No broken images (missing `src` or 404 assets)
- [ ] Consistent spacing — no elements touching edges

---

## Responsiveness Checks

- [ ] Layout renders correctly at 1440px (desktop)
- [ ] Layout renders correctly at 768px (tablet)
- [ ] Layout renders correctly at 375px (mobile)
- [ ] Navigation collapses/adapts on mobile
- [ ] Team cards stack vertically on small screens
- [ ] Text remains legible at all breakpoints

---

## Accessibility Checks

- [ ] Each page has exactly one `<h1>` tag
- [ ] Images have `alt` attributes
- [ ] Interactive elements have descriptive `id` or `aria-label`
- [ ] Sufficient colour contrast (text vs background)
- [ ] Tab navigation order is logical

---

## Data Integrity Checks

- [ ] `blog_entries.json` parses without errors (`JSON.parse` safe)
- [ ] `agent_status.json` parses without errors
- [ ] All required fields present in each blog entry (id, date, timestamp, title, author, role, type, content, tags)
- [ ] All required fields present in each agent record (name, role, status, current_task, completed_tasks)

---

## QA Completion Sign-Off

| Category | Status | Notes |
|---|---|---|
| File presence | ✅ PASS | All HTML, CSS, JS, and JSON files confirmed present on disk |
| Page loads | ✅ PASS | All 4 pages have valid, well-formed HTML with proper `<title>`, meta tags, and structure |
| Navigation | ✅ PASS | All 4 nav links present on every page, correctly pointing to correct pages |
| Active nav highlight | ⚠️ PARTIAL | `main.js` highlights active link by pathname — works over HTTP server, may fail on `file://` |
| Team cards (4 members) | ✅ PASS | All 4 cards present with names, roles, descriptions, emoji avatars |
| Team card data-agent attrs | ❌ FAIL | Cards missing `data-agent` attributes required by `load_status.js` (BUG-003) |
| Journey Log entries (static) | ✅ PASS | 2 hardcoded static entries visible in HTML |
| Journey Log entries (dynamic) | ❌ FAIL | `load_blog.js` not wired in; `#journey-feed` container missing (BUG-001, BUG-004) |
| Journey Log filters | ⚠️ PARTIAL | Filter buttons present and `journey.js` logic works for static entries; incompatible with `load_blog.js` filter API (BUG-006) |
| Meeting Room placeholder | ✅ PASS | "Coming Soon — Phase 2" banner present with premium design |
| Agent status injection | ❌ FAIL | `load_status.js` not referenced in `index.html` (BUG-002) |
| Dark mode aesthetics | ✅ PASS | 27KB stylesheet with design tokens, glassmorphism, and animations |
| Google Font | ⚠️ UNVERIFIED | Font preconnect tags present but no `@import` or `<link>` to specific font family found |
| Footer | ✅ PASS | Present on all pages with nav links |
| Responsive layout | ⚠️ UNVERIFIED | Cannot confirm without browser testing; CSS grid/flexbox used — likely functional |
| Semantic HTML | ✅ PASS | Proper use of `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` |
| Single `<h1>` per page | ✅ PASS | Each page has exactly one `<h1>` |
| Data integrity (JSON) | ✅ PASS | Both JSON files valid and well-formed with 4 blog entries, 4 agents |
| Newline rendering in blog | ❌ FAIL | `\n\n` in content will not render as HTML paragraphs (BUG-009) |

**Overall Status: ⚠️ PARTIAL PASS**  
Core structure is solid. Primary failure points are integration bugs between JB's data scripts and Nova's HTML — 3 missing script/attribute wiring tasks. No page is broken; data layer just isn't connected yet.  
See `BUGS.md` for 9 detailed issues (1 High, 5 Medium, 3 Low).

