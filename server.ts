import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// System instructions derived from the Tech Placement Dependency Graph
const PLACEMENT_SYSTEM_PROMPT = `
You are the PLACEMENT OS STRATEGIC MENTOR.
Your purpose: Guide a B.Tech Computer Science student from beginner baseline to a ₹23.3 LPA software engineering package and Google L3 SWE.

CORE STRATEGIC MANDATES FROM THE MASTER DEPENDENCY GRAPH:
1. Java is the singular enterprise language. Bridges rigorous DSA and scalable enterprise backend (Spring Boot).
2. Parallel Learning Model: Never learn sequentially (e.g. finishing all of Java before touching Aptitude is fatal). Stagger DSA, Aptitude drills, and Backend concurrently.
3. Quant Aptitude is the primary screening mechanism for 80% of Indian campus placements (TCS, Infosys, Wipro, Zoho). 30 mins daily speed drills are non-negotiable.
4. What to DEFER / IGNORE (Zero tolerance for tech bloat):
   - Multiple programming languages (do NOT switch to Python/C++/JS).
   - Frontend frameworks (React/Vue/Angular are LOW ROI for backend ₹20L+ packages).
   - Advanced DevOps (No Kubernetes, Terraform, complex AWS VPCs - Docker & basic EC2/Render is sufficient).
   - Machine Learning / AI (Distraction for standard software engineering interviews).
   - Advanced CP (No Segment Trees/Fenwick trees - focus on Graphs and DP).
5. High-ROI Priority Formula:
   ROI = (Placement Impact * Frequency in Interviews * Skill Transferability) / Learning Cost
6. Plain Text Coding & Thinking Aloud:
   Google & top MNCs test on plain text (Google Docs) without IDE autocomplete. Candidates must narrate thought processes continuously.
7. Behavioral (STAR-L):
   Googleyness and leadership have equal veto power. Require 5 STAR-L stories (Ambiguity, Humility, Conflict, Failure/Pivot).

Provide direct, actionable, high-ROI engineering advice without fluff or generic motivation.
`;

// Helper: Gemini client with User-Agent telemetry
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        },
        timeout: 15000
      }
    });
  }
  return geminiClient;
}

// Track temporary high-demand (503/429) cooldown per model to avoid repeat failures
const modelCooldownUntil: Record<string, number> = {};

interface ChatTurn {
  role: string;
  content: string;
}

// Sanitize history so Gemini API strict constraints are satisfied:
// 1. First turn MUST have role 'user'
// 2. Roles must strictly alternate 'user' -> 'model' -> 'user'
// 3. No empty text parts
// 4. Final turn has role 'user' containing the latest prompt + context
function buildCleanGeminiContents(
  prompt: string,
  history?: ChatTurn[],
  context?: any
): Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> {
  const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

  if (history && history.length > 0) {
    for (const h of history) {
      const text = (h.content || "").trim();
      if (!text) continue;
      const role: "user" | "model" = h.role === "assistant" || h.role === "model" ? "model" : "user";

      // Gemini contents CANNOT start with a model message
      if (contents.length === 0 && role === "model") {
        continue;
      }

      // Gemini contents must strictly alternate roles
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += `\n${text}`;
      } else {
        contents.push({ role, parts: [{ text }] });
      }
    }
  }

  // Build the final prompt with context if present
  let fullPrompt = prompt;
  if (context) {
    const ctxStr = typeof context === "string" ? context : JSON.stringify(context);
    fullPrompt = `Placement Context: ${ctxStr}\n\nStudent Query: ${prompt}`;
  }

  if (contents.length === 0) {
    contents.push({ role: "user", parts: [{ text: fullPrompt }] });
  } else if (contents[contents.length - 1].role === "user") {
    contents[contents.length - 1].parts[0].text = fullPrompt;
  } else {
    contents.push({ role: "user", parts: [{ text: fullPrompt }] });
  }

  return contents;
}

// Helper: Call Gemini API (Primary Provider with Automatic Transient Fallback)
async function callGeminiChat(
  prompt: string,
  history?: Array<{ role: string; content: string }>,
  context?: any
): Promise<string | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  const contents = buildCleanGeminiContents(prompt, history, context);

  // Supported non-deprecated models in priority order
  const allModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  const now = Date.now();

  // If a model recently returned 503 (high demand) or 429, prioritize available alternatives
  const candidateModels = [...allModels].sort((a, b) => {
    const aInCool = (modelCooldownUntil[a] || 0) > now ? 1 : 0;
    const bInCool = (modelCooldownUntil[b] || 0) > now ? 1 : 0;
    return aInCool - bInCool;
  });

  for (const model of candidateModels) {
    // If this model is in active cooldown and we have other models available, skip for now
    if ((modelCooldownUntil[model] || 0) > now && candidateModels.some(m => (modelCooldownUntil[m] || 0) <= now)) {
      continue;
    }

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: PLACEMENT_SYSTEM_PROMPT,
            temperature: 0.7,
          }
        });

        if (response && response.text) {
          delete modelCooldownUntil[model];
          return response.text;
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const isTransient =
          errMsg.includes("503") ||
          errMsg.includes("high demand") ||
          errMsg.includes("429") ||
          errMsg.includes("UNAVAILABLE");

        if (isTransient) {
          // Set a 45-second cooldown for this model during high-demand spikes
          modelCooldownUntil[model] = Date.now() + 45000;
          if (attempt === 0) {
            // Quick 250ms backoff before retry or switching model
            await new Promise(r => setTimeout(r, 250));
            continue;
          }
        }
        // Proceed to next fallback candidate
        break;
      }
    }
  }

  return null;
}

