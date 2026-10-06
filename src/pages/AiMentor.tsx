import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Send,
  Sparkles,
  Code2,
  Terminal,
  FileText,
  Copy,
  RotateCcw,
  Trophy,
  User,
  BookOpen,
  CalendarDays,
  LogOut,
  Menu,
  X,
  Bot,
  Check,
} from "lucide-react";

import careergizeLogo from "../assets/careergize-logo.jpeg";

/* =========================================================
   TYPES
========================================================= */

type MentorMode = "all" | "code_review" | "interview" | "architecture" | "resume";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  category?: string;
}

/* =========================================================
   NAV ITEMS
========================================================= */

const navItems = [
  { label: "Overview", icon: BookOpen },
  { label: "My Profile", icon: User },
  { label: "My Learning", icon: BookOpen },
  { label: "Schedule", icon: CalendarDays },
  { label: "Achievements", icon: Trophy },
  { label: "AI Mentor", icon: Brain },
];

/* =========================================================
   INTELLIGENT MENTOR KNOWLEDGE BASE
========================================================= */

const MENTOR_KNOWLEDGE_BASE: { [key: string]: string } = {
  sql: `### ⚡ SQL & Database Optimization Strategy

To optimize high-concurrency database queries in modern production systems (e.g., PostgreSQL / MySQL):

1. **Eliminate N+1 Queries**:
   - In Django: Always use \`select_related()\` for single-valued relationships (\`ForeignKey\`, \`OneToOne\`) and \`prefetch_related()\` for multi-valued relationships (\`ManyToMany\`, reverse \`ForeignKey\`).
   - In raw SQL: Replace iterative queries with joined subqueries or batch fetching.

2. **Index Optimization**:
   - Add B-Tree indexes on columns frequently used in \`WHERE\`, \`JOIN\`, and \`ORDER BY\` clauses.
   - Use composite indexes when querying multiple columns together (order matters: equality first, then range filters).

3. **Analyze Execution Plans**:
   \`\`\`sql
   EXPLAIN ANALYZE 
   SELECT u.id, u.username, COUNT(o.id) as orders_count
   FROM users u
   LEFT JOIN orders o ON u.id = o.user_id
   WHERE u.created_at >= '2024-01-01'
   GROUP BY u.id, u.username;
   \`\`\`
   Look for **Sequential Scans (Seq Scan)** on large tables and convert them to **Index Scans**.

4. **Connection Pooling**: Use PgBouncer to keep connection overhead sub-millisecond.

Would you like me to analyze a specific slow query from your project?`,

  react: `### ⚛️ Modern React 19 Performance & State Management

Here are the golden rules for architecting scalable, zero-lag React applications:

1. **State Co-location**:
   - Keep state as local as possible. Never place temporary form states into global stores.
   - For global caching, prefer **TanStack Query** (React Query) over manual Redux/Zustand boilerplate.

2. **Optimized Zustand Store Architecture**:
   \`\`\`typescript
   import { create } from 'zustand';

   interface StudentStore {
     xp: number;
     addXp: (amount: number) => void;
   }

   export const useStudentStore = create<StudentStore>((set) => ({
     xp: 3450,
     addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
   }));
   \`\`\`

3. **Prevent Unnecessary Re-renders**:
   - Avoid creating new object/array literals inside JSX props (\`style={{ margin: 10 }}\` creates a new reference on every render).
   - Use \`useCallback\` only when passing functions to \`React.memo\` children or dependency arrays.
   - Leverage React 19 Compiler and Server Components for static portions of your UI tree.

Would you like to review your current component tree or optimize an existing hook?`,

  resume: `### 📄 High-Impact STAR Metrics for Software Engineering

Recruiters and hiring managers spend an average of 6 seconds per resume. Stand out by replacing passive duty descriptions with **Google's XYZ Formula**:

> *"Accomplished [X] as measured by [Y], by doing [Z]."*

#### ❌ Weak Example:
- *"Created REST API endpoints in Django and connected to PostgreSQL database."*

#### ✅ Strong, Metric-Driven STAR Example:
- *"Architected 14 RESTful API viewsets using Django REST Framework and PostgreSQL, reducing query latency by 42% through strategic index caching and handling 10,000+ daily student requests."*

#### ❌ Weak Example:
- *"Built frontend UI components in React."*

#### ✅ Strong, Metric-Driven STAR Example:
- *"Engineered 18 reusable, responsive React components using TypeScript and TailwindCSS, eliminating redundant re-renders with Zustand and achieving a 98/100 Lighthouse performance rating."*

Paste your current resume bullet points right here, and I will rewrite them to sound executive and senior-level!`,

  interview: `### 🎯 Senior Frontend & Full Stack Mock Interview Question

Let's test your real-world problem-solving skills! Here is your technical question:

**Scenario**: You are tasked with building a real-time live attendance tracker for 10,000 students concurrent in Careergize Learning Hub. When the instructor starts class, 5,000 students click "Check-In" within 30 seconds.

**Questions for you**:
1. How do you prevent your database from locking up under this sudden burst of concurrent check-in writes?
2. What caching or queueing strategy (e.g. Redis, Celery, BullMQ) would you implement?
3. How would you update the student's UI immediately without making them wait for the database transaction to finish?

Take your time and reply with your technical approach—I'll review and grade your answer!`,

  rag: `### 🤖 Hybrid RAG & Vector Database Architecture

To build a state-of-the-art Generative AI assistant like Careergize AI:

1. **Chunking & Embedding**:
   - Document segmentation with recursive character text splitters (chunk size: 500-1000 tokens, overlap: 100 tokens).
   - Embed using high-dimensional models (e.g., OpenAI \`text-embedding-3-small\` or HuggingFace \`all-MiniLM-L6-v2\`).

2. **Vector Indexing (Pinecone / Chroma / pgvector)**:
   - Use HNSW (Hierarchical Navigable Small World) indexing for logarithmic search times.
   - Store metadata (lesson ID, module name, instructor) to enable pre-filtering before vector distance calculation.

3. **Hybrid Search (Dense + Sparse)**:
   - Combine dense vector semantic search with BM25 keyword search using Reciprocal Rank Fusion (RRF).
   - This ensures exact keyword matches (like specific function names) aren't missed by purely semantic embeddings.

4. **Reranking**:
   - Pass top-20 retrieved chunks through a cross-encoder reranker (e.g., Cohere Rerank) to feed only the top 3-5 most pertinent context chunks to the LLM.

Would you like a sample Python implementation of a LangChain RAG pipeline?`,
};

