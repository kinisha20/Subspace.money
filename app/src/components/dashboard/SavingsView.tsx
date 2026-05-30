"use client";
import { useState } from "react";
import { mockSavingsGoals } from "@/lib/mock-data";
import { formatINR } from "@/lib/design-tokens";
import { Plus, Target, X } from "lucide-react";
import { toast } from "sonner";

interface GoalForm {
  name: string;
  target: string;
  monthly: string;
  deadline: string;
}

const EMPTY_FORM: GoalForm = { name: "", target: "", monthly: "", deadline: "" };

export function SavingsView() {
  const totalSaved  = mockSavingsGoals.reduce((s, g) => s + g.current, 0);
  const totalTarget = mockSavingsGoals.reduce((s, g) => s + g.target, 0);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState<GoalForm>(EMPTY_FORM);

  function openModal()  { setForm(EMPTY_FORM); setModalOpen(true);  }
  function closeModal() { setModalOpen(false); }

  function handleCreate() {
    toast.success("Goal created!");
    closeModal();
  }

  return (
    <>
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

          {/* Add goal – premium dashed card */}
          <button
            id="new-savings-goal-btn"
            onClick={openModal}
            className="group border-2 border-dashed border-[#E5E7EB] rounded-[20px] p-8 flex flex-col items-center justify-center gap-3 text-[#9CA3AF] hover:border-teal-400 hover:text-teal-500 hover:bg-teal-50/40 transition-all duration-300 min-h-[220px]"
            aria-label="Add new savings goal"
          >
            <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Plus size={22} aria-hidden="true" />
            </div>
            <div className="text-center">
              <p className="text-[14px] font-bold">New savings goal</p>
              <p className="text-[12px] opacity-70 mt-0.5">Track your next milestone</p>
            </div>
          </button>
        </div>
      </div>

      {/* Slide-up modal backdrop */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="goal-modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Drawer / modal panel */}
          <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-[28px] sm:rounded-[28px] px-6 pt-6 pb-8 shadow-2xl animate-slide-up sm:animate-none">
            {/* Handle (mobile) */}
            <div className="w-10 h-1 rounded-full bg-[#E5E7EB] mx-auto mb-5 sm:hidden" aria-hidden="true" />

            <div className="flex items-center justify-between mb-6">
              <h2 id="goal-modal-title" style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[22px] text-[#121212] tracking-tight">
                New savings goal
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#6B6B6B] hover:bg-[#EBEBEB] transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Goal name */}
              <div>
                <label htmlFor="goal-name" className="block text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">
                  Goal name
                </label>
                <input
                  id="goal-name"
                  type="text"
                  placeholder="e.g. Europe vacation"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-[14px] border border-[#E5E7EB] text-[14px] text-[#121212] placeholder:text-[#C0C0C0] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                />
              </div>

              {/* Target amount */}
              <div>
                <label htmlFor="goal-target" className="block text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">
                  Target amount (₹)
                </label>
                <input
                  id="goal-target"
                  type="number"
                  placeholder="e.g. 200000"
                  value={form.target}
                  onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                  className="w-full px-4 py-3 rounded-[14px] border border-[#E5E7EB] text-[14px] text-[#121212] placeholder:text-[#C0C0C0] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                />
              </div>

              {/* Monthly contribution */}
              <div>
                <label htmlFor="goal-monthly" className="block text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">
                  Monthly contribution (₹)
                </label>
                <input
                  id="goal-monthly"
                  type="number"
                  placeholder="e.g. 10000"
                  value={form.monthly}
                  onChange={e => setForm(f => ({ ...f, monthly: e.target.value }))}
                  className="w-full px-4 py-3 rounded-[14px] border border-[#E5E7EB] text-[14px] text-[#121212] placeholder:text-[#C0C0C0] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                />
              </div>

              {/* Deadline */}
              <div>
                <label htmlFor="goal-deadline" className="block text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">
                  Deadline
                </label>
                <input
                  id="goal-deadline"
                  type="date"
                  value={form.deadline}
                  onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  className="w-full px-4 py-3 rounded-[14px] border border-[#E5E7EB] text-[14px] text-[#121212] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-6">
              <button
                id="create-goal-btn"
                onClick={handleCreate}
                className="w-full py-3.5 rounded-[14px] bg-[#0F5F56] text-white text-[14px] font-bold hover:bg-[#083B35] active:scale-[0.98] transition-all duration-200"
              >
                Create Goal
              </button>
              <button
                onClick={closeModal}
                className="w-full py-3 rounded-[14px] text-[#6B6B6B] text-[14px] font-semibold hover:bg-[#F5F5F5] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.32, 0.72, 0, 1) both; }
      `}</style>
    </>
  );
}
