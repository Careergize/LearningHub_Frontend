import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Message } from "../types";

export default function MentorChat() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "init-1",
      role: "assistant",
      content: "Hello! I am your 24/7 Careergize AI Mentor. I have analyzed your GitHub profile and active courses. How can I help you accelerate your technical career or optimize your upskilling trajectory today?"
    }
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      }));

      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, history })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.text,
          isSimulated: data.isSimulated
        }]);
      } else {
        throw new Error(data.error || "Failed to query server.");
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `Oops! I had a slight connection issue: ${err.message || 'Please check your backend configuration.'}. However, don't stop building! Always focus on hands-on optimization!`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (topic: string, prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <section id="mentor" className="py-20 max-w-7xl mx-auto px-6 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Visual Info Block */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-tertiary/10 text-brand-tertiary font-sans text-xs font-bold border border-brand-tertiary/20">
            <span className="material-symbols-outlined text-sm animate-pulse">support_agent</span>
            MEET YOUR 24/7 AI MENTOR
          </div>
          <h2 className="font-sans font-extrabold text-3xl md:text-5xl text-brand-dark tracking-tight leading-tight">
            A Personal Mentor <br />
            <span className="text-brand-primary">In Your Pocket.</span>
          </h2>
          <p className="font-sans text-base md:text-lg text-brand-dark/70 leading-relaxed">
            Forget waiting for office hours. Careergize AI reviews your code, recommends targeted React hooks or SQL performance exercises, and sharpens your resume using top-tier tech metrics.
          </p>

          {/* Quick recommendations */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-dark/45">Quick Suggested Topics</h4>
            <div className="flex flex-wrap gap-2.5">
              <button 
                onClick={() => handlePresetClick("sql", "How can I improve my SQL query performance using Indexing?")}
                className="px-4 py-2 bg-white hover:bg-brand-primary hover:text-white rounded-xl border border-brand-dark/10 shadow-sm text-xs font-semibold text-brand-dark/80 transition-all cursor-pointer"
              >
                ⚡ SQL Indexing Optimization
              </button>
              <button 
                onClick={() => handlePresetClick("react", "What React hooks should I master for performance-oriented apps?")}
                className="px-4 py-2 bg-white hover:bg-brand-primary hover:text-white rounded-xl border border-brand-dark/10 shadow-sm text-xs font-semibold text-brand-dark/80 transition-all cursor-pointer"
              >
                ⚛️ Mastering React Hooks
              </button>
              <button 
                onClick={() => handlePresetClick("resume", "Give me an example of rewriting resume bullets with STAR metrics.")}
                className="px-4 py-2 bg-white hover:bg-brand-primary hover:text-white rounded-xl border border-brand-dark/10 shadow-sm text-xs font-semibold text-brand-dark/80 transition-all cursor-pointer"
              >
                📄 STAR Resume Metrics
              </button>
            </div>
          </div>

          {/* Developer Testimonial Quote */}
          <div className="glass p-5 rounded-2xl border border-white/50 shadow-sm flex gap-4 items-start relative overflow-hidden">
            <div className="w-11 h-11 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <span className="material-symbols-outlined">format_quote</span>
            </div>
            <div>
              <p className="font-sans italic text-sm text-brand-dark/80 leading-relaxed">
                "Careergize AI pinpointed that I was creating redundant state variables in React instead of deriving them, helping me clean up my portfolio in a single afternoon!"
              </p>
              <div className="mt-3 text-xs font-bold text-brand-dark/50">
                — Sarah J., Junior Frontend Engineer
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Chat Interactive Window */}
        <div className="w-full">
          <div className="bg-white rounded-3xl shadow-xl border border-brand-dark/5 overflow-hidden flex flex-col h-[520px]">
            {/* Header */}
            <div className="bg-brand-surface/70 px-6 py-4 border-b border-brand-dark/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <span className="material-symbols-outlined">smart_toy</span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
                </div>
                <div>
                  <h4 className="font-sans font-extrabold text-brand-dark text-sm leading-none">Careergize Career Coach</h4>
                  <span className="text-[10px] text-brand-dark/45">Powered by Gemini AI</span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Active Mentor
              </span>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl p-4 text-sm font-sans leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-brand-primary text-white rounded-tr-none"
                          : "bg-white text-brand-dark border border-brand-dark/5 rounded-tl-none"
                      }`}
                    >
                      {/* Message Content */}
                      <div className="whitespace-pre-line space-y-1.5">
                        {msg.content}
                      </div>

                      {/* Simulation Tag if active */}
                      {msg.isSimulated && (
                        <div className="mt-2 text-[10px] text-brand-primary font-medium border-t border-brand-primary/10 pt-1.5 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[11px]">info</span>
                          Simulated answers. Connect your secrets for live Gemini API responses.
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-brand-dark/5 text-brand-dark rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSend} className="p-4 border-t border-brand-dark/5 bg-white flex gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask your Career Mentor anything..."
                className="flex-1 bg-brand-surface/60 border border-brand-dark/10 rounded-full px-5 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="w-10 h-10 rounded-full bg-brand-primary hover:bg-brand-secondary text-white flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                disabled={isLoading || !inputValue.trim()}
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
