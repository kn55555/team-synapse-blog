# Architecture Plan: Journey Blog Website

This document outlines the technical architecture, file structure, and page layout guidelines for the AI engineering team's Journey Blog.

---

## Technical Constraints & Design Principles
1.  **No Frameworks**: Built using plain **HTML5, CSS3, and modern vanilla JavaScript**.
2.  **Premium Aesthetics (Natural Pastel Theme)**: Warm, light pastel aesthetic using warm beige backgrounds, cream surfaces, and soft sage green/peach orange accents. Solid colors only, with no gradients.
3.  **Responsive Layout**: Renders responsively on desktop, tablet, and mobile layouts.
4.  **Bilingual Support (EN / JP)**: Dynamic locale selector toggle switch (`EN / JP`) in header, switching static elements via `data-en` and `data-ja` attributes, and dynamic feeds via listener events.
5.  **Secure Researcher thoughts Portal**: Login protection (`12131415`) unlocking a local storage text editor to document research logs.

---

## Project Directory Layout
We organize the code using a clean, modular structure:

```text
Engineering_Simulation_Team/
│
├── index.html               # Homepage (Team Intro & Setup Guide)
├── about.html               # About Page (Research Project Details)
├── journey.html             # Journey Log Page (Bilingual timeline feed)
├── meeting-room.html        # Virtual Meeting Room (Phase 2 Placeholder)
├── author.html              # Researcher Portal (Authenticated thoughts log)
│
├── css/
│   └── style.css            # Global styling, light pastel tokens, solid overrides
│
├── js/
│   ├── main.js              # Global script (Navbar, translation engine, switcher events)
│   ├── journey.js           # Journey page script (bilingual timeline loader & filters)
│   └── load_status.js       # Live status script (bilingual agent card loader & latest updates)
│
├── data/
│   ├── blog_entries.json    # Bilingual simulation timeline log database
│   ├── agent_status.json    # Bilingual agent status database
│   └── author_thoughts.json # Bilingual default thoughts database
│
├── assets/                  # Media assets (images, team avatars, icons)
│   └── .gitkeep
│
├── TEAM_LOG.md              # Shared coordination log
├── PROJECT_BRIEF.md         # General project specifications
└── ARCHITECTURE.md          # This technical architecture document
```

---

## Page Layout & Requirements

### 1. Homepage (`index.html`)
*   **Hero Section**: Intro to the AI engineering team.
*   **Team Intro Section**: Grid of Oli, Nova, JB, and Robin with live statuses.
*   **How to Get Started Section**: Technical guide explaining agent prompt setup and coordination.
*   **Latest Updates Section**: Dynamically fetches the top 3 newest updates from the log.

### 2. About Page (`about.html`)
*   **Research Context**: Details of the AI team vs. student team research.
*   **Methodology & Objective**: Summary of evaluation metrics.

### 3. Journey Log Page (`journey.html`)
*   **Bilingual Timeline Feed**: Dynamically renders simulation events based on the active locale.
*   **Filtering**: Filters timeline logs by agent or type.

### 4. Virtual Meeting Room (`meeting-room.html`)
*   **Phase 2 Placeholder**: Simulated 2x2 grid panel showing live statuses.

### 5. Researcher thoughts Portal (`author.html`)
*   **Profile Card**: Lead researcher bio.
*   **Password form**: Authenticates password `12131415` to display text editor inputs.
*   **Local thoughts Feed**: Loads defaults from `author_thoughts.json` and syncs overrides to `localStorage`.

---

## CSS Design Tokens (`css/style.css`)
Visual consistency is defined via global properties `:root`:
*   **Colors**: Sage green (`hsl(135, 30%, 42%)`), Peach orange (`hsl(22, 75%, 62%)`), Beige (`hsl(35, 35%, 94%)`).
*   **Gradients**: Redefined to solid colors.
*   **Typography**: 'Outfit' and 'JetBrains Mono' loaded via Google Fonts.
