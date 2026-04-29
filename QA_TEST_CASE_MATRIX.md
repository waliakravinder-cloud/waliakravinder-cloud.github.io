# HooiserHyperdrive Civic Engagement Desk QA Test Case Matrix

This matrix is intended for handoff and walkthrough testing of the static wireframe portal.

## Test Approach

- Test by opening `index.html` directly in a browser.
- Do not rely on a local server or network access.
- Validate both desktop and narrow/mobile layouts where noted.

## Matrix

| ID | Area | Scenario | Preconditions | Steps | Expected Result | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| QA-01 | Navigation | Open the app locally | Project files are present on disk | 1. Open `index.html` directly in a browser. | The home page renders without requiring a build step, package install, or server. | High |
| QA-02 | Navigation | Verify global page links | `index.html` is open | 1. Click each navigation link from the shared header. 2. Repeat from at least one inner page. | Each link opens the correct local HTML page and no external navigation is required. | High |
| QA-03 | Responsive Nav | Verify mobile menu behavior | Any page is open | 1. Resize the browser below 720px. 2. Click the Menu button. 3. Click the Menu button again. | The shared menu opens and closes correctly on smaller widths. | High |
| QA-04 | Theme | Verify day/night theme toggle | Any page with the shared header is open | 1. Click the theme toggle. 2. Navigate to another page. | The theme changes visually and the selected theme persists across page navigation. | Medium |
| QA-05 | Citizen Dashboard | View loyalty summary | `pages/my-dashboard.html` is open | 1. Review the hero and metric cards. | Loyalty points, current tier, milestone progress, and recent rating are visible. | High |
| QA-06 | Citizen Dashboard | Filter engagement history | `pages/my-dashboard.html` is open | 1. Click `All`. 2. Click `Volunteering`. 3. Click `Feedback`. 4. Click `Service`. | The table only shows rows matching the selected filter, and `All` restores all entries. | High |
| QA-07 | Rewards | Review rewards catalog and redemption flow | `pages/rewards-preferences.html` is open | 1. Review all catalog cards. 2. Review the redemption form and preference panel. | Rewards show point cost and availability, and the page clearly communicates graceful failure and confirmation behavior. | Medium |
| QA-08 | Agent Desk | Switch selected citizen | `pages/agent-desk.html` is open | 1. Click each citizen in the queue. | The profile, tier, points, milestone banner, recommendation text, timeline, and knowledge details update for the selected citizen. | High |
| QA-09 | Agent Workflow | Verify knowledge and case logging presence | `pages/agent-desk.html` is open | 1. Review lookup, recommendations, KB search, and case logging sections. 2. Click the knowledge center link. | The agent desk contains lookup, milestone, recommendation, KB, escalation, and case closure concepts with working local navigation. | High |
| QA-10 | Programs | Review recommended program options | `pages/programs.html` is open | 1. Review the program cards. 2. Review the enrollment form. | Recommended programs, point values, eligibility, caps, and a mock enrollment workflow are visible and readable. | Medium |
| QA-11 | Engagement History | Review detailed timeline | `pages/engagement-history.html` is open | 1. Review the timeline table, filters, and linked-document notes. | The page presents dated engagement actions, channels, case context, point values, and supporting milestone context. | Medium |
| QA-12 | Supervisor | Change dashboard timeframe | `pages/feedback-analytics.html` is open | 1. Click `Weekly`. 2. Click `Monthly`. 3. Click `Quarterly`. | The CSAT score, coaching focus text, and chart values update for each timeframe. | High |
| QA-13 | Supervisor | Review coaching flags and drill-down | `pages/feedback-analytics.html` is open | 1. Review the KPI cards. 2. Review the low-rating interactions table and agent self-view panel. | The page shows CSAT, response time, conversion and escalation metrics plus drill-down content for supervisors. | Medium |
| QA-14 | Admin | Review admin console coverage | `pages/admin-console.html` is open | 1. Review program, tier, KB workflow, guardrail, audit, and access sections. | The admin console covers program configuration, tier management, KB lifecycle, AI guardrails, and audit/retention notes. | Medium |
| QA-15 | Assets | Verify local placeholder assets | Any page with an illustration is open | 1. Open the dashboard page. 2. Open the agent desk page. | Placeholder images load from local SVG files and no remote assets are requested. | Medium |
| QA-16 | Markup | Confirm mock content labeling | Project files are open in VS Code | 1. Review representative HTML files. | Mock data sections are labeled with `<!-- MOCK -->` comments in the markup. | Medium |
| QA-17 | Shared Layout | Confirm shared shell consistency | Multiple pages are open | 1. Compare header and footer structure across the home page and inner pages. | Each page uses the shared header, navigation set, and footer pattern required for the wireframe. | Medium |
| QA-18 | Offline Constraint | Confirm no external dependency usage | Browser dev tools are available | 1. Open the Network panel if desired. 2. Navigate through the app. | No CDN, remote image, font, framework, or package dependency is required for the wireframe to function. | High |

## Exit Criteria

- All High priority cases pass.
- No broken local links are found.
- No missing asset references are found.
- No JavaScript errors block the documented interactions.

## Handoff Notes

- This matrix is tailored to the current static prototype and should be expanded if the project moves into functional development.
- If future work introduces forms with submission or live data, add negative, validation, and cross-browser test coverage.