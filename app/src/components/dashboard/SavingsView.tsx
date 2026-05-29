"use client";
import { mockSavingsGoals } from "@/lib/mock-data";
import { formatINR } from "@/lib/design-tokens";
import { Plus, Target } from "lucide-react";
import { toast } from "sonner";

export function SavingsView() {
  const totalSaved  = mockSavingsGoals.reduce((s, g) => s + g.current, 0);
  const totalTarget = mockSavingsGoals.reduce((s, g) => s + g.target, 0);

  return (
    <div className="space-y-5 page-enter">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Saved",       value: formatINR(totalSaved)  },
          { label: "Total Targets",     value: formatINR(totalTarget) },
          { label: "Overall Progress",  value: `${Math.round(totalSaved/totalTarget*100)}%` },
          { label: "Active Goals",      value: mockSavingsGoals.length.toString() },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-[20px] border border-[#E5E7EB] px-5 py-4">
            <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-2">{s.label}</p>
            <p style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[24px] text-[#121212] tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Goals grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockSavingsGoals.map((goal) => {
          const pct = Math.round((goal.current / goal.target) * 100);
          const remaining = goal.target - goal.current;
          return (
            <div key={goal.id} className="bg-white rounded-[20px] border border-[#E5E7EB] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: goal.color + "20" }}>
                      <Target size={15} style={{ color: goal.color }} aria-hidden="true" />
                    </div>
                    <h3 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[18px] text-[#121212] tracking-tight">{goal.name}</h3>
                  </div>
                  <p className="text-[12px] text-[#9CA3AF]">
                    By {new Date(goal.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[22px] text-[#121212] tracking-tight">{pct}%</p>
                  <p className="text-[11px] text-[#9CA3AF]">complete</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 bg-[#F5EFE7] rounded-full overflow-hidden mb-4" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${goal.name} progress`}>
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: goal.color }}
                />
              </div>

              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#6B6B6B]">{formatINR(goal.current)} saved</span>
                <span className="text-[#9CA3AF]">{formatINR(remaining)} to go</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#F5EFE7] flex items-center justify-between">
                <span className="text-[12px] text-[#6B6B6B]">Monthly contribution</span>
                <span className="text-[13px] font-bold text-[#121212]">{formatINR(goal.monthlyContribution)}</span>
              </div>
            </div>
          );
        })}

        {/* Add goal */}
        <button
          onClick={() => toast.info("Goal creation coming soon")}
          className="border-2 border-dashed border-[#E5E7EB] rounded-[20px] p-6 flex flex-col items-center justify-center gap-2 text-[#9CA3AF] hover:border-teal-300 hover:text-teal-500 transition-all duration-200 min-h-[200px]"
          aria-label="Add new savings goal"
        >
          <Plus size={20} aria-hidden="true" />
          <span className="text-[13px] font-semibold">New savings goal</span>
        </button>
      </div>
    </div>
  );
}
