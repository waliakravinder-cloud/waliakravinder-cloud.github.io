# HooiserHyperdrive Civic Engagement Desk — User Stories

**Product:** HooiserHyperdrive Civic Engagement Desk
**Personas:**
- **Citizen (C)** — resident participating in civic programs
- **Agent (A)** — call-center / service-center government worker
- **Supervisor (S)** — agent manager reviewing CX & coaching needs
- **Program Admin (P)** — staff configuring programs, points, tiers
- **System / AI (AI)** — recommendation & insights engine

**Story format:** *As a `<persona>`, I want `<capability>` so that `<value>`.*
**AC = Acceptance Criteria** (Given/When/Then). Each story has a priority (P0 = must, P1 = should, P2 = nice).

---

## Epic 1 — Citizen Engagement Tracking & Rewards

### US-1.1 Earn loyalty points for civic actions  *(P0)*
As a **Citizen**, I want to automatically earn loyalty points whenever I complete a tracked civic action (volunteering, attending a town hall, submitting feedback, completing a survey), so that I am recognized for my participation.

**AC**
- Given a citizen completes a tracked action, when the action is recorded, then their points balance increases by the configured amount within 5 seconds.
- Given an action has a per-citizen cap (e.g., 1 survey/day), when the cap is exceeded, then no additional points are awarded and the citizen is notified why.
- Each transaction is written to engagement history with timestamp, action type, points delta, and source.

### US-1.2 View My Dashboard  *(P0)*
As a **Citizen**, I want a "My Dashboard" showing my points balance, current tier, engagement history, and AI recommendations, so that I understand my standing and what to do next.

**AC**
- Dashboard loads in < 2s and shows: points balance, tier badge, last 10 engagements, ≥3 AI recommendations.
- Empty-state copy is shown when no engagement history exists.
- All values match the underlying ledger (no stale cache > 60s).

### US-1.3 Tier progression & milestones  *(P0)*
As a **Citizen**, I want to see my current tier (Bronze, Silver, Gold, Volunteer Champion) and progress to the next tier, so that I am motivated to engage more.

**AC**
- Tier is calculated from rolling 12-month points using configurable thresholds.
- Progress bar shows points needed to next tier; reaching a threshold triggers a milestone event.
- Tier downgrade only occurs at the annual review date, not mid-cycle.

### US-1.4 Rate the agent interaction  *(P0)*
As a **Citizen**, I want to rate (1–5 stars) and optionally comment on my interaction with an agent after a call/visit/email, so that my feedback can improve service.

**AC**
- Rating prompt is delivered within 10 minutes of case closure (in-app, SMS, or email).
- Rating + comment is linked to the specific interaction ID and agent ID.
- Submitting a rating awards loyalty points (configurable, e.g., +5).
- Citizen may submit only one rating per interaction; edits allowed for 24h.

### US-1.5 Redeem points / view rewards catalog  *(P1)*
As a **Citizen**, I want to browse and redeem rewards (e.g., parking credit, event tickets, civic recognition), so that points feel valuable.

**AC**
- Catalog shows item name, point cost, availability.
- Redemption fails gracefully if balance < cost or item out of stock.
- Successful redemption decrements balance atomically and emails confirmation.

### US-1.6 Manage privacy & notification preferences  *(P1)*
As a **Citizen**, I want to control which categories of programs and channels (email/SMS/push) I receive recommendations on, so that my engagement is on my terms.

**AC**
- Preferences persist across sessions; default is opt-in to email only.
- AI recommendations respect preference filters (no hidden categories surfaced).

---

## Epic 2 — Agent Real-Time Citizen Insights

### US-2.1 Citizen lookup on contact  *(P0)*
As an **Agent**, I want the citizen's profile to auto-populate when a call/email/walk-in is identified, so that I have context immediately.

**AC**
- Lookup by phone, email, citizen ID, or name returns a match in < 1s.
- Profile shows: name, tier badge, points balance, last 5 engagements, open cases, preferred language, and AI recommendations.
- If no match, agent can create a new citizen record from the same screen.

