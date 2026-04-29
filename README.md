# Smart Civic Engagement Desk

Static wireframe portal for local government teams to track citizen engagement, loyalty milestones, agent recommendations, knowledge guidance, and service feedback analytics.

## How to Open

1. Open the project folder in VS Code.
2. Open `index.html` directly in any browser.
3. Navigate across pages using the shared header.

No install step, server, package manager, or build tool is required.

## Page Map

- `index.html`: Home page and solution overview.
- `pages/my-dashboard.html`: Citizen-facing dashboard with points, tier, recommendations, and history filters.
- `pages/agent-desk.html`: Agent service console with loyalty context, next-best actions, and knowledge details.
- `pages/engagement-history.html`: Detailed civic activity and loyalty timeline.
- `pages/programs.html`: Program enrollment and recommendation page.
- `pages/knowledge-center.html`: Knowledge management guidance and agent scripts.
- `pages/feedback-analytics.html`: Management-facing feedback and coaching analytics.

## Reset Instructions

- Refresh the browser tab to reset any temporary UI state such as mobile navigation or page-level filters.
- Theme preference is stored in browser local storage. To reset it, clear the site storage for the file-based page or switch back using the theme toggle.

## Structure

- `css/styles.css`: Global styles, reset, layout, and design tokens.
- `css/components.css`: Shared component styles for navigation, buttons, cards, tables, and forms.
- `js/main.js`: Shared mobile navigation and day/night theme toggle.
- `js/my-dashboard.js`: Dashboard history filtering.
- `js/agent-desk.js`: Mock citizen switching in the agent workspace.
- `js/feedback-analytics.js`: Mock timeframe switching for analytics.
- `assets/images/*.svg`: Local placeholder artwork with no external assets.
- `USER_STORIES.md`: Dedicated handoff document for audience-focused user stories.
- `QA_TEST_CASE_MATRIX.md`: Dedicated handoff matrix for QA validation.

## Handoff Documents

- `USER_STORIES.md`: Audience-based user stories with acceptance notes for citizen, agent, and manager workflows.
- `QA_TEST_CASE_MATRIX.md`: Structured QA matrix with IDs, preconditions, steps, expected results, and priority.