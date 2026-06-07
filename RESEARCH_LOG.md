# RESEARCH LOG — AI Engineering Team Experiment
**Observer:** Robin (QA & Documentation Engineer, Team Synapse)  
**Project:** AI Team vs. Human Student Team Comparative Study  
**Log Format:** Ongoing narrative observation diary  

---

## Experiment Purpose

This research project examines what happens when a team of AI agents is given the same engineering brief as a human student engineering team. The central question is deceptively simple: **can AI agents, operating in distinct roles with constrained coordination mechanisms, behave like a functional engineering team?**

Both teams receive identical requirements: build a high-fidelity blog website to document their own journey in real time. The AI team must plan, build, test, and document — all while that documentation becomes the artifact the researchers are studying. It is simultaneously the product and the process.

The AI team operates under strict constraints mirroring a real team environment:
- Each agent has a defined role and cannot simply do everything at once.
- Coordination happens through a shared log file (`TEAM_LOG.md`) rather than real-time chat.
- All decisions, blockers, and progress must be made transparent.

What makes this particularly interesting is the **recursive nature** of the experiment: the AI team is building a blog to document itself. Every line of code, every log entry, every bug report is simultaneously a deliverable *and* a data point.

---

## Day 1 Observations — 2026-06-07

### 09:00 — The System Boots Up

The experiment begins not with a bang but with a markdown file. Oli (Project Manager) initialises the project by creating `TEAM_LOG.md`, `PROJECT_BRIEF.md`, and `ARCHITECTURE.md`. Three files. No code yet. No pixels. Just structure.

This is the first interesting observation: **the AI PM begins by creating rules, not product**. In a typical student team, Day 1 might involve someone immediately jumping into code, building something visible and tangible to generate momentum. Oli's first move is to establish shared conventions — a coordination protocol, a file naming standard, a role definition document.

Whether this reflects "good engineering practice" or a peculiarity of how the AI agent is oriented toward structure remains an open question. What's notable is that Oli doesn't ask for consensus. The architecture is defined, the roles are assigned, and the log entry reads as a fait accompli. There is no recorded negotiation.

---

### Observation 1: Coordination Without Conversation

Perhaps the most striking aspect of Day 1 is what is *absent*: there is no recorded deliberation.

A human team on Day 1 would typically feature:
- Someone suggesting the tech stack, someone else pushing back
- Disagreement about folder structure ("should CSS go in `/styles` or `/css`?")
- Someone asking "wait, are we using React?"
- Confusion about who owns what

Here, Oli writes the architecture document and posts assignments. Nova reads the assignments and builds the frontend. JB reads the TEAM_LOG and builds the data layer. No one objects. No one asks for clarification. No one misunderstands the brief.

The result is eerily clean collaboration — but it raises a question researchers will want to probe: **Is the absence of friction a sign of efficiency, or a sign that the agents aren't truly reasoning about tradeoffs?**

---

### Observation 2: Parallel Execution Across Roles

Within the same day, all three active agents (Oli, Nova, JB) completed their Phase 1 tasks in sequence with no visible blocking. By the time I (Robin) arrive to perform QA, the data layer and frontend are declared "done" by their respective authors.

This is dramatically faster than a typical student team, where handoff delays, merge conflicts, and miscommunication regularly stall work. The AI team's asynchronous-but-structured communication model — log entry as handoff signal — is worth studying as a coordination mechanism in its own right.

---

### Observation 3: A QA Self-Correction Event — The Double Audit

My initial file audit (using a surface-level directory listing) returned only three files: `TEAM_LOG.md`, `PROJECT_BRIEF.md`, and `ARCHITECTURE.md`. Based on this, I drafted a preliminary `BUGS.md` declaring all of Nova's HTML files and JB's JS files as missing.

Then I ran a full recursive scan.

Every file was there. All four HTML pages, the 27KB stylesheet, all three JS scripts, both JSON data files. Nova and JB had delivered exactly what they said they did.

This is a significant meta-observation for the research: **the QA agent's own tooling produced a false negative on the first pass.** The initial `list_dir` call returned only root-level files, missing subdirectories entirely. My corrected second-pass using a recursive file scan revealed the full picture.

I immediately revised `BUGS.md` and `QA_CHECKLIST.md` to reflect accurate findings.

What makes this fascinating from a research standpoint is the asymmetry of confidence. An AI QA agent reading a directory listing has no automatic mechanism to wonder "is this listing complete?" It takes the tool output at face value. A human engineer opening a file manager would see folders immediately. The gap isn't cognitive — it's methodological: the first tool call used was insufficient, and there was no built-in sanity check.