### US-2.2 Loyalty milestone recognition prompt  *(P0)*
As an **Agent**, I want a banner suggesting how to thank the citizen for recent milestones (e.g., "Reached Gold last week"), so that I can personalize the conversation.

**AC**
- Banner shows when a milestone occurred in the last 30 days.
- Includes a one-line script the agent can read verbatim.
- Dismissable per interaction; dismissal is logged.

### US-2.3 Engagement history timeline  *(P0)*
As an **Agent**, I want a chronological, filterable timeline of the citizen's engagements and prior cases, so that I can resolve issues with full context.

**AC**
- Timeline supports filters: date range, channel, program, case status.
- Each entry expands to show details, notes, and linked documents.
- Loads incrementally; page-size 25.

### US-2.4 AI-powered next-best-action recommendations  *(P0)*
As an **Agent**, I want AI-generated next-best-action suggestions tailored to the citizen, so that I can offer relevant programs or resolutions.

**AC**
- ≥3 ranked suggestions are shown with rationale, expected points, and a one-click "Enroll" / "Send info" action.
- Suggestions exclude programs the citizen is already in or has opted out of.
- Each suggestion has a feedback control (👍 / 👎) used to retrain ranking.
- If the AI service is unavailable, a rule-based fallback set is shown and labeled as such.

### US-2.5 Knowledge management lookup  *(P0)*
As an **Agent**, I want an in-context KB search returning the most relevant articles for the citizen's question, so that I provide accurate answers fast.

**AC**
- Search returns top 5 articles with snippet, last-updated date, and confidence score.
- Articles can be sent to the citizen via email/SMS in one click; the action is logged.
- Search query and selected article are saved to the case for audit.

### US-2.6 Issue resolution & case logging  *(P0)*
As an **Agent**, I want to log the reason for contact, resolution, and follow-up, so that future agents have context and metrics are accurate.

**AC**
- Required fields: reason code, resolution code, notes, follow-up date (optional).
- Case cannot be closed without reason and resolution.
- Closing a case triggers the citizen rating prompt (US-1.4).

### US-2.7 Enroll citizen in a program  *(P0)*
As an **Agent**, I want to enroll the citizen into a recommended program in one step, so that the engagement is captured immediately.

**AC**
- Enrollment confirms eligibility, shows points to be earned, and writes to engagement history.
- Citizen receives a confirmation via their preferred channel.
- Enrollment counts toward the agent's "conversions" metric.

### US-2.8 Escalate based on tier or issue severity  *(P1)*
As an **Agent**, I want to escalate a high-tier citizen or a complex issue to a supervisor with full context, so that VIP / sensitive matters get priority.

**AC**
- Escalation includes the case, timeline snapshot, and agent notes.
- High-tier (Gold/Champion) escalations route to a priority queue.
- Supervisor receives notification within 1 minute.

---

## Epic 3 — AI Recommendations & Personalization

### US-3.1 Generate citizen recommendations  *(P0)*
As the **System (AI)**, I need to generate ranked recommendations using the citizen's history, interests, tier, and active programs, so that suggestions are relevant.

**AC**
- Inputs: engagement history, declared interests, location, tier, program catalog.
- Output: ranked list with id, title, rationale, expected points, confidence.
- Excludes already-enrolled, opted-out, or geographically ineligible programs.
- Latency p95 < 1.5s; refreshed at most every 15 minutes per citizen.

### US-3.2 Explainable rationale  *(P1)*
As an **Agent**, I want each recommendation to include a short, plain-language rationale, so that I can confidently explain it to the citizen.

**AC**
- Rationale ≤ 240 chars, references at least one factual datapoint from the citizen profile.
- No PII beyond what is already on screen; no fabricated facts.

### US-3.3 Feedback loop  *(P1)*
As the **System**, I want to capture agent and citizen feedback on recommendations, so that quality improves over time.

**AC**
- 👍/👎 + optional reason stored per recommendation.
- Acceptance rate dashboard available to Program Admin.

