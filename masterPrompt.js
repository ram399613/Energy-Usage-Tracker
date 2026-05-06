// ============================================================
//  ENERGY USAGE TRACKER — ALL-IN-ONE MASTER PROMPT FILE
//  Stack: HTML/CSS/JS + Node.js + MongoDB
//  ⚠️  DO NOT change deployment or MongoDB — only add this file
// ============================================================

const Anthropic = require("@anthropic-ai/sdk");
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ============================================================
//  STEP 1 — DATA CLEANER
//  Run ALL MongoDB data through this before sending to AI
//  This was the ROOT CAUSE of wrong predictions in old model
// ============================================================

function cleanData(rawDocs) {
  if (!Array.isArray(rawDocs)) rawDocs = [rawDocs];
  return rawDocs.map((doc) => ({
    date: doc.date ? new Date(doc.date).toISOString().split("T")[0] : null,
    totalKwh: parseFloat((doc.totalKwh || 0).toFixed(3)),
    cost: parseFloat((doc.cost || 0).toFixed(2)),
    currency: doc.currency || "USD",
    tariff: parseFloat((doc.tariff || 0.12).toFixed(4)),
    peakHours: doc.peakHours || "17:00-21:00",
    temperature: {
      indoor: doc.temperature?.indoor ?? null,
      outdoor: doc.temperature?.outdoor ?? null,
      unit: doc.temperature?.unit || "C",
    },
    solar: {
      generated: parseFloat((doc.solar?.generated || 0).toFixed(3)),
      exported: parseFloat((doc.solar?.exported || 0).toFixed(3)),
      selfConsumed: parseFloat((doc.solar?.selfConsumed || 0).toFixed(3)),
    },
    appliances: (doc.appliances || []).map((a) => ({
      name: a.name || "Unknown Device",
      kwh: parseFloat((a.kwh || 0).toFixed(3)),
      hoursOn: parseFloat((a.hoursOn || 0).toFixed(1)),
      isEssential: a.isEssential ?? false,
      isSchedulable: a.isSchedulable ?? false,
    })),
  }));
}

// ============================================================
//  STEP 2 — MASTER AI FUNCTION
//  One function handles ALL 6 AI features
//  Just pass: type + your MongoDB data
// ============================================================

async function runEnergyAI(type, mongoData) {
  // --- Clean the data first (fixes old model bug) ---
  const clean = cleanData(mongoData);

  // --- Build the correct prompt based on type ---
  const prompt = buildPrompt(type, clean);

  // --- Call Claude with the master system prompt ---
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20240620", // Fixed placeholder model
    max_tokens: 1000,
    system: `
You are an expert home energy analyst AI inside a residential energy monitoring app.
You have access to household data: appliance kWh, bills, temperature, peak hours, solar.

STRICT RULES:
1. Reason step-by-step before answering.
2. NEVER guess or hallucinate — only use the JSON data given.
3. If a field is null or missing, say so instead of assuming.
4. Energy in kWh, cost in the currency in the data, carbon in kg CO₂.
5. Summaries: max 5-6 sentences or bullet points. Be concise.
6. Predictions must be labeled "Projected" or "Estimated".
7. Never suggest unsafe electrical work — say "contact an electrician".
8. For JSON-type responses, return ONLY raw JSON, no markdown, no extra text.
    `.trim(),
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  // Auto-parse JSON responses
  if (
    ["bill", "anomaly", "peak"].includes(type)
  ) {
    try {
      return JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      return { raw: text, parseError: true };
    }
  }

  return text;
}

// ============================================================
//  STEP 3 — MASTER PROMPT BUILDER
//  All 6 prompts in one place, selected by type
// ============================================================

