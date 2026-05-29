"use client";

import { mockDashboardStats, mockTransactions, mockAIInsights, mockSubscriptions, mockSpendingByMonth } from "@/lib/mock-data";
import { formatINR, formatINRCompact, CHART_COLORS } from "@/lib/design-tokens";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Sparkles, ArrowRight, AlertCircle, Lightbulb, Shield, Target } from "lucide-react";
import Link from "next/link";

const insightIcons = {
  save:        { icon: Target,       color: "text-green-600",  bg: "bg-green-50"  },
  warning:     { icon: AlertCircle,  color: "text-amber-600",  bg: "bg-amber-50"  },
  opportunity: { icon: Lightbulb,    color: "text-blue-600",   bg: "bg-blue-50"   },
  tip:         { icon: Shield,       color: "text-teal-600",   bg: "bg-teal-50"   },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F2018] rounded-xl px-3 py-2 text-white shadow-xl border border-white/10">
        <p className="text-[11px] text-white/50 mb-1">{label}</p>
        <p className="text-[14px] font-bold">{formatINR(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function DashboardHome() {
  const { totalBalance, monthlySavings, subscriptions, pendingSplits, savingsRate, balanceChange, savingsChange, investmentValue } = mockDashboardStats;

  return (
    <div className="space-y-6 page-enter">

      {/* ── Stat Cards Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Balance",
            value: formatINR(totalBalance),
            change: `+${balanceChange}% this month`,
            positive: true,
          },
          {
            label: "Monthly Savings",
            value: formatINR(monthlySavings),
            change: `+${formatINR(savingsChange)} vs last`,
            positive: true,
          },
          {
            label: "Subscriptions",
            value: formatINR(subscriptions),
            change: "7 active plans",
            positive: false,
          },
          {
            label: "Pending Splits",
            value: formatINR(pendingSplits),
            change: "3 people owe you",
            positive: null,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-[20px] border border-[#E5E7EB] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          >
            <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-2">{stat.label}</p>
            <p
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="text-[26px] text-[#121212] tracking-tight leading-none mb-2"
            >
              {stat.value}
            </p>
            <div className={`flex items-center gap-1 text-[11px] font-semibold ${
              stat.positive === true  ? "text-green-600" :
              stat.positive === false ? "text-red-500"   :
              "text-[#6B6B6B]"
            }`}>
              {stat.positive === true  && <TrendingUp  size={12} aria-hidden="true" />}
              {stat.positive === false && <TrendingDown size={12} aria-hidden="true" />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart + AI Insight ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Spending chart */}
        <div className="lg:col-span-2 bg-white rounded-[20px] border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                style={{ fontFamily: "'Instrument Serif', serif" }}
                className="text-[17px] text-[#121212] tracking-tight"
              >
                Monthly Spending
              </h2>
              <p className="text-[12px] text-[#6B6B6B] mt-0.5">Last 6 months</p>
            </div>
            <Link
              href="/analytics"
              className="flex items-center gap-1 text-[12px] font-semibold text-teal-500 hover:text-teal-600 no-underline transition-colors"
            >
              Full report <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSpendingByMonth} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={CHART_COLORS.secondary} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "'Satoshi','DM Sans',sans-serif" }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "'Satoshi','DM Sans',sans-serif" }}
                  tickFormatter={(v) => formatINRCompact(v)}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(15,95,86,0.1)", strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke={CHART_COLORS.secondary}
                  strokeWidth={2.5}
                  fill="url(#spendGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: CHART_COLORS.secondary, stroke: "white", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top AI insight */}
        <div className="bg-[#0F2018] rounded-[20px] border border-white/5 p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#7CCF5C]/15 flex items-center justify-center">
              <Sparkles size={14} className="text-[#7CCF5C]" aria-hidden="true" />
            </div>
            <span className="text-[10px] font-bold text-[#7CCF5C] uppercase tracking-widest">AI Insight</span>
          </div>
          <h3
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-[17px] text-white leading-snug mb-2 tracking-tight"
          >
            {mockAIInsights[0].title}
          </h3>
          <p className="text-[13px] text-white/60 leading-relaxed flex-1 mb-4">
            {mockAIInsights[0].description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#7CCF5C]">{mockAIInsights[0].impact} saved</span>
            <Link
              href="/ai-insights"
              className="flex items-center gap-1 text-[11px] font-semibold text-white/50 hover:text-white no-underline transition-colors"
            >
              See all <ArrowRight size={10} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Recent Transactions + Subscriptions ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent transactions */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h2
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="text-[17px] text-[#121212] tracking-tight"
            >
              Recent Transactions
            </h2>
            <Link href="/transactions" className="text-[12px] font-semibold text-teal-500 hover:text-teal-600 no-underline transition-colors">
              View all
            </Link>
          </div>
          <ul className="space-y-0" role="list">
            {mockTransactions.slice(0, 6).map((tx, i) => (
              <li
                key={tx.id}
                className={`flex items-center justify-between py-3 ${i < 5 ? "border-b border-[#F5EFE7]" : ""}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                    style={{ background: tx.type === "credit" ? "#DCFCE7" : "#F5EFE7", color: tx.type === "credit" ? "#16A34A" : "#6B6B6B" }}
                    aria-hidden="true"
                  >
                    {tx.category.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#121212] truncate">{tx.description}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{tx.category}</p>
                  </div>
                </div>
                <span
                  className={`text-[13px] font-bold flex-shrink-0 ml-2 ${
                    tx.type === "credit" ? "text-green-600" : "text-[#121212]"
                  }`}
                >
                  {tx.type === "credit" ? "+" : "-"}{formatINR(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming renewals */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h2
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="text-[17px] text-[#121212] tracking-tight"
            >
              Upcoming Renewals
            </h2>
            <Link href="/subscriptions" className="text-[12px] font-semibold text-teal-500 hover:text-teal-600 no-underline transition-colors">
              Manage all
            </Link>
          </div>
          <ul className="space-y-0" role="list">
            {mockSubscriptions.filter(s => s.status === "active").slice(0, 6).map((sub, i) => (
              <li
                key={sub.id}
                className={`flex items-center justify-between py-3 ${i < 5 ? "border-b border-[#F5EFE7]" : ""}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-xl flex-shrink-0"
                    style={{ background: sub.color + "20" }}
                    aria-hidden="true"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[10px] font-bold" style={{ color: sub.color }}>
                        {sub.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#121212] truncate">{sub.name}</p>
                    <p className="text-[11px] text-[#9CA3AF]">
                      Renews {new Date(sub.nextRenewal).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className="text-[13px] font-bold text-[#121212]">{formatINR(sub.amount)}</span>
                  {!sub.used && (
                    <p className="text-[10px] text-amber-500 font-semibold mt-0.5">Unused</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── AI Insights Row ───────────────────────────────────────── */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#7CCF5C]/12 flex items-center justify-center">
              <Sparkles size={14} className="text-[#5CB840]" aria-hidden="true" />
            </div>
            <h2
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="text-[17px] text-[#121212] tracking-tight"
            >
              AI Insights
            </h2>
          </div>
          <Link href="/ai-insights" className="text-[12px] font-semibold text-teal-500 hover:text-teal-600 no-underline transition-colors">
            View all insights
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {mockAIInsights.map((insight) => {
            const { icon: Icon, color, bg } = insightIcons[insight.type];
            return (
              <div
                key={insight.id}
                className="rounded-[14px] border border-[#E5E7EB] p-4 hover:border-teal-200 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon size={15} className={color} aria-hidden="true" />
                </div>
                <h3 className="text-[13px] font-bold text-[#121212] mb-1.5 leading-snug">{insight.title}</h3>
                <p className="text-[11px] text-[#6B6B6B] leading-relaxed mb-3 line-clamp-2">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0F5F56]">{insight.impact}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
