# Smart Civic Engagement Desk — User Stories

**Product:** Smart Civic Engagement Desk

## Personas
- **Citizen (C)** — resident participating in civic programs
- **Agent (A)** — call-center / service-center government worker
- **Supervisor (S)** — agent manager reviewing CX & coaching needs
- **Program Admin (P)** — staff configuring programs, points, tiers
- **System / AI (AI)** — recommendation & insights engine

**Story format:**  
_As a `<persona>`, I want `<capability>` so that `<value>`._  
**AC** = Acceptance Criteria (Given/When/Then).  
Each story has a priority:
- **P0** = must
- **P1** = should
- **P2** = nice

---

## Epic 1 — Citizen Engagement Tracking & Rewards

### US-1.1 Earn loyalty points for civic actions (P0)
**As a Citizen,** I want to automatically earn loyalty points whenever I complete a tracked civic action (volunteering, attending a town hall, submitting feedback, completing a survey), so that I am recognized for my participation.

**Acceptance Criteria**
- Given a citizen completes a tracked action, when the action is recorded, then their points balance increases by the configured amount within 5 seconds.
- Given an action has a per-citizen cap (e.g., 1 survey/day), when the cap is exceeded, then no additional points are awarded and the citizen is notified why.
- Each transaction is written to engagement history with timestamp, action type, points delta, and source.

### US-1.2 View My Dashboard (P0)
**As a Citizen,** I want a "My Dashboard" showing my points balance, current tier, engagement history, and AI recommendations, so that I understand my standing and what to do next.

**Acceptance Criteria**
- Dashboard loads in `< 2s` and shows: points balance, tier badge, last 10 engagements, `>=3` AI recommendations.
- Empty-state copy is shown when no engagement history exists.
- All values match the underlying ledger (no stale cache `> 60s`).

### US-1.3 Tier progression & milestones (P0)
**As a Citizen,** I want to see my current tier (Bronze, Silver, Gold, Volunteer Champion) and progress to the next tier, so that I am motivated to engage more.

**Acceptance Criteria**
- Tier is calculated from rolling 12-month points using configurable thresholds.
- Progress bar shows points needed to next tier; reaching a threshold triggers a milestone event.
- Tier downgrade only occurs at the annual review date, not mid-cycle.

### US-1.4 Rate the agent interaction (P0)
**As a Citizen,** I want to rate (1–5 stars) and optionally