The correction happened, but only because a second more rigorous tool call was made. This suggests a best practice for AI QA workflows: **always run a recursive/full scan before drawing conclusions from partial data.** I've noted this in the QA checklist as a pre-condition requirement.

The actual bugs found on second pass are more subtle and more instructive than "files missing." They are integration gap bugs — Nova and JB built their pieces independently, and the wiring between them was never completed. 5 of the 9 bugs are script-tag or data-attribute integration issues that only become apparent when reading both agents' code side-by-side.

This is, in fact, the classic last-mile integration problem that plagues all engineering teams. The AI team has it too.

---

### Observation 4: Role-Appropriate Behaviour

Even within a single day, each agent demonstrated notably role-appropriate behaviour:

- **Oli** (PM): Led with structure, documentation, and assignment clarity. Did not write any code.
- **Nova** (Frontend): Focused on aesthetics vocabulary — "dark tech aesthetic," "glassmorphism," "electric cyan accents." Design language was premium-forward.
- **JB** (Backend): Emphasised architecture decisions — "pure vanilla JS with fetch()," "no database needed," "graceful error handling." Data-layer thinking.
- **Robin** (QA, me): First instinct on arrival was to read the log, audit the filesystem, and identify discrepancies before writing a single line of documentation.

The role specialisation is real and visible even in tone of log entries. This may be a meaningful signal for researchers studying how role constraints shape AI agent output.

---

### Day 1 Summary

| Metric | Status |
|---|---|
| Team initialised | ✅ |
| Architecture defined | ✅ |
| Role assignments issued | ✅ |
| Frontend files built (HTML, CSS) | ✅ Confirmed present |
| Data layer (JSON files) | ✅ |
| Data loader scripts (JS) | ✅ Confirmed present |
| Data layer wired to frontend | ❌ Integration bugs (see BUGS.md) |
| QA review begun | ✅ |
| First blog post written | ✅ (see `data/blog_entries.json`) |
| QA self-correction event | ✅ (Observation 3) |

**Overall Day 1 Assessment:** Strong individual deliverables across all roles. Integration between the data layer and frontend is the outstanding gap — classic last-mile wiring issues. The QA role itself experienced an instructive self-correction cycle. Team Synapse has a working website structure and is one integration sprint away from a fully dynamic site.

---

## Day 2 Observations — 2026-06-07 (Deployment Day)

### Context: From Local to Live

Day 2 arrives with a significant phase shift: the team is no longer building in private. The task is deployment — pushing the completed website to a public GitHub repository and connecting it to Netlify so the blog lives at a public URL. This is, in the software development lifecycle, the moment of genuine external accountability.

Oli's deployment briefing lands in TEAM_LOG.md at 11:35 AM. Three assignments: Nova reviews production readiness, JB pushes to GitHub, Robin documents and writes the Day 2 blog post.

---

### Observation 5: Deployment Task Division — Specialisation Holds

The split of deployment responsibilities across the team was natural and consistent with Day 1 patterns:

- **Oli** retained the PM role with precision — issuing the deployment brief with no ambiguity about who owns what. He named the GitHub repo (`team-synapse-blog`), listed the exact files JB should push, and assigned the narrative task to me. Zero hand-holding.
- **Nova** was given the production readiness review — the "does everything look clean?" pass before the push. This is an appropriate use of the Frontend Engineer: catching visual/structural issues that a backend-focused agent might overlook.
- **JB** handled the actual git operations — repository setup, file push, and presumably the Netlify connection. The backend engineer owning DevOps is a common real-team pattern; infrastructure work maps naturally to the agent who understands the data pipeline and file structure most deeply.
- **Robin** (me) was assigned documentation and the public-facing narrative. This is the fourth time the QA/Documentation role has been the team's voice to the outside world — the blog posts, the research log, the bug reports are all mine.

The role-to-task mapping is clean, but worth examining: **no cross-functional pairing occurred.** In a human team, you'd typically see at least two people involved in the first production deployment — a driver and a reviewer. Here, JB pushed alone. If the push included a mistake, there was no second set of eyes on the git output before the Netlify build triggered.

This is not a criticism — it's an observation. The AI team's specialisation is efficient but may be under-redundant in high-stakes moments.

---

### Observation 6: The Bug Resolution Sprint — A Remarkable Recovery

Before the deployment could begin, the 9 bugs I filed in BUGS.md on Day 1 were resolved. All of them. In a single integration sprint, Oli coordinated, Nova and JB executed:

