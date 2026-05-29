"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { mockSpendingByMonth, mockSpendingByCategory, mockSavingsOverTime } from "@/lib/mock-data";
import { formatINR, formatINRCompact, CHART_COLORS } from "@/lib/design-tokens";

const tooltipStyle = {
  backgroundColor: "#0F2018",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "#ffffff",
  fontFamily: "'Satoshi','DM Sans',sans-serif",
  fontSize: "13px",
};

export function AnalyticsView() {
  const totalSpend = mockSpendingByCategory.reduce((s, c) => s + c.value, 0);

  return (
    <div className="space-y-6 page-enter">

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Spent (May)",   value: formatINR(48600),  sub: "-4.2% vs Apr" },
          { label: "Avg. Daily Spend",    value: formatINR(1567),   sub: "30 days" },
          { label: "Largest Category",    value: "Food",            sub: "₹8,200 (16.9%)" },
          { label: "Savings Rate",        value: "23.6%",           sub: "+2.1% vs Apr" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-[20px] border border-[#E5E7EB] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-2">{s.label}</p>
            <p style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[24px] text-[#121212] tracking-tight leading-none mb-1.5">{s.value}</p>
            <p className="text-[11px] text-[#9CA3AF]">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Spending over time */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[17px] text-[#121212] tracking-tight mb-4">Spending over time</h2>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockSpendingByMonth} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "'Satoshi','DM Sans',sans-serif" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "'Satoshi','DM Sans',sans-serif" }} tickFormatter={formatINRCompact} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatINR(v), "Spent"]} />
              <Bar dataKey="amount" fill={CHART_COLORS.secondary} radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category pie + savings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Category breakdown */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[17px] text-[#121212] tracking-tight mb-4">Spending by category</h2>
          <div className="flex items-center gap-4">
            <div className="h-[180px] w-[180px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mockSpendingByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {mockSpendingByCategory.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatINR(v), "Spent"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {mockSpendingByCategory.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} aria-hidden="true" />
                    <span className="text-[12px] text-[#6B6B6B]">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[12px] font-bold text-[#121212]">{formatINR(cat.value)}</span>
                    <span className="text-[10px] text-[#9CA3AF] ml-1">{Math.round(cat.value/totalSpend*100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Savings trend */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[17px] text-[#121212] tracking-tight mb-4">Monthly savings</h2>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSavingsOverTime} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "'Satoshi','DM Sans',sans-serif" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "'Satoshi','DM Sans',sans-serif" }} tickFormatter={formatINRCompact} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatINR(v), "Saved"]} />
                <Area type="monotone" dataKey="savings" stroke={CHART_COLORS.primary} strokeWidth={2.5} fill="url(#savingsGrad)" dot={false} activeDot={{ r: 5, fill: CHART_COLORS.primary, stroke: "white", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
