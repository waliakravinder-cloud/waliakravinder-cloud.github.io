// Mock data store for HooiserHyperdrive Civic Engagement Desk demo
// All data is in-memory; persisted to localStorage so the demo feels real across pages.

const DEFAULT_DATA = {
  tiers: [
    { name: "Bronze",              min: 0,    color: "#a16207", icon: "🥉" },
    { name: "Silver",              min: 500,  color: "#64748b", icon: "🥈" },
    { name: "Gold",                min: 2500, color: "#ca8a04", icon: "🥇" },
    { name: "Volunteer Champion",  min: 7500, color: "#7c3aed", icon: "🏆" }
  ],

  programs: [
    { id: "p-tree",      title: "Spring Tree Planting",        category: "environment", points: 50, date: "2026-05-09", location: "Riverside Park",      desc: "Help plant 200 native saplings along the river trail." },
    { id: "p-survey",    title: "Transit Improvement Survey",  category: "civic",       points: 20, date: "2026-05-15", location: "Online",             desc: "10-minute survey shaping next year's bus routes." },
    { id: "p-foodbank",  title: "Saturday Food Bank Shift",    category: "volunteer",   points: 75, date: "2026-05-11", location: "Downtown Pantry",    desc: "Sort and distribute groceries to families in need." },
    { id: "p-townhall",  title: "District 4 Town Hall",        category: "civic",       points: 30, date: "2026-05-22", location: "Community Center",   desc: "Meet your council member; share priorities for the FY27 budget." },
    { id: "p-literacy",  title: "Adult Literacy Tutor",        category: "education",   points: 100, date: "2026-05-18", location: "Central Library",   desc: "Tutor adult learners (ESL & GED). 2-hr commitment." },
    { id: "p-cleanup",   title: "Beach Cleanup Day",           category: "environment", points: 40, date: "2026-05-30", location: "Ocean Pier",         desc: "Free t-shirt & breakfast for all volunteers." },
    { id: "p-cpr",       title: "Free CPR Certification",      category: "health",      points: 60, date: "2026-05-25", location: "Fire Station 7",     desc: "Earn certification while supporting community safety." },
    { id: "p-budget",    title: "Participatory Budget Vote",   category: "civic",       points: 15, date: "2026-05-12", location: "Online",             desc: "Vote on $2M of neighborhood projects." }
  ],

  citizens: [
    {
      id: "C-Gold-001",
      name: "Sophie Pavia",
      email: "aisha.patel@example.gov",
      phone: "864-915-8385",
      language: "en",
      district: "District 4",
      interests: ["environment", "education"],
      optOut: ["sms"],
      points: 4800,
      tier: "Gold",
      tierReachedDate: "2026-04-17",
      enrolledPrograms: ["p-literacy"],
      openCases: [
        { id: "CS-2042", subject: "Pothole on Elm St not yet repaired", opened: "2026-04-25", status: "Open", priority: "Normal" }
      ],
      history: [
        { date: "2026-04-26", action: "Survey: Park Improvements",   channel: "online",  points: 20  },
        { date: "2026-04-19", action: "Volunteer: River Cleanup",    channel: "in-person", points: 60  },
        { date: "2026-04-17", action: "Tier upgrade → Gold",          channel: "system",  points: 0   },
        { date: "2026-04-10", action: "Town Hall attendance",        channel: "in-person", points: 30  },
        { date: "2026-03-28", action: "Adult Literacy enrollment",   channel: "online",  points: 100 },
        { date: "2026-03-12", action: "Feedback rating: 5★ (Agent Smith)", channel: "post-call", points: 5 }
      ]
    },
    {
      id: "C-Bronze-002",
      name: "Maria Lopez",
      email: "maria.lopez@example.gov",
      phone: "555-0177",
      language: "es",
      district: "District 2",
      interests: ["civic", "health"],
      optOut: ["sms"],
      points: 480,
      tier: "Bronze",
      tierReachedDate: "2026-01-04",
      enrolledPrograms: [],
      openCases: [],
      history: [
        { date: "2026-04-22", action: "Participatory Budget vote",   channel: "online",  points: 15 },
        { date: "2026-04-08", action: "Town Hall attendance",        channel: "in-person", points: 30 },
        { date: "2026-03-30", action: "Survey: Transit",             channel: "online",  points: 20 }
      ]
    },
    {
      id: "C-Champ-004",
      name: "Robert Chen",
      email: "robert.chen@example.gov",
      phone: "555-0193",
      language: "en",
      district: "District 1",
      interests: ["volunteer", "environment", "education"],
      optOut: [],
      points: 9200,
      tier: "Volunteer Champion",
      tierReachedDate: "2025-11-02",
      enrolledPrograms: ["p-foodbank", "p-tree"],
      openCases: [
        { id: "CS-2098", subject: "Request: Volunteer leadership program", opened: "2026-04-27", status: "Open", priority: "VIP" }
      ],
      history: [
        { date: "2026-04-27", action: "Food Bank shift",             channel: "in-person", points: 75 },
        { date: "2026-04-20", action: "Beach Cleanup",                channel: "in-person", points: 40 },
        { date: "2026-04-13", action: "CPR Certification",            channel: "in-person", points: 60 },
        { date: "2026-04-06", action: "Town Hall attendance",         channel: "in-person", points: 30 },
        { date: "2026-03-25", action: "Tutor session (Literacy)",     channel: "in-person", points: 100 }
      ]
    },
    {
      id: "C-New-005",
      name: "Jordan Rivera",
      email: "jordan.rivera@example.gov",
      phone: "555-0108",
      language: "en",
      district: "District 3",
      interests: [],
      optOut: [],
      points: 0,
      tier: "Bronze",
      tierReachedDate: "2026-04-29",
      enrolledPrograms: [],
      openCases: [],
      history: []
    }
  ],

  // Knowledge base for agent search
  kb: [
    { id: "kb-pothole",   title: "Reporting & repair timeline for potholes",      tags: ["roads","repair"],     updated: "2026-04-01", body: "Potholes are triaged within 48h. Major arterials repaired in 5 business days; residential within 10. Citizens can track status via case ID." },
    { id: "kb-recycling", title: "Recycling pickup schedule & accepted items",    tags: ["waste","environment"],updated: "2026-03-15", body: "Curbside recycling occurs weekly on the citizen's regular trash day. Accepted: paper, cardboard, #1 & #2 plastics, aluminum, glass. NOT accepted: plastic bags, styrofoam, electronics." },
    { id: "kb-permits",   title: "Building permit application process",           tags: ["permits","housing"],  updated: "2026-02-28", body: "Apply online at permits.example.gov. Standard residential permits issued in 10 business days. Required: site plan, contractor license, fee." },
    { id: "kb-volunteer", title: "How citizens earn loyalty points",              tags: ["loyalty","programs"], updated: "2026-04-20", body: "Points are awarded automatically upon verified completion of a program. Tier thresholds: Silver 500, Gold 2,500, Volunteer Champion 7,500. Points roll on a 12-month basis." },
    { id: "kb-tax",       title: "Property tax payment options & deadlines",      tags: ["tax","finance"],      updated: "2026-01-30", body: "Property tax due Apr 30 and Oct 31. Payment options: online, mail, in-person. Payment plans available for hardship cases — see Form FT-22." }
  ],

  // Agent ratings (CSAT)
  agents: [
    { id: "A-001", name: "Agent Smith", region: "Region A", csat30: 4.7, csat90: 4.6, conversions30: 38, escalations30: 4 },
    { id: "A-002", name: "Agent Jones", region: "Region B", csat30: 3.9, csat90: 4.1, conversions30: 22, escalations30: 9 },
    { id: "A-003", name: "Agent Patel", region: "Region A", csat30: 4.9, csat90: 4.8, conversions30: 51, escalations30: 2 }
  ],
  recentInteractions: [
    { id: "INT-9010", agentId: "A-001", citizenId: "C-Gold-001",   date: "2026-04-29", channel: "post-case", csat: null, comment: "" },
    { id: "INT-9001", agentId: "A-002", citizenId: "C-Bronze-002", date: "2026-04-28", channel: "call",   csat: 2, comment: "Felt rushed; didn't fully answer my recycling question." },
    { id: "INT-9002", agentId: "A-001", citizenId: "C-Gold-001",   date: "2026-04-27", channel: "email",  csat: 5, comment: "Quick and friendly. Resolved my pothole report fast." },
    { id: "INT-9003", agentId: "A-003", citizenId: "C-Champ-004",  date: "2026-04-26", channel: "visit",  csat: 5, comment: "Excellent — recommended a great new volunteer program." },
    { id: "INT-9004", agentId: "A-002", citizenId: "C-Bronze-002", date: "2026-04-22", channel: "call",   csat: 2, comment: "Same issue, second call. Frustrating." }
  ]
};