/* =========================================================
   COMPONENT
========================================================= */

export default function AiMentor() {
  const navigate = useNavigate();

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User
  const [user, setUser] = useState<any>(null);

  // Mode filter
  const [mentorMode, setMentorMode] = useState<MentorMode>("all");

  // Chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "assistant",
      content:
        "Hello! I am your 24/7 Careergize AI Mentor. I am ready to review your code, architect systems, run mock technical interviews, or optimize your resume. How can I help you today?",
      timestamp: "Just now",
      category: "General",
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Load User
  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (e) {
        console.error("Failed to parse loggedInUser", e);
      }
    }
  }, []);

  const studentName = user?.username || "suku@gmail.com";
  const studentEmail = user?.email || "suku@gmail.com";
  const studentAvatarChar = studentName.charAt(0).toUpperCase();

  // Navigation handler
  const handleNavigation = (label: string) => {
    if (label === "Overview") navigate("/dashboard");
    if (label === "My Profile") navigate("/profile");
    if (label === "My Learning") navigate("/my-learning");
    if (label === "Schedule") navigate("/schedule");
    if (label === "Achievements") navigate("/achievements");
    if (label === "AI Mentor") navigate("/ai-mentor");
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInStudentId");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  // Copy helper
  const handleCopy = (id: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Clear chat
  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content:
          "Conversation reset. How can I help you tackle your next technical milestone today? Feel free to ask about code optimizations, system design, or interview preparation.",
        timestamp: "Just now",
        category: "General",
      },
    ]);
  };

  // Send message logic
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputPrompt).trim();
    if (!textToSend || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsTyping(true);

    const lower = textToSend.toLowerCase();
    let replyContent = "";

    if (lower.includes("sql") || lower.includes("database") || lower.includes("index") || lower.includes("query")) {
      replyContent = MENTOR_KNOWLEDGE_BASE.sql;
    } else if (lower.includes("react") || lower.includes("hook") || lower.includes("state") || lower.includes("frontend")) {
      replyContent = MENTOR_KNOWLEDGE_BASE.react;
    } else if (lower.includes("resume") || lower.includes("star") || lower.includes("bullet") || lower.includes("cv")) {
      replyContent = MENTOR_KNOWLEDGE_BASE.resume;
    } else if (lower.includes("interview") || lower.includes("mock") || lower.includes("question") || lower.includes("hiring")) {
      replyContent = MENTOR_KNOWLEDGE_BASE.interview;
    } else if (lower.includes("rag") || lower.includes("vector") || lower.includes("ai") || lower.includes("llm")) {
      replyContent = MENTOR_KNOWLEDGE_BASE.rag;
    } else {
      replyContent = `That's a thoughtful question regarding **"${textToSend}"**!

As your Careergize AI Mentor, here are the key engineering recommendations:

1. **Understand Fundamentals**: Ensure strong conceptual grasp before diving into framework abstractions.
2. **Hands-On Application**: Build a standalone proof-of-concept repository or test script to benchmark real behavior.
3. **Clean Code & Testing**: Write unit tests and maintain strict TypeScript or type hints to prevent regressions.
4. **Placement Readiness**: Document your architectural decisions in a clear README so recruiters can evaluate your engineering depth.

Would you like me to generate a complete code example or deep-dive into any specific aspect of this?`;
    }

    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          replyContent = data.text;
        }
      }
    } catch {
      // Use fallback
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: replyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          category: mentorMode,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-primary/20 selection:text-brand-primary">
      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col z-30">
        {/* Brand */}
        <div className="px-7 py-7">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20 overflow-hidden">
              <img
                src={careergizeLogo}
                alt="Careergize Logo"
                className="w-8 h-8 object-contain scale-125"
              />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-slate-900">
                Careergize<span className="text-brand-primary">.</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                Learning Hub
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === "AI Mentor";

            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary font-bold shadow-2xs"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-brand-primary" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-brand-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Simple AI Status in Sidebar */}
        <div className="p-4 mx-4 mb-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-700">
            <span>AI Mentor Access</span>
            <span className="text-emerald-600 font-extrabold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            24/7 Intelligent Engineering Mentor
          </p>
        </div>

        {/* Profile & Logout */}
        <div className="p-4 border-t border-slate-100">
          {/* Student Profile Quick Tile */}
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm shrink-0">
              {studentAvatarChar}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate text-slate-800">{studentName}</p>
              <p className="text-xs text-slate-400 truncate">{studentEmail}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =========================================================
          MOBILE HEADER
      ========================================================= */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center overflow-hidden">
            <img src={careergizeLogo} alt="Careergize Logo" className="w-7 h-7 object-contain scale-110" />
          </div>
          <div className="font-extrabold text-base text-slate-900">
            Careergize<span className="text-brand-primary">.</span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-3 bg-white border-b border-slate-200 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.label)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}

      {/* =========================================================
          MAIN CONTENT AREA (ONLY AI MENTOR)
      ========================================================= */}
      <main className="lg:ml-64 min-h-screen">
        <div className="w-full px-5 sm:px-8 lg:px-10 py-8 space-y-6">
          {/* Header */}
          <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                    24/7 INTELLIGENT TECHNICAL ADVISORY
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  AI Mentor
                </h1>
                <p className="text-slate-500 text-sm mt-1 max-w-2xl leading-relaxed">
                  Ask technical questions, debug code, practice mock interview scenarios, and optimize your architecture in real time.
                </p>
              </div>

              <div className="p-3 px-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-700">Online</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Careergize AI 2.5</div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Focused AI Chat Container */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[740px] overflow-hidden">
            {/* Focus Mode Selector Bar */}
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 overflow-x-auto text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
                  Topic:
                </span>
                {[
                  { id: "all", label: "General Mentor", icon: Brain },
                  { id: "code_review", label: "Code Review", icon: Code2 },
                  { id: "interview", label: "Mock Interview", icon: Sparkles },
                  { id: "architecture", label: "System Design", icon: Terminal },
                  { id: "resume", label: "Resume & Portfolio", icon: FileText },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isCurrent = mentorMode === mode.id;

                  return (
                    <button
                      key={mode.id}
                      onClick={() => setMentorMode(mode.id as MentorMode)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        isCurrent
                          ? "bg-brand-primary text-white shadow-2xs"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleClearChat}
                title="Reset conversation"
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
              {messages.map((msg) => {
                const isUser = msg.role === "user";

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3.5 items-start ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                        isUser
                          ? "bg-brand-primary text-white"
                          : "bg-brand-primary/10 text-brand-primary"
                      }`}
                    >
                      {isUser ? studentAvatarChar : <Brain className="w-4 h-4" />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-5 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? "bg-brand-primary text-white rounded-tr-xs"
                          : "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs"
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                      {/* Footer */}
                      <div
                        className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] ${
                          isUser ? "border-white/20 text-white/70" : "border-slate-200/80 text-slate-400"
                        }`}
                      >
                        <span>{msg.timestamp}</span>

                        {!isUser && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="flex items-center gap-1 hover:text-brand-primary transition cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500 font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-3.5 items-start">
                  <div className="w-9 h-9 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl rounded-tl-xs p-4 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce [animation-delay:0.4s]" />
                    <span className="text-xs text-slate-400 font-medium ml-2">AI Mentor is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggested Queries */}
            <div className="px-6 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Suggested Prompts:
              </span>
              {[
                { text: "⚡ SQL Indexing Optimization", prompt: "How can I improve my SQL query performance using indexing and EXPLAIN ANALYZE?" },
                { text: "⚛️ React Query vs useEffect", prompt: "What React hooks should I master for performance-oriented apps?" },
                { text: "🎯 Mock Interview Question", prompt: "Give me a mock technical interview question on scaling high-traffic systems." },
                { text: "📄 STAR Resume Metrics", prompt: "Give me an example of rewriting technical resume bullets with STAR metrics." },
                { text: "🤖 Vector DB RAG Pipeline", prompt: "Explain how to build a hybrid vector database RAG pipeline in Python." },
              ].map((item) => (
                <button
                  key={item.text}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-brand-primary hover:text-brand-primary transition text-[11px] font-semibold shrink-0 cursor-pointer shadow-2xs"
                >
                  {item.text}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center gap-3 bg-slate-50 rounded-2xl border border-slate-200 px-4 py-2.5 focus-within:ring-2 focus-within:ring-brand-primary/30 focus-within:border-brand-primary transition">
                <textarea
                  rows={1}
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your mentor about code, architecture, interview questions, or resumes... (Enter to send)"
                  className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none max-h-24"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputPrompt.trim() || isTyping}
                  className={`p-2.5 rounded-xl font-bold transition flex items-center justify-center cursor-pointer ${
                    inputPrompt.trim() && !isTyping
                      ? "bg-brand-primary text-white shadow-xs hover:bg-brand-primary/95"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