// Helper: Call Groq API if GROQ_API_KEY is configured (Secondary Fallback Provider)
async function callGroqChat(messages: Array<{ role: string; content: string }>): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  // Active models supported on this Groq environment
  const candidateModels = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];

  for (const model of candidateModels) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: PLACEMENT_SYSTEM_PROMPT },
            ...messages
          ],
          temperature: 0.6,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`Groq model ${model} returned non-200:`, errText);
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    } catch (err: any) {
      console.warn(`Groq request error for ${model}:`, err?.message || err);
    }
  }

  return null;
}

// Fallback Strategic Rules Engine
function getFallbackMentorResponse(prompt: string, context?: any) {
  const lower = prompt.toLowerCase();

  if (lower.includes("2 hours") || lower.includes("today's plan") || lower.includes("generate today's plan")) {
    return `### **High-ROI 2-Hour Execution Allocation**
Based on the Placement Dependency Graph, here is your prioritized session:

1. **60 mins — DSA Array/Two-Pointers (Active Problem Solving)**
   - Solve 2 LeetCode Mediums on Two Pointers or Sliding Window.
   - *Rule:* Code in plain text or Google Docs first; do not rely on IDE auto-complete.
2. **30 mins — Java Syntax / Object-Oriented Logic**
   - Implement custom class encapsulation with constructors and ArrayList/HashMap usage.
3. **30 mins — Quantitative Aptitude Speed Drill**
   - 10 timed questions on Percentages & Ratios (< 60 seconds per question).
   - *Why:* 80% of candidates get eliminated in OA rounds before technical evaluation begins.`;
  }

  if (lower.includes("aptitude") || lower.includes("oa") || lower.includes("tomorrow")) {
    return `### **Aptitude OA Urgent Protocol (High Frequency Core)**
If your assessment is imminent, prioritize solely by ROI:
- **Percentages & Profit/Loss**: Master the 1/2 to 1/15 fraction conversion tables.
- **Ratios & Proportions**: Focus on inverse efficiency for Time & Work / Pipes & Cisterns.
- **Speed, Time & Distance**: Relative speed logic (Trains, Boats & Streams).
- **Time Boxing:** Spend no more than 60 seconds per question. If stuck, mark and move forward immediately.`;
  }

  if (lower.includes("spring boot") || lower.includes("backend") || lower.includes("should i study")) {
    return `### **Backend Roadmap Validation**
**Check Prerequisites First:**
- Have you mastered Java OOP (Classes, Interfaces, Polymorphism)?
- Have you written complex SQL JOINs, GROUP BY, and understand ACID properties?

If **YES**: Begin **Spring Boot Web & Inversion of Control (IoC)** immediately. Build a Tier-2 E-commerce REST API.
If **NO**: Complete Java Collections Framework (HashMap/ArrayList) and SQL Joins first. Stacking Spring Boot on shaky OOP leads directly to tutorial hell.`;
  }

  if (lower.includes("ready") || lower.includes("am i ready")) {
    return `### **Placement Readiness Audit (Section 23 Criteria)**
You achieve official **DONE** status when all 5 criteria are empirically satisfied:
1. **DSA:** Solve an unseen LeetCode Medium in under 25 mins in a plain text editor while narrating time/space complexity aloud.
2. **CS Core:** Fluently articulate ACID transactions, Thread Deadlocks, and the TCP/IP 3-way handshake.
3. **Projects:** 1 deployed backend API (Spring Boot + PostgreSQL + Redis) with live Swagger docs.
4. **Behavioral:** 5 STAR-L stories documented (Ambiguity, Humility, Conflict, Failure pivot).
5. **Aptitude:** Consistent 80%+ on timed TCS/Infosys mock drills.`;
  }

  return `### **Strategic Placement Guidance**
To maximize your velocity toward **₹23.3 LPA** and **Google L3 SWE**:

- **Follow the DAG Dependency:** Focus on the current unlocked node in your roadmap.
- **Enforce the 1:3 Rule:** 1 hour of concept intake requires 3 hours of direct implementation.
- **Think Aloud:** When coding, vocalize every decision and evaluate space/time complexity bounds before typing.
- **Strictly Defer Tech Bloat:** Avoid switching to React, Python, or Kubernetes until your Java Spring Boot microservice and Graph/DP DSA foundation are locked down.`;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Placement OS Backend", timestamp: new Date().toISOString() });
});

