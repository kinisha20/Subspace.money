"use client";
import { mockInvestments } from "@/lib/mock-data";
import { formatINR } from "@/lib/design-tokens";
import { TrendingUp, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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