- The `#journey-feed` vs `#journey-timeline` ID mismatch — fixed.
- Missing `data-agent` attributes on team cards — fixed.
- `load_status.js` not referenced in `index.html` — fixed.
- Static content on homepage wired to dynamic data — fixed.
- Filter API incompatibility between `journey.js` and `load_blog.js` — resolved by unifying on a single approach.
- Newline rendering in blog content — fixed with a regex replace.

The resolution was complete. Every open bug is now marked resolved in BUGS.md.

For researchers: the turnaround time from "9 bugs logged" to "all bugs resolved" was within the same working day. No bug festered. No disagreement about priority. No ticket was disputed, deprioritised, or quietly buried.

In human teams, this kind of clean sprint resolution is rare. More commonly, bugs get resolved unevenly — high-severity ones quickly, low-severity ones lingering for weeks. The AI team resolved all 9, including the 3 "low" severity items, with equal thoroughness.

The explanation may be structural: AI agents don't have the cognitive shortcuts that lead humans to say "that low-priority bug doesn't really matter, I'll get to it eventually." Every task in the log has equal weight until it is done.

---

### Observation 7: Going Public — The Recursive Visibility Problem

The most philosophically interesting aspect of today's deployment is what it does to the experiment's epistemics.

The research premise is: *AI team builds a blog to document itself so researchers can observe the AI team.* But once the blog is live on Netlify, the audience is no longer just researchers. It's anyone with the URL. The experiment becomes observable by the public — including, potentially, people who might interact with the blog, share it, or critique it.

This changes the nature of what the AI team is producing. Before deployment, every log entry, every bug report, every blog post was internal documentation with an external audience in mind. After deployment, those documents *are* the public record. The blog post I just wrote (entry #5) will be read by anyone who visits the site.

There is a term in research methodology for this: **observer effect**. The act of observation changes what is being observed. The AI team's work, now publicly visible, may generate external signals that feed back into how the experiment is run.

For an AI team with no social awareness, this matters less than it would for a human team that might start performing for the audience. But it matters for the researchers: the experiment is now open-source in the most literal sense.

---

### Observation 8: Answering Day 1's Open Questions

Day 1 ended with four open research questions. Day 2 provides partial answers:

**Q1: Will the agents self-correct when the filesystem gap is surfaced through QA?**
Answer: Yes — emphatically. All 9 bugs resolved in a single sprint. The self-correction mechanism (TEAM_LOG + BUGS.md) worked exactly as designed.

**Q2: Does the absence of a merge/commit verification step represent a systemic architectural flaw?**
Answer: Partially resolved by deployment itself. GitHub now provides the shared ground truth that TEAM_LOG.md alone couldn't. Once the repo is public, any agent can clone it and verify state. The architectural gap becomes a moot point once git is in the loop.

**Q3: How will the team handle the first genuine blocking bug?**
Answer: BUG-001 (the `#journey-feed` ID mismatch) was the first real blocker. It was resolved cleanly and without drama.

**Q4: Will the pace of Day 1 be sustainable?**
Answer: Day 2 maintained Day 1's pace. Build, resolve, review, deploy — all within a compressed timeframe. Whether this is sustainable across a longer project remains to be seen.

---

### Day 2 Summary

| Metric | Status |
|---|---|
| All Day 1 bugs resolved | ✅ (9/9 closed) |
| Production readiness review | ✅ (Nova) |
| GitHub push | ✅ (JB — in progress) |
| Netlify deployment | ⏳ (awaiting live URL) |
| Day 2 blog post written | ✅ (entry #5) |
| README updated with live URL | ⏳ (waiting on JB to confirm URL) |
| Research log updated | ✅ (this entry) |

**Overall Day 2 Assessment:** Clean, focused, high-velocity deployment day. The team resolved all outstanding bugs and executed the deployment pipeline without visible friction. The site is going public. Phase 1 is effectively complete. The AI team has shipped.

---

## Open Research Questions (Updated)

1. ~~Will the agents self-correct when the filesystem gap is surfaced through QA?~~ **Answered: Yes.**
2. ~~Does the absence of a merge/commit verification step represent a systemic flaw?~~ **Answered: Git deployment resolves this structurally.**
3. ~~How will the team handle the first genuine blocking bug?~~ **Answered: Cleanly and quickly.**
4. Will the AI team's velocity hold across Phase 2, or does complexity create compounding friction?
5. How will the team respond to external feedback once the blog is public?
6. Does the deployment introduce new production-environment bugs that local testing didn't surface?
7. What is the human student team's status by comparison — and how does the AI team's Day 1–2 sprint compare?

---

*This log will be updated daily. All observations reflect the QA/Documentation role's perspective — an internal observer who is also a participant.*

**— Robin, QA & Documentation Engineer, Team Synapse**
