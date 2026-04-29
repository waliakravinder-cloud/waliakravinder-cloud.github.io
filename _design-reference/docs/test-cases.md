# HooiserHyperdrive Civic Engagement Desk — Test Cases

**Conventions**
- **ID**: `TC-<epic>.<story>.<n>`
- **Type**: Functional (F), UI (UI), Integration (INT), Negative (NEG), Performance (PERF), Security (SEC), Accessibility (A11Y), AI/Quality (AI)
- **Priority**: P0 (smoke), P1 (regression), P2 (extended)
- Each test lists *Pre-conditions → Steps → Expected Result*. Test data refers to the personas in **Appendix A**.

---

## Epic 1 — Citizen Engagement Tracking & Rewards

### US-1.1 Earn loyalty points

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-1.1.1 | F | P0 | Points awarded for completed survey |
| TC-1.1.2 | F | P0 | Points awarded for volunteer event check-in |
| TC-1.1.3 | NEG | P0 | Daily cap blocks duplicate survey points |
| TC-1.1.4 | NEG | P1 | Inactive program does not award points |
| TC-1.1.5 | INT | P0 | Engagement history row created with correct metadata |

**TC-1.1.1** — *Survey points*
- Pre: Citizen `C-Gold-001` logged in; "Spring 2026 Community Survey" active, value = 20 pts.
- Steps: Submit survey → check dashboard within 5s.
- Expected: Balance increases by 20; toast "You earned 20 points"; ledger row with action=`SURVEY_SUBMIT`, delta=+20, source=`survey:spring-2026`.

**TC-1.1.3** — *Daily cap*
- Pre: `C-Bronze-002` already submitted today's daily-tip survey (cap = 1/day).
- Steps: Re-submit same survey.
- Expected: Submission blocked with message "Daily limit reached"; balance unchanged; no ledger row.

### US-1.2 View My Dashboard

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-1.2.1 | UI | P0 | Dashboard renders all required widgets |
| TC-1.2.2 | UI | P1 | Empty-state for new citizen with no history |
| TC-1.2.3 | PERF | P1 | Dashboard p95 load < 2s with 500 history rows |
| TC-1.2.4 | F | P0 | Balance matches ledger sum |

### US-1.3 Tier progression

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-1.3.1 | F | P0 | Crossing 500-pt threshold upgrades Bronze→Silver |
| TC-1.3.2 | F | P0 | Milestone event fires exactly once per upgrade |
| TC-1.3.3 | NEG | P1 | Tier does not downgrade mid-cycle when points expire |
| TC-1.3.4 | UI | P1 | Progress bar % matches (current − tierMin)/(tierMax − tierMin) |

**TC-1.3.1**
- Pre: `C-Bronze-002` at 480 pts; Silver threshold = 500.
- Steps: Award +25 pts via volunteer check-in.
- Expected: Tier becomes Silver; `TIER_UPGRADE` event published; banner "Welcome to Silver" shown next dashboard load.

### US-1.4 Rate the agent

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-1.4.1 | F | P0 | Rating prompt sent within 10 min of case close |
| TC-1.4.2 | F | P0 | Rating + comment linked to interaction & agent |
| TC-1.4.3 | F | P1 | Rating awards configured points |
| TC-1.4.4 | NEG | P0 | Cannot submit two ratings for same interaction |
| TC-1.4.5 | F | P2 | Edit rating allowed within 24h, blocked after |

### US-1.5 Redeem rewards

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-1.5.1 | F | P1 | Successful redemption decrements balance atomically |
| TC-1.5.2 | NEG | P1 | Redemption blocked when balance < cost |
| TC-1.5.3 | NEG | P1 | Redemption blocked when item out of stock |
| TC-1.5.4 | INT | P2 | Confirmation email sent and logged |

### US-1.6 Preferences

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-1.6.1 | F | P1 | Preferences persist across logout/login |
| TC-1.6.2 | F | P1 | Opted-out category suppressed from recommendations |
| TC-1.6.3 | NEG | P1 | SMS not sent when SMS channel disabled |

---

## Epic 2 — Agent Real-Time Insights

### US-2.1 Citizen lookup

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-2.1.1 | F | P0 | Lookup by phone returns correct profile |
| TC-2.1.2 | F | P0 | Lookup by email returns correct profile |
| TC-2.1.3 | F | P0 | Lookup by citizen ID returns correct profile |
| TC-2.1.4 | NEG | P0 | No-match shows "Create new" CTA |
| TC-2.1.5 | PERF | P1 | Lookup p95 < 1s with 100k citizens |
| TC-2.1.6 | SEC | P0 | Agent in Region A cannot retrieve Region B citizen |

