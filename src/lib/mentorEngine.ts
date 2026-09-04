export function getFallbackMentorResponse(prompt: string, context?: any): string {
  const lower = prompt.toLowerCase();

  if (lower.includes("2 hours") || lower.includes("today's plan") || lower.includes("generate today's plan") || lower.includes("study today")) {
    return `### **High-ROI Execution Allocation**
Based on your current 38-node Placement Dependency Graph, here is your mathematically optimized session:

1. **60 mins — DSA Array & Two-Pointers (Active Problem Solving)**
   - Solve 2 LeetCode Mediums on Two Pointers or Sliding Window.
   - *Rule:* Code in plain text or Google Docs first; do not rely on IDE auto-complete.
2. **30 mins — Java Syntax & Object-Oriented Logic**
   - Implement custom class encapsulation with constructors and ArrayList/HashMap usage.
3. **30 mins — Quantitative Aptitude Speed Drill**
   - 10 timed questions on Percentages & Ratios (< 60 seconds per question).
   - *Why:* 80% of candidates get eliminated in OA rounds before technical evaluation begins.`;
  }

  if (lower.includes("aptitude") || lower.includes("oa") || lower.includes("tomorrow") || lower.includes("checklist")) {
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

  if (lower.includes("ready") || lower.includes("am i ready") || lower.includes("readiness")) {
    return `### **Placement Readiness Audit (Section 23 Criteria)**
You achieve official **DONE** status when all 5 criteria are empirically satisfied:
1. **DSA:** Solve an unseen LeetCode Medium in under 25 mins in a plain text editor while narrating time/space complexity aloud.
2. **CS Core:** Fluently articulate ACID transactions, Thread Deadlocks, and the TCP/IP 3-way handshake.
3. **Projects:** 1 deployed backend API (Spring Boot + PostgreSQL + Redis) with live Swagger docs.
4. **Behavioral:** 5 STAR-L stories documented (Ambiguity, Humility, Conflict, Failure pivot).
5. **Aptitude:** Consistent 80%+ on timed TCS/Infosys mock drills.`;
  }

  if (lower.includes("test me") || lower.includes("java fundamentals") || lower.includes("question")) {
    return `### **Java Rapid-Fire Technical Assessment**
Answer these 3 core questions to verify node mastery:

1. **Memory Allocation:** Explain the difference between Heap and Stack memory in Java. What happens when an object is instantiated inside a method?
2. **String Immutability:** Why is \`String\` immutable in Java? What is the performance difference between \`String\` and \`StringBuilder\` in a loop?
3. **Collections Mechanics:** How does a \`HashMap\` handle hash collisions under the hood in Java 8+?

*Respond with your concise explanation for instant evaluation.*`;
  }

  return `### **Strategic Placement Guidance**
To maximize your velocity toward **₹23.3 LPA** and **Google L3 SWE**:

- **Follow the DAG Dependency:** Focus on the current unlocked node in your roadmap.
- **Enforce the 1:3 Rule:** 1 hour of concept intake requires 3 hours of direct implementation.
- **Think Aloud:** When coding, vocalize every decision and evaluate space/time complexity bounds before typing.
- **Strictly Defer Tech Bloat:** Avoid switching to React, Python, or Kubernetes until your Java Spring Boot microservice and Graph/DP DSA foundation are locked down.`;
}
