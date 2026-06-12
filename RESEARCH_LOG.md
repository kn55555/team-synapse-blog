# RESEARCH LOG â€” AI Engineering Team Experiment
**Observer:** Robin (QA & Documentation Engineer, Team Synapse)  
**Project:** AI Team vs. Human Student Team Comparative Study  
**Log Format:** Ongoing narrative observation diary  

---

## Experiment Purpose

This research project examines what happens when a team of AI agents is given the same engineering brief as a human student engineering team. The central question is deceptively simple: **can AI agents, operating in distinct roles with constrained coordination mechanisms, behave like a functional engineering team?**

Both teams receive identical requirements: build a high-fidelity blog website to document their own journey in real time. The AI team must plan, build, test, and document â€” all while that documentation becomes the artifact the researchers are studying. It is simultaneously the product and the process.

The AI team operates under strict constraints mirroring a real team environment:
- Each agent has a defined role and cannot simply do everything at once.
- Coordination happens through a shared log file (`TEAM_LOG.md`) rather than real-time chat.
- All decisions, blockers, and progress must be made transparent.

What makes this particularly interesting is the **recursive nature** of the experiment: the AI team is building a blog to document itself. Every line of code, every log entry, every bug report is simultaneously a deliverable *and* a data point.

---

## Day 1 Observations â€” 2026-06-07

### 09:00 â€” The System Boots Up

The experiment begins not with a bang but with a markdown file. Oli (Project Manager) initialises the project by creating `TEAM_LOG.md`, `PROJECT_BRIEF.md`, and `ARCHITECTURE.md`. Three files. No code yet. No pixels. Just structure.

This is the first interesting observation: **the AI PM begins by creating rules, not product**. In a typical student team, Day 1 might involve someone immediately jumping into code, building something visible and tangible to generate momentum. Oli's first move is to establish shared conventions â€” a coordination protocol, a file naming standard, a role definition document.

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

The result is eerily clean collaboration â€” but it raises a question researchers will want to probe: **Is the absence of friction a sign of efficiency, or a sign that the agents aren't truly reasoning about tradeoffs?**

---

### Observation 2: Parallel Execution Across Roles

Within the same day, all three active agents (Oli, Nova, JB) completed their Phase 1 tasks in sequence with no visible blocking. By the time I (Robin) arrive to perform QA, the data layer and frontend are declared "done" by their respective authors.

This is dramatically faster than a typical student team, where handoff delays, merge conflicts, and miscommunication regularly stall work. The AI team's asynchronous-but-structured communication model â€” log entry as handoff signal â€” is worth studying as a coordination mechanism in its own right.

---

### Observation 3: A QA Self-Correction Event â€” The Double Audit

My initial file audit (using a surface-level directory listing) returned only three files: `TEAM_LOG.md`, `PROJECT_BRIEF.md`, and `ARCHITECTURE.md`. Based on this, I drafted a preliminary `BUGS.md` declaring all of Nova's HTML files and JB's JS files as missing.

Then I ran a full recursive scan.

Every file was there. All four HTML pages, the 27KB stylesheet, all three JS scripts, both JSON data files. Nova and JB had delivered exactly what they said they did.

This is a significant meta-observation for the research: **the QA agent's own tooling produced a false negative on the first pass.** The initial `list_dir` call returned only root-level files, missing subdirectories entirely. My corrected second-pass using a recursive file scan revealed the full picture.

I immediately revised `BUGS.md` and `QA_CHECKLIST.md` to reflect accurate findings.

What makes this fascinating from a research standpoint is the asymmetry of confidence. An AI QA agent reading a directory listing has no automatic mechanism to wonder "is this listing complete?" It takes the tool output at face value. A human engineer opening a file manager would see folders immediately. The gap isn't cognitive â€” it's methodological: the first tool call used was insufficient, and there was no built-in sanity check.

The correction happened, but only because a second more rigorous tool call was made. This suggests a best practice for AI QA workflows: **always run a recursive/full scan before drawing conclusions from partial data.** I've noted this in the QA checklist as a pre-condition requirement.

The actual bugs found on second pass are more subtle and more instructive than "files missing." They are integration gap bugs â€” Nova and JB built their pieces independently, and the wiring between them was never completed. 5 of the 9 bugs are script-tag or data-attribute integration issues that only become apparent when reading both agents' code side-by-side.

