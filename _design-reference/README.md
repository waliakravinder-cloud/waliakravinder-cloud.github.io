# HooiserHyperdrive Civic Engagement Desk — Hackathon Project

A "HooiserHyperdrive Civic Engagement Desk" demo for local government agents. Tracks and rewards citizen engagement, gives agents real-time loyalty/engagement context, and uses AI to suggest next-best actions, recognize milestones, and resolve issues.

## Deliverables

| # | Deliverable | Location |
|---|---|---|
| 1 | User stories | [docs/user-stories.md](docs/user-stories.md) |
| 2 | Test cases | [docs/test-cases.md](docs/test-cases.md) |
| 3 | Wireframes | [wireframes/index.html](wireframes/index.html) |
| 4 | Working demo (Citizen + Agent + Supervisor) | [app/index.html](app/index.html) |
| 5 | One-slide pitch | [slides/pitch.html](slides/pitch.html) |

## Run the demo

**No build, no install.** Just open [app/index.html](app/index.html) in any modern browser
(double-click the file, or right-click → *Open with Live Server* in VS Code).

The landing page lets you switch between three roles:

- **Citizen — My Dashboard** — points balance, tier, history, AI recommendations, post-interaction rating.
- **Agent Desk** *(primary surface)* — citizen lookup, milestone talking points, AI next-best actions, KB search, one-click enroll/escalate.
- **Supervisor — CX Insights** — agent CSAT, conversions, escalations, auto-flagged coaching opportunities.

State is persisted in `localStorage`; click **Reset demo** at the bottom of any page to restore.

## AI configuration

The demo runs **fully offline** with a rule-based recommender (no API key needed). The recommender scores each program by:

- match against citizen's declared interests,
- tier-appropriate impact (Bronze gets quick wins; Gold/Champion gets high-impact),
- proximity to the next tier threshold,
- event recency.

**Optional LLM enhancement:** in the browser DevTools console, set:

```js
SCED_OPENAI_KEY = "sk-...";
```

Then click **Refresh** on any recommendation panel. The app calls `gpt-4o-mini`
in JSON mode to rewrite each rationale into warmer, plainer language. Outputs
pass a guardrail filter (PII regex, prohibited-promise terms, 240-char cap).
If the API call fails, the panel is labeled `(fallback: AI unavailable)` and
falls back to the rule-based rationale — no broken UI.

> **Security note:** in production the key would never sit in the browser. The hackathon hook is for live-demo convenience only.

## Demo script (≤ 3 minutes)

1. Open [app/index.html](app/index.html) → click **Agent Desk**.
2. Aisha Patel (Gold) is auto-loaded. Point out the **milestone banner** and **AI top pick**.
3. Click **Enroll** on the top recommendation → watch points/tier and history update live.
4. Search KB for *"pothole"* → click **Send to citizen**.
5. Click **Close case &amp; request rating** on the open pothole case.
6. Switch to **Citizen — My Dashboard** → show the new points, history row, and rating prompt; submit a 5★ rating.
7. Switch to **Supervisor — CX Insights** → show CSAT KPIs and the coaching flag for Agent Jones (rating ≤ 2, repeat callback).

## Repository layout

```
Project/
├── README.md
├── docs/
│   ├── user-stories.md          # 6 epics, 27 stories, AC in Given/When/Then
│   └── test-cases.md            # ~90 test cases + smoke suite + personas
├── wireframes/
│   └── index.html               # Low-fi wireframes (citizen / agent / supervisor / flow)
├── slides/
│   └── pitch.html               # One-slide pitch (Ctrl/Cmd+P → PDF)
└── app/
    ├── index.html               # Role picker / landing
    ├── citizen.html             # Citizen "My Dashboard"
    ├── agent.html               # Agent Desk (primary)
    ├── supervisor.html          # Supervisor CX dashboard
    ├── css/styles.css
    └── js/
        ├── data.js              # Mock state, ledger, tier helpers, lookup
        └── ai.js                # Rule-based recommender + OpenAI hook + guardrails
```

## How the engineering principles are reflected

- **DRY** — shared `data.js` / `ai.js` consumed by all three views.
- **Modular** — UI surfaces are independent HTML files; logic is in pure JS modules with no UI coupling.
- **Security** — guardrail regex on AI output (PII, prohibited promises); no secrets in source; user input rendered as text (no `innerHTML` with user input); append-only points history.
- **12-factor-friendly** — no filesystem state; AI key supplied via runtime config (would be env var on a server).
- **Accessibility** — semantic HTML, sufficient color contrast, keyboard-reachable controls (full WCAG audit listed in test cases).
- **Test plan** — see `docs/test-cases.md` (Demo-Day smoke suite, Appendix B).

## Out of scope (hackathon)

Native mobile, real SSO, payment processing for paid rewards, production ML pipeline. See *Out-of-Scope* section in user stories.