function buildPrompt(type, clean) {
  const data = JSON.stringify(clean, null, 2);
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  const sevenDayAvg =
    clean.length > 1
      ? parseFloat(
          (
            clean.slice(-7).reduce((s, d) => s + d.totalKwh, 0) /
            Math.min(clean.length, 7)
          ).toFixed(3)
        )
      : 0;

  const prompts = {

    // ── PROMPT 1: Daily Summary ──────────────────────────────
    daily: `
Here is today's home energy data in JSON:
${data}
sevenDayAvgKwh: ${sevenDayAvg}

Task:
1. Calculate total kWh consumed today across all devices.
2. Identify the top 3 highest-consuming appliances.
3. Compare today's usage to the 7-day average (${sevenDayAvg} kWh).
4. If solar data exists, calculate net grid consumption (consumed minus generated).
5. Estimate today's electricity cost using the tariff in the data.
6. Give ONE specific action the homeowner can take to reduce tomorrow's usage.

Respond in this format:
- Total Usage: X kWh
- Top Consumers: [list]
- vs Last 7 Days: X% higher/lower
- Solar Offset: X kWh (skip if no solar)
- Estimated Cost: $X
- Tip: [one sentence]
    `.trim(),

    // ── PROMPT 2: Monthly Bill Prediction ───────────────────
    bill: `
Here is this month's daily energy data in JSON:
${data}

Context:
- Today is day ${currentDay} of ${daysInMonth}.
- Tariff: ${clean[0]?.tariff || 0.12} per kWh.
- Peak hours: ${clean[0]?.peakHours || "17:00-21:00"}.

Task:
1. Calculate actual spend so far this month.
2. Compute average daily kWh for days elapsed.
3. Project remaining days using weighted average:
   last 7 days = 60% weight, earlier days = 40% weight.
4. Predict the end-of-month bill.
5. Compare to last month (use lastMonthBill field if present).
6. If projected bill is more than 10% above last month, flag as HIGH
   and give 2 ways to reduce it.

Return ONLY this JSON, no other text:
{
  "spentSoFar": number,
  "projectedTotal": number,
  "lastMonthBill": number,
  "percentChange": number,
  "alert": "HIGH" or "NORMAL" or "LOW",
  "suggestions": ["string", "string"]
}
    `.trim(),

    // ── PROMPT 3: Anomaly Detection ──────────────────────────
    anomaly: `
Here is 30 days of per-appliance energy data in JSON:
${data}

Task:
1. For each appliance, calculate mean daily kWh and standard deviation.
2. Flag any appliance whose last 3-day average exceeds
   (mean + 2 × standard deviation) as ANOMALY.
3. For each anomaly suggest a possible cause such as:
   "AC running longer due to high temperatures" or
   "refrigerator door seal may be failing".
4. Rank anomalies by cost impact, highest first.

Return ONLY this JSON, no other text:
{
  "anomalies": [
    {
      "appliance": "string",
      "normalAvgKwh": number,
      "recentAvgKwh": number,
      "excessKwh": number,
      "estimatedExtraCost": number,
      "possibleCause": "string"
    }
  ],
  "allClear": true or false
}
    `.trim(),

    // ── PROMPT 4: Solar Optimization ────────────────────────
    solar: `
Here is today's solar generation and household usage data in JSON:
${data}

Task:
1. Find hours when solar generation exceeds household consumption
   (these are surplus hours).
2. Identify high-consumption appliances running during low-solar
   or peak-rate hours.
3. Suggest which appliances to shift to surplus solar hours to
   maximize self-consumption and minimize grid import.
4. Calculate potential monthly savings if suggestions are followed
   (use tariff from data).

Rules:
- Only suggest shifting schedulable appliances
  (washing machine, dishwasher, EV charger, etc.).
- Do NOT suggest shifting always-on appliances
  (refrigerator, medical devices, router).

Respond in this format:
- Surplus Hours: [list of hours]
- Shift Recommendations: [appliance → suggested time slot]
- Potential Monthly Savings: $X
- Reason: [one sentence explaining the biggest saving]
    `.trim(),

    // ── PROMPT 5: Peak Hour Alert ────────────────────────────
    peak: `
Current home energy status in JSON:
${data}
currentTime: ${now.toTimeString().slice(0, 5)}

Task:
1. Check if current time falls within the peak tariff window
   (field: peakHours).
2. List all appliances currently ON that are non-essential
   (isEssential: false in applianceList).
3. Calculate cost per hour of running non-essential appliances
   during peak window.
4. Write a short push-notification alert (max 2 sentences)
   only if cost impact is significant (above $0.30/hour).

Return ONLY this JSON, no other text:
{
  "isPeakHour": true or false,
  "nonEssentialRunning": ["string"],
  "costPerHour": number,
  "alert": "string or null"
}
    `.trim(),

    // ── PROMPT 6: Weekly Report ──────────────────────────────
    weekly: `
Here is the past 7 days of complete home energy data in JSON:
${data}

Write a friendly, easy-to-read weekly energy report for the homeowner.
Use simple language — no technical jargon.

Include these 5 sections:

1. WEEK SUMMARY
   - Total kWh this week vs last week
   - Total cost this week vs last week
   - Total solar generated (if available)
   - Net carbon footprint in kg CO₂
     (use 0.233 kg CO₂ per kWh as the default factor)

2. BEST DAY & WORST DAY
   - Which day had lowest consumption and why
     (link to weather or temperature data if available)
   - Which day had highest consumption and why

3. TOP ENERGY WASTERS
   - Top 3 appliances by weekly consumption
   - Any usage during peak hours that was avoidable

4. 3 SMART TIPS FOR NEXT WEEK
   - Specific tips based on this household's actual data patterns
   - Make each tip actionable and concrete

5. PROGRESS SCORE
   - Rate: Excellent / Good / Needs Improvement
   - One short motivational sentence

Tone: warm, friendly, encouraging — like a helpful neighbour.
    `.trim(),

    // ── PROMPT 6: Free Chat (custom question) ───────────────
    chat: `
Here is the household energy data in JSON:
${data}

The homeowner has asked the following question.
Answer using only the data provided above.
Be concise, friendly, and give one actionable tip at the end.

Question: {{USER_QUESTION}}
    `.trim(),
  };

  return prompts[type] || prompts["daily"];
}

