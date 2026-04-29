# HooiserHyperdrive Civic Engagement Desk

Static civic engagement demo for local government teams to track citizen engagement, loyalty milestones, agent recommendations, and service feedback analytics.

## How to Open

1. Open the project folder in VS Code.
2. Start a local static server (for markdown/doc fetch requests), for example:
	- `python -m http.server 5500`
3. Open `http://localhost:5500/index.html` in a browser.
4. Navigate across pages using the shared header.

No package manager or build tool is required.

## Page Map

- `index.html`: Home page and role-switch entry hub.
- `citizen.html`: Citizen-facing dashboard with points, tier progress, recommendations, and ratings.
- `agent.html`: Agent console with lookup, milestone banners, recommendations, KB search, and case workflow.
- `supervisor.html`: Supervisor CX insights with KPIs, coaching flags, and interaction table.
- `user-stories.html`: Branded document reader for `USER_STORIES.md`.
- `test-cases.html`: Branded document reader for `QA_TEST_CASE_MATRIX.md`.

## Reset Instructions

- Use the Reset Demo links on role pages where available.
- To fully reset state, clear browser local storage for the site.

## Structure

- `css/styles.css`: Global styling, tokens, cards, and document rendering styles.
- `js/data.js`: Demo state store and domain helpers.
- `js/ai.js`: Rule-based recommendations with optional OpenAI enhancement.
- `js/markdown-viewer.js`: Markdown renderer used by the document pages.
- `USER_STORIES.md`: Dedicated handoff document for audience-focused user stories.
- `QA_TEST_CASE_MATRIX.md`: Dedicated handoff matrix for QA validation.

## Handoff Documents

- `USER_STORIES.md`: Audience-based user stories with acceptance notes for citizen, agent, and manager workflows.
- `QA_TEST_CASE_MATRIX.md`: Structured QA matrix with IDs, preconditions, steps, expected results, and priority.