const STORAGE_KEY = "sced_demo_state_v1";

const Store = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  },
  save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  reset() {
    localStorage.removeItem(STORAGE_KEY);
    return this.load();
  }
};

// ---------- Domain helpers ----------
function tierFor(points, tiers) {
  let current = tiers[0];
  for (const t of tiers) if (points >= t.min) current = t;
  return current;
}
function nextTier(points, tiers) {
  return tiers.find(t => t.min > points) || null;
}
function tierProgress(points, tiers) {
  const cur = tierFor(points, tiers);
  const nxt = nextTier(points, tiers);
  if (!nxt) return { pct: 100, toNext: 0, current: cur, next: null };
  const span = nxt.min - cur.min;
  const into = points - cur.min;
  return { pct: Math.round((into / span) * 100), toNext: nxt.min - points, current: cur, next: nxt };
}

function findCitizen(state, query) {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  return state.citizens.find(c =>
    c.id.toLowerCase() === q ||
    c.email.toLowerCase() === q ||
    c.phone.replace(/[^\d]/g, "") === q.replace(/[^\d]/g, "") ||
    c.name.toLowerCase().includes(q)
  ) || null;
}

function awardPoints(state, citizenId, programId, source = "agent-enroll") {
  const citizen = state.citizens.find(c => c.id === citizenId);
  const program = state.programs.find(p => p.id === programId);
  if (!citizen || !program) return { ok: false, reason: "not-found" };
  if (citizen.enrolledPrograms.includes(programId)) return { ok: false, reason: "already-enrolled" };
  citizen.enrolledPrograms.push(programId);
  citizen.points += program.points;
  citizen.history.unshift({
    date: new Date().toISOString().slice(0,10),
    action: `Enrolled: ${program.title} (+${program.points})`,
    channel: source,
    points: program.points
  });
  // Tier check
  const newTier = tierFor(citizen.points, state.tiers).name;
  if (newTier !== citizen.tier) {
    citizen.tier = newTier;
    citizen.tierReachedDate = new Date().toISOString().slice(0,10);
    citizen.history.unshift({
      date: citizen.tierReachedDate,
      action: `Tier upgrade → ${newTier}`,
      channel: "system",
      points: 0
    });
  }
  Store.save(state);
  return { ok: true, citizen, program };
}

function logRating(state, interactionId, citizenId, agentId, csat, comment) {
  const interaction = state.recentInteractions.find(i => i.id === interactionId && i.citizenId === citizenId);
  if (interaction) {
    if (interaction.csat !== null && interaction.csat !== undefined) {
      return { ok: false, reason: "already-rated" };
    }
    interaction.csat = csat;
    interaction.comment = comment || "";
    interaction.ratedAt = new Date().toISOString().slice(0,10);
  } else {
    state.recentInteractions.unshift({
      id: interactionId || `INT-${Date.now()}`,
      agentId, citizenId, date: new Date().toISOString().slice(0,10),
      channel: "post-case", csat, comment
    });
  }
  // Award rating points
  const citizen = state.citizens.find(c => c.id === citizenId);
  if (citizen) {
    citizen.points += 5;
    citizen.history.unshift({
      date: new Date().toISOString().slice(0,10),
      action: `Feedback rating: ${csat}★`,
      channel: "post-case",
      points: 5
    });
  }
  Store.save(state);
  return { ok: true };
}

function fmtDate(s) {
  try { return new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
  catch { return s; }
}

// Expose globally
window.SCED = {
  Store, tierFor, nextTier, tierProgress, findCitizen, awardPoints, logRating, fmtDate
};