// Chat with Mentor
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, message, context } = req.body;
    const userPrompt = message || (Array.isArray(messages) && messages.length > 0 ? (messages[messages.length - 1]?.content || messages[messages.length - 1]?.text) : "");

    const formattedMessages = (Array.isArray(messages) ? messages : []).map((m: any) => ({
      role: m.sender === "assistant" || m.role === "assistant" ? "assistant" : "user",
      content: m.content || m.text || ""
    }));

    if (userPrompt && (formattedMessages.length === 0 || formattedMessages[formattedMessages.length - 1].content !== userPrompt)) {
      formattedMessages.push({ role: "user", content: userPrompt });
    }

    const promptText = `User Context: ${JSON.stringify(context || {})}
User Query: ${userPrompt || "Strategic guidance"}`;

    // 1. Primary: Gemini
    let responseText = await callGeminiChat(promptText, formattedMessages.length > 1 ? formattedMessages : undefined);

    // 2. Secondary: Groq
    if (!responseText) {
      responseText = await callGroqChat(formattedMessages);
    }

    // 3. Fallback Heuristic
    if (!responseText) {
      responseText = getFallbackMentorResponse(userPrompt || "general guidance", context);
    }

    res.json({ reply: responseText });
  } catch (err: any) {
    console.error("AI Chat Route Error:", err);
    res.json({ reply: getFallbackMentorResponse("general guidance") });
  }
});

// Generate Daily High-ROI Plan
app.post("/api/ai/daily-plan", async (req, res) => {
  try {
    const { availableHours = 3, currentPhase, upcomingEvents, weakAreas } = req.body;
    const prompt = `Generate an exact, mathematically optimized daily placement plan for ${availableHours} hours.
Current Phase: ${currentPhase || "Phase 1: Java + Aptitude + DSA Foundation"}
Upcoming Events: ${JSON.stringify(upcomingEvents || [])}
Weak Areas: ${JSON.stringify(weakAreas || [])}
Format strictly with:
- PRIMARY FOCUS (with exact topic and time)
- SECONDARY PARALLEL (Aptitude drill / DSA)
- CS THEORY (Spaced repetition)
- EXECUTION PROTOCOL`;

    // 1. Primary: Gemini
    let plan = await callGeminiChat(prompt);
    // 2. Secondary: Groq
    if (!plan) plan = await callGroqChat([{ role: "user", content: prompt }]);
    // 3. Fallback Heuristic
    if (!plan) plan = getFallbackMentorResponse("2 hours", { availableHours });

    res.json({ plan });
  } catch (err: any) {
    console.error("Daily Plan Route Error:", err);
    res.json({ plan: getFallbackMentorResponse("2 hours") });
  }
});

// Interactive Mock Interview Question Simulator
app.post("/api/ai/mock-interview", async (req, res) => {
  try {
    const { mode, userResponse, questionIndex = 0, history = [] } = req.body;
    const prompt = `You are a strict technical interviewer at an elite product company (or Google) conducting a ${mode} interview.
History: ${JSON.stringify(history)}
Candidate's Latest Response: "${userResponse || "Ready to begin"}"
Question #${questionIndex + 1}.

If this is the start: Provide Question #1 with clear constraints.
If evaluating response:
1. Evaluate Technical Accuracy (0-10)
2. Clarity & Communication (0-10)
3. Missing Concepts or Edge Cases
4. Concise Feedback
5. Next Question (Question #${questionIndex + 1}) or Final Verdict if question 5.`;

    // 1. Primary: Gemini
    let interviewStep = await callGeminiChat(prompt);
    // 2. Secondary: Groq
    if (!interviewStep) interviewStep = await callGroqChat([{ role: "user", content: prompt }]);
    // 3. Fallback Heuristic
    if (!interviewStep) {
      interviewStep = `### **${mode} Mock Evaluation — Question #${questionIndex + 1}**\n\n**Feedback:** Good logical direction. In an actual technical round, remember to explicitly state the time and space complexity before coding.\n\n**Next Question:** How would you optimize this if memory is strictly constrained to O(1) auxiliary space? Walk me through your pointer mechanics.`;
    }

    res.json({ step: interviewStep });
  } catch (err: any) {
    console.error("Mock Interview Route Error:", err);
    res.json({
      step: `### **${(req.body?.mode) || 'Technical'} Mock Evaluation**\n\n**Feedback:** Proceeding with core optimization analysis.\n\n**Next Question:** Walk through how you analyze and prove worst-case time complexity.`
    });
  }
});

// Start Server with Vite Middleware in dev, or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Placement OS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
