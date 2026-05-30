"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { mockInvestments } from "@/lib/mock-data";
import { formatINR } from "@/lib/design-tokens";
import { TrendingUp, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getUser } from "@/lib/user-store";

// Brand-styled logo config keyed by holding name
const logoConfig: Record<string, { bg: string; label: string }> = {
  "Nifty 50 Index Fund":  { bg: "#1B2A6B", label: "N50"  },
  "HDFC Small Cap Fund":  { bg: "#E31837", label: "HDFC" },
  "Digital Gold":         { bg: "#F59E0B", label: "GOLD" },
  "HDFC Bank FD":         { bg: "#004C8F", label: "HDFC" },
  "Reliance Industries":  { bg: "#1E3A5F", label: "RIL"  },
};

function HoldingLogo({ name, fallbackColor }: { name: string; fallbackColor: string }) {
  const cfg = logoConfig[name];
  const bg  = cfg?.bg ?? fallbackColor;
  const lbl = cfg?.label ?? name.charAt(0);

  return (
    <div
      className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
      style={{ background: bg }}
      aria-hidden="true"
    >
      {name === "HDFC Bank FD" ? (
        <div className="flex flex-col items-center leading-none">
          <span className="text-[9px] font-extrabold text-white tracking-tight">HDFC</span>
          <span className="text-[8px] font-bold text-white/80 tracking-wide">Bank</span>
        </div>
      ) : (
        <span className="text-[10px] font-extrabold text-white tracking-tight">{lbl}</span>
      )}
    </div>
  );
}

export function InvestmentsView() {
  const [isPro, setIsPro] = useState(true);

  useEffect(() => {
    setIsPro(getUser()?.plan === "pro");
  }, []);

  const totalInvested = mockInvestments.reduce((s, i) => s + i.invested, 0);
  const totalCurrent  = mockInvestments.reduce((s, i) => s + i.current,  0);
  const totalReturns  = totalCurrent - totalInvested;
  const totalPct      = ((totalReturns / totalInvested) * 100).toFixed(1);

  const tooltipStyle = {
    backgroundColor: "#0F2018",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    color: "#ffffff",
    fontFamily: "'Satoshi','DM Sans',sans-serif",
    fontSize: "13px",
  };

  if (!isPro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-[#1A3C2A] flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 3L17 10H24L18.5 14.5L20.5 22L14 17.5L7.5 22L9.5 14.5L4 10H11L14 3Z" fill="#7CCF5C"/></svg>
        </div>
        <h2 style={{fontFamily:"'Instrument Serif',serif"}} className="text-[28px] text-[#121212] tracking-tight mb-3">Investment Tracking is Pro only</h2>
        <p className="text-[15px] text-[#6B6B6B] max-w-[400px] leading-relaxed mb-6">Track your mutual funds, stocks, FDs and gold holdings with real-time performance. Upgrade to Pro to unlock portfolio analytics.</p>
        <div className="bg-[#F5EFE7] border border-[#E5E0D5] rounded-2xl p-5 mb-6 text-left max-w-[380px] w-full">
          <p className="text-[12px] font-bold text-[#1A3C2A] uppercase tracking-wider mb-3">What you get with Pro</p>
          {["Unlimited investment tracking","Portfolio performance charts","Returns & allocation analytics","AI-powered investment insights","Mutual fund & stock tracking"].map(f => (
            <div key={f} className="flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" fill="#7CCF5C" fillOpacity="0.2"/><path d="M4 7l2 2 4-4" stroke="#1A3C2A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="text-[13px] text-[#374151]">{f}</span>
            </div>
          ))}
        </div>
        <Link href="/login" className="inline-flex items-center gap-2 bg-[#1A3C2A] text-white text-[14px] font-semibold rounded-full px-8 py-3.5 no-underline hover:bg-[#0F2018] transition-colors">
          Upgrade to Pro — ₹190/month
        </Link>
        <p className="text-[12px] text-[#9CA3AF] mt-3">Or <Link href="/login" className="text-[#0F5F56] no-underline hover:underline">sign in with Pro demo account</Link></p>
      </div>
    );
  }

  return (
    <div className="space-y-5 page-enter">

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {
          [
            { label: "Total Invested",  value: formatINR(totalInvested),          positive: null },
            { label: "Current Value",   value: formatINR(totalCurrent),           positive: null },
            { label: "Total Returns",   value: formatINR(totalReturns),           positive: true },
            { label: "Overall Return",  value: `+${totalPct}%`,                   positive: true },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-[20px] border border-[#E5E7EB] px-5 py-4">
              <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-2">{s.label}</p>
              <p style={{ fontFamily: "'Instrument Serif', serif" }} className={`text-[24px] tracking-tight ${
                s.positive === true ? "text-green-600" : "text-[#121212]"
              }`}>{s.value}</p>
            </div>
          ))
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Allocation pie */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-5">
          <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[17px] text-[#121212] tracking-tight mb-4">Allocation</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mockInvestments} cx="50%" cy="50%" outerRadius={80} dataKey="current" strokeWidth={0}>
                  {mockInvestments.map((inv, i) => (
                    <Cell key={i} fill={inv.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatINR(v), "Value"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-3">
            {mockInvestments.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: inv.color }} aria-hidden="true" />
                  <span className="text-[12px] text-[#6B6B6B]">{inv.name.split(" ").slice(0, 2).join(" ")}</span>
                </div>
                <span className="text-[12px] font-bold text-[#121212]">{Math.round(inv.current/totalCurrent*100)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Holdings */}
        <div className="lg:col-span-2 bg-white rounded-[20px] border border-[#E5E7EB] p-5">
          <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[17px] text-[#121212] tracking-tight mb-4">Holdings</h2>
          <div className="space-y-3">
            {mockInvestments.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between py-3 border-b border-[#F5EFE7] last:border-0">
                <div className="flex items-center gap-3">
                  <HoldingLogo name={inv.name} fallbackColor={inv.color} />
                  <div>
                    <p className="text-[13px] font-bold text-[#121212]">{inv.name}</p>
                    <p className="text-[11px] text-[#9CA3AF] capitalize">{inv.type.replace("_", " ")}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[16px] text-[#121212] tracking-tight">{formatINR(inv.current)}</p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    {inv.returnsPercent > 0
                      ? <TrendingUp size={11} className="text-green-500" aria-hidden="true" />
                      : <TrendingDown size={11} className="text-red-500" aria-hidden="true" />
                    }
                    <span className={`text-[11px] font-bold ${inv.returnsPercent > 0 ? "text-green-600" : "text-red-500"}`}>
                      +{inv.returnsPercent}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