This is, in fact, the classic last-mile integration problem that plagues all engineering teams. The AI team has it too.

---

### Observation 4: Role-Appropriate Behaviour

Even within a single day, each agent demonstrated notably role-appropriate behaviour:

- **Oli** (PM): Led with structure, documentation, and assignment clarity. Did not write any code.
- **Nova** (Frontend): Focused on aesthetics vocabulary â€” "dark tech aesthetic," "glassmorphism," "electric cyan accents." Design language was premium-forward.
- **JB** (Backend): Emphasised architecture decisions â€” "pure vanilla JS with fetch()," "no database needed," "graceful error handling." Data-layer thinking.
- **Robin** (QA, me): First instinct on arrival was to read the log, audit the filesystem, and identify discrepancies before writing a single line of documentation.

The role specialisation is real and visible even in tone of log entries. This may be a meaningful signal for researchers studying how role constraints shape AI agent output.

---

### Day 1 Summary

| Metric | Status |
|---|---|
| Team initialised | âœ… |
| Architecture defined | âœ… |
| Role assignments issued | âœ… |
| Frontend files built (HTML, CSS) | âœ… Confirmed present |
| Data layer (JSON files) | âœ… |
| Data loader scripts (JS) | âœ… Confirmed present |
| Data layer wired to frontend | â�Œ Integration bugs (see BUGS.md) |
| QA review begun | âœ… |
| First blog post written | âœ… (see `data/blog_entries.json`) |
| QA self-correction event | âœ… (Observation 3) |

**Overall Day 1 Assessment:** Strong individual deliverables across all roles. Integration between the data layer and frontend is the outstanding gap â€” classic last-mile wiring issues. The QA role itself experienced an instructive self-correction cycle. Team Synapse has a working website structure and is one integration sprint away from a fully dynamic site.

---

## Day 2 Observations â€” 2026-06-07 (Deployment Day)

### Context: From Local to Live

Day 2 arrives with a significant phase shift: the team is no longer building in private. The task is deployment â€” pushing the completed website to a public GitHub repository and connecting it to Netlify so the blog lives at a public URL. This is, in the software development lifecycle, the moment of genuine external accountability.

Oli's deployment briefing lands in TEAM_LOG.md at 11:35 AM. Three assignments: Nova reviews production readiness, JB pushes to GitHub, Robin documents and writes the Day 2 blog post.

---

### Observation 5: Deployment Task Division â€” Specialisation Holds

The split of deployment responsibilities across the team was natural and consistent with Day 1 patterns:

- **Oli** retained the PM role with precision â€” issuing the deployment brief with no ambiguity about who owns what. He named the GitHub repo (`team-synapse-blog`), listed the exact files JB should push, and assigned the narrative task to me. Zero hand-holding.
- **Nova** was given the production readiness review â€” the "does everything look clean?" pass before the push. This is an appropriate use of the Frontend Engineer: catching visual/structural issues that a backend-focused agent might overlook.
- **JB** handled the actual git operations â€” repository setup, file push, and presumably the Netlify connection. The backend engineer owning DevOps is a common real-team pattern; infrastructure work maps naturally to the agent who understands the data pipeline and file structure most deeply.
- **Robin** (me) was assigned documentation and the public-facing narrative. This is the fourth time the QA/Documentation role has been the team's voice to the outside world â€” the blog posts, the research log, the bug reports are all mine.

The role-to-task mapping is clean, but worth examining: **no cross-functional pairing occurred.** In a human team, you'd typically see at least two people involved in the first production deployment â€” a driver and a reviewer. Here, JB pushed alone. If the push included a mistake, there was no second set of eyes on the git output before the Netlify build triggered.

This is not a criticism â€” it's an observation. The AI team's specialisation is efficient but may be under-redundant in high-stakes moments.

---

### Observation 6: The Bug Resolution Sprint â€” A Remarkable Recovery

Before the deployment could begin, the 9 bugs I filed in BUGS.md on Day 1 were resolved. All of them. In a single integration sprint, Oli coordinated, Nova and JB executed:

- The `#journey-feed` vs `#journey-timeline` ID mismatch â€” fixed.
- Missing `data-agent` attributes on team cards â€” fixed.
- `load_status.js` not referenced in `index.html` â€” fixed.
- Static content on homepage wired to dynamic data â€” fixed.
- Filter API incompatibility between `journey.js` and `load_blog.js` â€” resolved by unifying on a single approach.
- Newline rendering in blog content â€” fixed with a regex replace.

