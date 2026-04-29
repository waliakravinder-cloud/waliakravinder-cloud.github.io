// AI recommender for HooiserHyperdrive Civic Engagement Desk
// - Rule-based engine works fully offline (no API key needed) — perfect for hackathon demo.
// - Optional OpenAI hook: if window.SCED_OPENAI_KEY is set, call the API and merge results.
// - All AI outputs pass a guardrail filter (PII / prohibited promises) before display.

(function () {
  // ---------- Guardrails ----------
  const PROHIBITED_PATTERNS = [
    /\b(guarantee|guaranteed|promise to|legally binding|i'?ll waive|will waive)\b/i,
    /\b\d{3}-\d{2}-\d{4}\b/,                    // SSN
    /\b\d{16}\b/,                                // credit card-ish
    /password|api[_ ]?key|secret/i
  ];
  function passesGuardrails(text) {
    return !PROHIBITED_PATTERNS.some(rx => rx.test(text));
  }
  function safeRationale(text, fallback) {
    if (passesGuardrails(text) && text.length <= 240) return text;
    return fallback;
  }

  // ---------- Rule-based recommender ----------
  function ruleBased(citizen, programs, tiers) {
    const enrolled = new Set(citizen.enrolledPrograms || []);
    const optOut = new Set(citizen.optOut || []);
    const interests = new Set(citizen.interests || []);
    const candidates = programs.filter(p => !enrolled.has(p.id) && !optOut.has(p.category));

    const scored = candidates.map(p => {
      let score = 0;
      const reasons = [];
      if (interests.has(p.category)) { score += 50; reasons.push(`matches your interest in ${p.category}`); }
      // Tier-based nudge: higher tier → recommend higher-impact programs
      if ((citizen.tier === "Gold" || citizen.tier === "Volunteer Champion") && p.points >= 60) {
        score += 20; reasons.push("high-impact opportunity for a top-tier citizen");
      }
      if (citizen.tier === "Bronze" && p.points <= 30) {
        score += 15; reasons.push("quick win to build your points");
      }
      // Proximity to next tier
      const prog = window.SCED.tierProgress(citizen.points, tiers);
      if (prog.next && p.points >= prog.toNext) {
        score += 30; reasons.push(`would reach ${prog.next.name} tier`);
      }
      // Recency: prefer near-term events
      const days = Math.max(1, Math.ceil((new Date(p.date) - new Date()) / 86400000));
      if (days <= 14) { score += 10; reasons.push("happening soon"); }

      // Default rationale
      if (reasons.length === 0) reasons.push("popular community program");

      const rationale = `${reasons.slice(0, 2).join("; ")} (+${p.points} pts).`;
      return {
        id: p.id,
        title: p.title,
        rationale: safeRationale(rationale, `Earn ${p.points} points and engage with your community.`),
        points: p.points,
        confidence: Math.min(0.99, 0.4 + score / 100),
        date: p.date,
        location: p.location,
        source: "rule-based"
      };
    });

    scored.sort((a, b) => b.confidence - a.confidence);
    return scored.slice(0, 5);
  }

  // ---------- Optional OpenAI hook ----------
  // Set window.SCED_OPENAI_KEY = "sk-..." in the browser console to enable.
  async function openAIEnhance(citizen, baseRecs) {
    const key = window.SCED_OPENAI_KEY;
    if (!key) return null;
    try {
      const sys = "You are a civic engagement assistant. Rewrite each recommendation rationale into ONE warm, plain-language sentence (<= 200 chars). Reference at least one citizen datapoint. Do NOT invent facts. Return JSON: {recs:[{id,rationale}]}.";
      const usr = JSON.stringify({
        citizen: { tier: citizen.tier, points: citizen.points, interests: citizen.interests, district: citizen.district, language: citizen.language },
        recs: baseRecs.map(r => ({ id: r.id, title: r.title, rationale: r.rationale, points: r.points }))
      });
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [{ role: "system", content: sys }, { role: "user", content: usr }]
        })
      });
      if (!resp.ok) throw new Error(`OpenAI ${resp.status}`);
      const json = await resp.json();
      const parsed = JSON.parse(json.choices[0].message.content);
      const map = new Map(parsed.recs.map(r => [r.id, r.rationale]));
      return baseRecs.map(r => ({
        ...r,
        rationale: safeRationale(map.get(r.id) || r.rationale, r.rationale),
        source: map.has(r.id) ? "openai+rules" : r.source
      }));
    } catch (e) {
      console.warn("OpenAI enhancement failed; using rule-based:", e);
      return null;
    }
  }

  async function recommend(citizen, programs, tiers) {
    const base = ruleBased(citizen, programs, tiers);
    const enhanced = await openAIEnhance(citizen, base);
    return { recs: enhanced || base, fallback: !enhanced && !!window.SCED_OPENAI_KEY };
  }

  // ---------- Agent talking-points / milestone scripts ----------
  function milestoneScript(citizen) {
    const reachedDays = Math.floor((new Date() - new Date(citizen.tierReachedDate)) / 86400000);
    if (reachedDays <= 30 && citizen.tier !== "Bronze") {
      return {
        type: "milestone",
        text: `Thank ${citizen.name.split(" ")[0]} for reaching ${citizen.tier} status ${reachedDays === 0 ? "today" : reachedDays + " days ago"} — recognize their commitment to ${citizen.interests[0] || "the community"}.`
      };
    }
    const recent = (citizen.history || [])[0];
    if (recent && recent.points > 0) {
      return {
        type: "recent",
        text: `Acknowledge their recent ${recent.action.toLowerCase()} on ${window.SCED.fmtDate(recent.date)} (+${recent.points} pts).`
      };
    }
    return {
      type: "welcome",
      text: `Welcome ${citizen.name.split(" ")[0]} warmly — they are new to civic engagement. Suggest a quick-win program.`
    };
  }

  // ---------- KB search ----------
  function searchKB(kb, query) {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase();
    return kb
      .map(a => {
        const hay = (a.title + " " + a.tags.join(" ") + " " + a.body).toLowerCase();
        let score = 0;
        for (const tok of q.split(/\s+/)) if (tok && hay.includes(tok)) score += tok.length;
        return { ...a, score, snippet: a.body.slice(0, 140) + (a.body.length > 140 ? "…" : "") };
      })
      .filter(a => a.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  window.SCED_AI = { recommend, milestoneScript, searchKB, ruleBased, passesGuardrails };
})();