### US-3.4 Safety & guardrails  *(P0)*
As a **Program Admin**, I need AI outputs to be filtered for prohibited content, PII leakage, and out-of-policy promises, so that the agency is protected.

**AC**
- All AI outputs pass a guardrail check before display; failures are logged and a safe fallback is shown.
- Prompts and responses are logged (with redaction) for audit for ≥ 90 days.

---

## Epic 4 — Customer Experience (CX) Insights for Management

### US-4.1 Supervisor CX dashboard  *(P0)*
As a **Supervisor**, I want to see agent CSAT trends, low-rating interactions, and coaching flags, so that I can target training.

**AC**
- Filters: date range, agent, channel, program.
- KPIs: avg CSAT, response time, conversion rate, escalation rate.
- Drill-down from KPI to underlying interactions in ≤ 2 clicks.

### US-4.2 Auto-flag coaching opportunities  *(P1)*
As the **System**, I want to flag interactions with rating ≤ 2, repeated callbacks, or unresolved escalations as coaching opportunities, so that supervisors act quickly.

**AC**
- Flag appears within 5 minutes of trigger.
- Supervisor can acknowledge, assign coaching, or dismiss with reason.

### US-4.3 Agent self-view  *(P1)*
As an **Agent**, I want to see my own CSAT, conversions, and recent feedback, so that I can self-improve.

**AC**
- View shows last 30/90/365-day metrics and 5 most recent comments (anonymized to agent).

---

## Epic 5 — Administration & Configuration

### US-5.1 Manage programs and point values  *(P0)*
As a **Program Admin**, I want to create/edit programs with point values, eligibility, caps, and dates, so that incentives stay current.

**AC**
- Audit log records who changed what and when.
- Changes do not retroactively alter past transactions.

### US-5.2 Manage tiers and thresholds  *(P1)*
As a **Program Admin**, I want to define tier names, thresholds, and benefits, so that the loyalty model can evolve.

**AC**
- Threshold change triggers recalculation job; citizens notified if tier changes.

### US-5.3 Manage knowledge base  *(P1)*
As a **Program Admin**, I want to create/version/retire KB articles tagged by topic and program, so that agents see accurate info.

**AC**
- Articles support draft → review → publish workflow.
- Retired articles are hidden from search but retained for audit.

---

## Epic 6 — Cross-cutting / Non-functional

### US-6.1 Authentication & roles  *(P0)*
As a **System Owner**, I want SSO and role-based access (Citizen, Agent, Supervisor, Admin), so that data is appropriately scoped.

**AC**
- Citizens cannot view other citizens' data.
- Agents see only assigned/queued citizens; full audit trail of access.

### US-6.2 Accessibility (WCAG 2.1 AA)  *(P0)*
As any user, I want the app to be keyboard-navigable, screen-reader friendly, and high-contrast compliant, so that it is usable by all.

**AC**
- Automated axe scan: 0 critical violations.
- Manual screen-reader pass on Citizen Dashboard and Agent Desk.

### US-6.3 Localization  *(P1)*
As a **Citizen / Agent**, I want the UI in my preferred language (EN, ES at minimum), so that I can use it comfortably.

**AC**
- Language switcher persists per user; AI rationale generated in chosen language.

### US-6.4 Audit & data retention  *(P0)*
As a **Compliance Officer**, I want all engagement, points, and AI events logged with retention policies, so that we meet legal requirements.

**AC**
- Append-only ledger for points; admin overrides require dual approval.
- Retention configurable per data class; deletions log who/when/why.

### US-6.5 Performance & availability  *(P1)*
As a **System Owner**, I want the agent desk to load p95 < 2s and have 99.5% uptime in business hours, so that operations are not disrupted.

**AC**
- Synthetic monitor verifies SLO; alerts fire on breach.

---

## Out-of-Scope (this hackathon)
- Native mobile apps (web-responsive only).
- Payment processing for paid rewards.
- Real SSO integration (mock auth in demo).
- Production-grade ML training pipeline (use prompt-based AI + rules).
