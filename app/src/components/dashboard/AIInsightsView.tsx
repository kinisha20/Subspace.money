"use client";
import { useState } from "react";
import Link from "next/link";
import { mockAIInsights } from "@/lib/mock-data";
import { Sparkles, Send, AlertCircle, Lightbulb, Shield, Target, ChevronRight } from "lucide-react";

const insightConfig = {
  save:        { icon: Target,       bg: "bg-green-50",  border: "border-green-100", iconColor: "text-green-600",  label: "Save money"    },
  warning:     { icon: AlertCircle,  bg: "bg-amber-50",  border: "border-amber-100", iconColor: "text-amber-600",  label: "Warning"       },
  opportunity: { icon: Lightbulb,    bg: "bg-blue-50",   border: "border-blue-100",  iconColor: "text-blue-600",   label: "Opportunity"   },
  tip:         { icon: Shield,       bg: "bg-teal-50",   border: "border-teal-100",  iconColor: "text-teal-600",   label: "Smart tip"     },
};

const mockChatResponses: Record<string, string> = {
  default: "Based on your spending patterns, I recommend focusing on reducing subscription costs first. You have 3 unused subscriptions costing \u20b93,569/month.",
  budget:  "Your optimal monthly budget breakdown: Food \u20b96,000, Transport \u20b91,500, Entertainment \u20b92,500, Savings \u20b922,000, Utilities \u20b92,500. This leaves a buffer of \u20b96,500.",
  savings: "To hit your Goa goal by August 15, increase your monthly contribution by \u20b9800. I'll automatically adjust your savings transfer on the 1st of every month.",
  invest:  "Your current SIP returns average 19% annually. Consider adding a mid-cap fund to diversify. HDFC Midcap Opportunities has delivered 24% CAGR over 5 years.",
};

type ChatMessage = { role: "user" | "ai"; content: string };

export function AIInsightsView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Hello! I'm your Subspace AI assistant. I've analyzed your spending patterns for May 2026. Ask me anything about your finances." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    setTimeout(() => {
      const lc = userMsg.toLowerCase();
      const reply =
        lc.includes("budget")  ? mockChatResponses.budget  :
        lc.includes("saving")  ? mockChatResponses.savings :
        lc.includes("invest")  ? mockChatResponses.invest  :
        mockChatResponses.default;
      setMessages(prev => [...prev, { role: "ai", content: reply }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-5 page-enter">

      {/* AI insights grid */}
      <div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[20px] text-[#121212] tracking-tight mb-4">Active insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockAIInsights.map((insight) => {
            const cfg = insightConfig[insight.type];
            const Icon = cfg.icon;
            return (
              <div key={insight.id} className={`bg-white rounded-[20px] border ${cfg.border} p-5 hover:shadow-md transition-all duration-200`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} className={cfg.iconColor} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.iconColor}`}>{cfg.label}</span>
                    <h3 className="text-[14px] font-bold text-[#121212] mt-0.5 leading-snug">{insight.title}</h3>
                  </div>
                  <span className="text-[12px] font-bold text-teal-600 flex-shrink-0">{insight.impact}</span>
                </div>
                <p className="text-[13px] text-[#6B6B6B] leading-relaxed mb-4">{insight.description}</p>
                <Link
                  href={insight.actionHref}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-500 hover:text-teal-600 transition-colors no-underline"
                >
                  {insight.actionLabel} <ChevronRight size={12} aria-hidden="true" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Chat */}
      <div className="bg-[#0F2018] rounded-[20px] border border-white/5 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-xl bg-[#7CCF5C]/15 flex items-center justify-center">
            <Sparkles size={15} className="text-[#7CCF5C]" aria-hidden="true" />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[16px] text-white tracking-tight">AI Finance Assistant</h2>
            <p className="text-[11px] text-white/40">Ask anything about your money</p>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[320px] overflow-y-auto px-5 py-4 space-y-3 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-[14px] px-4 py-3 text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#7CCF5C] text-[#121212] font-medium"
                    : "bg-white/6 text-white/80 border border-white/6"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/6 border border-white/6 rounded-[14px] px-4 py-3">
                <div className="flex gap-1" aria-label="AI is typing">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        <div className="flex gap-2 px-5 pb-3 overflow-x-auto no-scrollbar">
          {["Optimize my budget", "Review savings goals", "Best investment for me"].map((p) => (
            <button
              key={p}
              onClick={() => { setInput(p); }}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white/6 border border-white/8 text-[11px] font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 px-5 pb-5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your finances..."
            className="flex-1 bg-white border border-white/20 rounded-xl px-4 py-3 text-[13px] text-[#121212] font-medium placeholder:text-[#9CA3AF] outline-none focus:border-[#7CCF5C] focus:ring-2 focus:ring-[#7CCF5C]/20 transition-colors"
            aria-label="Message AI assistant"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-[#7CCF5C] flex items-center justify-center flex-shrink-0 hover:bg-[#5CB840] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send size={16} className="text-[#121212]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