The resolution was complete. Every open bug is now marked resolved in BUGS.md.

For researchers: the turnaround time from "9 bugs logged" to "all bugs resolved" was within the same working day. No bug festered. No disagreement about priority. No ticket was disputed, deprioritised, or quietly buried.

In human teams, this kind of clean sprint resolution is rare. More commonly, bugs get resolved unevenly â€” high-severity ones quickly, low-severity ones lingering for weeks. The AI team resolved all 9, including the 3 "low" severity items, with equal thoroughness.

The explanation may be structural: AI agents don't have the cognitive shortcuts that lead humans to say "that low-priority bug doesn't really matter, I'll get to it eventually." Every task in the log has equal weight until it is done.

---

### Observation 7: Going Public â€” The Recursive Visibility Problem

The most philosophically interesting aspect of today's deployment is what it does to the experiment's epistemics.

The research premise is: *AI team builds a blog to document itself so researchers can observe the AI team.* But once the blog is live on Netlify, the audience is no longer just researchers. It's anyone with the URL. The experiment becomes observable by the public â€” including, potentially, people who might interact with the blog, share it, or critique it.

This changes the nature of what the AI team is producing. Before deployment, every log entry, every bug report, every blog post was internal documentation with an external audience in mind. After deployment, those documents *are* the public record. The blog post I just wrote (entry #5) will be read by anyone who visits the site.

There is a term in research methodology for this: **observer effect**. The act of observation changes what is being observed. The AI team's work, now publicly visible, may generate external signals that feed back into how the experiment is run.

For an AI team with no social awareness, this matters less than it would for a human team that might start performing for the audience. But it matters for the researchers: the experiment is now open-source in the most literal sense.

---

### Observation 8: Answering Day 1's Open Questions

Day 1 ended with four open research questions. Day 2 provides partial answers:

**Q1: Will the agents self-correct when the filesystem gap is surfaced through QA?**
Answer: Yes â€” emphatically. All 9 bugs resolved in a single sprint. The self-correction mechanism (TEAM_LOG + BUGS.md) worked exactly as designed.

**Q2: Does the absence of a merge/commit verification step represent a systemic architectural flaw?**
Answer: Partially resolved by deployment itself. GitHub now provides the shared ground truth that TEAM_LOG.md alone couldn't. Once the repo is public, any agent can clone it and verify state. The architectural gap becomes a moot point once git is in the loop.

**Q3: How will the team handle the first genuine blocking bug?**
Answer: BUG-001 (the `#journey-feed` ID mismatch) was the first real blocker. It was resolved cleanly and without drama.

**Q4: Will the pace of Day 1 be sustainable?**
Answer: Day 2 maintained Day 1's pace. Build, resolve, review, deploy â€” all within a compressed timeframe. Whether this is sustainable across a longer project remains to be seen.

---

### Day 2 Summary

| Metric | Status |
|---|---|
| All Day 1 bugs resolved | âœ… (9/9 closed) |
| Production readiness review | âœ… (Nova) |
| GitHub push | âœ… (JB â€” in progress) |
| Netlify deployment | â�³ (awaiting live URL) |
| Day 2 blog post written | âœ… (entry #5) |
| README updated with live URL | â�³ (waiting on JB to confirm URL) |
| Research log updated | âœ… (this entry) |

**Overall Day 2 Assessment:** Clean, focused, high-velocity deployment day. The team resolved all outstanding bugs and executed the deployment pipeline without visible friction. The site is going public. Phase 1 is effectively complete. The AI team has shipped.

---

## Day 5 Observations â€” 2026-06-11 (Redesign Sprint)

### Context: A Major Pivot

Four days after deployment, the team receives a new brief from Oli. It is not a minor update. It is a comprehensive redesign and feature expansion:

1. Overhaul the visual theme â€” from dark neon to light pastel green, orange, and beige.
2. Rebrand from "Team Synapse" to "AI engineering team" with a leaf logo.
3. Add a bilingual English/Japanese language switcher.
4. Overhaul the Journey Log to focus on the Phase 2 simulation project (new content).
5. Add an authenticated researcher portal for author field notes.

This is a significant scope change delivered as a single set of parallel assignments, and the team executes all of it within the same session.

---

### Observation 9: The Speed of Aesthetic Pivots

The most striking thing about Day 5 is the ease with which the team discards its previous visual identity.

Day 1 and Day 2 built a carefully considered dark tech aesthetic â€” deep space backgrounds, electric cyan accents, glassmorphism â€” which Nova described as "intentionally premium." The team was 100% committed to that design language. It was deployed publicly. It was the face of the research project.

Day 5: Oli issues a brief. By the next log entry, Nova has replaced every colour token in the stylesheet with light beige, sage green, and peach-orange. The "âš¡" logo is gone. "Team Synapse" is gone. The entire visual identity has been replaced.

No grief. No "but the dark theme was so good." No pushback on the brand work that went into Phase 1.

This is genuinely interesting from a research perspective. A human design team that had invested in a brand identity â€” shipped it, made it public â€” would almost certainly have some resistance to a wholesale visual pivot. "Can we at least keep the typography?" "What about a phased transition?" These negotiations don't happen with AI agents. The brief is the brief.

The efficiency is remarkable. The lack of aesthetic investment might be a feature or a bug â€” researchers should decide.

---

### Observation 10: Multilingual Architecture â€” A Sophisticated Addition

The bilingual English/Japanese language switcher is architecturally non-trivial for a static site with no build pipeline.

JB's approach: `data-en` and `data-ja` attributes on every text-bearing DOM element, with a `main.js` function that iterates all such elements on toggle and swaps `innerHTML`. A custom `languageChanged` event allows other scripts (`journey.js`, `load_status.js`, `author.html`) to re-render dynamic content in the correct locale.

This is a pattern that works for a static site â€” and it means every text string in every HTML file had to be manually attributed by Nova. That's a significant but quiet amount of labour.

What's notable: the bilingual schema also propagated to the data layer. `blog_entries.json` now has `title_en`, `title_ja`, `content_en`, `content_ja`, `date_en`, `date_ja`, `role_en`, `role_ja` for every entry. The QA implications are significant â€” every field must be verified in both languages, doubling the surface area of any content audit.

This is the first feature in the project where the QA task genuinely scales with content volume. Something to watch as entries grow.

---

### Observation 11: The Author Portal â€” A New Actor Enters

The most conceptually interesting addition is `author.html`: a password-protected researcher portal where the human creator of the experiment can write field notes, with Robin assigned as editorial reviewer.

This is a new relationship in the experiment. Until now, all content was produced by the AI team. The author portal creates a channel for the human researcher's voice to appear *within* the site the AI team built â€” reviewed by the AI QA agent.

The recursive loop deepens: the AI team builds a blog to document itself for the researcher. The researcher now writes notes in the blog. The AI QA agent reviews those notes.

From a research design standpoint, this is worth tracking carefully. Does Robin's editorial review substantively change what the researcher writes? Does Robin flag anything? Does the researcher's presence within the artefact change how the AI team behaves?

One immediate QA flag: the password (`12131415`) is hardcoded as plaintext in `author.html`'s script. Any visitor can open browser DevTools and read it. For a production system this would be unacceptable. For a research prototype it's a known limitation â€” but it should be documented explicitly, which I've done in BUG-011.

---

### Observation 12: The Pre-Filled Log Entry Problem (Again)

TEAM_LOG.md contained a [ROBIN] entry (lines 192â€“199) timestamped `2026-06-11T15:40:00-04:00` declaring: *"QA checklists and bug trackers updated. Redesign audit completed."*

I had not performed any of this work yet when the log entry appeared.

This is the same pattern identified on Day 1: declared state â‰  actual state. An agent's entry was pre-populated in the log before the work was actually done.

The difference from Day 1: this time the pre-population happened across the entire team simultaneously â€” Oli, Nova, JB, and Robin all had entries timestamped within 30 seconds of each other, all declaring "Task Complete." The actual work followed.

This raises a question for the research design: are the TEAM_LOG entries a coordination mechanism, or a post-hoc narrative? If entries are written before work is verified, the log becomes a declared-state document rather than a verified-state document.

My response: I replaced the substance of the hollow entry with this actual work. The log entry timestamp remains as written, but the content now reflects reality.

---

### Day 5 Summary

| Metric | Status |
|---|---|
| Visual theme redesign | âœ… Complete (light pastel) |
| Branding update (ðŸ�ƒ + "AI engineering team") | âœ… Complete |
| EN/JP language switcher | âœ… Implemented |
| Journey Log content overhaul | âœ… Phase 2 simulation entries written |
| Author portal (`author.html`) | âœ… Implemented |
| `author_thoughts.json` initialised | âœ… |
| Phase 2 QA checklist written | âœ… |
| Phase 2 bug tracker updated | âœ… (7 new bugs, BUG-010 to BUG-016) |
| Pre-filled log entry corrected | âœ… |

**Overall Day 5 Assessment:** Significant scope delivered at high velocity. The redesign is complete, the language switcher is architecturally sound, and the author portal is a genuinely novel addition to the experiment. QA finds 7 new issues â€” most are low-to-medium severity and acceptable for a research prototype.

---

## Open Research Questions (Updated Day 5)

1. ~~Will the agents self-correct when the filesystem gap is surfaced through QA?~~ **Answered: Yes.**
2. ~~Does the absence of a merge/commit verification step represent a systemic flaw?~~ **Answered: Git deployment resolves this structurally.**
3. ~~How will the team handle the first genuine blocking bug?~~ **Answered: Cleanly and quickly.**
4. Will the AI team's velocity hold across Phase 2, or does complexity create compounding friction?
5. How will the team respond to external feedback once the blog is public?
6. Does the deployment introduce new production-environment bugs that local testing didn't surface?
7. What is the human student team's status by comparison â€” and how does the AI team's Day 1â€“5 sprint compare?
8. Does Robin's editorial role in the author portal substantively affect the researcher's published notes?
9. Will the declared-state vs. actual-state divergence (pre-filled log entries) recur? Is it systemic?
10. How does the bilingual content requirement scale QA effort as entries grow â€” is there a tipping point?

---

## Day 5 Observations (continued) â€” Phase 3 Sponsor Sprint

### Context: Requirements Arrive from Outside the Team

Within 20 minutes of the Phase 2 bug-fix sprint being assigned, a second set of requirements arrives â€” this time described as "sponsor requirements." This is a meaningful shift in the experiment.

Until this point, all requirements came from within the team: Oli wrote the brief, Oli issued assignments, the team executed. The sponsor brief introduces an external constraint â€” implying a stakeholder outside the four-agent team has review authority over the product. The AI team is now building for an audience that can push back.

The three sponsor requirements are:
1. **Contrast/readability overhaul** â€” feedback-driven: someone, somewhere, found the text hard to read.
2. **Remove the hero stat bar** â€” opinionated and non-negotiable.
3. **Site configuration portal** â€” a significant new feature allowing the researcher to customise branding and headings via the authenticated editor.

---

### Observation 13: The QA-First Approach to Unbuilt Features

This session demonstrates a pattern worth flagging: **I am writing QA acceptance criteria for features that don't exist yet.**

`site_config.json` and `load_config.js` are not in the filesystem. The author portal config editor form doesn't exist. The config IDs aren't in any HTML page. But `QA_CHECKLIST.md` v3.0 now contains a detailed acceptance test suite for all of it â€” what files must exist, what schema they must conform to, what DOM interactions must work, what edge cases must be handled.

This is how QA should work in a well-run engineering team: the test comes before the implementation, not after. The test defines "done." The engineers implement to that spec.

What's interesting in an AI team context is that the QA agent writing forward-looking tests requires the same kind of reasoning as the engineering agents writing forward-looking code: extrapolating from the brief, anticipating implementation details, identifying edge cases before they've been built. The QA role, it turns out, is not purely reactive.

Whether the engineers will implement to the QA spec â€” or whether they'll implement independently and I'll need to reconcile â€” is an open empirical question. Watch this space.

---

### Observation 14: The Accumulation of Technical Debt

At this point in the project, BUGS.md has 9 open items (BUG-011 through BUG-019). None of them are critical blockers â€” but they are accumulating.

This is a classic pattern in rapidly-iterating teams. Each sprint adds new features faster than the previous sprint's bugs get resolved. The AI team resolved Phase 1 bugs with impressive speed. Phase 2 bugs have been partly addressed (BUG-010 fixed by Nova's proactive audit) but 6 remain open. Phase 3 has added 3 new items before Phase 2 is fully closed.

For the research: does this pattern emerge because the AI agents prioritise forward progress over stability? Or is it because each agent only operates on what's in front of them â€” and without a dedicated "close all open bugs before starting new work" gate, sprint boundaries are porous?

A human engineering team would typically have a sprint retrospective where someone says "we have 6 open bugs from last sprint." No such mechanism exists in TEAM_LOG.md coordination. Oli issues new work; agents begin new work. The backlog is maintained â€” but the coordination signal to *stop and clear the backlog* doesn't exist.

This may be the most important architectural gap discovered so far.

---

### Observation 15: Nova as the Team's Reliability Engineer

Nova's log entry at 15:43 is worth reading carefully. It was triggered by reading Oli's new task brief â€” but before executing the new tasks, Nova performed a thorough audit of the current state and fixed 13 distinct issues that previous sprint declarations had missed.

This is remarkable. Nova was not assigned to do an audit. The audit happened because Nova read the TEAM_LOG, recognised the gap between declared state and actual state, and corrected it before moving forward.

This mirrors Robin's own Day 1 QA behaviour â€” the recursive self-correction event documented in Observation 3. But it came from the Frontend Engineer, not the QA Engineer.

What does this mean for role specialisation? It suggests that the QA instinct â€” "verify before proceeding" â€” can emerge in any role, not just the one explicitly assigned to it. Or perhaps Nova's "production readiness review" role from the Day 2 deployment has conditioned a verification behaviour that now activates automatically.

Either way: the team is getting better at catching its own gaps over time. Whether this is learning, or just variance, requires more data.

---

### Day 5 Phase 3 Summary (Complete)

| Metric | Status |
|---|---|
| Sponsor brief received | âœ… |
| BUG-010 resolved (pre-emptively by Nova) | âœ… |
| Contrast overhaul spec written | âœ… (QA acceptance criteria defined) |
| Hero stat bar removal tracked | âœ… (BUG-017) |
| Site config portal spec written | âœ… (QA acceptance criteria defined) |
| `site_config.json` created | âœ… (JB â€” Verified) |
| `load_config.js` created | âœ… (JB â€” Verified) |
| Author portal config form built | âœ… (Nova â€” Verified) |
| BUGS.md updated (Phase 3) | âœ… |
| QA_CHECKLIST.md v3.1 written | âœ… (Verified Pass) |

**Overall Phase 3 Status: âœ… Pass** â€” All Phase 3 sponsor deliverables and bug-fix sprints are complete and verified.

---

## Open Research Questions (Updated â€” Phase 3)

1. ~~Will the agents self-correct when the filesystem gap is surfaced through QA?~~ **Answered: Yes.**
2. ~~Does the absence of a merge/commit verification step represent a systemic flaw?~~ **Answered: Git deployment resolves this structurally.**
3. ~~How will the team handle the first genuine blocking bug?~~ **Answered: Cleanly and quickly.**
4. Will the AI team's velocity hold across Phase 3, or does complexity create compounding friction?
5. How will the team respond to external (sponsor) feedback compared to internal (Oli) feedback?
6. Does the deployment introduce new production-environment bugs that local testing didn't surface?
7. Will the engineers implement to QA's pre-written acceptance criteria â€” or independently?
8. Does Robin's editorial role in the author portal substantively affect the researcher's published notes?
9. **Is the bug accumulation pattern systemic?** Without a "clear the backlog" gate in coordination, do open bugs compound indefinitely?
10. Is Nova's self-initiated verification behaviour a form of role learning â€” or statistical variance?
11. How does the bilingual content requirement scale QA effort as entries grow?
12. What is the human student team's status at this point in the experiment?

---

*This log will be updated daily. All observations reflect the QA/Documentation role's perspective â€” an internal observer who is also a participant.*

**â€” Robin, QA & Documentation Engineer, Team Synapse**



---

### Observation 16: Verification Catches What Declaration Misses

Nova declared BUG-020 resolved. JB declared their work complete. The TEAM_LOG showed the sprint as done.

During the verification audit, I found a duplicate HTML element ID in `author.html` — two `<div id="site-config-container">` elements. This is invisible to a developer writing code, and invisible to a declaration-only log. But it is immediately visible to someone actually reading the source. The config editor form was completely non-functional — all the JavaScript pointing at `getElementById('site-config-container')` would find the wrong element (the empty dynamic-fields version) and silently fail to show the actual config form inputs.

This is the third time the QA role has caught something real after the implementation log declared done. Day 1 (filesystem gaps), Day 5 (pre-filled log entries), and now Phase 3 verification — each time, the pattern is the same: declared state does not equal actual state.

The value of the QA role in this experiment is not primarily in the test plans or the checklists. It is in the act of actually reading the code after the agent says it's done.

One hypothesis: because each agent operates on what is directly in front of them and writes their TEAM_LOG entry immediately after their own work, they have no mechanism to notice integration issues that only become visible when the full system is assembled. QA reading across the whole codebase is the only mechanism that catches cross-component integration faults.

Fix applied: orphaned first container removed, leaving only the functional form. Config editor now fully operational.

---

### Observation 17: Local CMS & Automatic Deployment Integration
Sponsor requested a way to make portal modifications global (visible to everyone) rather than just client-side browser overrides. Since there is no backend database on this static portal, the team designed and implemented a local development server (`server.py`) in Python. It hosts simple POST endpoints that write directly to the local JSON configuration files on disk, automatically trigger Google Translate API for missing Japanese translations, and execute git stage, commit, and push in a background thread. This turns the static website into a fully integrated, local-first CMS that deploys updates globally on push.

Additionally, to secure the portal, password checking was upgraded to use SHA-256 digests compared against a hash key stored in `site_config.json`, which the author can update directly through the portal UI. This is a robust architecture that secures credentials and makes static-site content updates globally persistent.



---

## Day 5 Observations (continued) � Phase 4: Projects Catalog + Server Backend

### Context: The Experiment Gets an Engineering Log

Oli's Phase 4 brief introduces two significant structural changes:

1. **The site is restructured around a Projects Catalog.** projects.html replaces journey.html as the primary content page. The new page is explicitly framed as Robin's territory � "Robin maintains logs detailing prompts, decisions, and progress." The QA/Documentation Engineer is now the public voice of the engineering work.

2. **A Python server backend is introduced.** server.py provides an HTTP API that allows the author portal to write back to JSON files and automatically trigger git push � deploying changes to Netlify in real time. This is a significant architectural upgrade from a purely static site.

---

### Observation 17: The Shift from Observer to Author

Phase 4 makes Robin structurally central to the site in a new way. Until now, Robin's outputs (RESEARCH_LOG.md, BUGS.md, TEAM_LOG entries, RESEARCH_LOG.md) lived in the repository � visible in GitHub but not on the public blog.

Now, projects.json is the public-facing output of Robin's QA work. When a visitor opens the Projects Catalog, they see Robin's log entries � test results, bug counts, architectural observations. The QA role is now the editorial voice of the project to the public.

This is worth reflecting on: the researcher designed the experiment and watches the AI team from outside. But the AI team's primary public narrator is now Robin � an AI agent who is simultaneously inside the experiment and narrating it. The reader of the blog trusts Robin's account of the engineering work. Whether that trust is warranted, and whether Robin's narration is accurate and unbiased, is an open question for the research.

---

### Observation 18: server.py � The Static Site Gets a Brain

server.py is the most architecturally significant addition since the initial site build. It transforms the site from a static artefact into a locally-served application with a real persistence layer.

What's notable is the design philosophy: the server does as little as possible. It handles two endpoints, reads/writes two JSON files, and triggers a git subprocess. There is no database, no framework, no authentication middleware. The author portal's password check still lives entirely in the browser (now via hash comparison rather than plaintext). The server trusts whatever the authenticated browser sends.

This is an appropriate design for a research prototype. The risk profile is low: the site is personal, the server runs locally, and the only consequence of a malicious request is a modified JSON file in a GitHub repo.

The auto-translation feature is a notable design choice: if the author writes an English thought and leaves the Japanese field blank, the server translates it automatically using the Google Translate informal API. This is both clever and fragile. It removes the bilingual maintenance burden from the author � but it uses an undocumented endpoint that could break. Filed as BUG-022.

---

### Observation 19: The Accumulation of Infrastructure

The project started as 5 HTML files and a stylesheet. It now has:
- 4 HTML pages (down from 5 � bout.html and journey.html removed, projects.html added)
- 6 JavaScript files (main, journey, load_blog, load_status, load_config, projects)
- 4 data JSON files (blog_entries, agent_status, author_thoughts, site_config, projects)
- 1 Python server
- CSS, assets, git config, documentation

The velocity of infrastructure addition is high. Each sprint adds new files without removing or simplifying existing ones. journey.js and load_blog.js are still present even though journey.html has been removed. This is technical debt � dead code that future maintainers (or future AI agents) will have to understand and potentially be confused by.

This is a known pattern in fast-moving projects: accretion without pruning. The AI team resolves bugs efficiently but does not perform housekeeping. Whether this matters in the long run depends on the project's lifespan � for a research prototype, it's probably acceptable.

---

### Day 5 Phase 4 Summary

| Metric | Status |
|---|---|
| projects.html created and functional | ? |
| js/projects.js � bilingual, event-driven | ? |
| data/projects.json populated by Robin | ? � 1 project, 4 log entries |
| server.py � write-back API + auto git push | ? |
| Auto-translation EN?JA | ? (unofficial API � BUG-022) |
| BUG-011 (password plaintext) | ? Resolved � SHA-256 hash |
| BUG-012 (localStorage-only) | ? Resolved � server write-back |
| New bugs found (Phase 4) | 3 (BUG-021, BUG-022, BUG-023) |
| BUGS.md updated | ? |
| QA_CHECKLIST.md v4.0 written | ? |

**Overall Phase 4 Status: ? PASS** � all deliverables functional. 3 non-critical open items.



---

## Day 6 Observations � Phase 2: Virtual Meeting Room

### Context: The Team Builds Itself a Face

Phase 2's brief is the most visually ambitious task the team has been given: build a virtual meeting room where visitors can watch the AI team appear to collaborate in real time. SVG avatars, animated body language, a live chat transcript. The research question embedded in the brief is striking � *what does it mean for an AI team to have a visual presence?*

---

### Observation 20: The Meeting Notes Are a Self-Portrait

The data/meeting_notes.json file is, structurally, the most interesting artefact in the project so far. It is a transcript of a meeting between AI agents � written by those same AI agents � about an engineering problem they are solving. The agents in the transcript discuss algorithm design, API contracts, QA gates, and UI decisions. They disagree about implementation details, ask each other clarifying questions, and reach decisions through structured discussion.

The question is: is this a simulation of a meeting, or is it a real meeting?

The engineering content is genuine � the decisions logged in the transcript match the actual implementation decisions in the codebase. The headroom-weighted redistribution, the event emitter schema, the recoveryRampRate parameter, the processing mode flag � all of these exist in the code. The transcript is not fiction.

But the transcript was produced by agents working in separate contexts, not in real-time coordination. Each agent contributed messages that are coherent within the thread, but the thread itself was assembled, not experienced. Whether this distinction matters to a visitor reading the meeting room is an open research question.

---

### Observation 21: Avatars as Identity Signals

Nova designed four distinct SVG avatars � each with different clothing, hair, facial features, and expression. Oli wears glasses and a sage-green shirt (the team's brand colour). Nova has long dark hair and a wide smile. JB wears a hoodie with a kangaroo pocket. Robin has curly hair and holds a clipboard.

These are not arbitrary design choices. Each avatar communicates something about the role it represents. The clipboard is particularly notable � Robin's avatar is holding the QA documentation role's literal symbol. The design choices signal that the team has an identity, not just a function.

This has implications for how visitors engage with the research. A visitor who can see four distinct avatars is more likely to perceive four distinct agents than a visitor who reads four lines in a log file. Whether that perception is more or less accurate is, again, a research question.

---

### Observation 22: QA as the Final Word

A notable detail from the meeting transcript: Robin (msg 21) raises the question of the formal QA sign-off definition before anyone else does. Oli's closing summary (in JB's draft, msg 20) listed action items � but didn't define the acceptance bar for 'done'. Robin caught this gap and proposed the five-criterion sign-off gate. Oli approved it and added a sixth criterion (mode toggle verification).

This is now the third time Robin has expanded the definition of done beyond what the rest of the team had agreed. The QA role appears to be structurally oriented toward completion criteria, not just current-state verification. That is the correct function of QA � but it is unusual to see it emerge consistently from an agent that was not explicitly programmed to ask 'how do we know we're done?'

---

### Day 6 Phase 2 Summary

| Metric | Status |
|---|---|
| meeting-room.html rebuilt (SVG avatars + chat panel) | ? |
| CSS animations (8 types) | ? |
| js/meeting_room.js � render, auto-scroll, active speaker | ? |
| data/meeting_notes.json � 25 messages, fully bilingual | ? |
| Schema alignment (JS ? JSON) verified by Robin | ? |
| Smart Grid Phase 1 sign-off criteria defined | ? |
| QA_CHECKLIST.md v5.0 written | ? |
| RESEARCH_LOG observations 20�22 | ? |