// ============================================================
//  STEP 4 — EXPRESS ROUTES
//  Add ONE line to your existing server.js:
//  app.use('/api/ai', require('./masterPrompt'))
//  MongoDB models = UNCHANGED. Deployment = UNCHANGED.
// ============================================================

const express = require("express");
const router = express.Router();

// Your existing MongoDB models — Paths fixed for root location
const EnergyLog = require("./models/EnergyLog");
// const BillRecord = require("./models/BillRecord"); // Placeholder/Missing
// const SolarData = require("./models/SolarData");   // Placeholder/Missing

const DAY = 86400000;

// GET /api/ai/daily
router.get("/daily", async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const raw = await EnergyLog.find({ date: { $gte: today } }).lean();
    const last7 = await EnergyLog.find({
      date: { $gte: new Date(Date.now() - 7 * DAY) },
    }).lean();
    const result = await runEnergyAI("daily", [...last7, ...raw]);
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET /api/ai/bill
router.get("/bill", async (req, res) => {
  try {
    const start = new Date(); start.setDate(1); start.setHours(0, 0, 0, 0);
    const raw = await EnergyLog.find({ date: { $gte: start } }).lean();
    const result = await runEnergyAI("bill", raw);
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET /api/ai/anomaly
router.get("/anomaly", async (req, res) => {
  try {
    const raw = await EnergyLog.find({
      date: { $gte: new Date(Date.now() - 30 * DAY) },
    }).lean();
    const result = await runEnergyAI("anomaly", raw);
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET /api/ai/solar
router.get("/solar", async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const raw = await EnergyLog.find({ date: { $gte: today } }).lean();
    const result = await runEnergyAI("solar", raw);
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET /api/ai/peak
router.get("/peak", async (req, res) => {
  try {
    const latest = await EnergyLog.findOne().sort({ date: -1 }).lean();
    const result = await runEnergyAI("peak", [latest]);
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET /api/ai/weekly
router.get("/weekly", async (req, res) => {
  try {
    const raw = await EnergyLog.find({
      date: { $gte: new Date(Date.now() - 7 * DAY) },
    }).sort({ date: 1 }).lean();
    const result = await runEnergyAI("weekly", raw);
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// POST /api/ai/chat  — body: { question: "..." }
router.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "question required" });
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const raw = await EnergyLog.find({
      date: { $gte: new Date(Date.now() - 7 * DAY) },
    }).lean();
    const clean = cleanData(raw);
    const prompt = buildPrompt("chat", clean).replace(
      "{{USER_QUESTION}}", question
    );
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      system: "You are a home energy analyst. Answer using only the data provided. Be concise and friendly.",
      messages: [{ role: "user", content: prompt }],
    });
    const text = response.content.map((b) => b.text || "").join("\n");
    res.json({ success: true, data: text });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

module.exports = router;