### US-2.2 Milestone recognition

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-2.2.1 | F | P0 | Banner shown when milestone within last 30 days |
| TC-2.2.2 | NEG | P1 | No banner if no milestone in last 30 days |
| TC-2.2.3 | F | P1 | Dismiss is logged with agent + interaction id |

### US-2.3 Engagement timeline

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-2.3.1 | UI | P0 | Timeline renders newest-first with 25/page |
| TC-2.3.2 | F | P0 | Filter by date range narrows results correctly |
| TC-2.3.3 | F | P1 | Filter by channel (call/email/walk-in) |
| TC-2.3.4 | UI | P1 | Expand entry shows notes & linked docs |

### US-2.4 AI next-best-action

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-2.4.1 | AI | P0 | ≥3 ranked recommendations returned for known citizen |
| TC-2.4.2 | AI | P0 | Each recommendation has rationale, points, action button |
| TC-2.4.3 | NEG | P0 | Already-enrolled programs excluded |
| TC-2.4.4 | NEG | P0 | Opted-out categories excluded |
| TC-2.4.5 | F | P1 | Thumbs-up/down recorded with rec id and agent id |
| TC-2.4.6 | INT | P0 | Fallback list shown & labeled when AI service errors/times out |
| TC-2.4.7 | PERF | P1 | Recommendation panel p95 < 1.5s |

**TC-2.4.6** — *Fallback*
- Pre: AI endpoint mocked to return 503.
- Steps: Open `C-Gold-001` profile.
- Expected: Panel shows rule-based recs with badge "Fallback (AI unavailable)"; error logged; user-facing copy is non-alarming.

### US-2.5 Knowledge base lookup

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-2.5.1 | F | P0 | Search returns ≤5 ranked articles with snippet & date |
| TC-2.5.2 | F | P0 | "Send to citizen" delivers via citizen's preferred channel |
| TC-2.5.3 | F | P1 | Search query + selected article saved to case |
| TC-2.5.4 | NEG | P1 | Retired articles excluded from results |

### US-2.6 Case logging

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-2.6.1 | NEG | P0 | Cannot close case without reason & resolution |
| TC-2.6.2 | F | P0 | Closing case triggers citizen rating prompt |
| TC-2.6.3 | F | P1 | Follow-up date schedules a reminder task |

### US-2.7 Enroll in program

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-2.7.1 | F | P0 | One-click enroll writes engagement + sends confirmation |
| TC-2.7.2 | NEG | P0 | Ineligible citizen blocked with clear reason |
| TC-2.7.3 | F | P1 | Enrollment increments agent's conversion metric |

### US-2.8 Escalation

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-2.8.1 | F | P1 | Gold-tier escalation routes to priority queue |
| TC-2.8.2 | F | P1 | Supervisor notified within 60s |
| TC-2.8.3 | F | P2 | Escalation packet contains timeline snapshot |

---

## Epic 3 — AI Recommendations

### US-3.1 / 3.2 Generation & rationale

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-3.1.1 | AI | P0 | Output schema valid (id, title, rationale, points, confidence) |
| TC-3.1.2 | AI | P0 | Rationale ≤ 240 chars and references a real profile datapoint |
| TC-3.1.3 | AI | P0 | No fabricated programs (every id exists in catalog) |
| TC-3.1.4 | PERF | P1 | p95 latency < 1.5s on 50-rec batch |
| TC-3.1.5 | F | P1 | Cache TTL ≤ 15 min per citizen |

### US-3.3 Feedback loop

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-3.3.1 | F | P1 | 👍/👎 stored with rec id, agent id, timestamp |
| TC-3.3.2 | F | P2 | Acceptance rate KPI updates within 1h |

### US-3.4 Guardrails

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-3.4.1 | SEC | P0 | Prompt-injection input ("ignore previous…") does not change behavior |
| TC-3.4.2 | SEC | P0 | PII (SSN, DOB) never appears in rationale |
| TC-3.4.3 | SEC | P0 | Prohibited promises (guarantees, legal advice) blocked & logged |
| TC-3.4.4 | F | P1 | Guardrail failure shows safe fallback, not raw error |

---

## Epic 4 — CX Insights

### US-4.1 Supervisor dashboard

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-4.1.1 | F | P0 | KPIs match underlying data for last 30 days |
| TC-4.1.2 | UI | P1 | Drill-down from KPI to interactions in ≤2 clicks |
| TC-4.1.3 | SEC | P0 | Supervisor sees only their team's agents |

