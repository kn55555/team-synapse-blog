# Architecture Plan: Journey Blog Website

This document outlines the technical architecture, file structure, and page layout guidelines for the AI Team's Journey Blog.

---

## Technical Constraints & Design Principles
1.  **No Frameworks**: Built using plain **HTML5, CSS3, and modern vanilla JavaScript**.
2.  **Premium Aesthetics**: High-fidelity, modern UI design. Use of vibrant HSL-based color palettes, dark mode styling, glassmorphism, responsive CSS Grid/Flexbox layouts, and subtle micro-animations.
3.  **Responsive Layout**: The website must render beautifully on desktop, tablet, and mobile devices.
4.  **Semantic HTML & Accessibility**: Focus on structured markup (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) and search engine optimization (SEO).

---

## Project Directory Layout
We will organize the code using a clean, modular structure:

```text
Engineering_Simulation_Team/
│
├── index.html               # Homepage (Team Intro)
├── about.html               # About Page (Research Project Details)
├── journey.html             # Journey Log Page (Progress updates)
├── meeting-room.html        # Virtual Meeting Room (Phase 2 Placeholder)
│
├── css/
│   └── style.css            # Global styling, design system tokens, layout, and components
│
├── js/
│   ├── main.js              # Global script (Navbar logic, themes, core interactions)
│   └── journey.js           # Journey page script (dynamically loads and renders logs)
│
├── assets/                  # Media assets (images, team avatars, icons)
│
├── TEAM_LOG.md              # Shared coordination log
├── PROJECT_BRIEF.md         # General project specifications
└── ARCHITECTURE.md          # This technical architecture document
```

---

## Page Layout & Requirements

### 1. Homepage (`index.html`)
*   **Hero Section**: High-impact introduction highlighting the AI Engineering Team.
*   **Team Intro Section**: Grid layout displaying all 4 team members with their names, roles, descriptions, and custom avatars.
    *   **Oli** (Project Manager)
    *   **Nova** (Frontend Engineer)
    *   **JB** (Backend Engineer)
    *   **Robin** (QA & Documentation Engineer)
*   **Call to Action**: Quick link to view the Journey Log or the Research About page.

### 2. About Page (`about.html`)
*   **Research Context**: Clear explanation of the AI team vs. human student team research experiment.
*   **Methodology & Objective**: Overview of what the researchers are measuring (speed, code quality, collaboration efficiency).

### 3. Journey Log Page (`journey.html`)
*   **Dynamic Log Feed**: Displays the timeline of team events and updates.
*   **Data Source**: Reads from a structured JSON dataset (managed by JB/Nova) representing the logged steps in `TEAM_LOG.md`.
*   **Filtering**: Ability to filter logs by Agent (Oli, Nova, JB, Robin) or type (UPDATE, DECISION, QUESTION, BLOCKER).

### 4. Virtual Meeting Room (`meeting-room.html`)
*   **Phase 2 Placeholder**: A clean, premium dashboard mockup showing a "Coming Soon in Phase 2" state.
*   **Concept**: Will eventually feature simulated real-time logs of team standups, chats, and coordination logs.

---

## CSS Design Tokens (`css/style.css`)
To maintain visual consistency, Nova should define a global custom properties scope (`:root`) with:
*   **Colors**: Modern HSL-based colors (deep space background, electric violet accents, soft borders).
*   **Typography**: Clean sans-serif fonts (e.g., 'Inter' or 'Outfit' loaded via Google Fonts).
*   **Spacers**: Consistent padding and margin utility scales.
*   **Transitions**: Standard `cubic-bezier` timing variables for smooth micro-animations on hover.
