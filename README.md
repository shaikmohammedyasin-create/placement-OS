# Placement OS

> Personal Placement Operating System — Strategy, Execution, Supabase Database & AI Placement Strategic Mentor for B.Tech Computer Science Students targeting **₹23.3 LPA+** product unicorns and **Google L3 SWE**.

---

## 🌟 Key Features

- **Master 38-Node Tech Placement Dependency Graph**: Visual DAG tracking core CS, DSA, Aptitude, System Design, and Backend milestones.
- **Unified Events & Execution Planner**: Single general `events` table handling study sessions, aptitude tests, coding OAs, interviews, mock interviews, college exams, deadlines, and project milestones.
- **Supabase PostgreSQL Integration**: Simple, maintainable 8-table relational database architecture (`roadmap_nodes`, `events`, `applications`, `projects`, `study_sessions`, `test_results`, `interview_notes`, `user_settings`) with dual local-storage fallback.
- **Placement AI Strategic Mentor**: Context-aware AI mentor powered by Gemini with Groq fallback for 2-hour daily plan generation and interactive mock technical interviews.
- **STAR-L Behavioral & Plain Text Coding**: Google Docs simulation tools and behavioral story logger for Googleyness & MNC evaluation.

---

## 🛠️ Database Setup (Supabase PostgreSQL)

1. Create a project at [Supabase](https://supabase.com/).
2. Navigate to the **SQL Editor** in Supabase and execute the script provided in [`supabase/schema.sql`](./supabase/schema.sql).
3. Copy your project URL and anon public key from **Project Settings -> API**.
4. Set the environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+

### Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in keys:
   ```env
   GEMINI_API_KEY="your-gemini-key"
   GROQ_API_KEY="your-groq-key"
   VITE_SUPABASE_URL="your-supabase-url"
   VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 📄 License
MIT
