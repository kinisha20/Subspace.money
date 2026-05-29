"use client";
import { useState } from "react";
import { mockSubscriptions } from "@/lib/mock-data";
import { formatINR } from "@/lib/design-tokens";
import { Plus, AlertTriangle, CheckCircle2, Pause } from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function SubscriptionsView() {
  const [subs, setSubs] = useState(mockSubscriptions);

  const total = subs.filter(s => s.status === "active").reduce((sum, s) => {
    if (s.cycle === "yearly") return sum + s.amount / 12;
    return sum + s.amount;
  }, 0);

  const unused = subs.filter(s => !s.used && s.status === "active");

  const handlePause = (id: string) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "paused" ? "active" : "paused" } as typeof s : s));
    toast.success("Subscription updated");
  };

  return (
    <div className="space-y-5 page-enter">

      {/* Header stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {
          [
            { label: "Monthly Total",   value: formatINR(Math.round(total)) },
            { label: "Active Plans",    value: subs.filter(s => s.status === "active").length.toString() },
            { label: "Unused Plans",    value: unused.length.toString() },
            { label: "Annual Cost",     value: formatINR(Math.round(total * 12)) },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-[20px] border border-[#E5E7EB] px-5 py-4">
              <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-2">{s.label}</p>
              <p style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[26px] text-[#121212] tracking-tight">{s.value}</p>
            </div>
          ))
        }
      </div>

      {/* AI warning */}
      {unused.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-[16px] px-5 py-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-[13px] font-bold text-amber-800">{unused.length} subscriptions you haven't used in 45+ days</p>
            <p className="text-[12px] text-amber-600 mt-0.5">
              Pausing or cancelling them saves {formatINR(unused.reduce((s, u) => s + u.amount, 0))}/month
            </p>
          </div>
        </div>
      )}

      {/* Subscriptions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {subs.map((sub) => (
          <div
            key={sub.id}
            className={`bg-white rounded-[20px] border p-5 transition-all duration-200 ${
              sub.status === "paused" ? "border-[#E5E7EB] opacity-60" :
              !sub.used ? "border-amber-200" : "border-[#E5E7EB]"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <BrandLogo
                  logoUrl={sub.logoUrl}
                  name={sub.name}
                  color={sub.color}
                  size="md"
                />
                <div>
                  <h3 className="text-[14px] font-bold text-[#121212]">{sub.name}</h3>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{sub.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[18px] text-[#121212] tracking-tight">{formatINR(sub.amount)}</p>
                <p className="text-[10px] text-[#9CA3AF]">{sub.cycle}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                {sub.status === "active" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600">
                    <CheckCircle2 size={11} aria-hidden="true" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9CA3AF]">
                    <Pause size={11} aria-hidden="true" /> Paused
                  </span>
                )}
                {!sub.used && sub.status === "active" && (
                  <p className="text-[10px] text-amber-500 font-semibold mt-1">Last used {sub.lastUsed}</p>
                )}
              </div>
              <button
                onClick={() => handlePause(sub.id)}
                className="text-[11px] font-semibold text-[#6B6B6B] hover:text-[#121212] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#F5EFE7]"
              >
                {sub.status === "active" ? "Pause" : "Resume"}
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-[#F5EFE7]">
              <p className="text-[11px] text-[#9CA3AF]">
                Renews {new Date(sub.nextRenewal).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
              </p>
            </div>
          </div>
        ))}

        {/* Add new */}
        <button
          onClick={() => toast.info("Subscription import coming soon")}
          className="border-2 border-dashed border-[#E5E7EB] rounded-[20px] p-5 flex flex-col items-center justify-center gap-2 text-[#9CA3AF] hover:border-teal-300 hover:text-teal-500 transition-all duration-200 min-h-[140px]"
          aria-label="Add new subscription"
        >
          <Plus size={20} aria-hidden="true" />
          <span className="text-[13px] font-semibold">Add subscription</span>
        </button>
      </div>
    </div>
  );
}