### US-4.2 Coaching flags

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-4.2.1 | F | P1 | Rating ≤2 creates flag within 5 min |
| TC-4.2.2 | F | P1 | Repeated callback (≥3 in 7 days same reason) creates flag |
| TC-4.2.3 | F | P2 | Dismiss requires reason text |

### US-4.3 Agent self-view

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-4.3.1 | F | P1 | 30/90/365-day toggles return correct windows |
| TC-4.3.2 | SEC | P1 | Comments anonymized (no citizen name/email shown) |

---

## Epic 5 — Administration

### US-5.1 Programs

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-5.1.1 | F | P0 | Create program with point value, cap, dates |
| TC-5.1.2 | F | P0 | Edit point value does NOT alter past transactions |
| TC-5.1.3 | F | P1 | Audit log captures who/what/when |

### US-5.2 Tiers

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-5.2.1 | F | P1 | Threshold change triggers recalculation job |
| TC-5.2.2 | F | P1 | Affected citizens notified of new tier |

### US-5.3 Knowledge base

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-5.3.1 | F | P1 | Draft → Review → Publish workflow enforced |
| TC-5.3.2 | NEG | P1 | Retired articles hidden from agent search |

---

## Epic 6 — Non-functional

### Security & Auth

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-6.1.1 | SEC | P0 | Citizen cannot access another citizen's dashboard (IDOR) |
| TC-6.1.2 | SEC | P0 | Agent role cannot reach admin endpoints |
| TC-6.1.3 | SEC | P0 | All API endpoints require authenticated session |
| TC-6.1.4 | SEC | P0 | Inputs sanitized — XSS payload in comment renders as text |
| TC-6.1.5 | SEC | P1 | Rate limiting on lookup endpoint (≥ 60 req/min triggers 429) |
| TC-6.1.6 | SEC | P1 | Secrets not present in client bundle or logs |

### Accessibility

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-6.2.1 | A11Y | P0 | axe-core: 0 critical issues on Citizen Dashboard |
| TC-6.2.2 | A11Y | P0 | axe-core: 0 critical issues on Agent Desk |
| TC-6.2.3 | A11Y | P1 | Keyboard-only flow: lookup → enroll → close case |
| TC-6.2.4 | A11Y | P1 | Color contrast ≥ 4.5:1 on all text |

### Localization

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-6.3.1 | F | P1 | Switching to ES translates UI labels |
| TC-6.3.2 | AI | P1 | AI rationale returned in selected language |

### Audit & retention

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-6.4.1 | F | P0 | Points ledger is append-only (no UPDATE/DELETE) |
| TC-6.4.2 | F | P1 | Admin override requires dual approval |
| TC-6.4.3 | F | P1 | AI prompt/response stored with redaction for ≥90d |

### Performance

| ID | Type | Pri | Title |
|----|------|-----|-------|
| TC-6.5.1 | PERF | P1 | Agent Desk load p95 < 2s, 100 concurrent users |
| TC-6.5.2 | PERF | P1 | Recommendation API p95 < 1.5s, 50 RPS |

---

## Appendix A — Test Personas / Data

| ID | Name | Tier | Points | Notes |
|----|------|------|--------|-------|
| C-Bronze-002 | Maria Lopez | Bronze | 480 | Near Silver threshold; opted out of SMS |
| C-Silver-003 | David Kim | Silver | 1,250 | Active volunteer; prefers email |
| C-Gold-001 | Aisha Patel | Gold | 4,800 | Reached Gold 12 days ago; ES preferred |
| C-Champ-004 | Robert Chen | Volunteer Champion | 9,200 | VIP escalation eligible |
| C-New-005 | (new) | — | 0 | Empty-state coverage |
| A-001 | Agent Smith | — | — | Region A |
| A-002 | Agent Jones | — | — | Region B (cross-region SEC tests) |
| S-001 | Supervisor Lee | — | — | Manages A-001, A-002 |

---

## Appendix B — Smoke Suite (Demo Day)

Run in order; all must pass before the demo.

1. TC-2.1.1 — Lookup by phone for `C-Gold-001`
2. TC-2.2.1 — Milestone banner shown
3. TC-2.4.1 — ≥3 AI recommendations with rationale
4. TC-2.4.6 — Fallback path when AI disabled
5. TC-2.7.1 — One-click enroll in tree-planting program
6. TC-2.6.2 — Close case triggers rating prompt
7. TC-1.4.2 — Citizen submits 5★ rating tied to interaction
8. TC-1.2.1 — Citizen dashboard reflects new points & history
9. TC-1.3.1 — Tier upgrade animation/banner
10. TC-3.4.2 — No PII in rationale (visual scan)
